import Resolver from "../artifact/Resolver.js";

import Selector from "../state/Selector.js";

import MoveGenerator from "../model/MoveGenerator.js";
import TestData from "../model/TestData.js";

import HumanPlayerStrategy from "./HumanPlayerStrategy.js";

QUnit.module("HumanPlayerStrategy");

QUnit.skip("choosePaymentCoin()", assert => {
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

  HumanPlayerStrategy.choosePaymentCoin(hand, store, delay).then(callback);
});

QUnit.skip("chooseMove()", assert => {
  // Setup.
  const store = TestData.createStore();
  const delay = 0;
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinKey = hand[1];
  const paymentCoin = Resolver.coin(paymentCoinKey);
  const moveStates = MoveGenerator.generateForCoin(player, paymentCoin, store.getState());

  // Run.
  const done = assert.async();
  const callback = result => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    assert.ok(result);
    assert.equal(["deploy", "pass", "recruit"].includes(result.moveKey), true);
    assert.equal(result.playerId, playerId);
    assert.equal(result.paymentCoinKey, paymentCoinKey);
    done();
  };

  HumanPlayerStrategy.chooseMove(moveStates, store, delay).then(callback);
});

const HumanPlayerStrategyTest = {};
export default HumanPlayerStrategyTest;
