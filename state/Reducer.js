/* eslint no-console: ["error", { allow: ["error", "log", "warn"] }] */

import ArrayUtils from "../util/ArrayUtilities.js";

import ActionType from "./ActionType.js";
import AppState from "./AppState.js";

const Reducer = {};

const addToArray = (state, arrayName, playerId, coinId) => {
  const map = state[arrayName] || {};
  const oldArray = map[playerId] || [];
  const newArray = R.append(coinId, oldArray);
  const newPlayer2To = R.assoc(playerId, newArray, map);

  return R.assoc(arrayName, newPlayer2To, state);
};

const log = (message, state) => {
  if (state.isVerbose) {
    console.log(message);
  }
};

const removeFromArray = (state, arrayName, playerId, coinId) => {
  const map = state[arrayName] || {};
  const oldArray = map[playerId] || [];
  const newArray = ArrayUtils.remove(coinId, oldArray);
  const newPlayer2From = R.assoc(playerId, newArray, map);

  return R.assoc(arrayName, newPlayer2From, state);
};

const transferBetweenArrays = (state, fromKey, toKey, playerId, coinId) => {
  if (R.isNil(coinId)) {
    console.error(`ERROR: invalid coinId: ${coinId}`);
  }

  const oldFrom = state[fromKey][playerId] || [];
  const newFrom = ArrayUtils.remove(coinId, oldFrom);
  const oldTo = state[toKey][playerId] || [];
  const newTo = R.append(coinId, oldTo);
  const newPlayerToFrom = R.assoc(playerId, newFrom, state[fromKey]);
  const newPlayerToTo = R.assoc(playerId, newTo, state[toKey]);

  return {
    ...state,
    [fromKey]: newPlayerToFrom,
    [toKey]: newPlayerToTo
  };
};

const transferBoardToPlayerArray = (state, toKey, playerId, an1) => {
  const oldUnit = state.anToTokens[an1];
  let newANToTokens;
  let newUnit;
  if (oldUnit.length === 1) {
    newANToTokens = R.dissoc(an1, state.anToTokens);
  } else {
    newUnit = ArrayUtils.remove(oldUnit[0], oldUnit);
    newANToTokens = R.assoc(an1, newUnit, state.anToTokens);
  }

  const oldTo = state[toKey][playerId] || [];
  const newTo = R.append(oldUnit[0], oldTo);
  const newPlayerToTo = R.assoc(playerId, newTo, state[toKey]);

  return {
    ...state,
    anToTokens: newANToTokens || {},
    [toKey]: newPlayerToTo
  };
};

const transferPlayerArrayToBoard = (state, fromKey, playerId, coinId, an2) => {
  const oldFrom = state[fromKey][playerId] || [];
  const newFrom = ArrayUtils.remove(coinId, oldFrom);
  const oldUnit = state.anToTokens[an2] || [];
  const newUnit = R.append(coinId, oldUnit);
  const newPlayerToFrom = R.assoc(playerId, newFrom, state[fromKey]);
  const newANToTokens = R.assoc(an2, newUnit, state.anToTokens);

  return {
    ...state,
    [fromKey]: newPlayerToFrom,
    anToTokens: newANToTokens
  };
};

