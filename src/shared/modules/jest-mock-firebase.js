/**
 * This mock file only needs to be imported:
 * ```
 * import "jest-mock-firebase"
 * ```
 *
 * - Mocks firebase imports with an in-memory realtime database
 * - Resets database and subscribers after each test
 * - Mocks authentication, enabling anonymous sign in
 */
jest.mock("firebase/database", () => {
  class URLStorage {
    constructor() {
      this.resetData();
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

    resetData() {
      this.setData({});
    }

    setData(data) {
      this.data = data;
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
        .reduce((value, segment) => value && value[segment], this.data);
    }

    setUrl(url, value) {
      const lastSlashIndex = url.lastIndexOf("/");
      // table/123/key -> /table/123
      const parentUrl = url.slice(0, lastSlashIndex);
      const valueKey = url.slice(lastSlashIndex + 1);
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
  let urlCallbacks;

  const resetObservers = () => {
    urlCallbacks = {};
    return urlCallbacks;
  };

  const notifyUrl = (url) => {
    const observers = urlCallbacks[url] || [];
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
    notifyUrl(refUrl);
  };

  const setMock = (refUrl, value) => {
    state.setUrl(refUrl, value);
    notifyUrl(refUrl);
  };

  const mockReset = () => {
    resetObservers();
    state.resetData();
  };

  const mockSetData = (data) => {
    state.setData(data);
  };

  resetObservers();

  return {
    getDatabase: () => firebaseDatabase,
    mockReset,
    mockSetData,
    onValue: observeUrl,
    ref: refMock,
    runTransaction: runTransactionMock,
    set: setMock,
  };
});

jest.mock("firebase/auth", () => {
  const fakeUser = {
    user: {
      uid: "mocked_uid",
    },
  };
  const getAuth = () => "auth";
  const signInAnonymously = () => Promise.resolve(fakeUser);

  return {
    getAuth,
    signInAnonymously,
  };
});

import { mockReset } from "firebase/database";
afterEach(() => {
  mockReset();
});
