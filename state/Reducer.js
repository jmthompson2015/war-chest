/* eslint no-console: ["error", { allow: ["error", "log", "warn"] }] */

import ArrayUtils from "../util/ArrayUtilities.js";

import ActionType from "./ActionType.js";
import AppState from "./AppState.js";

const Reducer = {};

const addToArray = (state, arrayName, playerId, coinId) => {
  const map = state[arrayName] || {};
  const oldArray = map[playerId] || [];
  const newArray = R.append(coinId, oldArray);
  const newPlayer2To = { ...map, [playerId]: newArray };

  return { ...state, [arrayName]: newPlayer2To };
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
  const newPlayer2From = { ...map, [playerId]: newArray };

  return { ...state, [arrayName]: newPlayer2From };
};

const transferBetweenArrays = (state, fromKey, toKey, playerId, coinId) => {
  const oldFrom = state[fromKey][playerId] || [];
  const newFrom = ArrayUtils.remove(coinId, oldFrom);
  const oldTo = state[toKey][playerId] || [];
  const newTo = R.append(coinId, oldTo);
  const newPlayerToFrom = { ...state[fromKey], [playerId]: newFrom };
  const newPlayerToTo = { ...state[toKey], [playerId]: newTo };

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
    newANToTokens = { ...state.anToTokens };
    delete newANToTokens[an1];
  } else {
    newUnit = ArrayUtils.remove(oldUnit[0], oldUnit);
    newANToTokens = { ...state.anToTokens, [an1]: newUnit };
  }

  const oldTo = state[toKey][playerId] || [];
  const newTo = R.append(oldUnit[0], oldTo);
  const newPlayerToTo = { ...state[toKey], [playerId]: newTo };

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
  const newPlayerToFrom = { ...state[fromKey], [playerId]: newFrom };
  const newANToTokens = { ...state.anToTokens, [an2]: newUnit };

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
      newCoins = { ...state.coinInstances, [action.coinState.id]: action.coinState };
      return { ...state, coinInstances: newCoins };
    case ActionType.ADD_TO_PLAYER_ARRAY:
      return addToArray(state, action.arrayName, action.playerId, action.coinId);
    case ActionType.MOVE_A_UNIT:
      log(`Reducer MOVE_A_UNIT an = ${action.an1} an2 = ${action.an2}`, state);
      unit = state.anToTokens[action.an1];
      newANToTokens = { ...state.anToTokens };
      delete newANToTokens[action.an1];
      newANToTokens = { ...newANToTokens, [action.an2]: unit };
      return { ...state, anToTokens: newANToTokens };
    case ActionType.POP_INPUT_CALLBACK:
      log(`Reducer POP_INPUT_CALLBACK`, state);
      newInputCallbackStack = R.init(state.inputCallbackStack);
      return { ...state, inputCallbackStack: newInputCallbackStack };
    case ActionType.PUSH_INPUT_CALLBACK:
      log(`Reducer PUSH_INPUT_CALLBACK callback isNil ? ${R.isNil(action.callback)}`, state);
      newInputCallbackStack = R.append(action.callback, state.inputCallbackStack);
      return { ...state, inputCallbackStack: newInputCallbackStack };
    case ActionType.REFILL_BAG:
      oldDiscardFacedown = state.playerToDiscardFacedown[action.playerId] || [];
      oldDiscardFaceup = state.playerToDiscardFaceup[action.playerId] || [];
      oldBag = state.playerToBag[action.playerId] || [];
      newBag = [...oldDiscardFacedown, ...oldDiscardFaceup, ...oldBag];
      newPlayerToDiscardFacedown = { ...state.playerToDiscardFacedown, [action.playerId]: [] };
      newPlayerToDiscardFaceup = { ...state.playerToDiscardFaceup, [action.playerId]: [] };
      newPlayerToBag = { ...state.playerToBag, [action.playerId]: newBag };
      return {
        ...state,
        playerToDiscardFacedown: newPlayerToDiscardFacedown,
        playerToDiscardFaceup: newPlayerToDiscardFaceup,
        playerToBag: newPlayerToBag
      };
    case ActionType.REMOVE_FROM_PLAYER_ARRAY:
      return removeFromArray(state, action.arrayName, action.playerId, action.coinId);
    case ActionType.SET_CONTROL:
      newAnToControl = { ...state.anToControl, [action.an]: action.controlKey };
      return { ...state, anToControl: newAnToControl };
    case ActionType.SET_CURRENT_DAMAGE_CALLBACK:
      log(
        `Reducer SET_CURRENT_DAMAGE_CALLBACK callback isNil ? ${R.isNil(action.callback)}`,
        state
      );
      return { ...state, currentDamageCallback: action.callback };
    case ActionType.SET_CURRENT_DAMAGE_TARGET:
      log(`Reducer SET_CURRENT_DAMAGE_TARGET damageTargetKey = ${action.damageTargetKey}`, state);
      return { ...state, currentDamageTargetKey: action.damageTargetKey };
    case ActionType.SET_CURRENT_HAND_CALLBACK:
      log(`Reducer SET_CURRENT_HAND_CALLBACK callback isNil ? ${R.isNil(action.callback)}`, state);
      return { ...state, currentHandCallback: action.callback };
    case ActionType.SET_CURRENT_MOVE:
      log(`Reducer SET_CURRENT_MOVE moveState = ${JSON.stringify(action.moveState)}`, state);
      return { ...state, currentMove: action.moveState };
    case ActionType.SET_CURRENT_MOVES:
      log(`Reducer SET_CURRENT_MOVES moveStates.length = ${action.moveStates.length}`, state);
      return { ...state, currentMoves: action.moveStates };
    case ActionType.SET_CURRENT_PAYMENT_COIN:
      log(`Reducer SET_CURRENT_PAYMENT_COIN coinId = ${action.coinId}`, state);
      return { ...state, currentPaymentCoinId: action.coinId };
    case ActionType.SET_CURRENT_PHASE:
      log(`Reducer SET_CURRENT_PHASE phaseKey = ${action.phaseKey}`, state);
      return { ...state, currentPhaseKey: action.phaseKey };
    case ActionType.SET_CURRENT_PLAYER:
      log(`Reducer SET_CURRENT_PLAYER playerId = ${action.playerId}`, state);
      return { ...state, currentPlayerId: action.playerId };
    case ActionType.SET_CURRENT_PLAYER_ORDER:
      log(
        `Reducer SET_CURRENT_PLAYER_ORDER playerIds = ${JSON.stringify(action.playerIds)}`,
        state
      );
      return { ...state, currentPlayerOrder: action.playerIds };
    case ActionType.SET_DELAY:
      log(`Reducer SET_DELAY delay = ${action.delay}`, state);
      return { ...state, delay: action.delay };
    case ActionType.SET_INITIATIVE_CHANGED_THIS_ROUND:
      log(`Reducer SET_INITIATIVE_CHANGED_THIS_ROUND isChanged ? ${action.isChanged}`, state);
      return { ...state, initiativeChangedThisRound: action.isChanged };
    case ActionType.SET_INITIATIVE_PLAYER:
      log(`Reducer SET_INITIATIVE_PLAYER playerId = ${action.playerId}`, state);
      return { ...state, initiativePlayerId: action.playerId };
    case ActionType.SET_MCTS_ROOT:
      log(`Reducer SET_MCTS_ROOT mctsRoot = ${action.mctsRoot}`, state);
      return { ...state, mctsRoot: action.mctsRoot };
    case ActionType.SET_PLAYERS:
      log(`Reducer SET_PLAYERS players.length = ${action.players.length}`, state);
      newPlayers = R.reduce((accum, p) => ({ ...accum, [p.id]: p }), {}, action.players);
      return { ...state, playerInstances: newPlayers, isTwoPlayer: action.players.length === 2 };
    case ActionType.SET_PLAYER_STRATEGY:
      log(
        `Reducer SET_PLAYER_STRATEGY playerId = ${action.playerId} strategy = ${action.strategy}`,
        state
      );
      newPlayerToStrategy = { ...state.playerToStrategy, [action.playerId]: action.strategy };
      return { ...state, playerToStrategy: newPlayerToStrategy };
    case ActionType.SET_PLAYER_TO_TABLEAU:
      log(`Reducer SET_PLAYER_TO_TABLEAU playerToTableau = ${action.playerToTableau}`, state);
      return { ...state, playerToTableau: action.playerToTableau };
    case ActionType.SET_ROUND:
      log(`Reducer SET_ROUND round = ${action.round}`, state);
      return { ...state, round: action.round };
    case ActionType.SET_UNIT:
      log(`Reducer SET_UNIT an = ${action.an} coinId = ${action.coinId}`, state);
      oldUnit = state.anToTokens[action.an] || [];
      newUnit = R.append(action.coinId, oldUnit);
      newANToTokens = { ...state.anToTokens, [action.an]: newUnit };
      return { ...state, anToTokens: newANToTokens };
    case ActionType.SET_USER_MESSAGE:
      log(`Reducer SET_USER_MESSAGE userMessage = ${action.userMessage}`, state);
      return { ...state, userMessage: action.userMessage };
    case ActionType.SET_VERBOSE:
      log(`Reducer SET_VERBOSE isVerbose = ${action.isVerbose}`, state);
      return { ...state, isVerbose: action.isVerbose };
    case ActionType.SET_WINNER:
      log(`Reducer SET_WINNER winnerTeamKey = ${action.winnerTeamKey}`, state);
      return { ...state, winnerTeamKey: action.winnerTeamKey };
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
