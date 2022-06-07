import { Player } from "./Player";

export const OtherPlayers = ({ meIndex, players = [] }) => {
  const allPlayerCount = players.length + 1;

  return (
    <>
      {players.map((player, i) => (
        <Player
          avatarProps={{ avatarStyle: "Transparent" }}
          key={player.id}
          player={player}
          orderIndex={(meIndex + i + 1) % allPlayerCount}
        />
      ))}
    </>
  );
};
