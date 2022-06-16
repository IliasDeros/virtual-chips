import React from "react";
import { PlayerAvatar } from "./PlayerAvatar";
import {
  StyledBigBlind,
  StyledDealer,
  StyledPlayer,
  StyledPlayerBet,
  StyledPlayerName,
  StyledPlayerStack,
  StyledSmallBlind,
} from "./styles";
import { Chip } from "shared/components/Chip";
import Button from "constants/button";
import State from "constants/state";

export const Player = ({ avatarProps, orderIndex, player }) => {
  const { button, chips, isHost, name, turnBet } = player;
  const isDealer = [Button.DEALER_SMALL, Button.DEALER].includes(button);
  const isSmallBlind = [Button.DEALER_SMALL, Button.SMALL_BLIND].includes(
    button
  );
  const isChecked = player.state === State.CHECKED;
  const isFolded = player.state === State.FOLDED;
  const isTied = player.state === State.TIED;

  return (
    <StyledPlayer>
      <div className="relative">
        <PlayerAvatar
          isFolded={isFolded}
          index={orderIndex}
          avatarProps={avatarProps}
        />
        <StyledPlayerName>
          {name} {isHost && "(host)"}
        </StyledPlayerName>
        {button === Button.BIG_BLIND && <StyledBigBlind>BB</StyledBigBlind>}
        {isDealer && <StyledDealer>D</StyledDealer>}
        {isSmallBlind && <StyledSmallBlind>SB</StyledSmallBlind>}
        <StyledPlayerStack>{chips}</StyledPlayerStack>

        {turnBet ? (
          <StyledPlayerBet>
            {turnBet} <Chip className="ml-1 -mr-1" />
          </StyledPlayerBet>
        ) : null}
        {isChecked && <StyledPlayerBet>CHECK</StyledPlayerBet>}
        {isTied && <StyledPlayerBet>TIED</StyledPlayerBet>}
      </div>
    </StyledPlayer>
  );
};
