import Avatar from "avataaars";
import { commonAvatarProps } from "./styles";

export default AvatarBasicJulie = ({ avatarProps }) => (
  <Avatar
    avatarStyle="Circle"
    topType="LongHairStraight"
    accessoriesType="Blank"
    hairColor="BrownDark"
    facialHairType="Blank"
    clotheType="BlazerShirt"
    eyeType="Default"
    eyebrowType="Default"
    mouthType="Default"
    skinColor="Light"
    {...commonAvatarProps}
    {...avatarProps}
  />
);
