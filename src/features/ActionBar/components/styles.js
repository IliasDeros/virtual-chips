export const StyledActionBar = ({ className = "", children }) => (
  <div className={`w-full bg-gray-600 ${className} flex`}>{children}</div>
);

const actionClasses = {
  fold: "bg-secondary",
  check: "bg-primary",
  tie: "bg-warning",
  call: "bg-accent",
  bet: "bg-accent",
};

export const StyledAction = ({
  className,
  children,
  action = "",
  ...htmlProps
}) => {
  const commonClass = `w-full flex justify-center items-center ${className} uppercase font-bold tracking-widest text-white`;
  const actionClass = actionClasses[action];
  const fullClass = [actionClass, className, commonClass].join(" ");

  return (
    <button className={fullClass} {...htmlProps}>
      {children}
    </button>
  );
};
