import React from "react";
import { PlayerAvatar } from "./PlayerAvatar";
import {
  StyledPlayer,
  StyledPlayerBet,
  StyledPlayerButton,
  StyledPlayerName,
  StyledPlayerStack,
} from "./styles";

export default Player = ({ avatarProps, index, player }) => {
  return (
    <StyledPlayer>
      <div className="relative">
        <PlayerAvatar index={index} avatarProps={avatarProps} />
        <StyledPlayerName>
          {player.name} {player.isHost && "(host)"}
        </StyledPlayerName>
        <StyledPlayerButton>{player.button}</StyledPlayerButton>
        <StyledPlayerStack>{player.chips}</StyledPlayerStack>
        {player.turnBet && <StyledPlayerBet>{player.turnBet}</StyledPlayerBet>}
      </div>
    </StyledPlayer>
  );
};
