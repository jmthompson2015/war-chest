/* eslint no-console: ["error", { allow: ["error", "log", "warn"] }] */

import ArrayUtils from "../util/ArrayUtilities.js";

import ActionType from "./ActionType.js";
import AppState from "./AppState.js";

const Reducer = {};

const assoc = (propertyName, propertyValue, object) =>
  Immutable(R.assoc(propertyName, Immutable(propertyValue), object));

const addToArray = (state, arrayName, playerId, coinId) => {
  const map = state[arrayName] || {};
  const oldArray = map[playerId] || [];
  const newArray = R.append(coinId, oldArray);
  const newPlayer2To = assoc(playerId, newArray, map);

  return assoc(arrayName, newPlayer2To, state);
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
  const newPlayer2From = assoc(playerId, newArray, map);

  return assoc(arrayName, newPlayer2From, state);
};

const transferBetweenArrays = (state, fromKey, toKey, playerId, coinId) => {
  if (R.isNil(coinId)) {
    console.error(`ERROR: invalid coinId: ${coinId}`);
  }

  const oldFrom = state[fromKey][playerId] || [];
  const newFrom = ArrayUtils.remove(coinId, oldFrom);
  const oldTo = state[toKey][playerId] || [];
  const newTo = R.append(coinId, oldTo);
  const newPlayerToFrom = assoc(playerId, newFrom, state[fromKey]);
  const newPlayerToTo = assoc(playerId, newTo, state[toKey]);

  return Immutable(
    R.pipe(
      R.assoc(fromKey, newPlayerToFrom),
      R.assoc(toKey, newPlayerToTo)
    )(state)
  );
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
  let newDiscardFaceup;
  let newInputCallbackStack;
  let newMorgue;
  let newHand;
  let newPlayers;
  let newPlayerToBag;
  let newPlayerToDiscardFacedown;
  let newPlayerToDiscardFaceup;
  let newPlayerToMorgue;
  let newPlayerToHand;
  let newUnit;
  let oldBag;
  let oldDiscardFacedown;
  let oldDiscardFaceup;
  let oldHand;
  let oldUnit;
  let unit;

  switch (action.type) {
    case ActionType.ADD_COIN:
      newCoins = assoc(action.coinState.id, action.coinState, state.coinInstances);
      return assoc("coinInstances", newCoins, state);
    case ActionType.ADD_TO_PLAYER_ARRAY:
      return addToArray(state, action.arrayName, action.playerId, action.coinId);
    case ActionType.BOARD_TO_DISCARD_FACEUP:
      log(
        `Reducer BOARD_TO_DISCARD_FACEUP playerId = ${action.playerId} an = ${action.an1}`,
        state
      );
      oldUnit = state.anToTokens[action.an1];
      if (oldUnit.length === 1) {
        newANToTokens = R.dissoc(action.an1, state.anToTokens);
      } else {
        newUnit = ArrayUtils.remove(oldUnit[0], oldUnit);
        newANToTokens = assoc(action.an1, newUnit, state.anToTokens);
      }
      newDiscardFaceup = state.playerToDiscardFaceup[action.playerId] || [];
      newDiscardFaceup = R.append(oldUnit[0], newDiscardFaceup);
      newPlayerToDiscardFaceup = assoc(
        action.playerId,
        newDiscardFaceup,
        state.playerToDiscardFaceup
      );
      return Immutable(
        R.pipe(
          R.assoc("anToTokens", newANToTokens || {}),
          R.assoc("playerToDiscardFaceup", newPlayerToDiscardFaceup)
        )(state)
      );
    case ActionType.BOARD_TO_MORGUE:
      log(`Reducer BOARD_TO_MORGUE playerId = ${action.playerId} an = ${action.an1}`, state);
      oldUnit = state.anToTokens[action.an1];
      if (oldUnit.length === 1) {
        newANToTokens = R.dissoc(action.an1, state.anToTokens);
      } else {
        newUnit = ArrayUtils.remove(oldUnit[0], oldUnit);
        newANToTokens = assoc(action.an1, newUnit, state.anToTokens);
      }
      newMorgue = state.playerToMorgue[action.playerId] || [];
      newMorgue = R.append(oldUnit[0], newMorgue);
      newPlayerToMorgue = assoc(action.playerId, newMorgue, state.playerToMorgue);
      return Immutable(
        R.pipe(
          R.assoc("anToTokens", newANToTokens || {}),
          R.assoc("playerToMorgue", newPlayerToMorgue)
        )(state)
      );
    case ActionType.HAND_TO_BOARD:
      oldHand = state.playerToHand[action.playerId] || [];
      newHand = ArrayUtils.remove(action.coinId, oldHand);
      oldUnit = state.anToTokens[action.an2] || [];
      newUnit = R.append(action.coinId, oldUnit);
      newPlayerToHand = assoc(action.playerId, newHand, state.playerToHand);
      newANToTokens = assoc(action.an2, newUnit, state.anToTokens);
      return Immutable(
        R.pipe(
          R.assoc("playerToHand", newPlayerToHand),
          R.assoc("anToTokens", newANToTokens)
        )(state)
      );
    case ActionType.MOVE_A_UNIT:
      log(`Reducer MOVE_A_UNIT an = ${action.an1} an2 = ${action.an2}`, state);
      unit = state.anToTokens[action.an1];
      newANToTokens = R.dissoc(action.an1, state.anToTokens);
      newANToTokens = assoc(action.an2, unit, newANToTokens);
      return assoc("anToTokens", newANToTokens, state);
    case ActionType.POP_INPUT_CALLBACK:
      log(`Reducer POP_INPUT_CALLBACK`, state);
      newInputCallbackStack = R.init(state.inputCallbackStack);
      return assoc("inputCallbackStack", newInputCallbackStack, state);
    case ActionType.PUSH_INPUT_CALLBACK:
      log(`Reducer PUSH_INPUT_CALLBACK callback isNil ? ${R.isNil(action.callback)}`, state);
      newInputCallbackStack = R.append(action.callback, state.inputCallbackStack);
      return assoc("inputCallbackStack", newInputCallbackStack, state);
    case ActionType.REFILL_BAG:
      oldDiscardFacedown = state.playerToDiscardFacedown[action.playerId] || [];
      oldDiscardFaceup = state.playerToDiscardFaceup[action.playerId] || [];
      oldBag = state.playerToBag[action.playerId] || [];
      newBag = R.concat(R.concat(oldDiscardFacedown, oldDiscardFaceup), oldBag);
      newPlayerToDiscardFacedown = assoc(action.playerId, [], state.playerToDiscardFacedown);
      newPlayerToDiscardFaceup = assoc(action.playerId, [], state.playerToDiscardFaceup);
      newPlayerToBag = assoc(action.playerId, newBag, state.playerToBag);
      return Immutable(
        R.pipe(
          R.assoc("playerToDiscardFacedown", newPlayerToDiscardFacedown),
          R.assoc("playerToDiscardFaceup", newPlayerToDiscardFaceup),
          R.assoc("playerToBag", newPlayerToBag)
        )(state)
      );
    case ActionType.REMOVE_FROM_PLAYER_ARRAY:
      return removeFromArray(state, action.arrayName, action.playerId, action.coinId);
    case ActionType.SET_CONTROL:
      newAnToControl = assoc(action.an, action.controlKey, state.anToControl);
      return assoc("anToControl", newAnToControl, state);
    case ActionType.SET_CURRENT_DAMAGE_CALLBACK:
      log(
        `Reducer SET_CURRENT_DAMAGE_CALLBACK callback isNil ? ${R.isNil(action.callback)}`,
        state
      );
      return assoc("currentDamageCallback", action.callback, state);
    case ActionType.SET_CURRENT_DAMAGE_TARGET:
      log(`Reducer SET_CURRENT_DAMAGE_TARGET damageTargetKey = ${action.damageTargetKey}`, state);
      return assoc("currentDamageTargetKey", action.damageTargetKey, state);
    case ActionType.SET_CURRENT_HAND_CALLBACK:
      log(`Reducer SET_CURRENT_HAND_CALLBACK callback isNil ? ${R.isNil(action.callback)}`, state);
      return assoc("currentHandCallback", action.callback, state);
    case ActionType.SET_CURRENT_MOVE:
      log(`Reducer SET_CURRENT_MOVE moveState = ${JSON.stringify(action.moveState)}`, state);
      return assoc("currentMove", action.moveState, state);
    case ActionType.SET_CURRENT_MOVES:
      log(`Reducer SET_CURRENT_MOVES moveStates.length = ${action.moveStates.length}`, state);
      return assoc("currentMoves", action.moveStates, state);
    case ActionType.SET_CURRENT_PAYMENT_COIN:
      log(`Reducer SET_CURRENT_PAYMENT_COIN coinId = ${action.coinId}`, state);
      return assoc("currentPaymentCoinId", action.coinId, state);
    case ActionType.SET_CURRENT_PHASE:
      log(`Reducer SET_CURRENT_PHASE phaseKey = ${action.phaseKey}`, state);
      return assoc("currentPhaseKey", action.phaseKey, state);
    case ActionType.SET_CURRENT_PLAYER:
      log(`Reducer SET_CURRENT_PLAYER playerId = ${action.playerId}`, state);
      return assoc("currentPlayerId", action.playerId, state);
    case ActionType.SET_CURRENT_PLAYER_ORDER:
      log(
        `Reducer SET_CURRENT_PLAYER_ORDER playerIds = ${JSON.stringify(action.playerIds)}`,
        state
      );
      return assoc("currentPlayerOrder", action.playerIds, state);
    case ActionType.SET_DELAY:
      log(`Reducer SET_DELAY delay = ${action.delay}`, state);
      return assoc("delay", action.delay, state);
    case ActionType.SET_INITIATIVE_CHANGED_THIS_ROUND:
      return assoc("initiativeChangedThisRound", action.isChanged, state);
    case ActionType.SET_INITIATIVE_PLAYER:
      return assoc("initiativePlayerId", action.playerId, state);
    case ActionType.SET_PLAYERS:
      log(`Reducer SET_PLAYERS players.length = ${action.players.length}`, state);
      newPlayers = R.reduce((accum, p) => assoc(p.id, p, accum), {}, action.players);
      return assoc("playerInstances", newPlayers, state);
    case ActionType.SET_PLAYER_TO_TABLEAU:
      log(`Reducer SET_PLAYER_TO_TABLEAU playerToTableau = ${action.playerToTableau}`, state);
      return assoc("playerToTableau", action.playerToTableau, state);
    case ActionType.SET_ROUND:
      log(`Reducer SET_ROUND round = ${action.round}`, state);
      return assoc("round", action.round, state);
    case ActionType.SET_UNIT:
      log(`Reducer SET_UNIT an = ${action.an} coinId = ${action.coinId}`, state);
      oldUnit = state.anToTokens[action.an] || [];
      newUnit = Immutable(R.append(action.coinId, oldUnit));
      newANToTokens = assoc(action.an, newUnit, state.anToTokens);
      return assoc("anToTokens", newANToTokens, state);
    case ActionType.SET_USER_MESSAGE:
      log(`Reducer SET_USER_MESSAGE userMessage = ${action.userMessage}`, state);
      return assoc("userMessage", action.userMessage, state);
    case ActionType.SET_VERBOSE:
      log(`Reducer SET_VERBOSE isVerbose = ${action.isVerbose}`, state);
      return assoc("isVerbose", action.isVerbose, state);
    case ActionType.SET_WINNER:
      log(`Reducer SET_WINNER winnerTeamKey = ${action.winnerTeamKey}`, state);
      return assoc("winnerTeamKey", action.winnerTeamKey, state);
    case ActionType.TRANSFER_BETWEEN_PLAYER_ARRAYS:
      return transferBetweenArrays(
        state,
        action.fromArrayName,
        action.toArrayName,
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
