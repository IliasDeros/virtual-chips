import Avatar from "avataaars";
import { commonAvatarProps } from "./styles";

export default AvatarLoveTurban = ({ avatarProps }) => (
  <Avatar
    avatarStyle="Circle"
    topType="Turban"
    accessoriesType="Round"
    hatColor="PastelOrange"
    facialHairType="Blank"
    clotheType="Overall"
    clotheColor="PastelOrange"
    eyeType="Hearts"
    eyebrowType="SadConcerned"
    mouthType="Eating"
    skinColor="Pale"
    {...commonAvatarProps}
    {...avatarProps}
  />
);
