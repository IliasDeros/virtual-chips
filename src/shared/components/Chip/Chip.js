import "./styles.scss";

export const Chip = ({
  className = "",
  stack = false,
  stackHorizontal = false,
  stackVertical = false,
  value = "10",
  ...htmlProps
}) => {
  let fullClass = `${className} chip chip--${value}`;

  if (stack) {
    fullClass += " chip--stack";
  }

  if (stackHorizontal) {
    fullClass += " chip--x";
  }

  if (stackVertical) {
    fullClass += " chip--y";
  }

  return <div className={fullClass} {...htmlProps}></div>;
};
