import "./jest-mock-firebase";
import { getAuth, signInAnonymously } from "firebase/auth";
import {
  getDatabase,
  mockSetData,
  onValue,
  ref,
  runTransaction,
  set,
} from "firebase/database";

describe("firebase/database", () => {
  it("Gets database", () => {
    expect(getDatabase()).toBeTruthy();
  });

  describe("when subscribed to users/123/name", () => {
    let nameRef;

    beforeEach(() => {
      nameRef = ref(getDatabase(), "users/123/name");
    });

    it("Trigger onValue callback by calling set()", () => {
      const value = "set value";
      const callback = jest.fn();

      onValue(nameRef, callback);
      set(nameRef, value);

      const [snapshot] = callback.mock.lastCall;
      expect(snapshot.val()).toBe(value);
    });

    describe("When name is already set", () => {
      beforeEach(() => {
        mockSetData({ users: { 123: { name: "Firstname" } } });
      });

      it("Trigger onValue callback by calling runTransaction()", () => {
        const callback = jest.fn();

        onValue(nameRef, callback);
        runTransaction(nameRef, (name) => `${name} Lastname`);

        const [snapshot] = callback.mock.lastCall;
        expect(snapshot.val()).toBe("Firstname Lastname");
      });

      it("Trigger onValue if a value was already set", () => {
        const callback = jest.fn();

        onValue(nameRef, callback);

        const [snapshot] = callback.mock.lastCall;
        expect(snapshot.val()).toBe("Firstname");
      });
    });

    describe("When changing a nested property", () => {
      let userRef;

      beforeEach(() => {
        userRef = ref(getDatabase(), "users/123");
      });

      it("Triggers parent onValue", () => {
        const name = "Name";
        const callback = jest.fn();

        onValue(userRef, callback);
        set(nameRef, name);

        const [snapshot] = callback.mock.lastCall;
        expect(snapshot.val()).toEqual({ name });
      });
    });
  });
});

describe("firebase/auth", () => {
  it("Sign in anonymously", async () => {
    const { user } = await signInAnonymously(getAuth());
    expect(user.uid).toBeTruthy();
  });
});
