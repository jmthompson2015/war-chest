import Phase from "../artifact/Phase.js";

import ActionCreator from "../state/ActionCreator.js";
import S from "../state/Selector.js";

import GameFunction from "./GameFunction.js";
import TestData from "./TestData.js";

const { SingleStepRunner } = GameEngine;

QUnit.module("SingleStepRunner");

const props = {
  actionCreator: ActionCreator,
  gameFunction: GameFunction,
  selector: S,
};

QUnit.test("execute() Draw Three Coins", (assert) => {
  // Setup.
  const phaseKey = Phase.DRAW_THREE_COINS;
  const playerId = 1;
  const store = TestData.createStore();
  store.dispatch(ActionCreator.setVerbose(false));
  store.dispatch(ActionCreator.setDelay(TestData.DELAY));
  store.dispatch(ActionCreator.setCurrentRound(1));
  store.dispatch(ActionCreator.setCurrentPhase(phaseKey));
  store.dispatch(ActionCreator.setCurrentPlayer(playerId));

  // Run.
  const done = assert.async();
  const callback = () => {
    assert.ok(true, "test resumed from async operation");

    // Verify.
    const state = store.getState();
    assert.equal(S.currentRound(state), 1);
    assert.equal(S.currentPhaseKey(state), phaseKey);
    assert.equal(S.currentPlayerId(state), playerId);
    assert.equal(S.currentStepKey(state), undefined);
    done();
  };

  SingleStepRunner.execute(props, store)
    .then(callback)
    .catch((error) => {
      assert.ok(false, error.message);
      done();
    });
});

QUnit.test("execute() Play Coins", (assert) => {
  // Setup.
  const phaseKey = Phase.PLAY_COIN_1;
  const playerId = 1;
  const store = TestData.createStore();
  store.dispatch(ActionCreator.setVerbose(false));
  store.dispatch(ActionCreator.setDelay(TestData.DELAY));
  store.dispatch(ActionCreator.setCurrentRound(1));
  store.dispatch(ActionCreator.setCurrentPhase(phaseKey));
  store.dispatch(ActionCreator.setCurrentPlayer(playerId));

  // Run.
  const done = assert.async();
  const callback = () => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    const state = store.getState();
    assert.equal(S.currentRound(state), 1);
    assert.equal(S.currentPhaseKey(state), phaseKey);
    assert.equal(S.currentPlayerId(state), playerId);
    assert.equal(S.currentStepKey(state), undefined);
    done();
  };

  SingleStepRunner.execute(props, store)
    .then(callback)
    .catch((error) => {
      assert.ok(false, error.message);
      done();
    });
});

const SingleStepRunnerTest = {};
export default SingleStepRunnerTest;