Reducer.root = (state, action) => {
  // LOGGER.debug(`root() type = ${action.type}`);

  if (typeof state === "undefined") {
    return AppState.create();
  }

  if (action.type.startsWith("@@redux/INIT")) {
    // Nothing to do.
    return state;
  }

  let newAnToControl;
  let newANToTokens;
  let newBag;
  let newCoins;
  let newInputCallbackStack;
  let newPlayers;
  let newPlayerToBag;
  let newPlayerToDiscardFacedown;
  let newPlayerToDiscardFaceup;
  let newPlayerToStrategy;
  let newUnit;
  let oldBag;
  let oldDiscardFacedown;
  let oldDiscardFaceup;
  let oldUnit;
  let unit;

  switch (action.type) {
    case ActionType.ADD_COIN:
      newCoins = R.assoc(action.coinState.id, action.coinState, state.coinInstances);
      return R.assoc("coinInstances", newCoins, state);
    case ActionType.ADD_TO_PLAYER_ARRAY:
      return addToArray(state, action.arrayName, action.playerId, action.coinId);
    case ActionType.MOVE_A_UNIT:
      log(`Reducer MOVE_A_UNIT an = ${action.an1} an2 = ${action.an2}`, state);
      unit = state.anToTokens[action.an1];
      newANToTokens = R.dissoc(action.an1, state.anToTokens);
      newANToTokens = R.assoc(action.an2, unit, newANToTokens);
      return R.assoc("anToTokens", newANToTokens, state);
    case ActionType.POP_INPUT_CALLBACK:
      log(`Reducer POP_INPUT_CALLBACK`, state);
      newInputCallbackStack = R.init(state.inputCallbackStack);
      return R.assoc("inputCallbackStack", newInputCallbackStack, state);
    case ActionType.PUSH_INPUT_CALLBACK:
      log(`Reducer PUSH_INPUT_CALLBACK callback isNil ? ${R.isNil(action.callback)}`, state);
      newInputCallbackStack = R.append(action.callback, state.inputCallbackStack);
      return R.assoc("inputCallbackStack", newInputCallbackStack, state);
    case ActionType.REFILL_BAG:
      oldDiscardFacedown = state.playerToDiscardFacedown[action.playerId] || [];
      oldDiscardFaceup = state.playerToDiscardFaceup[action.playerId] || [];
      oldBag = state.playerToBag[action.playerId] || [];
      newBag = R.concat(R.concat(oldDiscardFacedown, oldDiscardFaceup), oldBag);
      newPlayerToDiscardFacedown = R.assoc(action.playerId, [], state.playerToDiscardFacedown);
      newPlayerToDiscardFaceup = R.assoc(action.playerId, [], state.playerToDiscardFaceup);
      newPlayerToBag = R.assoc(action.playerId, newBag, state.playerToBag);
      return {
        ...state,
        playerToDiscardFacedown: newPlayerToDiscardFacedown,
        playerToDiscardFaceup: newPlayerToDiscardFaceup,
        playerToBag: newPlayerToBag
      };
    case ActionType.REMOVE_FROM_PLAYER_ARRAY:
      return removeFromArray(state, action.arrayName, action.playerId, action.coinId);
    case ActionType.SET_CONTROL:
      newAnToControl = R.assoc(action.an, action.controlKey, state.anToControl);
      return R.assoc("anToControl", newAnToControl, state);
    case ActionType.SET_CURRENT_DAMAGE_CALLBACK:
      log(
        `Reducer SET_CURRENT_DAMAGE_CALLBACK callback isNil ? ${R.isNil(action.callback)}`,
        state
      );
      return R.assoc("currentDamageCallback", action.callback, state);
    case ActionType.SET_CURRENT_DAMAGE_TARGET:
      log(`Reducer SET_CURRENT_DAMAGE_TARGET damageTargetKey = ${action.damageTargetKey}`, state);
      return R.assoc("currentDamageTargetKey", action.damageTargetKey, state);
    case ActionType.SET_CURRENT_HAND_CALLBACK:
      log(`Reducer SET_CURRENT_HAND_CALLBACK callback isNil ? ${R.isNil(action.callback)}`, state);
      return R.assoc("currentHandCallback", action.callback, state);
    case ActionType.SET_CURRENT_MOVE:
      log(`Reducer SET_CURRENT_MOVE moveState = ${JSON.stringify(action.moveState)}`, state);
      return R.assoc("currentMove", action.moveState, state);
    case ActionType.SET_CURRENT_MOVES:
      log(`Reducer SET_CURRENT_MOVES moveStates.length = ${action.moveStates.length}`, state);
      return R.assoc("currentMoves", action.moveStates, state);
    case ActionType.SET_CURRENT_PAYMENT_COIN:
      log(`Reducer SET_CURRENT_PAYMENT_COIN coinId = ${action.coinId}`, state);
      return R.assoc("currentPaymentCoinId", action.coinId, state);
    case ActionType.SET_CURRENT_PHASE:
      log(`Reducer SET_CURRENT_PHASE phaseKey = ${action.phaseKey}`, state);
      return R.assoc("currentPhaseKey", action.phaseKey, state);
    case ActionType.SET_CURRENT_PLAYER:
      log(`Reducer SET_CURRENT_PLAYER playerId = ${action.playerId}`, state);
      return R.assoc("currentPlayerId", action.playerId, state);
    case ActionType.SET_CURRENT_PLAYER_ORDER:
      log(
        `Reducer SET_CURRENT_PLAYER_ORDER playerIds = ${JSON.stringify(action.playerIds)}`,
        state
      );
      return R.assoc("currentPlayerOrder", action.playerIds, state);
    case ActionType.SET_DELAY:
      log(`Reducer SET_DELAY delay = ${action.delay}`, state);
      return R.assoc("delay", action.delay, state);
    case ActionType.SET_INITIATIVE_CHANGED_THIS_ROUND:
      log(`Reducer SET_INITIATIVE_CHANGED_THIS_ROUND isChanged ? ${action.isChanged}`, state);
      return R.assoc("initiativeChangedThisRound", action.isChanged, state);
    case ActionType.SET_INITIATIVE_PLAYER:
      log(`Reducer SET_INITIATIVE_PLAYER playerId = ${action.playerId}`, state);
      return R.assoc("initiativePlayerId", action.playerId, state);
    case ActionType.SET_PLAYERS:
      log(`Reducer SET_PLAYERS players.length = ${action.players.length}`, state);
      newPlayers = R.reduce((accum, p) => R.assoc(p.id, p, accum), {}, action.players);
      return { ...state, playerInstances: newPlayers, isTwoPlayer: action.players.length === 2 };
    case ActionType.SET_PLAYER_STRATEGY:
      log(
        `Reducer SET_PLAYER_STRATEGY playerId = ${action.playerId} strategy = ${action.strategy}`,
        state
      );
      newPlayerToStrategy = R.assoc(action.playerId, action.strategy, state.playerToStrategy);
      return R.assoc("playerToStrategy", newPlayerToStrategy, state);
    case ActionType.SET_PLAYER_TO_TABLEAU:
      log(`Reducer SET_PLAYER_TO_TABLEAU playerToTableau = ${action.playerToTableau}`, state);
      return R.assoc("playerToTableau", action.playerToTableau, state);
    case ActionType.SET_ROUND:
      log(`Reducer SET_ROUND round = ${action.round}`, state);
      return R.assoc("round", action.round, state);
    case ActionType.SET_UNIT:
      log(`Reducer SET_UNIT an = ${action.an} coinId = ${action.coinId}`, state);
      oldUnit = state.anToTokens[action.an] || [];
      newUnit = R.append(action.coinId, oldUnit);
      newANToTokens = R.assoc(action.an, newUnit, state.anToTokens);
      return R.assoc("anToTokens", newANToTokens, state);
    case ActionType.SET_USER_MESSAGE:
      log(`Reducer SET_USER_MESSAGE userMessage = ${action.userMessage}`, state);
      return R.assoc("userMessage", action.userMessage, state);
    case ActionType.SET_VERBOSE:
      log(`Reducer SET_VERBOSE isVerbose = ${action.isVerbose}`, state);
      return R.assoc("isVerbose", action.isVerbose, state);
    case ActionType.SET_WINNER:
      log(`Reducer SET_WINNER winnerTeamKey = ${action.winnerTeamKey}`, state);
      return R.assoc("winnerTeamKey", action.winnerTeamKey, state);
    case ActionType.TRANSFER_BAG_TO_HAND:
      return transferBetweenArrays(
        state,
        "playerToBag",
        "playerToHand",
        action.playerId,
        action.coinId
      );
    case ActionType.TRANSFER_BETWEEN_PLAYER_ARRAYS:
      return transferBetweenArrays(
        state,
        action.fromArrayName,
        action.toArrayName,
        action.playerId,
        action.coinId
      );
    case ActionType.TRANSFER_BOARD_TO_DISCARD_FACEUP:
      log(
        `Reducer TRANSFER_BOARD_TO_DISCARD_FACEUP playerId = ${action.playerId} an = ${action.an1}`,
        state
      );
      return transferBoardToPlayerArray(
        state,
        "playerToDiscardFaceup",
        action.playerId,
        action.an1
      );
    case ActionType.TRANSFER_BOARD_TO_MORGUE:
      log(
        `Reducer TRANSFER_BOARD_TO_MORGUE playerId = ${action.playerId} an = ${action.an1}`,
        state
      );
      return transferBoardToPlayerArray(state, "playerToMorgue", action.playerId, action.an1);
    case ActionType.TRANSFER_HAND_TO_BOARD:
      return transferPlayerArrayToBoard(
        state,
        "playerToHand",
        action.playerId,
        action.coinId,
        action.an2
      );
    case ActionType.TRANSFER_HAND_TO_DISCARD_FACEDOWN:
      return transferBetweenArrays(
        state,
        "playerToHand",
        "playerToDiscardFacedown",
        action.playerId,
        action.coinId
      );
    case ActionType.TRANSFER_HAND_TO_DISCARD_FACEUP:
      return transferBetweenArrays(
        state,
        "playerToHand",
        "playerToDiscardFaceup",
        action.playerId,
        action.coinId
      );
    case ActionType.TRANSFER_SUPPLY_TO_DISCARD_FACEUP:
      return transferBetweenArrays(
        state,
        "playerToSupply",
        "playerToDiscardFaceup",
        action.playerId,
        action.coinId
      );
    case ActionType.TRANSFER_SUPPLY_TO_MORGUE:
      return transferBetweenArrays(
        state,
        "playerToSupply",
        "playerToMorgue",
        action.playerId,
        action.coinId
      );
    default:
      console.warn(`Reducer.root: Unhandled action type: ${action.type}`);
      return state;
  }
};

Object.freeze(Reducer);

export default Reducer;
