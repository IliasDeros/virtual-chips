export default function canCheck([me, ...opponents]) {
  const bet = (player) => player.turnBet || 0;
  const noRaise = opponents.every((player) => bet(player) <= bet(me));
  return noRaise;
}
