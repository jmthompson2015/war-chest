import ActionCreator from "../state/ActionCreator.js";

const HumanPlayerStrategy = {};

HumanPlayerStrategy.choosePaymentCoin = (coinKeys, store) =>
  new Promise(resolve => {
    store.dispatch(ActionCreator.setCurrentHandCallback(resolve));
  });

HumanPlayerStrategy.chooseMove = (moveStates, store) =>
  new Promise(resolve => {
    store.dispatch(ActionCreator.setCurrentInputCallback(resolve));
  });

Object.freeze(HumanPlayerStrategy);

export default HumanPlayerStrategy;
