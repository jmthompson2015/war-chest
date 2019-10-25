import ActionCreator from "../state/ActionCreator.js";

const HumanPlayerStrategy = {};

HumanPlayerStrategy.choosePaymentCoin = (coinKeys, store) =>
  new Promise(resolve => {
    store.dispatch(ActionCreator.setCurrentHandCallback(resolve));
    store.dispatch(ActionCreator.setUserMessage("Choose a coin from your hand."));
  });

HumanPlayerStrategy.chooseMove = (moveStates, store) =>
  new Promise(resolve => {
    store.dispatch(ActionCreator.pushInputCallback(resolve));
    store.dispatch(ActionCreator.setUserMessage("Select an Action."));
  });

Object.freeze(HumanPlayerStrategy);

export default HumanPlayerStrategy;
