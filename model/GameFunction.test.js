import GameFunction from "./GameFunction.js";
import TestData from "./TestData.js";

QUnit.module("GameFunction");

QUnit.test("isGameOver() false", (assert) => {
  // Setup.
  const store = TestData.createStore();

  // Run.
  const result = GameFunction.isGameOver(store);

  // Verify.
  assert.equal(result, false);
});

QUnit.test("phaseKeys()", (assert) => {
  // Setup.

  // Run.
  const result = GameFunction.phaseKeys();

  // Verify.
  assert.ok(result);
  assert.equal(result.length, 4);
});

const GameFunctionTest = {};
export default GameFunctionTest;
