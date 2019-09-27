import Phase from "../artifact/Phase.js";

import ActionCreator from "../state/ActionCreator.js";
import Selector from "../state/Selector.js";

import PhaseFunction from "./PhaseFunction.js";

const Round = {};

const advancePhase = store => {
  const oldPhase = Selector.currentPhase(store.getState());
  const oldPhaseKey = oldPhase ? oldPhase.key : undefined;
  const phaseKeys = Phase.keys();
  let newPhaseKey;

  if (R.isNil(oldPhaseKey)) {
    [newPhaseKey] = phaseKeys; // first element
  } else {
    const index = phaseKeys.indexOf(oldPhaseKey);

    if (index === phaseKeys.length - 1) {
      // last phase.
      newPhaseKey = undefined;
    } else {
      newPhaseKey = phaseKeys[index + 1];
    }
  }

  store.dispatch(ActionCreator.setCurrentPhase(newPhaseKey));
};

const advanceRound = store => {
  const newRound = Selector.round(store.getState()) + 1;
  store.dispatch(ActionCreator.setRound(newRound));
};

const executePhase = (resolve, store) => {
  advancePhase(store);
  const phase = Selector.currentPhase(store.getState());
  const phaseKey = phase ? phase.key : undefined;

  if (R.isNil(phaseKey)) {
    resolve();
  } else {
    const phaseFunction = PhaseFunction[phaseKey];
    phaseFunction.execute(store).then(() => {
      executePhase(resolve, store);
    });
  }
};

Round.execute = store =>
  new Promise(resolve => {
    advanceRound(store);
    executePhase(resolve, store);
  });

Object.freeze(Round);

export default Round;
