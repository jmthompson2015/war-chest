import ActionCreator from "../state/ActionCreator.js";
import Selector from "../state/Selector.js";

import WCGame from "./WCGame.js";
import TestData from "./TestData.js";

QUnit.module("WCGame");

QUnit.test("execute()", (assert) => {
  // Setup.
  const store = TestData.createStore();
  store.dispatch(ActionCreator.setVerbose(false));
  store.dispatch(ActionCreator.setDelay(TestData.DELAY));
  store.dispatch(ActionCreator.setCurrentRound(1));
  store.dispatch(ActionCreator.setCurrentPlayer(1));
  const roundLimit = 3;

  // Run.
  const done = assert.async();
  const callback = () => {
    assert.ok(true, "test resumed from async operation");

    // Verify.
    const state = store.getState();
    assert.equal(Selector.currentRound(state), 4);
    assert.equal(Selector.currentPhaseKey(state), undefined);
    assert.equal(Selector.currentPlayerId(state), undefined);
    assert.equal(Selector.currentStepKey(state), undefined);
    assert.equal(Selector.currentStepKey(state), undefined);
    done();
  };

  WCGame.execute(store, roundLimit)
    .then(callback)
    .catch((error) => {
      assert.ok(false, error.message);
      done();
    });
});

const WCGameTest = {};
export default WCGameTest;
