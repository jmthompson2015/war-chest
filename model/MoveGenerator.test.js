import Move from "../artifact/Move.js";

import ActionCreator from "../state/ActionCreator.js";
import Selector from "../state/Selector.js";

import MoveGenerator from "./MoveGenerator.js";
import TestData from "./TestData.js";

QUnit.module("MoveGenerator");

const verifyMoveState = (
  assert,
  moveState,
  moveKey,
  playerId,
  paymentCoinId,
  an,
  fromAN,
  recruitCoinId,
  toAN
) => {
  assert.ok(moveState);
  assert.equal(moveState.moveKey, moveKey, "moveKey");
  assert.equal(moveState.playerId, playerId, "playerId");
  assert.equal(moveState.paymentCoinId, paymentCoinId, "paymentCoinId");
  assert.equal(moveState.an, an, "an");
  assert.equal(moveState.fromAN, fromAN, "fromAN");
  assert.equal(moveState.recruitCoinId, recruitCoinId, "recruitCoinId");
  assert.equal(moveState.toAN, toAN, "toAN");
};

QUnit.test("generate()", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());

  // Run.
  const result = MoveGenerator.generate(player, store.getState());

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 19, `result.length=${result.length}`);
  const move0 = result[0];
  verifyMoveState(
    assert,
    move0,
    Move.RECRUIT,
    1, // playerId
    10, // paymentCoinId
    undefined, // an
    undefined, // fromAN
    2 // recruitCoinId
  );
  const moveLast = result[result.length - 1];
  verifyMoveState(assert, moveLast, Move.PASS, 1, 1);
});

QUnit.test("generateForCoin()", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinId = hand[0];
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());

  // Run.
  const result = MoveGenerator.generateForCoin(player, paymentCoin, store.getState());

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 5, `result.length=${result.length}`);
  const move0 = result[0];
  verifyMoveState(
    assert,
    move0,
    Move.RECRUIT,
    1, // playerId
    1, // paymentCoinId
    undefined, // an
    undefined, // fromAN
    2 // recruitCoinId
  );
  const moveLast = result[result.length - 1];
  verifyMoveState(assert, moveLast, Move.PASS, 1, 1);
});

QUnit.test("generateForCoin() Scout", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 2;
  const player = Selector.player(playerId, store.getState());
  const paymentCoinId = 34; // Scout.
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());
  store.dispatch(ActionCreator.addToPlayerArray("playerToHand", playerId, paymentCoinId));
  store.dispatch(ActionCreator.setUnit("e2", 22)); // Archer.

  // Run.
  const result = MoveGenerator.generateForCoin(player, paymentCoin, store.getState());

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 12, `result.length=${result.length}`);
  const move0 = result[0];
  verifyMoveState(assert, move0, Move.CLAIM_INITIATIVE, playerId, paymentCoinId);
  const moveLast = result[result.length - 1];
  verifyMoveState(assert, moveLast, Move.DEPLOY, playerId, paymentCoinId, "f2");
});

const MoveGeneratorTest = {};
export default MoveGeneratorTest;
