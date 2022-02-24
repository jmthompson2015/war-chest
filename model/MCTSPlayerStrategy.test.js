import DamageTarget from "../artifact/DamageTarget.js";
import Phase from "../artifact/Phase.js";

import ActionCreator from "../state/ActionCreator.js";
import Selector from "../state/Selector.js";

import MoveGenerator from "./MoveGenerator.js";
import TestData from "./TestData.js";

import MCTSPlayerStrategy from "./MCTSPlayerStrategy.js";

QUnit.module("MCTSPlayerStrategy");

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

  MCTSPlayerStrategy.chooseDamageTarget(damageTargets, store, delay).then(callback);
});

QUnit.test("chooseMove()", (assert) => {
  // Setup.
  const playerId = 1;
  const paymentCoinId = 6;
  const store = TestData.createStore();
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(ActionCreator.setCurrentRound(1));
  store.dispatch(ActionCreator.setCurrentPhase(Phase.PLAY_COIN_1));
  const players2 = Selector.playersInOrder(store.getState());
  const playerIds = R.map(R.prop("id"), players2);
  store.dispatch(ActionCreator.setCurrentPlayerOrder(playerIds));
  store.dispatch(ActionCreator.setCurrentPlayer(playerId));
  store.dispatch(ActionCreator.setCurrentPaymentCoin(paymentCoinId));
  store.dispatch(ActionCreator.setVerbose(false));
  const delay = 0;
  const roundLimit = 30;
  const allowedTime = 500;
  const player = Selector.player(playerId, store.getState());
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());
  const moveStates = MoveGenerator.generateForCoin(player, paymentCoin, store.getState());

  // Run.
  const done = assert.async();
  const callback = (result) => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    assert.ok(result);
    assert.equal(
      ["deploy", "pass", "recruit"].includes(result.moveKey),
      true,
      `result.moveKey = ${result.moveKey}`
    );
    assert.equal(result.playerId, playerId, `result.playerId = ${result.playerId}`);
    assert.equal(
      hand.includes(result.paymentCoinId),
      true,
      `result.paymentCoinId = ${result.paymentCoinId}`
    );
    done();
  };

  MCTSPlayerStrategy.chooseMove(moveStates, store, delay, roundLimit, allowedTime).then(callback);
});

const MCTSPlayerStrategyTest = {};
export default MCTSPlayerStrategyTest;
