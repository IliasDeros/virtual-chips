import Avatar from "avataaars";
import { commonAvatarProps } from "./styles";

export const AvatarCoolKurt = ({ avatarProps }) => (
  <Avatar
    avatarStyle="Circle"
    topType="LongHairStraight"
    accessoriesType="Kurt"
    hairColor="BrownDark"
    facialHairType="MoustacheMagnum"
    facialHairColor="BrownDark"
    clotheType="GraphicShirt"
    clotheColor="PastelBlue"
    graphicType="Skull"
    eyeType="Side"
    eyebrowType="UpDown"
    mouthType="Twinkle"
    skinColor="Tanned"
    {...commonAvatarProps}
    {...avatarProps}
  />
);
