import DamageTarget from "../artifact/DamageTarget.js";

import Selector from "../state/Selector.js";

import HumanPlayerStrategy from "./HumanPlayerStrategy.js";
import MoveGenerator from "./MoveGenerator.js";
import TestData from "./TestData.js";

QUnit.module("HumanPlayerStrategy");

QUnit.skip("chooseDamageTarget()", assert => {
  // Setup.
  const store = TestData.createStore();
  const damageTargets = DamageTarget.values();

  // Run.
  const done = assert.async();
  const callback = result => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    assert.ok(result);
    assert.equal(damageTargets.includes(result), true);
    done();
  };

  HumanPlayerStrategy.chooseDamageTarget(damageTargets, store).then(callback);
});

QUnit.skip("chooseMove()", assert => {
  // Setup.
  const store = TestData.createStore();
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

  HumanPlayerStrategy.chooseMove(moveStates, store).then(callback);
});

QUnit.skip("choosePaymentCoin()", assert => {
  // Setup.
  const store = TestData.createStore();
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

  HumanPlayerStrategy.choosePaymentCoin(hand, store).then(callback);
});

const HumanPlayerStrategyTest = {};
export default HumanPlayerStrategyTest;
