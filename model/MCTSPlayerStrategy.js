import MCTS from "../mcts/MonteCarloTreeSearch.js";

import SimplePlayerStrategy from "./SimplePlayerStrategy.js";

const MCTSPlayerStrategy = {};

const ALLOWED_TIME = 5000;
const DELAY = 1000;

MCTSPlayerStrategy.chooseDamageTarget = (damageTargets, store, delay = DELAY) =>
  SimplePlayerStrategy.chooseDamageTarget(damageTargets, store, delay);

MCTSPlayerStrategy.chooseMove = (moveStates, store, delay, allowedTime = ALLOWED_TIME) =>
  new Promise(resolve => {
    if (moveStates.length <= 1) {
      resolve(moveStates[0]);
    } else {
      MCTS.execute(store.getState(), allowedTime).then(moveState => {
        resolve(moveState);
      });
    }
  });

MCTSPlayerStrategy.choosePaymentCoin = (coinIds, store, delay, allowedTime = ALLOWED_TIME) =>
  new Promise(resolve => {
    if (coinIds.length <= 1) {
      resolve(coinIds[0]);
    } else {
      MCTS.execute(store.getState(), allowedTime).then(paymentCoinId => {
        resolve(paymentCoinId);
      });
    }
  });

Object.freeze(MCTSPlayerStrategy);

export default MCTSPlayerStrategy;
