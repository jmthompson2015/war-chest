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

ActionCreator.addCoin = makeActionCreator(ActionType.ADD_COIN, "coinState");

ActionCreator.addToPlayerArray = (arrayName, playerId, coinId) => {
  return { type: ActionType.ADD_TO_PLAYER_ARRAY, arrayName, playerId, coinId };
};

ActionCreator.boardToMorgue = makeActionCreator(ActionType.BOARD_TO_MORGUE, "playerId", "an");

ActionCreator.handToBoard = makeActionCreator(ActionType.HAND_TO_BOARD, "playerId", "coinId", "an");

ActionCreator.moveAUnit = makeActionCreator(ActionType.MOVE_A_UNIT, "playerId", "fromAN", "toAN");

ActionCreator.refillBag = makeActionCreator(ActionType.REFILL_BAG, "playerId");

ActionCreator.removeFromPlayerArray = (arrayName, playerId, coinId) => {
  return { type: ActionType.REMOVE_FROM_PLAYER_ARRAY, arrayName, playerId, coinId };
};

ActionCreator.setControl = makeActionCreator(ActionType.SET_CONTROL, "an", "controlKey");

ActionCreator.setCurrentHandCallback = makeActionCreator(
  ActionType.SET_CURRENT_HAND_CALLBACK,
  "callback"
);

ActionCreator.setCurrentInputCallback = makeActionCreator(
  ActionType.SET_CURRENT_INPUT_CALLBACK,
  "callback"
);

ActionCreator.setCurrentMove = makeActionCreator(ActionType.SET_CURRENT_MOVE, "moveState");

ActionCreator.setCurrentMoves = makeActionCreator(ActionType.SET_CURRENT_MOVES, "moveStates");

ActionCreator.setCurrentPaymentCoin = makeActionCreator(
  ActionType.SET_CURRENT_PAYMENT_COIN,
  "coinId"
);

ActionCreator.setCurrentPhase = makeActionCreator(ActionType.SET_CURRENT_PHASE, "phaseKey");

ActionCreator.setCurrentPlayer = makeActionCreator(ActionType.SET_CURRENT_PLAYER, "playerId");

ActionCreator.setCurrentPlayerOrder = makeActionCreator(
  ActionType.SET_CURRENT_PLAYER_ORDER,
  "playerIds"
);

ActionCreator.setDelay = makeActionCreator(ActionType.SET_DELAY, "delay");

ActionCreator.setInitiativeChangedThisRound = makeActionCreator(
  ActionType.SET_INITIATIVE_CHANGED_THIS_ROUND,
  "isChanged"
);

ActionCreator.setInitiativePlayer = makeActionCreator(ActionType.SET_INITIATIVE_PLAYER, "playerId");

ActionCreator.setPlayers = makeActionCreator(ActionType.SET_PLAYERS, "players");

ActionCreator.setPlayerTableau = makeActionCreator(
  ActionType.SET_PLAYER_TABLEAU,
  "playerId",
  "tableau"
);

ActionCreator.setRound = makeActionCreator(ActionType.SET_ROUND, "round");

ActionCreator.setUnit = makeActionCreator(ActionType.SET_UNIT, "an", "coinId");

ActionCreator.setUserMessage = makeActionCreator(ActionType.SET_USER_MESSAGE, "userMessage");

ActionCreator.transferBetweenPlayerArrays = (fromArrayName, toArrayName, playerId, coinId) => {
  return {
    type: ActionType.TRANSFER_BETWEEN_PLAYER_ARRAYS,
    fromArrayName,
    toArrayName,
    playerId,
    coinId
  };
};

Object.freeze(ActionCreator);

export default ActionCreator;
