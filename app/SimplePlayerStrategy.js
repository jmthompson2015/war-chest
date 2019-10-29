import ArrayUtils from "../util/ArrayUtilities.js";

const SimplePlayerStrategy = {};

const DELAY = 1000;

SimplePlayerStrategy.chooseDamageTarget = (damageTargets, store, delay = DELAY) =>
  new Promise(resolve => {
    const damageTarget = ArrayUtils.randomElement(damageTargets);
    setTimeout(() => {
      resolve(damageTarget);
    }, delay);
  });

SimplePlayerStrategy.chooseMove = (moveStates, store, delay = DELAY) =>
  new Promise(resolve => {
    const moveState = ArrayUtils.randomElement(moveStates);
    setTimeout(() => {
      resolve(moveState);
    }, delay);
  });

SimplePlayerStrategy.choosePaymentCoin = (coinKeys, store, delay = DELAY) =>
  new Promise(resolve => {
    const coinKey = ArrayUtils.randomElement(coinKeys);
    setTimeout(() => {
      resolve(coinKey);
    }, delay);
  });

Object.freeze(SimplePlayerStrategy);

export default SimplePlayerStrategy;
