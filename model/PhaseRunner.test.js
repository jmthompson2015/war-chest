import ActionCreator from "../state/ActionCreator.js";
import S from "../state/Selector.js";

import GameFunction from "./GameFunction.js";
import TestData from "./TestData.js";

const { PhaseRunner, SingleStepRunner, TurnRunner } = GameEngine;

QUnit.module("PhaseRunner");

const props = {
  actionCreator: ActionCreator,
  gameFunction: GameFunction,
  selector: S,
};

const engine = {
  phaseRunner: PhaseRunner,
  turnRunner: TurnRunner,
  stepRunner: SingleStepRunner,
};

const assertLength = (assert, name, array, expected) => {
  assert.equal(array.length, expected, `${name} length = ${array.length}`);
};

QUnit.test("execute()", (assert) => {
  // Setup.
  const store = TestData.createStore();
  store.dispatch(ActionCreator.setVerbose(false));
  store.dispatch(ActionCreator.setDelay(TestData.DELAY));
  store.dispatch(ActionCreator.setCurrentRound(1));

  // Run.
  const done = assert.async();
  const callback = () => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    const state = store.getState();
    assert.equal(S.currentRound(state), 1);
    assert.equal(S.currentPhaseKey(state), undefined);
    assert.equal(S.currentPlayerId(state), undefined);
    assert.equal(S.currentStepKey(state), undefined);

    assertLength(assert, "currentMoves", S.currentMoves(state), 0);
    done();
  };

  PhaseRunner.execute(props, store, engine)
    .then(callback)
    .catch((error) => {
      assert.ok(false, error.message);
      done();
    });
});

const PhaseRunnerTest = {};
export default PhaseRunnerTest;
