import ActionCreator from "../state/ActionCreator.js";

const HumanPlayerStrategy = {};

HumanPlayerStrategy.chooseDamageTarget = (damageTargets, store) =>
  new Promise(resolve => {
    store.dispatch(ActionCreator.setCurrentDamageCallback(resolve));
    store.dispatch(ActionCreator.setUserMessage("Select a damage target."));
  });

HumanPlayerStrategy.chooseMove = (moveStates, store) =>
  new Promise(resolve => {
    store.dispatch(ActionCreator.pushInputCallback(resolve));
    store.dispatch(ActionCreator.setUserMessage("Select an action."));
  });

HumanPlayerStrategy.choosePaymentCoin = (coinKeys, store) =>
  new Promise(resolve => {
    store.dispatch(ActionCreator.setCurrentHandCallback(resolve));
    store.dispatch(ActionCreator.setUserMessage("Choose a coin from your hand."));
  });

Object.freeze(HumanPlayerStrategy);

export default HumanPlayerStrategy;
