const MoveState = {};

MoveState.create = ({ an, fromAN, moveKey, paymentCoinKey, playerId, recruitCoinKey, toAN }) =>
  Immutable({
    // Required.
    moveKey,
    playerId,
    paymentCoinKey,
    // Situational.
    an,
    fromAN,
    recruitCoinKey,
    toAN
  });

Object.freeze(MoveState);

export default MoveState;
