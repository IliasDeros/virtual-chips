import { AvatarBasicJulie } from "./AvatarBasicJulie";
import { AvatarScaredSanta } from "./AvatarScaredSanta";
import { AvatarSickAfro } from "./AvatarSickAfro";
import { AvatarCoolKurt } from "./AvatarCoolKurt";
import { AvatarLoveTurban } from "./AvatarLoveTurban";

const avatars = {
  0: AvatarBasicJulie,
  1: AvatarScaredSanta,
  2: AvatarSickAfro,
  3: AvatarCoolKurt,
  4: AvatarLoveTurban,
};

export const PlayerAvatar = ({ avatarProps, index }) => {
  const SelectedAvatar = avatars[index] || avatars[0];
  return <SelectedAvatar avatarProps={avatarProps} />;
};
