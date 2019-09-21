const CoinState = {};

CoinState.create = ({ coinKey, count = 1, isFaceup = true }) =>
  Immutable({
    // Required.
    coinKey,
    // Situational.
    count,
    isFaceup
  });

Object.freeze(CoinState);

export default CoinState;
