import ArrayUtils from "../util/ArrayUtilities.js";

import ActionCreator from "../state/ActionCreator.js";
import Selector from "../state/Selector.js";

import MoveGenerator from "./MoveGenerator.js";
import MoveFunction from "./MoveFunction.js";

const drawThreeCoins = (playerId, store) => {
  for (let i = 0; i < 3; i += 1) {
    const bag = Selector.bag(playerId, store.getState());
    const coinKey = ArrayUtils.randomElement(bag);
    store.dispatch(
      ActionCreator.transferBetweenPlayerArrays("playerToBag", "playerToHand", playerId, coinKey)
    );
  }
};

const PhaseFunction = {
  drawThreeCoins: {
    execute: store =>
      new Promise(resolve => {
        const players = Selector.playersInOrder(store.getState());
        R.forEach(p => {
          drawThreeCoins(p.id, store);
        }, players);
        resolve();
      }),
    key: "drawThreeCoins"
  },
  playCoins: {
    execute: store =>
      new Promise(resolve => {
        const players = Selector.playersInOrder(store.getState());
        R.forEach(p => {
          const moves = MoveGenerator.generate(p, store.getState());
          // FIXME: need player strategy
          // const move = p.selectMove(moves, store.getState());
          const moveState = ArrayUtils.randomElement(moves);
          MoveFunction.execute(moveState, store);
        }, players);
        resolve();
      }),
    key: "playCoins"
  }
};

Object.freeze(PhaseFunction);

export default PhaseFunction;
