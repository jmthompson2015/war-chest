import MCTS from "../mcts/MonteCarloTreeSearch.js";

import SimplePlayerStrategy from "./SimplePlayerStrategy.js";

const MCTSPlayerStrategy = {};

const ALLOWED_TIME1 = 5000;
const ALLOWED_TIME2 = 10000;
const DELAY = 1000;
const ROUND_LIMIT = 100;

MCTSPlayerStrategy.chooseDamageTarget = (damageTargets, store, delay = DELAY) =>
  SimplePlayerStrategy.chooseDamageTarget(damageTargets, store, delay);

MCTSPlayerStrategy.chooseMove = (
  moveStates,
  store,
  delay,
  roundLimit = ROUND_LIMIT,
  allowedTime = ALLOWED_TIME2
) =>
  new Promise(resolve => {
    if (moveStates.length <= 1) {
      resolve(moveStates[0]);
    } else {
      MCTS.execute(store.getState(), roundLimit, allowedTime).then(moveState => {
        resolve(moveState);
      });
    }
  });

MCTSPlayerStrategy.choosePaymentCoin = (
  coinIds,
  store,
  delay,
  roundLimit = ROUND_LIMIT,
  allowedTime = ALLOWED_TIME1
) =>
  new Promise(resolve => {
    if (coinIds.length <= 1) {
      resolve(coinIds[0]);
    } else {
      MCTS.execute(store.getState(), roundLimit, allowedTime).then(paymentCoinId => {
        resolve(paymentCoinId);
      });
    }
  });

Object.freeze(MCTSPlayerStrategy);

export default MCTSPlayerStrategy;