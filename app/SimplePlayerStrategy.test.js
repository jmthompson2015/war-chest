import Selector from "../state/Selector.js";

import MoveGenerator from "../model/MoveGenerator.js";
import TestData from "../model/TestData.js";

import SimplePlayerStrategy from "./SimplePlayerStrategy.js";

QUnit.module("SimplePlayerStrategy");

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

  SimplePlayerStrategy.choosePaymentCoin(hand, store, delay).then(callback);
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

  SimplePlayerStrategy.chooseMove(moveStates, store, delay).then(callback);
});

const SimplePlayerStrategyTest = {};
export default SimplePlayerStrategyTest;
