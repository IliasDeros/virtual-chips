import Player from "./Player";

export default OtherPlayers = ({ players = [] }) => {
  return (
    <>
      {players.map((player, i) => (
        <Player
          avatarProps={{ avatarStyle: "Transparent" }}
          key={player.id}
          player={player}
          index={i + 1}
        />
      ))}
    </>
  );
};
