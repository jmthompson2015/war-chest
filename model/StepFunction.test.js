import Move from "../artifact/Move.js";
import Phase from "../artifact/Phase.js";
import Resolver from "../artifact/Resolver.js";
import UnitCard from "../artifact/UnitCard.js";
import UnitCoin from "../artifact/UnitCoin.js";

import ActionCreator from "../state/ActionCreator.js";
import CoinState from "../state/CoinState.js";
import MoveState from "../state/MoveState.js";
import Selector from "../state/Selector.js";

import MoveGenerator from "./MoveGenerator.js";
import StepFunction from "./StepFunction.js";
import TestData from "./TestData.js";

QUnit.module("StepFunction");

QUnit.test("chooseMove()", (assert) => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinId = hand[1]; // Swordsman
  const players = Selector.playersInOrder(store.getState());
  const playerIds = R.map(R.prop("id"), players);
  store.dispatch(ActionCreator.setCurrentPlayerOrder(playerIds));
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(ActionCreator.setCurrentPlayer(playerId));
  store.dispatch(ActionCreator.setCurrentPaymentCoin(paymentCoinId));
  const currentPlayer = Selector.player(playerId, store.getState());
  const paymentCoin = Selector.currentPaymentCoin(store.getState());
  const moveStates = MoveGenerator.generateForCoin(currentPlayer, paymentCoin, store.getState());

  // Run.
  const done = assert.async();
  const resolve = () => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    const moveState = Selector.currentMove(store.getState());
    assert.ok(moveState);
    assert.ok(moveState.moveKey, `moveState.moveKey = ${moveState.moveKey}`);
    assert.equal(moveState.playerId, 1);
    assert.equal(moveState.paymentCoinId, 6);
    done();
  };

  StepFunction.chooseMove(moveStates, paymentCoin, resolve, store);
});

QUnit.test("chooseMove() Berserker", (assert) => {
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
  const an1 = "e2";
  store.dispatch(ActionCreator.setUnit(an1, coinState1.id)); // Berserker
  store.dispatch(ActionCreator.setUnit(an1, coinState2.id)); // Berserker
  store.dispatch(ActionCreator.setUnit(an1, coinState3.id)); // Berserker
  const victimCoinId = 22; // Archer
  const an2 = "e3";
  store.dispatch(ActionCreator.setUnit(an2, victimCoinId)); // Archer

  const players = Selector.playersInOrder(store.getState());
  const playerIds = R.map(R.prop("id"), players);
  store.dispatch(ActionCreator.setCurrentPlayerOrder(playerIds));
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(ActionCreator.setCurrentPlayer(playerId));
  store.dispatch(ActionCreator.setCurrentPaymentCoin(paymentCoinId));

  const paymentCoin = Selector.currentPaymentCoin(store.getState());
  const moveStates = [
    MoveState.create({ moveKey: Move.ATTACK, playerId, paymentCoinId, an1, an2, victimCoinId }),
  ];

  // Run.
  const done = assert.async();
  const resolve = () => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    const moveState = Selector.currentMove(store.getState());
    assert.ok(moveState);
    assert.ok(moveState.moveKey, `moveState.moveKey = ${moveState.moveKey}`);
    assert.equal(Move.maneuverKeys().includes(moveState.moveKey), true);
    const resultAN = moveState.moveKey === Move.MOVE_A_UNIT ? moveState.an2 : moveState.an1;
    const unit2 = Selector.unit(resultAN, store.getState());
    assert.ok(unit2);
    assert.equal(unit2.length, 1);
    done();
  };

  StepFunction.chooseMove(moveStates, paymentCoin, resolve, store);
});

