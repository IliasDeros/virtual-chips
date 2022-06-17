/**
 * This mock file only needs to be imported:
 * ```
 * import "jest-mock-firebase"
 * ```
 *
 * - Mocks firebase with an in-memory realtime database
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

  class URLSubscribers {
    constructor(state) {
      this.state = state;
      this.subscribers = {};
    }

    /**
     * Finds all observer of the value, or any parent value
     * @param {string} url key to look for
     */
    _findUrlSubscribers(url, childSubscribers = {}) {
      const found = this.subscribers[url] || [];
      const hasParent = url.includes("/");
      const parentUrl = url.slice(0, url.lastIndexOf("/"));
      const parentSubscribers = hasParent
        ? this._findUrlSubscribers(parentUrl, childSubscribers)
        : {};

      return {
        ...childSubscribers,
        ...parentSubscribers,
        [url]: found,
      };
    }

    _notifySubscriber(url, subscriber) {
      const value = this.state.getUrl(url);
      subscriber(value);
    }

    notify(url) {
      const subscribers = this._findUrlSubscribers(url);
      const notifyList = ([url, sub]) => {
        const notifyOne = (sub) => this._notifySubscriber(url, sub);
        sub.forEach(notifyOne);
      };
      Object.entries(subscribers).forEach(notifyList);
    }

    reset() {
      this.subscribers = {};
    }

    subscribe(url, callback) {
      const newSubscriber = (value) => callback({ val: () => value });
      this.subscribers[url] = this.subscribers[url] || [];
      this.subscribers[url].push(newSubscriber);
      this._notifySubscriber(url, newSubscriber);
    }
  }

  const firebaseDatabase = "mockDB";
  const state = new URLStorage();
  const subscribers = new URLSubscribers(state);

  const mockReset = () => {
    state.resetData();
    subscribers.reset();
  };

  const mockSetData = (data) => {
    state.setData(data);
  };

  const onValue = subscribers.subscribe.bind(subscribers);

  /** Verify the right db is passed and return the URL */
  const ref = (db, url) => {
    if (firebaseDatabase !== db) {
      throw `Unexpected first argument for firebase.ref(): ${firebaseDatabase}. Expected: ${db}`;
    }

    return url;
  };

  const runTransaction = (refUrl, valueCallback) => {
    const value = state.getUrl(refUrl);
    const newValue = valueCallback(value);
    state.setUrl(refUrl, newValue);
    subscribers.notify(refUrl);
  };

  const set = (refUrl, value) => {
    state.setUrl(refUrl, value);
    subscribers.notify(refUrl);
  };

  return {
    getDatabase: () => firebaseDatabase,
    mockReset,
    mockSetData,
    onValue,
    ref,
    runTransaction,
    set,
  };
});

jest.mock("firebase/auth", () => {
  const uid = "mocked_uid";
  const fakeUser = { user: { uid } };
  const getAuth = () => "auth";
  const signInAnonymously = () => Promise.resolve(fakeUser);

  return {
    getAuth,
    signInAnonymously,
    uid,
  };
});

import { mockReset } from "firebase/database";
afterEach(() => {
  mockReset();
});
