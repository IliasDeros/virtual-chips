import React from "react";
import { PlayerAvatar } from "./PlayerAvatar";

export default Player = ({ avatarProps, index, player }) => {
  return (
    <div className="text-center inline-block">
      <div>
        {player.name} {player.isHost && "(host)"}
      </div>
      <div className="mt-1">
        <PlayerAvatar index={index} avatarProps={avatarProps} />
      </div>

      <div className="mt-2">{player.button}</div>
    </div>
  );
};
