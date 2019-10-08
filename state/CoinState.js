const CoinState = {};

CoinState.create = ({ id, coinKey, count = 1, isFaceup = true, isHighlighted = false }) =>
  Immutable({
    // Required.
    id,
    coinKey,
    // Situational.
    count,
    isFaceup,
    isHighlighted
  });

Object.freeze(CoinState);

export default CoinState;
