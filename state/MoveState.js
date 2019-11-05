const MoveState = {};

MoveState.create = ({
  an1,
  an2,
  an3,
  moveKey,
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
    an3,
    recruitCoinId,
    victimCoinId
  });

Object.freeze(MoveState);

export default MoveState;
