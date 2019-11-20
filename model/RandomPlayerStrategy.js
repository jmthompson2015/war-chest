import ArrayUtils from "../util/ArrayUtilities.js";

const RandomPlayerStrategy = {};

const DELAY = 1000;

RandomPlayerStrategy.chooseDamageTarget = (damageTargets, store, delay = DELAY) =>
  new Promise(resolve => {
    const answer =
      damageTargets.length <= 1 ? damageTargets[0] : ArrayUtils.randomElement(damageTargets);

    if (delay === 0) {
      resolve(answer);
    } else {
      setTimeout(() => {
        resolve(answer);
      }, delay);
    }
  });

RandomPlayerStrategy.chooseMove = (moveStates, store, delay = DELAY) =>
  new Promise(resolve => {
    const answer = moveStates.length <= 1 ? moveStates[0] : ArrayUtils.randomElement(moveStates);

    if (delay === 0) {
      resolve(answer);
    } else {
      setTimeout(() => {
        resolve(answer);
      }, delay);
    }
  });

RandomPlayerStrategy.choosePaymentCoin = (coinIds, store, delay = DELAY) =>
  new Promise(resolve => {
    const answer = coinIds.length <= 1 ? coinIds[0] : ArrayUtils.randomElement(coinIds);

    if (delay === 0) {
      resolve(answer);
    } else {
      setTimeout(() => {
        resolve(answer);
      }, delay);
    }
  });

Object.freeze(RandomPlayerStrategy);

export default RandomPlayerStrategy;
