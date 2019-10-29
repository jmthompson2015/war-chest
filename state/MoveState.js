const MoveState = {};

MoveState.create = ({ an, moveKey, paymentCoinId, playerId, recruitCoinId, toAN, victimCoinId }) =>
  Immutable({
    // Required.
    moveKey,
    playerId,
    paymentCoinId,
    // Situational.
    an,
    recruitCoinId,
    toAN,
    victimCoinId
  });

Object.freeze(MoveState);

export default MoveState;
