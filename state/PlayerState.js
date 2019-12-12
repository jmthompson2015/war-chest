import Resolver from "../artifact/Resolver.js";

const PlayerState = {};

PlayerState.create = ({
  id,
  name,
  teamKey,
  isComputer = true,
  strategy = "RandomPlayerStrategy"
}) =>
  Immutable({
    // Required.
    id,
    name,
    teamKey,
    // Situational.
    isComputer,
    strategy,
    // Managed.
    teamType: Resolver.team(teamKey)
  });

Object.freeze(PlayerState);

export default PlayerState;
