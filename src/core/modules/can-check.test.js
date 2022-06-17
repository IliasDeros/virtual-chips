import canCheck from "./can-check";

const turnBet = 80;
const me = { turnBet };

it("Defaults the turnBet", () => {
  const result = canCheck([me, {}, {}]);
  expect(result).toBeTruthy();
});

it("Can check when all bets are equal to me", () => {
  const result = canCheck([me, { turnBet }, { turnBet }]);
  expect(result).toBeTruthy();
});

it("Can check when all bets are equal or lower to be", () => {
  const lowerBet = turnBet - 20;
  const result = canCheck([me, { turnBet }, { turnBet: lowerBet }]);
  expect(result).toBeTruthy();
});

it("Cannot check if a bet is higher than me", () => {
  const higherBet = turnBet + 20;
  const result = canCheck([me, { turnBet }, { turnBet: higherBet }]);
  expect(result).toBeFalsy();
});
