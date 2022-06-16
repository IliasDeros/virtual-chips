import "./styles.css";
import Turn from "constants/turn"
import { Chip } from "shared/components/Chip"

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
  <div className="bg-primary-focus rounded-lg p-4 text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    {children}
  </div>
);

export const StyledPot = ({ children, pot }) => {
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
    <>
      <StyledPotcontainer>
        {chipLines.map((chips, index) => (
          <div key={`chips-line--${index}`}>
            {chips.map((PotChip, chipIndex) => (
              <PotChip key={`chip--${index}-${chipIndex}`} />
            ))}
          </div>
        ))}
        <div className="mt-2 font-bold">{pot}</div>
      </StyledPotcontainer>
    </>
  );
};

const Card = ({ className }) => (
  <div className={`rounded bg-white relative w-4 h-6 before:content-[' '] mr-1 last:mr-0 animate-card-appear ${className}`}>
    <div className="absolute top-0 bottom-0 left-0 right-0 m-0.5 bg-red-300  before:content-[' ']"></div>
  </div>
);

const CardsContainer = ({ children }) => (
  <div className="flex flex-row absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">{children}</div>
)

export const StyledCards = ({ turn }) => {
  switch (turn) {
    case Turn.FLOP:
      return (
        <CardsContainer>
          <Card className="rotate-in" />
          <Card className="rotate-in rotate-in--delay-1" />
          <Card className="rotate-in rotate-in--delay-2" />
          <Card className="invisible" />
          <Card className="invisible" />
        </CardsContainer>
      )
    case Turn.TURN:
      return (
        <CardsContainer>
          <Card />
          <Card />
          <Card />
          <Card className="rotate-in"/>
          <Card className="invisible" />
        </CardsContainer>
      )
    case Turn.RIVER:
    case Turn.FINISHED:
      return (
        <CardsContainer>
          <Card />
          <Card />
          <Card />
          <Card />
          <Card className="rotate-in"/>
        </CardsContainer>
      )
    default:
      return null
};
