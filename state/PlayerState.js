const PlayerState = {};

PlayerState.create = ({ id, name, teamKey, isComputer = true }) =>
  Immutable({
    id,
    name,
    teamKey,
    isComputer
  });

Object.freeze(PlayerState);

export default PlayerState;
