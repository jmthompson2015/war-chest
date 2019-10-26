import Move from "../artifact/Move.js";
import Phase from "../artifact/Phase.js";

import ActionCreator from "../state/ActionCreator.js";
import MoveState from "../state/MoveState.js";
import Selector from "../state/Selector.js";

import MoveGenerator from "../model/MoveGenerator.js";
import TestData from "../model/TestData.js";

import PhaseFunction from "./PhaseFunction.js";

QUnit.module("PhaseFunction");

QUnit.test("chooseMove()", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinId = hand[1]; // Swordsman
  store.dispatch(ActionCreator.setCurrentPaymentCoin(paymentCoinId));
  const players = Selector.playersInOrder(store.getState());
  const playerIds = R.map(R.prop("id"), players);
  store.dispatch(ActionCreator.setCurrentPlayerOrder(playerIds));
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(ActionCreator.setCurrentPlayer(playerId));
  const currentPlayer = Selector.player(playerId, store.getState());
  const paymentCoin = Selector.currentPaymentCoin(store.getState());
  const moveStates = MoveGenerator.generateForCoin(currentPlayer, paymentCoin, store.getState());
  const resolve = 12;

  // Run.
  const done = assert.async();
  const callback = (resolve2, store2) => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    assert.equal(resolve2, resolve);
    assert.ok(store2);
    const moveState = Selector.currentMove(store2.getState());
    assert.ok(moveState);
    assert.ok(moveState.moveKey, `moveState.moveKey = ${moveState.moveKey}`);
    assert.equal(moveState.playerId, 1);
    assert.equal(moveState.paymentCoinId, 6);
    done();
  };
  PhaseFunction.chooseMove(moveStates, paymentCoin, resolve, store, callback);
});

QUnit.test("drawThreeCoins()", assert => {
  // Setup.
  const store = TestData.createStore(true, false);
  const players = Selector.playersInOrder(store.getState());
  const playerIds = R.map(R.prop("id"), players);
  store.dispatch(ActionCreator.setCurrentPlayerOrder(playerIds));
  const phase = PhaseFunction[Phase.DRAW_THREE_COINS];

  // Run.
  const done = assert.async();
  const callback = () => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    assert.equal(Selector.hand(1, store.getState()).length, 3);
    assert.equal(Selector.hand(2, store.getState()).length, 3);
    done();
  };
  phase.execute(store).then(callback);
});

QUnit.test("executeSwordsmanAttribute()", assert => {
  // Setup.
  const store = TestData.createStore();

  const playerId = 1;
  store.dispatch(ActionCreator.setCurrentPlayer(playerId));
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinId = hand[1]; // Swordsman
  store.dispatch(ActionCreator.setCurrentPaymentCoin(paymentCoinId));
  const unitCoinId = 2; // Swordsman
  const fromAN = "e3"; // Raven control location.
  const toAN = "e4";
  store.dispatch(ActionCreator.setUnit(fromAN, unitCoinId));
  const players = Selector.playersInOrder(store.getState());
  const playerIds = R.map(R.prop("id"), players);
  store.dispatch(ActionCreator.setCurrentPlayerOrder(playerIds));
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(
    ActionCreator.setCurrentMove(
      MoveState.create({ moveKey: Move.ATTACK, playerId, paymentCoinId, fromAN, toAN })
    )
  );

  // Run.
  const done = assert.async();
  const callback = () => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    const playerUnitANs = Selector.playerUnitANs(playerId, store.getState());
    assert.ok(playerUnitANs);
    assert.equal(Array.isArray(playerUnitANs), true);
    assert.equal(playerUnitANs.length, 1);
    assert.equal(
      ["d3", "d4", "e2", "e4", "f2", "f3"].includes(playerUnitANs[0]),
      true,
      `playerUnitANs[0] = ${playerUnitANs[0]}`
    );
    done();
  };
  PhaseFunction.executeSwordsmanAttribute(store).then(callback);
});

QUnit.test("playCoins()", assert => {
  // Setup.
  const store = TestData.createStore();
  const players = Selector.playersInOrder(store.getState());
  const playerIds = R.map(R.prop("id"), players);
  store.dispatch(ActionCreator.setCurrentPlayerOrder(playerIds));
  const phase = PhaseFunction[Phase.PLAY_COINS];
  store.dispatch(ActionCreator.setDelay(0));

  // Run.
  const done = assert.async();
  const callback = () => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    assert.equal(Selector.hand(1, store.getState()).length, 0);
    assert.equal(Selector.hand(2, store.getState()).length, 0);
    done();
  };
  phase.execute(store).then(callback);
});

const PhaseFunctionTest = {};
export default PhaseFunctionTest;
