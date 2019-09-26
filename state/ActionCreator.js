import ActionType from "./ActionType.js";

const ActionCreator = {};

// See https://redux.js.org/recipes/reducing-boilerplate
const makeActionCreator = (type, ...argNames) => (...args) => {
  const action = { type };
  argNames.forEach((arg, index) => {
    action[argNames[index]] = args[index];
  });
  return action;
};

ActionCreator.addToPlayerArray = (arrayName, playerId, coinKey) => {
  return { type: ActionType.ADD_TO_PLAYER_ARRAY, arrayName, playerId, coinKey };
};

ActionCreator.boardToMorgue = makeActionCreator(ActionType.BOARD_TO_MORGUE, "playerId", "an");

ActionCreator.handToBoard = makeActionCreator(
  ActionType.HAND_TO_BOARD,
  "playerId",
  "coinKey",
  "an"
);

ActionCreator.moveAUnit = makeActionCreator(ActionType.MOVE_A_UNIT, "playerId", "fromAN", "toAN");

ActionCreator.removeFromPlayerArray = (arrayName, playerId, coinKey) => {
  return { type: ActionType.REMOVE_FROM_PLAYER_ARRAY, arrayName, playerId, coinKey };
};

ActionCreator.setControl = makeActionCreator(ActionType.SET_CONTROL, "an", "controlKey");

ActionCreator.setCurrentPaymentCoin = makeActionCreator(
  ActionType.SET_CURRENT_PAYMENT_COIN,
  "coinKey"
);

ActionCreator.setCurrentPhase = makeActionCreator(ActionType.SET_CURRENT_PHASE, "phaseKey");

ActionCreator.setCurrentPlayer = makeActionCreator(ActionType.SET_CURRENT_PLAYER, "playerId");

ActionCreator.setInitiativeChangedThisRound = makeActionCreator(
  ActionType.SET_INITIATIVE_CHANGED_THIS_ROUND,
  "isChanged"
);

ActionCreator.setInitiativePlayer = makeActionCreator(ActionType.SET_INITIATIVE_PLAYER, "playerId");

ActionCreator.setPlayers = makeActionCreator(ActionType.SET_PLAYERS, "players");

ActionCreator.setRound = makeActionCreator(ActionType.SET_ROUND, "round");

ActionCreator.setUnit = makeActionCreator(ActionType.SET_UNIT, "an", "coinKey");

ActionCreator.transferBetweenPlayerArrays = (fromArrayName, toArrayName, playerId, coinKey) => {
  return {
    type: ActionType.TRANSFER_BETWEEN_PLAYER_ARRAYS,
    fromArrayName,
    toArrayName,
    playerId,
    coinKey
  };
};

Object.freeze(ActionCreator);

export default ActionCreator;
