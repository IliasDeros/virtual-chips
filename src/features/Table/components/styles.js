import "./styles.css";

export const StyledTable = ({ children }) => (
  <div className="table">{children}</div>
);

export const StyledPlayer = ({ children }) => (
  <div className="table__player">{children}</div>
);

export const StyledPlayerName = ({ children }) => (
  <div className="table__player-name">{children}</div>
);

export const StyledPlayerButton = ({ children }) => (
  <div className="table__player-button">{children}</div>
);

export const StyledPlayerStack = ({ children }) => (
  <div className="table__player-stack">{children}</div>
);

export const StyledPlayerBet = ({ children }) => (
  <div className="table__player-bet">{children}</div>
);
