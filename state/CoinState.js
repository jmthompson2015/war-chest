const CoinState = {};

CoinState.create = ({ coinKey, count = 1, isFaceup = true, isHighlighted = false }) =>
  Immutable({
    // Required.
    coinKey,
    // Situational.
    count,
    isFaceup,
    isHighlighted
  });

Object.freeze(CoinState);

export default CoinState;
