import Move from "../artifact/Move.js";
import Phase from "../artifact/Phase.js";
import UnitCard from "../artifact/UnitCard.js";
import UnitCoin from "../artifact/UnitCoin.js";

import ActionCreator from "../state/ActionCreator.js";
import CoinState from "../state/CoinState.js";
import MoveState from "../state/MoveState.js";
import Selector from "../state/Selector.js";

import MoveGenerator from "../model/MoveGenerator.js";
import TestData from "../model/TestData.js";

import PhaseFunction from "./PhaseFunction.js";

QUnit.module("PhaseFunction");

// const logDebug = store => {
//   console.log(`coinInstances = ${JSON.stringify(store.getState().coinInstances, null, 2)}`);
//   console.log(`tableau1 = ${JSON.stringify(Selector.tableau(1, store.getState()))}`);
//   console.log(`hand1 = ${JSON.stringify(Selector.hand(1, store.getState()))}`);
//   console.log(`tableau2 = ${JSON.stringify(Selector.tableau(2, store.getState()))}`);
//   console.log(`hand2 = ${JSON.stringify(Selector.hand(2, store.getState()))}`);
// };

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

QUnit.test("chooseMove() Berserker", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const coinState1 = CoinState.create({ coinKey: UnitCoin.BERSERKER, store });
  store.dispatch(ActionCreator.addCoin(coinState1));
  const coinState2 = CoinState.create({ coinKey: UnitCoin.BERSERKER, store });
  store.dispatch(ActionCreator.addCoin(coinState2));
  const coinState3 = CoinState.create({ coinKey: UnitCoin.BERSERKER, store });
  store.dispatch(ActionCreator.addCoin(coinState3));
  const coinState4 = CoinState.create({ coinKey: UnitCoin.BERSERKER, store });
  store.dispatch(ActionCreator.addCoin(coinState4));
  const paymentCoinId = coinState4.id; // Berserker
  store.dispatch(ActionCreator.addToPlayerArray("playerToTableau", playerId, UnitCard.BERSERKER));
  store.dispatch(ActionCreator.addToPlayerArray("playerToHand", playerId, coinState4.id));
  store.dispatch(ActionCreator.setCurrentPaymentCoin(paymentCoinId));
  const an = "e2";
  store.dispatch(ActionCreator.setUnit(an, coinState1.id)); // Berserker
  store.dispatch(ActionCreator.setUnit(an, coinState2.id)); // Berserker
  store.dispatch(ActionCreator.setUnit(an, coinState3.id)); // Berserker
  const victimCoinId = 22; // Archer
  const toAN = "e3";
  store.dispatch(ActionCreator.setUnit(toAN, victimCoinId)); // Archer

  const players = Selector.playersInOrder(store.getState());
  const playerIds = R.map(R.prop("id"), players);
  store.dispatch(ActionCreator.setCurrentPlayerOrder(playerIds));
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(ActionCreator.setCurrentPlayer(playerId));

  const paymentCoin = Selector.currentPaymentCoin(store.getState());
  const moveStates = [
    MoveState.create({ moveKey: Move.ATTACK, playerId, paymentCoinId, an, toAN, victimCoinId })
  ];
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
    assert.equal(Move.maneuverKeys().includes(moveState.moveKey), true);
    assert.equal(resolve, resolve2);
    done();
  };
  PhaseFunction.chooseMove(moveStates, paymentCoin, resolve, store, callback);
});

QUnit.test("chooseMove() Mercenary", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const coinState1 = CoinState.create({ coinKey: UnitCoin.MERCENARY, store });
  store.dispatch(ActionCreator.addCoin(coinState1));
  const coinState2 = CoinState.create({ coinKey: UnitCoin.MERCENARY, store });
  store.dispatch(ActionCreator.addCoin(coinState2));
  const coinState3 = CoinState.create({ coinKey: UnitCoin.MERCENARY, store });
  store.dispatch(ActionCreator.addCoin(coinState3));
  const paymentCoinId = coinState2.id; // Mercenary
  store.dispatch(ActionCreator.setCurrentPaymentCoin(paymentCoinId));
  const an = "d4";
  store.dispatch(ActionCreator.setUnit(an, coinState1.id)); // Mercenary
  const recruitCoinId = coinState3.id;
  store.dispatch(ActionCreator.addToPlayerArray("playerToSupply", playerId, recruitCoinId));

  const players = Selector.playersInOrder(store.getState());
  const playerIds = R.map(R.prop("id"), players);
  store.dispatch(ActionCreator.setCurrentPlayerOrder(playerIds));
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(ActionCreator.setCurrentPlayer(playerId));

  const paymentCoin = Selector.currentPaymentCoin(store.getState());
  const moveStates = [
    MoveState.create({ moveKey: Move.RECRUIT, playerId, paymentCoinId, recruitCoinId })
  ];
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
    assert.equal(Move.maneuverKeys().includes(moveState.moveKey), true);
    done();
  };
  PhaseFunction.chooseMove(moveStates, paymentCoin, resolve, store, callback);
});

