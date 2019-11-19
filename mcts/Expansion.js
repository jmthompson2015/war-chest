import ArrayUtils from "../util/ArrayUtilities.js";

import ActionCreator from "../state/ActionCreator.js";
import Reducer from "../state/Reducer.js";
import Selector from "../state/Selector.js";

import MoveGenerator from "../model/MoveGenerator.js";

import Node from "./Node.js";

const Expansion = {};

Expansion.execute = leaf0 => {
  const leaf = leaf0;
  const { state } = leaf;
  const playerId = state.currentPlayerId;
  const paymentCoin = Selector.currentPaymentCoin(state);

  if (paymentCoin === undefined) {
    // Choose payment coin.
    const hand = Selector.hand(playerId, state);
    const mapFunction = c => {
      const store2 = Redux.createStore(Reducer.root, state);
      store2.dispatch(ActionCreator.setCurrentPaymentCoin(c));
      return Node.create({
        parent: leaf,
        state: store2.getState()
      });
    };
    leaf.children = R.map(mapFunction, hand);
  } else {
    // Choose move.
    const player = Selector.player(playerId, state);
    const moveStates = MoveGenerator.generateForCoin(player, paymentCoin, state);
    const mapFunction = m => {
      const store2 = Redux.createStore(Reducer.root, state);
      store2.dispatch(ActionCreator.setCurrentMoves(moveStates));
      store2.dispatch(ActionCreator.setCurrentMove(m));
      return Node.create({
        parent: leaf,
        state: store2.getState()
      });
    };
    leaf.children = R.map(mapFunction, moveStates);
  }

  return ArrayUtils.randomElement(leaf.children);
};

Object.freeze(Expansion);

export default Expansion;
