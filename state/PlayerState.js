const PlayerState = {};

PlayerState.create = ({
  id,
  name,
  teamKey,

  isComputer = true,
  strategy = "SimplePlayerStrategy"
}) =>
  Immutable({
    id,
    name,
    teamKey,

    isComputer,
    strategy
  });

Object.freeze(PlayerState);

export default PlayerState;