QUnit.test("chooseMove() Royal Guard", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinId = hand[2]; // Pikeman
  store.dispatch(ActionCreator.addToPlayerArray("playerToTableau", 2, UnitCard.ROYAL_GUARD));
  store.dispatch(ActionCreator.setCurrentPaymentCoin(paymentCoinId));
  const an = "e2";
  const toAN = "e3";
  const coinState1 = CoinState.create({ coinKey: UnitCoin.ROYAL_GUARD, store });
  store.dispatch(ActionCreator.addCoin(coinState1));
  store.dispatch(ActionCreator.addToPlayerArray("playerToSupply", 2, coinState1.id));
  const victimCoinId = coinState1.id; // Royal Guard
  store.dispatch(ActionCreator.setUnit(an, 7)); // Pikeman
  store.dispatch(ActionCreator.setUnit(toAN, victimCoinId)); // Royal Guard
  const players = Selector.playersInOrder(store.getState());
  const playerIds = R.map(R.prop("id"), players);
  store.dispatch(ActionCreator.setCurrentPlayerOrder(playerIds));
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(ActionCreator.setCurrentPlayer(playerId));

  const paymentCoin = Selector.currentPaymentCoin(store.getState());
  const moveStates = [
    MoveState.create({ moveKey: Move.ATTACK, playerId, paymentCoinId, an, toAN, victimCoinId })
  ];
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
    assert.equal(moveState.playerId, 1, `moveState.playerId = ${moveState.playerId}`);
    assert.equal(
      moveState.paymentCoinId,
      10,
      `moveState.paymentCoinId = ${moveState.paymentCoinId}`
    );
    assert.equal(moveState.an, "e2", `moveState.an = ${moveState.an}`);
    assert.equal(
      ["d3", "e3", "f1", "f2"].includes(moveState.toAN),
      true,
      `moveState.toAN = ${moveState.toAN}`
    );
    done();
  };
  PhaseFunction.chooseMove(moveStates, paymentCoin, resolve, store, callback);
});

QUnit.test("chooseMove() Swordsman", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinId = hand[1]; // Swordsman
  store.dispatch(ActionCreator.setCurrentPaymentCoin(paymentCoinId));
  const an = "e2";
  const toAN = "e3";
  const victimCoinId = 22; // Archer
  store.dispatch(ActionCreator.setUnit(an, 2)); // Swordsman
  store.dispatch(ActionCreator.setUnit(toAN, victimCoinId)); // Archer
  const players = Selector.playersInOrder(store.getState());
  const playerIds = R.map(R.prop("id"), players);
  store.dispatch(ActionCreator.setCurrentPlayerOrder(playerIds));
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(ActionCreator.setCurrentPlayer(playerId));

  const paymentCoin = Selector.currentPaymentCoin(store.getState());
  const moveStates = [
    MoveState.create({ moveKey: Move.ATTACK, playerId, paymentCoinId, an, toAN, victimCoinId })
  ];
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
    assert.equal(moveState.moveKey, Move.MOVE_A_UNIT, `moveState.moveKey = ${moveState.moveKey}`);
    assert.equal(moveState.playerId, 1, `moveState.playerId = ${moveState.playerId}`);
    assert.equal(
      moveState.paymentCoinId,
      6,
      `moveState.paymentCoinId = ${moveState.paymentCoinId}`
    );
    assert.equal(moveState.an, "e2", `moveState.an = ${moveState.an}`);
    assert.equal(
      ["d3", "e3", "f1", "f2"].includes(moveState.toAN),
      true,
      `moveState.toAN = ${moveState.toAN}`
    );
    const toCoin = Selector.coinForUnit(moveState.toAN, store.getState());
    assert.equal(toCoin.coinKey, UnitCoin.SWORDSMAN, `toCoin.coinKey = ${toCoin.coinKey}`);
    done();
  };
  PhaseFunction.chooseMove(moveStates, paymentCoin, resolve, store, callback);
});

QUnit.test("chooseMove() Warrior Priest", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const coinState1 = CoinState.create({ coinKey: UnitCoin.WARRIOR_PRIEST, store });
  store.dispatch(ActionCreator.addCoin(coinState1));
  const coinState2 = CoinState.create({ coinKey: UnitCoin.WARRIOR_PRIEST, store });
  store.dispatch(ActionCreator.addCoin(coinState2));
  const paymentCoinId = coinState2.id; // Warrior Priest
  store.dispatch(ActionCreator.setCurrentPaymentCoin(paymentCoinId));
  const an = "d4";
  store.dispatch(ActionCreator.setUnit(an, coinState1.id)); // Warrior Priest

  const players = Selector.playersInOrder(store.getState());
  const playerIds = R.map(R.prop("id"), players);
  store.dispatch(ActionCreator.setCurrentPlayerOrder(playerIds));
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(ActionCreator.setCurrentPlayer(playerId));

  const paymentCoin = Selector.currentPaymentCoin(store.getState());
  const moveStates = [MoveState.create({ moveKey: Move.CONTROL, playerId, paymentCoinId, an })];
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
  const an = "e3"; // Raven control location.
  const toAN = "e4";
  store.dispatch(ActionCreator.setUnit(an, unitCoinId));
  const players = Selector.playersInOrder(store.getState());
  const playerIds = R.map(R.prop("id"), players);
  store.dispatch(ActionCreator.setCurrentPlayerOrder(playerIds));
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(
    ActionCreator.setCurrentMove(
      MoveState.create({ moveKey: Move.ATTACK, playerId, paymentCoinId, an, toAN })
    )
  );
  const resolve = 12;

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
  PhaseFunction.executeSwordsmanAttribute(resolve, store, callback);
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
