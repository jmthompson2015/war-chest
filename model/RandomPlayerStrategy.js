import ArrayUtils from "../util/ArrayUtilities.js";

const RandomPlayerStrategy = {};

const DELAY = 1000;

RandomPlayerStrategy.delayedResolve = (choice, resolve, delay = DELAY) => {
  if (delay <= 0) {
    resolve(choice);
  } else {
    setTimeout(() => {
      resolve(choice);
    }, delay);
  }
};

RandomPlayerStrategy.chooseDamageTarget = (damageTargets, store, delay = DELAY) =>
  new Promise(resolve => {
    const answer =
      damageTargets.length <= 1 ? damageTargets[0] : ArrayUtils.randomElement(damageTargets);
    RandomPlayerStrategy.delayedResolve(answer, resolve, delay);
  });

RandomPlayerStrategy.chooseMove = (moveStates, store, delay = DELAY) =>
  new Promise(resolve => {
    const answer = moveStates.length <= 1 ? moveStates[0] : ArrayUtils.randomElement(moveStates);
    RandomPlayerStrategy.delayedResolve(answer, resolve, delay);
  });

RandomPlayerStrategy.choosePaymentCoin = (coinIds, store, delay = DELAY) =>
  new Promise(resolve => {
    const answer = coinIds.length <= 1 ? coinIds[0] : ArrayUtils.randomElement(coinIds);
    RandomPlayerStrategy.delayedResolve(answer, resolve, delay);
  });

Object.freeze(RandomPlayerStrategy);

export default RandomPlayerStrategy;
