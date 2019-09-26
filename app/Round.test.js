import Selector from "../state/Selector.js";

import TestData from "../model/TestData.js";

import Round from "./Round.js";

QUnit.module("Round");

QUnit.test("execute() ", assert => {
  // Setup.
  const store = TestData.createStore(true, false);

  // Run.
  const done = assert.async();
  const callback = () => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    assert.equal(Selector.round(store.getState()), 1);
    assert.equal(Selector.currentPhase(store.getState()), undefined);
    done();
  };

  Round.execute(store).then(callback);
});

const RoundTest = {};
export default RoundTest;
