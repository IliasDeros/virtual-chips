import React from "react";
import { PlayerAvatar } from "./PlayerAvatar";
import { StyledPlayer } from "./styles";

export default Player = ({ avatarProps, index, player }) => {
  return (
    <StyledPlayer>
      <div className="absolute">
        {player.name} {player.isHost && "(host)"}
      </div>
      <PlayerAvatar index={index} avatarProps={avatarProps} />

      <div className="absolute">{player.button}</div>
    </StyledPlayer>
  );
};
