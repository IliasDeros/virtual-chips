import "./styles.css";

// Reference: https://codepen.io/Rovak/pen/ExYeQar
export const StyledTable = ({ children }) => (
  <div className="table">{children}</div>
);

export const StyledPlayer = ({ children }) => (
  <div className="table__player">{children}</div>
);
