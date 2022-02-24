/* eslint no-console: ["error", { allow: ["warn"] }] */

// import Selector from "../state/Selector.js";

import MCTSGame from "./MCTSGame.js";
// import MoveFunction from "./MoveFunction.js";
import SimplePlayerStrategy from "./SimplePlayerStrategy.js";

const { MonteCarloTreeSearch } = MCTS;

const MCTSPlayerStrategy = {};

const DELAY = 0;

// const log = (label, moveState, state) => {
//   console.log(`${label} moveState = ${JSON.stringify(moveState)}`);
//   console.log(`${label} coin = ${JSON.stringify(Selector.coin(moveState.coinId, state))}`);
//   console.log(
//     `${label} paymentCoin = ${JSON.stringify(Selector.coin(moveState.paymentCoinId, state))}`
//   );
//   console.log(
//     `${label} recruitCoin = ${JSON.stringify(Selector.coin(moveState.recruitCoinId, state))}`
//   );
//   if (moveState.moveKey)
//     console.log(`${label} moveState = ${MoveFunction[moveState.moveKey].label(moveState, state)}`);
// };

const delayedResolve = (choice, resolve, delay = DELAY) => {
  if (delay <= 0) {
    resolve(choice);
  } else {
    setTimeout(() => {
      resolve(choice);
    }, delay);
  }
};

MCTSPlayerStrategy.chooseDamageTarget = (damageTargets, store, delay = DELAY) =>
  SimplePlayerStrategy.chooseDamageTarget(damageTargets, store, delay);

MCTSPlayerStrategy.chooseMove = (
  options,
  store,
  delay = DELAY,
  roundLimit = 100,
  allowedTime = 10000
) =>
  new Promise((resolve) => {
    if (options.length <= 1) {
      delayedResolve(options[0], resolve, delay);
    } else {
      const game = new MCTSGame(store.getState());
      const mcts = new MonteCarloTreeSearch({ game });
      const callback = (moveState) => {
        // log("MCTSPlayerStrategy.chooseMove()", moveState, store.getState());
        resolve(moveState);
      };
      mcts.execute(roundLimit, allowedTime).then(callback);
    }
  });

Object.freeze(MCTSPlayerStrategy);

export default MCTSPlayerStrategy;
