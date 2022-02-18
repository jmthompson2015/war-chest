import ControlMarker from "../artifact/ControlMarker.js";
import Team from "../artifact/Team.js";

import ActionCreator from "../state/ActionCreator.js";

import GameOver from "./GameOver.js";
import TestData from "./TestData.js";

QUnit.module("GameOver");

QUnit.test("getWinner() nil", (assert) => {
  // Setup.
  const store = TestData.createStore();
  store.dispatch(ActionCreator.setDelay(0));

  // Run.
  const result = GameOver.getWinner(store.getState());

  // Verify.
  assert.equal(R.isNil(result), true);
});

QUnit.test("getWinner() Raven", (assert) => {
  // Setup.
  const store = TestData.createStore();
  const controlKey = ControlMarker.RAVEN;
  store.dispatch(ActionCreator.setControl("d4", controlKey));
  store.dispatch(ActionCreator.setControl("e5", controlKey));
  store.dispatch(ActionCreator.setControl("g3", controlKey));
  store.dispatch(ActionCreator.setControl("i2", controlKey));

  // Run.
  const result = GameOver.getWinner(store.getState());

  // Verify.
  assert.equal(result, Team.RAVEN);
});

QUnit.test("isGameOver() false", (assert) => {
  // Setup.
  const store = TestData.createStore();
  store.dispatch(ActionCreator.setDelay(0));

  // Run.
  const result = GameOver.isGameOver(store.getState());

  // Verify.
  assert.equal(result, false);
});

QUnit.test("isGameOver() true", (assert) => {
  // Setup.
  const store = TestData.createStore();
  const controlKey = ControlMarker.RAVEN;
  store.dispatch(ActionCreator.setControl("d4", controlKey));
  store.dispatch(ActionCreator.setControl("e5", controlKey));
  store.dispatch(ActionCreator.setControl("g3", controlKey));
  store.dispatch(ActionCreator.setControl("i2", controlKey));

  // Run.
  const result = GameOver.isGameOver(store.getState());

  // Verify.
  assert.equal(result, true);
});

const GameOverTest = {};
export default GameOverTest;
