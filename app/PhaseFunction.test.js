import Phase from "../artifact/Phase.js";

import ActionCreator from "../state/ActionCreator.js";
import Selector from "../state/Selector.js";

import TestData from "../model/TestData.js";

import PhaseFunction from "./PhaseFunction.js";

QUnit.module("PhaseFunction");

QUnit.test("drawThreeCoins() ", assert => {
  // Setup.
  const store = TestData.createStore(true, false);
  const phase = PhaseFunction[Phase.DRAW_THREE_COINS];

  // Run.
  const done = assert.async();
  const callback = () => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    assert.equal(Selector.hand(1, store.getState()).length, 3);
    assert.equal(Selector.hand(2, store.getState()).length, 3);
    done();
  };
  phase.execute(store).then(callback);
});

QUnit.test("playCoins() ", assert => {
  // Setup.
  const store = TestData.createStore();
  const phase = PhaseFunction[Phase.PLAY_COINS];
  store.dispatch(ActionCreator.setDelay(0));

  // Run.
  const done = assert.async();
  const callback = () => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    assert.equal(Selector.hand(1, store.getState()).length, 0);
    assert.equal(Selector.hand(2, store.getState()).length, 0);
    done();
  };
  phase.execute(store).then(callback);
});

const PhaseFunctionTest = {};
export default PhaseFunctionTest;
