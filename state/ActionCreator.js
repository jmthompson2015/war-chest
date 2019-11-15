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

ActionCreator.boardToDiscardFaceup = makeActionCreator(
  ActionType.BOARD_TO_DISCARD_FACEUP,
  "playerId",
  "an1"
);

ActionCreator.boardToMorgue = makeActionCreator(ActionType.BOARD_TO_MORGUE, "playerId", "an1");

ActionCreator.handToBoard = makeActionCreator(
  ActionType.HAND_TO_BOARD,
  "playerId",
  "coinId",
  "an2"
);

ActionCreator.moveAUnit = makeActionCreator(ActionType.MOVE_A_UNIT, "playerId", "an1", "an2");

ActionCreator.popInputCallback = makeActionCreator(ActionType.POP_INPUT_CALLBACK);

ActionCreator.pushInputCallback = makeActionCreator(ActionType.PUSH_INPUT_CALLBACK, "callback");

ActionCreator.refillBag = makeActionCreator(ActionType.REFILL_BAG, "playerId");

ActionCreator.removeFromPlayerArray = (arrayName, playerId, coinId) => {
  return { type: ActionType.REMOVE_FROM_PLAYER_ARRAY, arrayName, playerId, coinId };
};

ActionCreator.setControl = makeActionCreator(ActionType.SET_CONTROL, "an", "controlKey");

ActionCreator.setCurrentDamageCallback = makeActionCreator(
  ActionType.SET_CURRENT_DAMAGE_CALLBACK,
  "callback"
);

ActionCreator.setCurrentDamageTarget = makeActionCreator(
  ActionType.SET_CURRENT_DAMAGE_TARGET,
  "damageTargetKey"
);

ActionCreator.setCurrentHandCallback = makeActionCreator(
  ActionType.SET_CURRENT_HAND_CALLBACK,
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

ActionCreator.setPlayerToTableau = makeActionCreator(
  ActionType.SET_PLAYER_TO_TABLEAU,
  "playerToTableau"
);

ActionCreator.setRound = makeActionCreator(ActionType.SET_ROUND, "round");

ActionCreator.setUnit = makeActionCreator(ActionType.SET_UNIT, "an", "coinId");

ActionCreator.setUserMessage = makeActionCreator(ActionType.SET_USER_MESSAGE, "userMessage");

ActionCreator.setVerbose = makeActionCreator(ActionType.SET_VERBOSE, "isVerbose");

ActionCreator.setWinner = makeActionCreator(ActionType.SET_WINNER, "winnerTeamKey");

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
