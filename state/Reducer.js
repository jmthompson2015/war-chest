/* eslint no-console: ["error", { allow: ["log", "warn"] }] */

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

const removeFromArray = (state, arrayName, playerId, coinId) => {
  const map = state[arrayName] || {};
  const oldArray = map[playerId] || [];
  const newArray = ArrayUtils.remove(coinId, oldArray);
  const newPlayer2From = assoc(playerId, newArray, map);

  return assoc(arrayName, newPlayer2From, state);
};

const transferBetweenArrays = (state, fromKey, toKey, playerId, coinId) => {
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

  let newAnToControl;
  let newANToTokens;
  let newBag;
  let newCoins;
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
      // console.log(`Reducer ADD_COIN coinState = ${JSON.stringify(action.coinState)}`);
      newCoins = assoc(action.coinState.id, action.coinState, state.coinInstances);
      return assoc("coinInstances", newCoins, state);
    case ActionType.ADD_TO_PLAYER_ARRAY:
      // console.log(
      //   `Reducer ADD_TO_PLAYER_ARRAY arrayName = ${action.arrayName} coinId = ${action.coinId}`
      // );
      return addToArray(state, action.arrayName, action.playerId, action.coinId);
    case ActionType.BOARD_TO_MORGUE:
      console.log(`Reducer BOARD_TO_MORGUE playerId = ${action.playerId} an = ${action.an}`);
      oldUnit = state.anToTokens[action.an];
      if (oldUnit.length === 1) {
        newANToTokens = R.dissoc(action.an, state.anToTokens);
      } else {
        newUnit = ArrayUtils.remove(oldUnit[0], oldUnit);
        newANToTokens = assoc(action.an, newUnit, state.anToTokens);
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
      oldUnit = state.anToTokens[action.an] || [];
      newUnit = R.append(action.coinId, oldUnit);
      newPlayerToHand = assoc(action.playerId, newHand, state.playerToHand);
      newANToTokens = assoc(action.an, newUnit, state.anToTokens);
      return Immutable(
        R.pipe(
          R.assoc("playerToHand", newPlayerToHand),
          R.assoc("anToTokens", newANToTokens)
        )(state)
      );
    case ActionType.MOVE_A_UNIT:
      console.log(`Reducer MOVE_A_UNIT an = ${action.an} toAN = ${action.toAN}`);
      unit = state.anToTokens[action.an];
      newANToTokens = R.dissoc(action.an, state.anToTokens);
      newANToTokens = assoc(action.toAN, unit, newANToTokens);
      return assoc("anToTokens", newANToTokens, state);
    case ActionType.POP_INPUT_CALLBACK:
      console.log(`Reducer POP_INPUT_CALLBACK`);
      newInputCallbackStack = R.init(state.inputCallbackStack);
      return assoc("inputCallbackStack", newInputCallbackStack, state);
    case ActionType.PUSH_INPUT_CALLBACK:
      console.log(`Reducer PUSH_INPUT_CALLBACK callback isNil ? ${R.isNil(action.callback)}`);
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
      console.log(
        `Reducer SET_CURRENT_DAMAGE_CALLBACK callback isNil ? ${R.isNil(action.callback)}`
      );
      return assoc("currentDamageCallback", action.callback, state);
    case ActionType.SET_CURRENT_DAMAGE_TARGET:
      console.log(`Reducer SET_CURRENT_DAMAGE_TARGET damageTargetKey = ${action.damageTargetKey}`);
      return assoc("currentDamageTargetKey", action.damageTargetKey, state);
    case ActionType.SET_CURRENT_HAND_CALLBACK:
      console.log(`Reducer SET_CURRENT_HAND_CALLBACK callback isNil ? ${R.isNil(action.callback)}`);
      return assoc("currentHandCallback", action.callback, state);
    case ActionType.SET_CURRENT_MOVE:
      console.log(`Reducer SET_CURRENT_MOVE moveState = ${JSON.stringify(action.moveState)}`);
      return assoc("currentMove", action.moveState, state);
    case ActionType.SET_CURRENT_MOVES:
      // console.log(`Reducer SET_CURRENT_MOVES moveStates = ${JSON.stringify(action.moveStates)}`);
      console.log(`Reducer SET_CURRENT_MOVES moveStates.length = ${action.moveStates.length}`);
      return assoc("currentMoves", action.moveStates, state);
    case ActionType.SET_CURRENT_PAYMENT_COIN:
      console.log(`Reducer SET_CURRENT_PAYMENT_COIN coinId = ${action.coinId}`);
      return assoc("currentPaymentCoinId", action.coinId, state);
    case ActionType.SET_CURRENT_PHASE:
      console.log(`Reducer SET_CURRENT_PHASE phaseKey = ${action.phaseKey}`);
      return assoc("currentPhaseKey", action.phaseKey, state);
    case ActionType.SET_CURRENT_PLAYER:
      console.log(`Reducer SET_CURRENT_PLAYER playerId = ${action.playerId}`);
      return assoc("currentPlayerId", action.playerId, state);
    case ActionType.SET_CURRENT_PLAYER_ORDER:
      console.log(
        `Reducer SET_CURRENT_PLAYER_ORDER playerIds = ${JSON.stringify(action.playerIds)}`
      );
      return assoc("currentPlayerOrder", action.playerIds, state);
    case ActionType.SET_DELAY:
      console.log(`Reducer SET_DELAY delay = ${action.delay}`);
      return assoc("delay", action.delay, state);
    case ActionType.SET_INITIATIVE_CHANGED_THIS_ROUND:
      return assoc("initiativeChangedThisRound", action.isChanged, state);
    case ActionType.SET_INITIATIVE_PLAYER:
      return assoc("initiativePlayerId", action.playerId, state);
    case ActionType.SET_PLAYERS:
      console.log(`Reducer SET_PLAYERS players.length = ${action.players.length}`);
      newPlayers = R.reduce((accum, p) => assoc(p.id, p, accum), {}, action.players);
      return assoc("playerInstances", newPlayers, state);
    case ActionType.SET_PLAYER_TO_TABLEAU:
      console.log(`Reducer SET_PLAYER_TO_TABLEAU playerToTableau = ${action.playerToTableau})}`);
      return assoc("playerToTableau", action.playerToTableau, state);
    case ActionType.SET_ROUND:
      console.log(`Reducer SET_ROUND round = ${action.round}`);
      return assoc("round", action.round, state);
    case ActionType.SET_UNIT:
      console.log(`Reducer SET_UNIT an = ${action.an} coinId = ${action.coinId}`);
      oldUnit = state.anToTokens[action.an] || [];
      newUnit = Immutable(R.append(action.coinId, oldUnit));
      newANToTokens = assoc(action.an, newUnit, state.anToTokens);
      return assoc("anToTokens", newANToTokens, state);
    case ActionType.SET_USER_MESSAGE:
      console.log(`Reducer SET_USER_MESSAGE userMessage = ${action.userMessage}`);
      return assoc("userMessage", action.userMessage, state);
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
