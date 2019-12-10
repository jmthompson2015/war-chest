import ArrayUtils from "../util/ArrayUtilities.js";

import ActionCreator from "../state/ActionCreator.js";
import Reducer from "../state/Reducer.js";
import Selector from "../state/Selector.js";

import MoveGenerator from "../model/MoveGenerator.js";

import Node from "./Node.js";

const Expansion = {};

const IS_PASS_ALLOWED = false;

Expansion.createMoveChildren = (moveStates, playerId, state, parent) => {
  const mapFunction = moveState => {
    const store = Redux.createStore(Reducer.root, state);
    store.dispatch(ActionCreator.setCurrentMoves(moveStates));
    store.dispatch(ActionCreator.setCurrentMove(moveState));

    return Node.create({ parent, state: store.getState() });
  };

  return R.map(mapFunction, moveStates);
};

Expansion.createPaymentCoinChildren = (hand, playerId, state, parent) => {
  const mapFunction = coinId => {
    const store = Redux.createStore(Reducer.root, state);
    store.dispatch(ActionCreator.setCurrentPaymentCoin(coinId));

    return Node.create({ parent, state: store.getState() });
  };

  return R.map(mapFunction, hand);
};

Expansion.execute = leaf0 => {
  const leaf = leaf0;
  const { state } = leaf;
  const playerId = state.currentPlayerId;
  const paymentCoin = Selector.currentPaymentCoin(state);

  if (paymentCoin) {
    const player = Selector.player(playerId, state);
    const moveStates0 = MoveGenerator.generateForCoin(player, paymentCoin, state, IS_PASS_ALLOWED);
    const moveStates =
      moveStates0.length === 0
        ? MoveGenerator.generateForCoin(player, paymentCoin, state)
        : moveStates0;
    leaf.children = Expansion.createMoveChildren(moveStates, playerId, state, leaf);
  } else {
    const hand = Selector.hand(playerId, state);
    leaf.children = Expansion.createPaymentCoinChildren(hand, playerId, state, leaf);
  }

  return ArrayUtils.randomElement(leaf.children);
};

Object.freeze(Expansion);

export default Expansion;
