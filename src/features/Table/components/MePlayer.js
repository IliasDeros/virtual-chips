import { Player } from "./Player";

export const MePlayer = ({ meIndex, player }) => (
  <Player
    player={player}
    orderIndex={meIndex}
    avatarProps={{ avatarStyle: "Circle" }}
  />
);
