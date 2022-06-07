import Avatar from "avataaars";
import { commonAvatarProps } from "./styles";

export const AvatarSickAfro = ({ avatarProps }) => (
  <Avatar
    avatarStyle="Circle"
    topType="LongHairFroBand"
    accessoriesType="Sunglasses"
    hairColor="Brown"
    facialHairType="BeardMajestic"
    facialHairColor="BrownDark"
    clotheType="Hoodie"
    clotheColor="Heather"
    eyeType="Close"
    eyebrowType="UpDown"
    mouthType="Vomit"
    skinColor="Black"
    {...commonAvatarProps}
    {...avatarProps}
  />
);
