const MoveState = {};

MoveState.create = ({
  an1,
  an2,
  moveKey,
  moveStates,
  paymentCoinId,
  playerId,
  recruitCoinId,
  victimCoinId
}) =>
  Immutable({
    // Required.
    moveKey,
    playerId,
    paymentCoinId,
    // Situational.
    an1,
    an2,
    moveStates,
    recruitCoinId,
    victimCoinId
  });

Object.freeze(MoveState);

export default MoveState;