QUnit.test("chooseMove() Mercenary", (assert) => {
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
  const an1 = "d4";
  store.dispatch(ActionCreator.setUnit(an1, coinState1.id)); // Mercenary
  const recruitCoinId = coinState3.id;
  store.dispatch(ActionCreator.addToPlayerArray("playerToSupply", playerId, recruitCoinId));

  const players = Selector.playersInOrder(store.getState());
  const playerIds = R.map(R.prop("id"), players);
  store.dispatch(ActionCreator.setCurrentPlayerOrder(playerIds));
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(ActionCreator.setCurrentPlayer(playerId));
  store.dispatch(ActionCreator.setCurrentPaymentCoin(paymentCoinId));

  const paymentCoin = Selector.currentPaymentCoin(store.getState());
  const moveStates = [
    MoveState.create({ moveKey: Move.RECRUIT, playerId, paymentCoinId, recruitCoinId }),
  ];

  // Run.
  const done = assert.async();
  const resolve = () => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    const moveState = Selector.currentMove(store.getState());
    assert.ok(moveState);
    assert.ok(moveState.moveKey, `moveState.moveKey = ${moveState.moveKey}`);
    assert.equal(Move.maneuverKeys().includes(moveState.moveKey), true);
    done();
  };

  StepFunction.chooseMove(moveStates, paymentCoin, resolve, store);
});

QUnit.test("chooseMove() Royal Guard", (assert) => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinId = hand[2]; // Pikeman
  store.dispatch(ActionCreator.addToPlayerArray("playerToTableau", 2, UnitCard.ROYAL_GUARD));
  const an1 = "e2";
  const an2 = "e3";
  const coinState1 = CoinState.create({ coinKey: UnitCoin.ROYAL_GUARD, store });
  store.dispatch(ActionCreator.addCoin(coinState1));
  store.dispatch(ActionCreator.addToPlayerArray("playerToSupply", 2, coinState1.id));
  const victimCoinId = coinState1.id; // Royal Guard
  store.dispatch(ActionCreator.setUnit(an1, 7)); // Pikeman
  store.dispatch(ActionCreator.setUnit(an2, victimCoinId)); // Royal Guard
  const players = Selector.playersInOrder(store.getState());
  const playerIds = R.map(R.prop("id"), players);
  store.dispatch(ActionCreator.setCurrentPlayerOrder(playerIds));
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(ActionCreator.setCurrentPlayer(playerId));
  store.dispatch(ActionCreator.setCurrentPaymentCoin(paymentCoinId));

  const paymentCoin = Selector.currentPaymentCoin(store.getState());
  const moveStates = [
    MoveState.create({ moveKey: Move.ATTACK, playerId, paymentCoinId, an1, an2, victimCoinId }),
  ];

  // Run.
  const done = assert.async();
  const resolve = () => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    const moveState = Selector.currentMove(store.getState());
    assert.ok(moveState);
    assert.equal(moveState.playerId, 1, `moveState.playerId = ${moveState.playerId}`);
    assert.equal(
      moveState.paymentCoinId,
      10,
      `moveState.paymentCoinId = ${moveState.paymentCoinId}`
    );
    assert.equal(moveState.an1, "e2", `moveState.an1 = ${moveState.an1}`);
    assert.equal(
      ["d3", "e3", "f1", "f2"].includes(moveState.an2),
      true,
      `moveState.an2 = ${moveState.an2}`
    );
    done();
  };

  StepFunction.chooseMove(moveStates, paymentCoin, resolve, store);
});

