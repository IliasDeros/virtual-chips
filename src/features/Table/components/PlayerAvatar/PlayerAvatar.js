import { commonAvatarProps } from "./styles";
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
const avatarsCount = Object.keys(avatars).length;

export const PlayerAvatar = ({ avatarProps, index, isFolded }) => {
  const SelectedAvatar = avatars[index % avatarsCount] || avatars[0];
  const className = `${commonAvatarProps.className} ${
    isFolded && "grayscale opacity-50"
  }`;
  return <SelectedAvatar avatarProps={{ ...avatarProps, className }} />;
};
