import Resolver from "../artifact/Resolver.js";

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
}) => ({
  // Required.
  moveKey,
  playerId,
  paymentCoinId,
  // Situational.
  an1,
  an2,
  moveStates,
  recruitCoinId,
  victimCoinId,
  // Managed.
  moveType: Resolver.move(moveKey)
});

Object.freeze(MoveState);

export default MoveState;
