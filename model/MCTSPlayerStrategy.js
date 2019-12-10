import Move from "../artifact/Move.js";

import MCTS from "../mcts/MonteCarloTreeSearch.js";

import RandomPlayerStrategy from "./RandomPlayerStrategy.js";
import SimplePlayerStrategy from "./SimplePlayerStrategy.js";

const MCTSPlayerStrategy = {};

const DELAY = 1000;
const ROUND_LIMIT = 100;

const filterPass = moveState => moveState.moveKey !== Move.PASS;

MCTSPlayerStrategy.chooseDamageTarget = (damageTargets, store, delay = DELAY) =>
  SimplePlayerStrategy.chooseDamageTarget(damageTargets, store, delay);

MCTSPlayerStrategy.chooseMove = (
  moveStates,
  store,
  delay = DELAY,
  roundLimit = ROUND_LIMIT,
  allowedTime = 10000
) =>
  new Promise(resolve => {
    if (moveStates.length <= 1) {
      RandomPlayerStrategy.delayedResolve(moveStates[0], resolve, delay);
    } else {
      const moveStates2 = R.filter(filterPass, moveStates);
      MCTS.execute(moveStates2, store.getState(), roundLimit, allowedTime).then(moveState => {
        resolve(moveState);
      });
    }
  });

MCTSPlayerStrategy.choosePaymentCoin = (
  coinIds,
  store,
  delay = DELAY,
  roundLimit = ROUND_LIMIT,
  allowedTime = 5000
) =>
  new Promise(resolve => {
    if (coinIds.length <= 1) {
      RandomPlayerStrategy.delayedResolve(coinIds[0], resolve, delay);
    } else {
      MCTS.execute(coinIds, store.getState(), roundLimit, allowedTime).then(paymentCoinId => {
        resolve(paymentCoinId);
      });
    }
  });

Object.freeze(MCTSPlayerStrategy);

export default MCTSPlayerStrategy;
