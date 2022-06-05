/*
 * calculate the split pots associated to multiple players going all-in
 *
 * @param players {array} list of players and their total bet [{ chips: { roundBet: 0, total: 0 } }]
 * @returns {array} list of sidepots with their players [{ pot: 0, players: [{ chips }] }, { main pot }]
 */
export function calculateSidePots(players) {
  if (players.length < 2)
    return console.error(
      "There has to be at least two players to calculate side-pots."
    );

  const sidePots = [];
  const mainPot = { pot: 0, players: [] };

  players
    // sort from lowest to highest
    .sort((a, b) => a.roundBet - b.roundBet)

    // distribute side pots, from smallest sidepot to main pot
    .forEach((player, i) => {
      // Distribute roundBet through existing sidepots
      const remainingBet = sidePots.reduce(
        (bet, sidePot) => bet - sidePot.bet,
        player.roundBet || 0
      );

      // Add to main pot
      if (player.chips > 0) {
        mainPot.pot += remainingBet;
        mainPot.players.push(player);
      }

      // Create sidepot with bet to match
      else if (remainingBet > 0) {
        sidePots.push({
          bet: remainingBet,
          players: [],
        });
      }

      // Add player to all sidepots
      sidePots.forEach((pot) => pot.players.push(player));
    });

  // Format pots
  const formattedSidepots = sidePots.map((sidePot) => ({
    pot: sidePot.bet * sidePot.players.length,
    players: sidePot.players,
  }));

  // Add main pot
  formattedSidepots.push(mainPot);

  return formattedSidepots;
}
