import ArrayUtils from "../util/ArrayUtilities.js";

const SimplePlayerStrategy = {};

SimplePlayerStrategy.choosePaymentCoin = coinKeys =>
  new Promise(resolve => {
    const coinKey = ArrayUtils.randomElement(coinKeys);
    resolve(coinKey);
  });

SimplePlayerStrategy.chooseMove = moveStates =>
  new Promise(resolve => {
    const moveState = ArrayUtils.randomElement(moveStates);
    resolve(moveState);
  });

Object.freeze(SimplePlayerStrategy);

export default SimplePlayerStrategy;
