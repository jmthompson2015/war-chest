/* eslint no-console: ["error", { allow: ["warn"] }] */

import ArrayUtils from "../util/ArrayUtilities.js";

import ActionType from "./ActionType.js";
import AppState from "./AppState.js";

const Reducer = {};

const assoc = (propertyName, propertyValue, object) =>
  Immutable(R.assoc(propertyName, Immutable(propertyValue), object));

const addToArray = (state, arrayName, playerId, coinKey) => {
  const map = state[arrayName] || {};
  const oldArray = map[playerId] || [];
  const newArray = R.append(coinKey, oldArray);
  const newPlayer2To = assoc(playerId, newArray, map);

  return assoc(arrayName, newPlayer2To, state);
};

const removeFromArray = (state, arrayName, playerId, coinKey) => {
  const map = state[arrayName] || {};
  const oldArray = map[playerId] || [];
  const newArray = ArrayUtils.remove(coinKey, oldArray);
  const newPlayer2From = assoc(playerId, newArray, map);

  return assoc(arrayName, newPlayer2From, state);
};

const transferBetweenArrays = (state, fromKey, toKey, playerId, coinKey) => {
  const oldFrom = state[fromKey][playerId] || [];
  const newFrom = ArrayUtils.remove(coinKey, oldFrom);
  const oldTo = state[toKey][playerId] || [];
  const newTo = R.append(coinKey, oldTo);
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
  let newMorgue;
  let newHand;
  let newPlayers;
  let newPlayerToMorgue;
  let newPlayerToHand;
  let newUnit;
  let oldHand;
  let oldUnit;
  let unit;

  switch (action.type) {
    case ActionType.ADD_TO_PLAYER_ARRAY:
      // console.log(
      //   `Reducer ADD_TO_PLAYER_ARRAY arrayName = ${action.arrayName} coinKey = ${action.coinKey}`
      // );
      return addToArray(state, action.arrayName, action.playerId, action.coinKey);
    case ActionType.BOARD_TO_MORGUE:
      oldUnit = state.anToTokens[action.an] || [];
      newUnit = ArrayUtils.remove(oldUnit[0], oldUnit);
      newMorgue = state.playerToMorgue[action.playerId] || [];
      newMorgue = R.append(oldUnit[0], newMorgue);
      newPlayerToMorgue = assoc(action.playerId, newMorgue, state.playerToMorgue);
      newANToTokens = assoc(action.an, newUnit, state.anToTokens);
      return Immutable(
        R.pipe(
          R.assoc("anToTokens", newANToTokens),
          R.assoc("playerToMorgue", newPlayerToMorgue)
        )(state)
      );
    case ActionType.HAND_TO_BOARD:
      oldHand = state.playerToHand[action.playerId] || [];
      newHand = ArrayUtils.remove(action.coinKey, oldHand);
      oldUnit = state.anToTokens[action.an] || [];
      newUnit = R.append(action.coinKey, oldUnit);
      newPlayerToHand = assoc(action.playerId, newHand, state.playerToHand);
      newANToTokens = assoc(action.an, newUnit, state.anToTokens);
      return Immutable(
        R.pipe(
          R.assoc("playerToHand", newPlayerToHand),
          R.assoc("anToTokens", newANToTokens)
        )(state)
      );
    case ActionType.MOVE_A_UNIT:
      unit = state.anToTokens[action.fromAN];
      newANToTokens = assoc(action.fromAN, undefined, state.anToTokens);
      newANToTokens = assoc(action.toAN, unit, newANToTokens);
      return assoc("anToTokens", newANToTokens, state);
    case ActionType.REMOVE_FROM_PLAYER_ARRAY:
      return removeFromArray(state, action.arrayName, action.playerId, action.coinKey);
    case ActionType.SET_CONTROL:
      newAnToControl = assoc(action.an, action.controlKey, state.anToControl);
      return assoc("anToControl", newAnToControl, state);
    case ActionType.SET_INITIATIVE_CHANGED_THIS_ROUND:
      return assoc("initiativeChangedThisRound", action.isChanged, state);
    case ActionType.SET_INITIATIVE_PLAYER:
      return assoc("initiativePlayerId", action.playerId, state);
    case ActionType.SET_PLAYERS:
      newPlayers = R.reduce((accum, p) => assoc(p.id, p, accum), {}, action.players);
      return assoc("playerInstances", newPlayers, state);
    case ActionType.SET_UNIT:
      // console.log(`Reducer SET_UNIT an = ${action.an} coinKey = ${action.coinKey}`);
      oldUnit = state.anToTokens[action.an] || [];
      newUnit = R.append(action.coinKey, oldUnit);
      newANToTokens = assoc(action.an, newUnit, state.anToTokens);
      return assoc("anToTokens", newANToTokens, state);
    case ActionType.TRANSFER_BETWEEN_PLAYER_ARRAYS:
      return transferBetweenArrays(
        state,
        action.fromArrayName,
        action.toArrayName,
        action.playerId,
        action.coinKey
      );
    default:
      console.warn(`Reducer.root: Unhandled action type: ${action.type}`);
      return state;
  }
};

Object.freeze(Reducer);

export default Reducer;
