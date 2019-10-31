import DamageTarget from "../artifact/DamageTarget.js";

import Selector from "../state/Selector.js";

import MoveGenerator from "../model/MoveGenerator.js";
import TestData from "../model/TestData.js";

import RandomPlayerStrategy from "./RandomPlayerStrategy.js";

QUnit.module("RandomPlayerStrategy");

QUnit.test("chooseDamageTarget()", assert => {
  // Setup.
  const store = TestData.createStore();
  const damageTargets = DamageTarget.values();
  const delay = 0;

  // Run.
  const done = assert.async();
  const callback = result => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    assert.ok(result);
    assert.equal(damageTargets.includes(result), true);
    done();
  };

  RandomPlayerStrategy.chooseDamageTarget(damageTargets, store, delay).then(callback);
});

QUnit.test("chooseMove()", assert => {
  // Setup.
  const store = TestData.createStore();
  const delay = 0;
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinId = hand[1];
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());
  const moveStates = MoveGenerator.generateForCoin(player, paymentCoin, store.getState());

  // Run.
  const done = assert.async();
  const callback = result => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    assert.ok(result);
    assert.equal(["deploy", "pass", "recruit"].includes(result.moveKey), true);
    assert.equal(result.playerId, playerId);
    assert.equal(result.paymentCoinId, paymentCoinId);
    done();
  };

  RandomPlayerStrategy.chooseMove(moveStates, store, delay).then(callback);
});

QUnit.test("choosePaymentCoin()", assert => {
  // Setup.
  const store = TestData.createStore();
  const delay = 0;
  const playerId = 1;
  const hand = Selector.hand(playerId, store.getState());

  // Run.
  const done = assert.async();
  const callback = result => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    assert.ok(result);
    assert.equal(hand.includes(result), true);
    done();
  };

  RandomPlayerStrategy.choosePaymentCoin(hand, store, delay).then(callback);
});

const RandomPlayerStrategyTest = {};
export default RandomPlayerStrategyTest;
