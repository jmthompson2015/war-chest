import DamageTarget from "../artifact/DamageTarget.js";
import Phase from "../artifact/Phase.js";
import RoyalCoin from "../artifact/RoyalCoin.js";
import UnitCoin from "../artifact/UnitCoin.js";

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
  store.dispatch(ActionCreator.setRound(1));
  store.dispatch(ActionCreator.setCurrentPhase(Phase.PLAY_COINS));
  const players2 = Selector.playersInOrder(store.getState());
  const playerIds = R.map(R.prop("id"), players2);
  store.dispatch(ActionCreator.setCurrentPlayerOrder(playerIds));
  store.dispatch(ActionCreator.setCurrentPlayer(playerId));
  store.dispatch(ActionCreator.setCurrentPaymentCoin(paymentCoinId));
  store.dispatch(ActionCreator.setVerbose(false));
  const delay = 0;
  const roundLimit = 30;
  const allowedTime = 100;
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

QUnit.test("choosePaymentCoin()", (assert) => {
  // Setup.
  const store = TestData.createStore();
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(ActionCreator.setRound(1));
  store.dispatch(ActionCreator.setCurrentPhase(Phase.PLAY_COINS));
  const players2 = Selector.playersInOrder(store.getState());
  const playerIds = R.map(R.prop("id"), players2);
  store.dispatch(ActionCreator.setCurrentPlayerOrder(playerIds));
  store.dispatch(ActionCreator.setCurrentPlayer(1));
  store.dispatch(ActionCreator.setVerbose(false));
  const delay = 0;
  const roundLimit = 30;
  const allowedTime = 100;
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const moveStates = MoveGenerator.generate(player, store.getState());

  // Run.
  const done = assert.async();
  const callback = (result) => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    assert.ok(result);
    const coinIds = R.map((m) => m.coinId, moveStates);
    assert.equal(coinIds.includes(result.coinId), true);
    const coin = Selector.coin(result.coinId, store.getState());
    assert.ok(coin);
    assert.equal(
      [RoyalCoin.RAVEN, UnitCoin.PIKEMAN, UnitCoin.SWORDSMAN].includes(coin.coinKey),
      true,
      `coin.coinKey = ${coin.coinKey}`
    );
    done();
  };

  MCTSPlayerStrategy.choosePaymentCoin(moveStates, store, delay, roundLimit, allowedTime).then(
    callback
  );
});

const MCTSPlayerStrategyTest = {};
export default MCTSPlayerStrategyTest;
