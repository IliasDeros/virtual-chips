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

export const StyledDealer = ({ children }) => (
  <div className="table__player-button table__player-button--dealer">
    {children}
  </div>
);

export const StyledBigBlind = ({ children }) => (
  <div className="table__player-button table__player-button--bb">
    {children}
  </div>
);

export const StyledSmallBlind = ({ children }) => (
  <div className="table__player-button table__player-button--sb">
    {children}
  </div>
);

export const StyledPlayerStack = ({ children }) => (
  <div className="table__player-stack">{children}</div>
);

export const StyledPlayerBet = ({ children }) => (
  <div className="table__player-bet">{children}</div>
);

export const Chip = ({
  className = "",
  stackHorizontal = false,
  value = "10",
  ...htmlProps
}) => {
  let fullClass = `${className} chip chip--${value}`;

  if (stackHorizontal) {
    fullClass += " chip--h";
  }

  return <div className={fullClass} {...htmlProps}></div>;
};

const getChipsForValue = (value) => {
  let remainingValue = value;

  const largeChip = 100;
  const mediumChip = 50;
  const smallChip = 10;
  const large = Math.floor(remainingValue / largeChip);
  const medium = Math.floor((remainingValue % largeChip) / mediumChip);
  const small = Math.floor(
    ((remainingValue % largeChip) % mediumChip) / smallChip
  );

  const chips = [];
  for (let i = 0; i < large; i++) {
    chips.push((props) => <Chip stackHorizontal value="10" {...props} />);
  }

  for (let i = 0; i < medium; i++) {
    chips.push((props) => <Chip stackHorizontal value="5" {...props} />);
  }

  for (let i = 0; i < small; i++) {
    chips.push((props) => <Chip stackHorizontal value="1" {...props} />);
  }

  return chips;
};

const StyledPotcontainer = ({ children }) => (
  <div className="absolute bg-primary-focus rounded-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 text-center">
    {children}
  </div>
);

export const StyledPot = ({ pot }) => {
  const maxChipsPerLine = 4;
  const maxChips = 50;

  // Pot is 2540
  const chips = getChipsForValue(pot).slice(0, maxChips);
  const chipLines = chips.reduce((acc, chip, index) => {
    if (index % maxChipsPerLine === 0) {
      acc.push([chip]);
    } else {
      acc[acc.length - 1].push(chip);
    }
    return acc;
  }, []);

  return (
    <StyledPotcontainer>
      {chipLines.map((chips, index) => (
        <div key={`chips-line--${index}`}>
          {chips.map((Chip, chipIndex) => (
            <Chip key={`chip--${index}-${chipIndex}`} />
          ))}
        </div>
      ))}
      <div className="mt-6 font-bold">{pot}</div>
    </StyledPotcontainer>
  );
};