QUnit.test("chooseMove() Swordsman", (assert) => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinId = hand[1]; // Swordsman
  const an1 = "e2";
  const an2 = "e3";
  const victimCoinId = 22; // Archer
  store.dispatch(ActionCreator.setUnit(an1, 2)); // Swordsman
  store.dispatch(ActionCreator.setUnit(an2, victimCoinId)); // Archer
  const players = Selector.playersInOrder(store.getState());
  const playerIds = R.map(R.prop("id"), players);
  store.dispatch(ActionCreator.setCurrentPlayerOrder(playerIds));
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(ActionCreator.setCurrentPlayer(playerId));
  store.dispatch(ActionCreator.setCurrentPaymentCoin(paymentCoinId));

  const paymentCoin = Selector.currentPaymentCoin(store.getState());
  const moveStates = [
    MoveState.create({ moveKey: Move.ATTACK, playerId, paymentCoinId, an1, an2, victimCoinId }),
  ];

  // Run.
  const done = assert.async();
  const resolve = () => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    const moveState = Selector.currentMove(store.getState());
    assert.ok(moveState);
    assert.equal(moveState.moveKey, Move.MOVE_A_UNIT, `moveState.moveKey = ${moveState.moveKey}`);
    assert.equal(moveState.playerId, 1, `moveState.playerId = ${moveState.playerId}`);
    assert.equal(
      moveState.paymentCoinId,
      6,
      `moveState.paymentCoinId = ${moveState.paymentCoinId}`
    );
    assert.equal(moveState.an1, "e2", `moveState.an1 = ${moveState.an1}`);
    assert.equal(
      ["d3", "e3", "f1", "f2"].includes(moveState.an2),
      true,
      `moveState.an2 = ${moveState.an2}`
    );
    const toCoin = Selector.coinForUnit(moveState.an2, store.getState());
    assert.equal(toCoin.coinKey, UnitCoin.SWORDSMAN, `toCoin.coinKey = ${toCoin.coinKey}`);
    done();
  };

  StepFunction.chooseMove(moveStates, paymentCoin, resolve, store);
});

QUnit.test("chooseMove() Warrior Priest", (assert) => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const coinState1 = CoinState.create({ coinKey: UnitCoin.WARRIOR_PRIEST, store });
  store.dispatch(ActionCreator.addCoin(coinState1));
  const coinState2 = CoinState.create({ coinKey: UnitCoin.WARRIOR_PRIEST, store });
  store.dispatch(ActionCreator.addCoin(coinState2));
  const paymentCoinId = coinState2.id; // Warrior Priest
  const an1 = "d4";
  store.dispatch(ActionCreator.setUnit(an1, coinState1.id)); // Warrior Priest

  const players = Selector.playersInOrder(store.getState());
  const playerIds = R.map(R.prop("id"), players);
  store.dispatch(ActionCreator.setCurrentPlayerOrder(playerIds));
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(ActionCreator.setCurrentPlayer(playerId));
  store.dispatch(ActionCreator.setCurrentPaymentCoin(paymentCoinId));

  const paymentCoin = Selector.currentPaymentCoin(store.getState());
  const moveStates = [MoveState.create({ moveKey: Move.CONTROL, playerId, paymentCoinId, an1 })];

  // Run.
  const done = assert.async();
  const resolve = () => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    const moveState = Selector.currentMove(store.getState());
    assert.ok(moveState);
    assert.ok(moveState.moveKey, `moveState.moveKey = ${moveState.moveKey}`);
    done();
  };

  StepFunction.chooseMove(moveStates, paymentCoin, resolve, store);
});

QUnit.test("drawThreeCoins()", (assert) => {
  // Setup.
  const store = TestData.createStore(true, false);
  store.dispatch(ActionCreator.setCurrentPhase(Phase.DRAW_THREE_COINS));
  const players = Selector.playersInOrder(store.getState());
  const playerIds = R.map(R.prop("id"), players);
  store.dispatch(ActionCreator.setCurrentPlayerOrder(playerIds));
  const playerId = R.head(playerIds);
  store.dispatch(ActionCreator.setCurrentPlayer(playerId));

  // Run.
  const done = assert.async();
  const callback = () => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    assert.equal(Selector.hand(playerId, store.getState()).length, 3);
    done();
  };

  StepFunction.execute(store).then(callback);
});

