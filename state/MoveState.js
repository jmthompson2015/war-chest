const MoveState = {};

MoveState.create = ({
  an,
  fromAN,
  moveKey,
  paymentCoinId,
  playerId,
  recruitCoinId,
  toAN,
  victimCoinId
}) =>
  Immutable({
    // Required.
    moveKey,
    playerId,
    paymentCoinId,
    // Situational.
    an,
    fromAN,
    recruitCoinId,
    toAN,
    victimCoinId
  });

Object.freeze(MoveState);

export default MoveState;
