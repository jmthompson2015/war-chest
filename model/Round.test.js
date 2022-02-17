import ActionCreator from "../state/ActionCreator.js";
import Selector from "../state/Selector.js";

import Round from "./Round.js";
import TestData from "./TestData.js";

QUnit.module("Round");

QUnit.test("execute() ", assert => {
  // Setup.
  const store = TestData.createStore(true, false);
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(ActionCreator.setVerbose(false));

  // Run.
  const done = assert.async();
  const callback = () => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    assert.equal(Selector.currentRound(store.getState()), 1);
    assert.equal(Selector.currentPhase(store.getState()), undefined);
    done();
  };

  Round.execute(store).then(callback);
});

const RoundTest = {};
export default RoundTest;
