import Move from "../artifact/Move.js";
import Team from "../artifact/Team.js";

import ActionCreator from "../state/ActionCreator.js";
import MoveState from "../state/MoveState.js";

import MCTSGame from "./MCTSGame.js";
import TestData from "./TestData.js";

QUnit.module("MCTSGame");

QUnit.test("getCurrentPlayer()", (assert) => {
  // Setup.
  const store = TestData.createStore();
  store.dispatch(ActionCreator.setCurrentPlayer(1));
  const game = new MCTSGame(store.getState());

  // Run.
  const result = game.getCurrentPlayer();

  // Verify.
  assert.ok(result, "result !== undefined");
  assert.equal(result.id, 1, `result.id ? ${result.id}`);
  assert.equal(result.name, "Alfred", `result.name ? ${result.name}`);
  assert.equal(result.teamKey, Team.RAVEN, `result.teamKey ? ${result.teamKey}`);
});

QUnit.test("getPossibleMoves() moves", (assert) => {
  // Setup.
  const store = TestData.createStore();
  store.dispatch(ActionCreator.setCurrentPlayer(1));
  store.dispatch(ActionCreator.setCurrentPaymentCoin(6));
  const game = new MCTSGame(store.getState());

  // Run.
  const result = game.getPossibleMoves();

  // Verify.
  assert.ok(result, "result !== undefined");
  assert.equal(Array.isArray(result), true, `Array.isArray(result) ? ${Array.isArray(result)}`);
  assert.equal(result.length, 19, `result.length = ${result.length}`);
  const move0 = result[0];
  assert.ok(move0);
  assert.equal(move0.moveKey, Move.RECRUIT);
  assert.equal(move0.playerId, 1);
  assert.equal(move0.paymentCoinId, 10);
  const moveLast = R.last(result);
  assert.ok(moveLast);
  assert.equal(moveLast.moveKey, Move.PASS);
  assert.equal(moveLast.playerId, 1);
  assert.equal(moveLast.paymentCoinId, 1);
});

QUnit.test("getWinner() 1", (assert) => {
  // Setup.
  const store = TestData.createStore();
  store.dispatch(ActionCreator.setCurrentPlayer(1));
  const game = new MCTSGame(store.getState());

  // Run.
  const result = game.getWinner();

  // Verify.
  assert.equal(result, undefined, `result = ${result}`);
});

QUnit.test("isGameOver()", (assert) => {
  // Setup.
  const store = TestData.createStore();
  store.dispatch(ActionCreator.setCurrentPlayer(1));
  const game = new MCTSGame(store.getState());

  // Run.
  const result = game.isGameOver();

  // Verify.
  assert.equal(result, false, `result ? ${result}`);
});

QUnit.test("performMove() 2", (assert) => {
  // Setup.
  const store = TestData.createStore();
  store.dispatch(ActionCreator.setCurrentPlayerOrder([1, 2]));
  store.dispatch(ActionCreator.setCurrentPlayer(1));
  const game = new MCTSGame(store.getState());
  const playerId = 1;
  const paymentCoinId = 6;
  const an1 = "e2"; // Raven control location.
  const moveKey = Move.DEPLOY;
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, an1 });

  // Run.
  game.performMove(moveState);

  // Verify.
  const { anToTokens } = game.state;
  const coinId = anToTokens[an1];
  assert.equal(coinId, 6);
});

const MCTSGameTest = {};
export default MCTSGameTest;
