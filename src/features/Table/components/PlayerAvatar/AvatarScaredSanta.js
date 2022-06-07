import Avatar from "avataaars";
import { commonAvatarProps } from "./styles";

export default AvatarScaredSanta = ({ avatarProps }) => (
  <Avatar
    avatarStyle="Circle"
    topType="WinterHat3"
    accessoriesType="Kurt"
    hatColor="Red"
    facialHairType="BeardLight"
    facialHairColor="BrownDark"
    clotheType="ShirtVNeck"
    clotheColor="Gray01"
    eyeType="Dizzy"
    eyebrowType="SadConcerned"
    mouthType="Concerned"
    skinColor="Pale"
    {...commonAvatarProps}
    {...avatarProps}
  />
);
