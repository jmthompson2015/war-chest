const PlayerState = {};

PlayerState.create = ({
  id,
  name,
  teamKey,

  isComputer = true,
  strategy = "RandomPlayerStrategy"
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
