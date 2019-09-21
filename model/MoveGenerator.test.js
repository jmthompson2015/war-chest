import Move from "../artifact/Move.js";
import Resolver from "../artifact/Resolver.js";
import RoyalCoin from "../artifact/RoyalCoin.js";
import UnitCoin from "../artifact/UnitCoin.js";

import Selector from "../state/Selector.js";

import MoveGenerator from "./MoveGenerator.js";
import TestData from "./TestData.js";

QUnit.module("MoveGenerator");

const verifyMoveState = (
  assert,
  moveState,
  moveKey,
  playerId,
  paymentCoinKey,
  an,
  fromAN,
  recruitCoinKey,
  toAN
) => {
  assert.ok(moveState);
  assert.equal(moveState.moveKey, moveKey, "moveKey");
  assert.equal(moveState.playerId, playerId, "playerId");
  assert.equal(moveState.paymentCoinKey, paymentCoinKey, "paymentCoinKey");
  assert.equal(moveState.an, an, "an");
  assert.equal(moveState.fromAN, fromAN, "fromAN");
  assert.equal(moveState.recruitCoinKey, recruitCoinKey, "recruitCoinKey");
  assert.equal(moveState.toAN, toAN, "toAN");
};

QUnit.test("generate() ", assert => {
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
    1,
    UnitCoin.PIKEMAN,
    undefined,
    undefined,
    UnitCoin.SWORDSMAN
  );
  const moveLast = result[result.length - 1];
  verifyMoveState(assert, moveLast, Move.PASS, 1, RoyalCoin.RAVEN);
});

QUnit.test("generateForCoin() ", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const hand = Selector.hand(playerId, store.getState());
  const coinKey = hand[0];
  const coin = Resolver.coin(coinKey);

  // Run.
  const result = MoveGenerator.generateForCoin(player, coin, store.getState());

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 5, `result.length=${result.length}`);
  const move0 = result[0];
  verifyMoveState(
    assert,
    move0,
    Move.RECRUIT,
    1,
    RoyalCoin.RAVEN,
    undefined,
    undefined,
    UnitCoin.SWORDSMAN
  );
  const moveLast = result[result.length - 1];
  verifyMoveState(assert, moveLast, Move.PASS, 1, RoyalCoin.RAVEN);
});

const MoveGeneratorTest = {};
export default MoveGeneratorTest;
