import DamageTarget from "../artifact/DamageTarget.js";

import ActionCreator from "../state/ActionCreator.js";
import Selector from "../state/Selector.js";

import MoveGenerator from "./MoveGenerator.js";
import SimplePlayerStrategy from "./SimplePlayerStrategy.js";
import TestData from "./TestData.js";

QUnit.module("SimplePlayerStrategy");

QUnit.test("chooseDamageTarget()", (assert) => {
  // Setup.
  const store = TestData.createStore();
  const damageTargets = DamageTarget.values();
  const delay = 0;

  // Run.
  const done = assert.async();
  const callback = (result) => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    assert.ok(result);
    assert.equal(damageTargets.includes(result), true);
    done();
  };

  SimplePlayerStrategy.chooseDamageTarget(damageTargets, store, delay).then(callback);
});

QUnit.test("chooseMove()", (assert) => {
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
  const callback = (result) => {
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

QUnit.test("chooseMove() moveAUnit", (assert) => {
  // Setup.
  const store = TestData.createStore();
  const delay = 0;
  const playerId = 1;
  store.dispatch(ActionCreator.setCurrentPlayer(playerId));
  store.dispatch(ActionCreator.setUnit("e2", 5)); // Swordsman
  const player = Selector.currentPlayer(store.getState());
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinId = hand[1];
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());
  const moveStates = MoveGenerator.generateForCoin(player, paymentCoin, store.getState());

  // Run.
  const done = assert.async();
  const callback = (result) => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    assert.ok(result);
    assert.equal(result.moveKey, "moveAUnit");
    assert.equal(["d3", "e3"].includes(result.an2), true);
    assert.equal(result.playerId, playerId);
    assert.equal(result.paymentCoinId, paymentCoinId);
    done();
  };

  SimplePlayerStrategy.chooseMove(moveStates, store, delay).then(callback);
});

const SimplePlayerStrategyTest = {};
export default SimplePlayerStrategyTest;
