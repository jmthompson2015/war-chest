/* eslint no-console: ["error", { allow: ["warn"] }] */

import MCTSGame from "./MCTSGame.js";
import SimplePlayerStrategy from "./SimplePlayerStrategy.js";

const { MonteCarloTreeSearch } = MCTS;

const MCTSPlayerStrategy = {};

const DELAY = 1000;

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
  allowedTime = 5000
) =>
  new Promise((resolve) => {
    if (options.length <= 1) {
      delayedResolve(options[0], resolve, delay);
    } else {
      const game = new MCTSGame(store.getState());
      const mcts = new MonteCarloTreeSearch({ game });
      const callback = (moveState) => {
        resolve(moveState);
      };
      mcts.execute(roundLimit, allowedTime).then(callback);
    }
  });

MCTSPlayerStrategy.choosePaymentCoin = (
  options,
  store,
  delay = DELAY,
  roundLimit = 100,
  allowedTime = 5000
) =>
  new Promise((resolve) => {
    if (options.length <= 1) {
      delayedResolve(options[0], resolve, delay);
    } else {
      const game = new MCTSGame(store.getState());
      const mcts = new MonteCarloTreeSearch({ game });
      const callback = (moveState) => {
        resolve(moveState);
      };
      mcts.execute(roundLimit, allowedTime).then(callback);
    }
  });

Object.freeze(MCTSPlayerStrategy);

export default MCTSPlayerStrategy;
