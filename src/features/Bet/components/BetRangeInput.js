import { useEffect, useRef } from "react";

// De-couple the input and the state
// This ensures the input always works
const useValue = (ref, value = 0) => {
  useEffect(() => {
    ref.current.value = value;
  }, [value]);

  return ref;
};

export default function BetRangeInput(props) {
  const { minBet, bet, maxBet, ...htmlProps } = props;
  const ref = useRef();
  useValue(ref, bet);

  return (
    <input
      className="range range-accent"
      ref={ref}
      max="100"
      min="0"
      type="range"
      {...htmlProps}
    />
  );
}
