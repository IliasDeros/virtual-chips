import "./styles.css";

export const Chip = ({
  className = "",
  stackHorizontal = false,
  stackVertical = false,
  value = "10",
  ...htmlProps
}) => {
  let fullClass = `${className} chip chip--${value}`;

  if (stackHorizontal) {
    fullClass += " chip--x";
  }

  if (stackVertical) {
    fullClass += " chip--y";
  }

  return <div className={fullClass} {...htmlProps}></div>;
};
