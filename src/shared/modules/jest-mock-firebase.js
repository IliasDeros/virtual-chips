jest.mock("firebase/database", () => {
  class URLStorage {
    constructor() {
      this.data = {};
    }

    _initializeProperty(json, key) {
      const hasValue = Object.keys(json).includes(key);

      if (!hasValue) {
        json[key] = {};
      }

      return json[key];
    }

    _initializeUrl(url = "table/123") {
      const segments = url.split("/");
      return segments.reduce(this._initializeProperty, this.data);
    }

    /**
     *
     * @example
     * ```
     * this.data // { "table": { "123": { "x": 1 } } }
     * this.getUrl("table/123") // { "x": 1 }
     * ```
     */
    getUrl(url) {
      return url
        .split("/")
        .reduce((value, segment) => value && value[segment], state);
    }

    setUrl(url, value) {
      // table/123/key -> /table/123
      const parentUrl = url.slice(0, url.lastIndexOf("/"));
      const valueProperty = this._initializeUrl(parentUrl);
      valueProperty[valueKey] = value;
    }
  }

  class ValueObserver {
    constructor(callback) {
      this.callback = callback;
    }

    notify(value) {
      this.callback({
        val() {
          return value;
        },
      });
    }
  }

  const firebaseDatabase = "mockDB";
  const state = new URLStorage();
  const urlCallbacks = { "table/123": [] };

  const notifyUrl = (url) => {
    const observers = urlCallbacks[path] || [];
    const value = state.getUrl(url);
    observers.forEach((o) => o.notify(value));
  };

  const observeUrl = (path, callback) => {
    urlCallbacks[path] = urlCallbacks[path] || [];
    urlCallbacks[path].push(new ValueObserver(callback));
  };

  /** Verify the right db is passed and return the URL */
  const refMock = (db, url) => {
    if (firebaseDatabase !== db) {
      throw `Unexpected first argument for firebase.ref(): ${firebaseDatabase}. Expected: ${db}`;
    }

    return url;
  };

  const runTransactionMock = (refUrl, valueCallback) => {
    const value = state.getUrl(refUrl);
    const newValue = valueCallback(value);
    state.setUrl(refUrl, newValue);
  };

  const setMock = (refUrl, value) => {
    state.setUrl(refUrl, value);
    notifyUrl(refUrl);
  };

  return {
    getDatabase: () => firebaseDatabase,
    onValue: observeUrl,
    ref: refMock,
    runTransaction: runTransactionMock,
    set: setMock,
  };
});
