import "./jest-mock-firebase";
import {
  getDatabase,
  mockSetData,
  onValue,
  ref,
  runTransaction,
  set,
} from "firebase/database";

it("Gets database", () => {
  expect(getDatabase()).toBeTruthy();
});

describe("when subscribed to users/123/name", () => {
  let subscription;

  beforeEach(() => {
    subscription = ref(getDatabase(), "users/123/name");
  });

  it("Trigger onValue callback by calling set()", () => {
    const value = "set value";
    const callback = jest.fn();

    onValue(subscription, callback);
    set(subscription, value);

    const [snapshot] = callback.mock.lastCall;
    expect(snapshot.val()).toBe(value);
  });

  it("Trigger onValue callback by calling runTransaction()", () => {
    mockSetData({ users: { 123: { name: "Firstname" } } });
    const callback = jest.fn();

    onValue(subscription, callback);
    runTransaction(subscription, (name) => `${name} Lastname`);

    const [snapshot] = callback.mock.lastCall;
    expect(snapshot.val()).toBe("Firstname Lastname");
  });
});