QUnit.test("drawThreeCoins() not enough", (assert) => {
  // Setup.
  const store = TestData.createStore(true, false);
  store.dispatch(ActionCreator.setCurrentPhase(Phase.DRAW_THREE_COINS));
  const players = Selector.playersInOrder(store.getState());
  const playerIds = R.map(R.prop("id"), players);
  store.dispatch(ActionCreator.setCurrentPlayerOrder(playerIds));
  const playerId = R.last(playerIds);
  store.dispatch(ActionCreator.setCurrentPlayer(playerId));

  // Move all except royal coin to morgue.
  const bag2 = Selector.bag(2, store.getState());
  bag2.forEach((coinId) => {
    if (Resolver.isRoyalCoin(Selector.coinType(coinId, store.getState()).key)) {
      store.dispatch(
        ActionCreator.transferBetweenPlayerArrays(
          "playerToBag",
          "playerToDiscardFacedown",
          2,
          coinId
        )
      );
    } else {
      store.dispatch(
        ActionCreator.transferBetweenPlayerArrays("playerToBag", "playerToMorgue", 2, coinId)
      );
    }
  });
  assert.equal(Selector.bag(2, store.getState()).length, 0);
  assert.equal(Selector.discardFacedown(2, store.getState()).length, 1);
  assert.equal(Selector.hand(2, store.getState()).length, 0);

  // Run.
  const done = assert.async();
  const callback = () => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    assert.equal(Selector.bag(2, store.getState()).length, 0);
    assert.equal(Selector.discardFacedown(2, store.getState()).length, 0);
    assert.equal(Selector.hand(2, store.getState()).length, 1);
    done();
  };

  StepFunction.execute(store).then(callback);
});

QUnit.test("executeBerserkerAttribute()", (assert) => {
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
  const an1 = "e2";
  store.dispatch(ActionCreator.setUnit(an1, coinState1.id)); // Berserker
  store.dispatch(ActionCreator.setUnit(an1, coinState2.id)); // Berserker
  store.dispatch(ActionCreator.setUnit(an1, coinState3.id)); // Berserker

  const players = Selector.playersInOrder(store.getState());
  const playerIds = R.map(R.prop("id"), players);
  store.dispatch(ActionCreator.setCurrentPlayerOrder(playerIds));
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(ActionCreator.setCurrentPlayer(playerId));
  store.dispatch(ActionCreator.setCurrentPaymentCoin(paymentCoinId));

  // Run.
  const done = assert.async();
  const resolve = () => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    const playerUnitANs = Selector.playerUnitANs(playerId, store.getState());
    assert.ok(playerUnitANs);
    assert.equal(Array.isArray(playerUnitANs), true);
    assert.equal(playerUnitANs.length, 1);
    assert.equal(
      ["c4", "d3", "d4", "e2", "e3", "e4", "f1", "f2", "f3", "g1", "g2"].includes(playerUnitANs[0]),
      true,
      `playerUnitANs[0] = ${playerUnitANs[0]}`
    );
    done();
  };

  StepFunction.executeBerserkerAttribute(resolve, store);
});

QUnit.test("executeMercenaryAttribute()", (assert) => {
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
  const an1 = "d4";
  store.dispatch(ActionCreator.setUnit(an1, coinState1.id)); // Mercenary
  const recruitCoinId = coinState3.id;
  store.dispatch(ActionCreator.addToPlayerArray("playerToSupply", playerId, recruitCoinId));

  const players = Selector.playersInOrder(store.getState());
  const playerIds = R.map(R.prop("id"), players);
  store.dispatch(ActionCreator.setCurrentPlayerOrder(playerIds));
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(ActionCreator.setCurrentPlayer(playerId));
  store.dispatch(ActionCreator.setCurrentPaymentCoin(paymentCoinId));

  // Run.
  const done = assert.async();
  const resolve = () => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    done();
  };

  StepFunction.executeMercenaryAttribute(resolve, store);
});

