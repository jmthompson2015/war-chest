import ArrayUtils from "../util/ArrayUtilities.js";

const SimplePlayerStrategy = {};

const DELAY = 1000;

SimplePlayerStrategy.choosePaymentCoin = (coinKeys, delay = DELAY) =>
  new Promise(resolve => {
    const coinKey = ArrayUtils.randomElement(coinKeys);
    setTimeout(() => {
      resolve(coinKey);
    }, delay);
  });

SimplePlayerStrategy.chooseMove = (moveStates, delay = DELAY) =>
  new Promise(resolve => {
    const moveState = ArrayUtils.randomElement(moveStates);
    setTimeout(() => {
      resolve(moveState);
    }, delay);
  });

Object.freeze(SimplePlayerStrategy);

export default SimplePlayerStrategy;