QUnit.test("executeRoyalGuardAttribute()", (assert) => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinId = hand[2]; // Pikeman
  store.dispatch(ActionCreator.addToPlayerArray("playerToTableau", 2, UnitCard.ROYAL_GUARD));
  const an1 = "e2";
  const an2 = "e3";
  const coinState1 = CoinState.create({ coinKey: UnitCoin.ROYAL_GUARD, store });
  store.dispatch(ActionCreator.addCoin(coinState1));
  store.dispatch(ActionCreator.addToPlayerArray("playerToSupply", 2, coinState1.id));
  const victimCoinId = coinState1.id; // Royal Guard
  store.dispatch(ActionCreator.setUnit(an1, 7)); // Pikeman
  store.dispatch(ActionCreator.setUnit(an2, victimCoinId)); // Royal Guard
  const players = Selector.playersInOrder(store.getState());
  const playerIds = R.map(R.prop("id"), players);
  store.dispatch(ActionCreator.setCurrentPlayerOrder(playerIds));
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(ActionCreator.setCurrentPlayer(playerId));
  store.dispatch(ActionCreator.setCurrentPaymentCoin(paymentCoinId));

  const moveState = MoveState.create({
    moveKey: Move.ATTACK,
    playerId,
    paymentCoinId,
    an1,
    an2,
    victimCoinId,
  });
  store.dispatch(ActionCreator.setCurrentMove(moveState));

  // Run.
  const done = assert.async();
  const callback = () => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    done();
  };

  StepFunction.executeRoyalGuardAttribute(store).then(callback);
});

QUnit.test("executeSwordsmanAttribute()", (assert) => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  store.dispatch(ActionCreator.setCurrentPlayer(playerId));
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinId = hand[1]; // Swordsman
  store.dispatch(ActionCreator.setCurrentPaymentCoin(paymentCoinId));
  const unitCoinId = 2; // Swordsman
  const an1 = "e3"; // Raven control location.
  const an2 = "e4";
  store.dispatch(ActionCreator.setUnit(an1, unitCoinId));
  const players = Selector.playersInOrder(store.getState());
  const playerIds = R.map(R.prop("id"), players);
  store.dispatch(ActionCreator.setCurrentPlayerOrder(playerIds));
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(
    ActionCreator.setCurrentMove(
      MoveState.create({ moveKey: Move.ATTACK, playerId, paymentCoinId, an1, an2 })
    )
  );

  // Run.
  const done = assert.async();
  const resolve = () => {
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

  StepFunction.executeSwordsmanAttribute(resolve, store);
});

QUnit.test("executeWarriorPriestAttribute()", (assert) => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const coinState1 = CoinState.create({ coinKey: UnitCoin.WARRIOR_PRIEST, store });
  store.dispatch(ActionCreator.addCoin(coinState1));
  const coinState2 = CoinState.create({ coinKey: UnitCoin.WARRIOR_PRIEST, store });
  store.dispatch(ActionCreator.addCoin(coinState2));
  const paymentCoinId = coinState2.id; // Warrior Priest
  const an1 = "d4";
  store.dispatch(ActionCreator.setUnit(an1, coinState1.id)); // Warrior Priest

  const players = Selector.playersInOrder(store.getState());
  const playerIds = R.map(R.prop("id"), players);
  store.dispatch(ActionCreator.setCurrentPlayerOrder(playerIds));
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(ActionCreator.setCurrentPlayer(playerId));
  store.dispatch(ActionCreator.setCurrentPaymentCoin(paymentCoinId));

  // Run.
  const done = assert.async();
  const resolve = () => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    done();
  };

  StepFunction.executeWarriorPriestAttribute(resolve, store);
});

QUnit.test("playCoins()", (assert) => {
  // Setup.
  const store = TestData.createStore();
  store.dispatch(ActionCreator.setCurrentPhase(Phase.PLAY_COIN_1));
  const players = Selector.playersInOrder(store.getState());
  const playerIds = R.map(R.prop("id"), players);
  store.dispatch(ActionCreator.setCurrentPlayerOrder(playerIds));
  const playerId = R.head(playerIds);
  store.dispatch(ActionCreator.setCurrentPlayer(playerId));
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(ActionCreator.setVerbose(false));

  // Run.
  const done = assert.async();
  const callback = () => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    assert.equal(Selector.hand(1, store.getState()).length, 2);
    done();
  };
  StepFunction.execute(store).then(callback);
});

const StepFunctionTest = {};
export default StepFunctionTest;
