import Move from "../artifact/Move.js";
import UnitCard from "../artifact/UnitCard.js";
import UnitCoin from "../artifact/UnitCoin.js";

import ActionCreator from "../state/ActionCreator.js";
import CoinState from "../state/CoinState.js";
import MoveState from "../state/MoveState.js";
import Selector from "../state/Selector.js";

import Tactic from "./Tactic.js";
import TestData from "./TestData.js";

QUnit.module("Tactic");

// const logDebug = store => {
//   console.log(`coinInstances = ${JSON.stringify(store.getState().coinInstances, null, 2)}`);
//   console.log(`tableau1 = ${JSON.stringify(Selector.tableau(1, store.getState()))}`);
//   console.log(`hand1 = ${JSON.stringify(Selector.hand(1, store.getState()))}`);
//   console.log(`tableau2 = ${JSON.stringify(Selector.tableau(2, store.getState()))}`);
//   console.log(`hand2 = ${JSON.stringify(Selector.hand(2, store.getState()))}`);
// };

QUnit.test("isLegal() Archer true", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 2;
  const player = Selector.player(playerId, store.getState());
  const hand2 = Selector.hand(playerId, store.getState());
  const paymentCoinId = hand2[1]; // Archer
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());
  const hand1 = Selector.hand(1, store.getState());
  const victimCoinId = hand1[1]; // Swordsman
  const an1 = "e2"; // Raven control location.
  const an2 = "e4";
  store.dispatch(ActionCreator.setUnit(an1, paymentCoinId));
  store.dispatch(ActionCreator.setUnit(an2, victimCoinId));
  const tactic = Tactic[UnitCoin.ARCHER];

  // Run.
  const result = tactic.isLegal(player, paymentCoin, an1, an2, store.getState());

  // Verify.
  assert.equal(result, true);
});

QUnit.test("isLegal() Archer-Knight false", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 2;
  const player = Selector.player(playerId, store.getState());
  store.dispatch(ActionCreator.addToPlayerArray("playerToTableau", 1, UnitCard.KNIGHT));
  const coinState1 = CoinState.create({ coinKey: UnitCoin.KNIGHT, store });
  store.dispatch(ActionCreator.addCoin(coinState1));
  const hand2 = Selector.hand(playerId, store.getState());
  const paymentCoinId = hand2[1]; // Archer
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());
  const victimCoinId = coinState1.id; // Knight
  const an1 = "e2"; // Raven control location.
  const an2 = "e4";
  store.dispatch(ActionCreator.setUnit(an1, paymentCoinId));
  store.dispatch(ActionCreator.setUnit(an2, victimCoinId));
  const tactic = Tactic[UnitCoin.ARCHER];

  // Run.
  const result = tactic.isLegal(player, paymentCoin, an1, an2, store.getState());

  // Verify.
  assert.equal(result, false);
});

QUnit.test("isLegal() Crossbowman true", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const paymentCoinId = 15; // Crossbowman
  store.dispatch(ActionCreator.addToPlayerArray("playerToHand", playerId, paymentCoinId));
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());
  const victimCoinId = 25; // Archer
  const an1 = "e2"; // Raven control location.
  const an2 = "e4";
  store.dispatch(ActionCreator.setUnit(an1, 11)); // Crossbowman
  store.dispatch(ActionCreator.setUnit(an2, victimCoinId)); // Archer
  const tactic = Tactic[UnitCoin.CROSSBOWMAN];

  // Run.
  const result = tactic.isLegal(player, paymentCoin, an1, an2, store.getState());

  // Verify.
  assert.equal(result, true);
});

QUnit.test("isLegal() Crossbowman-Knight false", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  store.dispatch(ActionCreator.addToPlayerArray("playerToTableau", 2, UnitCard.KNIGHT));
  const coinState1 = CoinState.create({ coinKey: UnitCoin.KNIGHT, store });
  store.dispatch(ActionCreator.addCoin(coinState1));
  const paymentCoinId = 15; // Crossbowman
  store.dispatch(ActionCreator.addToPlayerArray("playerToHand", playerId, paymentCoinId));
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());
  const victimCoinId = coinState1.id; // Knight
  const an1 = "e2"; // Raven control location.
  const an2 = "e4";
  store.dispatch(ActionCreator.setUnit(an1, 11)); // Crossbowman
  store.dispatch(ActionCreator.setUnit(an2, victimCoinId));
  const tactic = Tactic[UnitCoin.CROSSBOWMAN];

  // Run.
  const result = tactic.isLegal(player, paymentCoin, an1, an2, store.getState());

  // Verify.
  assert.equal(result, false);
});

QUnit.test("isLegal() Light Cavalry true", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const paymentCoinId = 20; // Light Cavalry
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());
  store.dispatch(ActionCreator.addToPlayerArray("playerToHand", playerId, paymentCoinId));
  const an1 = "e2"; // Raven control location.
  const an2 = "e4";
  store.dispatch(ActionCreator.setUnit(an1, 16)); // Light Cavalry
  const tactic = Tactic[UnitCoin.LIGHT_CAVALRY];

  // Run.
  const result = tactic.isLegal(player, paymentCoin, an1, an2, store.getState());

  // Verify.
  assert.equal(result, true);
});

QUnit.test("isLegal() Royal Guard true", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  store.dispatch(ActionCreator.addToPlayerArray("playerToTableau", playerId, UnitCard.ROYAL_GUARD));
  const coinState1 = CoinState.create({ coinKey: UnitCoin.ROYAL_GUARD, store });
  store.dispatch(ActionCreator.addCoin(coinState1));
  const paymentCoinId = 1; // Raven Royal Coin
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());
  store.dispatch(ActionCreator.addToPlayerArray("playerToHand", playerId, paymentCoinId));
  const an1 = "e2"; // Raven control location.
  const an2 = "e3";
  store.dispatch(ActionCreator.setUnit(an1, coinState1.id)); // Royal Guard
  const tactic = Tactic[UnitCoin.ROYAL_GUARD];

  // Run.
  const result = tactic.isLegal(player, paymentCoin, an1, an2, store.getState());

  // Verify.
  assert.equal(result, true);
});

QUnit.test("label() Archer", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 2;
  const hand2 = Selector.hand(playerId, store.getState());
  const paymentCoinId = hand2[1];
  const hand1 = Selector.hand(1, store.getState());
  const victimCoinId = hand1[1];
  const an1 = "e2"; // Raven control location.
  const an2 = "e4";
  store.dispatch(ActionCreator.setUnit(an1, paymentCoinId));
  store.dispatch(ActionCreator.setUnit(an2, victimCoinId));
  const moveKey = Move.TACTIC;
  const moveStates = [
    MoveState.create({ moveKey: Move.ATTACK, playerId, paymentCoinId, an1, an2, victimCoinId })
  ];
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, an1, moveStates });
  const tactic = Tactic[UnitCoin.ARCHER];

  // Run.
  const result = tactic.label(moveState, store.getState());

  // Verify.
  assert.equal(result, "Tactic: Archer at e2 attacks Swordsman at e4");
});

QUnit.test("label() Cavalry", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 2;
  const paymentCoinId = 29; // Cavalry
  store.dispatch(ActionCreator.addToPlayerArray("playerToHand", playerId, paymentCoinId));
  const victimCoinId = 2; // Swordsman
  const an1 = "e2";
  const an2 = "e3";
  const an3 = "e4";
  store.dispatch(ActionCreator.setUnit(an1, 26)); // Cavalry
  store.dispatch(ActionCreator.setUnit(an3, victimCoinId)); // Swordsman
  const moveKey = Move.TACTIC;
  const moveStates = [
    { moveKey: Move.MOVE_A_UNIT, playerId, paymentCoinId, an1, an2 },
    { moveKey: Move.ATTACK, playerId, paymentCoinId, an1: an2, an2: an3, victimCoinId }
  ];
  const moveState = MoveState.create({
    moveKey,
    playerId,
    paymentCoinId,
    an1,
    moveStates
  });
  const tactic = Tactic[UnitCoin.CAVALRY];

  // Run.
  const result = tactic.label(moveState, store.getState());

  // Verify.
  assert.equal(result, "Tactic: Cavalry at e2 moves to e3 and attacks Swordsman at e4");
});

QUnit.test("label() Crossbowman", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const paymentCoinId = 15; // Crossbowman
  store.dispatch(ActionCreator.addToPlayerArray("playerToHand", playerId, paymentCoinId));
  const victimCoinId = 25; // Archer
  const an1 = "e2"; // Raven control location.
  const an2 = "e4";
  store.dispatch(ActionCreator.setUnit(an1, 11)); // Crossbowman
  store.dispatch(ActionCreator.setUnit(an2, victimCoinId)); // Archer
  const moveKey = Move.TACTIC;
  const moveStates = [
    MoveState.create({ moveKey: Move.ATTACK, playerId, paymentCoinId, an1, an2, victimCoinId })
  ];
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, an1, moveStates });
  const tactic = Tactic[UnitCoin.CROSSBOWMAN];

  // Run.
  const result = tactic.label(moveState, store.getState());

  // Verify.
  assert.equal(result, "Tactic: Crossbowman at e2 attacks Archer at e4");
});

QUnit.test("label() Ensign", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  store.dispatch(ActionCreator.addToPlayerArray("playerToTableau", playerId, UnitCard.ENSIGN));
  const coinState1 = CoinState.create({ coinKey: UnitCoin.ENSIGN, store });
  store.dispatch(ActionCreator.addCoin(coinState1));
  const coinState2 = CoinState.create({ coinKey: UnitCoin.ENSIGN, store });
  store.dispatch(ActionCreator.addCoin(coinState2));
  const paymentCoinId = coinState1.id; // Marshall
  const moveCoinId = 6; // Swordsman
  const an1 = "e2"; // Raven control location.
  const an2 = "e4";
  const an3 = "f3";
  store.dispatch(ActionCreator.setUnit(an1, paymentCoinId));
  store.dispatch(ActionCreator.setUnit(an2, moveCoinId));
  const moveKey = Move.TACTIC;
  const moveStates = [
    MoveState.create({
      moveKey: Move.MOVE_A_UNIT,
      playerId,
      paymentCoinId,
      an1: an2,
      an2: an3
    })
  ];
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, an1, moveStates });
  const tactic = Tactic[UnitCoin.ENSIGN];

  // Run.
  const result = tactic.label(moveState, store.getState());

  // Verify.
  assert.equal(result, "Tactic: Ensign at e2 orders Swordsman at e4 to move to f3");
});

QUnit.test("label() Lancer", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 2;
  const paymentCoinId = 33; // Lancer
  store.dispatch(
    ActionCreator.transferBetweenPlayerArrays(
      "playerToSupply",
      "playerToHand",
      playerId,
      paymentCoinId
    )
  );
  const victimCoinId = 2; // Swordsman
  const an1 = "e2";
  const an2 = "e4";
  const an3 = "e5";
  store.dispatch(ActionCreator.setUnit(an1, 30)); // Lancer
  store.dispatch(ActionCreator.setUnit(an3, 2)); // Swordsman
  const moveKey = Move.TACTIC;
  const moveStates = [
    { moveKey: Move.MOVE_A_UNIT, playerId, paymentCoinId, an1, an2 },
    { moveKey: Move.ATTACK, playerId, paymentCoinId, an1: an2, an2: an3, victimCoinId }
  ];
  const moveState = MoveState.create({
    moveKey,
    playerId,
    paymentCoinId,
    an1,
    moveStates
  });
  const tactic = Tactic[UnitCoin.LANCER];

  // Run.
  const result = tactic.label(moveState, store.getState());

  // Verify.
  assert.equal(result, "Tactic: Lancer at e2 moves to e4 and attacks Swordsman at e5");
});

QUnit.test("label() Light Cavalry", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const paymentCoinId = 20; // Light Cavalry
  store.dispatch(ActionCreator.addToPlayerArray("playerToHand", playerId, paymentCoinId));
  const an1 = "e2"; // Raven control location.
  const an2 = "e4";
  store.dispatch(ActionCreator.setUnit(an1, 16)); // Light Cavalry
  const moveKey = Move.TACTIC;
  const moveStates = [
    MoveState.create({ moveKey: Move.MOVE_A_UNIT, playerId, paymentCoinId, an1, an2 })
  ];
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, an1, moveStates });
  const tactic = Tactic[UnitCoin.LIGHT_CAVALRY];

  // Run.
  const result = tactic.label(moveState, store.getState());

  // Verify.
  assert.equal(result, "Tactic: Light Cavalry at e2 moves to e4");
});

QUnit.test("label() Marshall", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  store.dispatch(ActionCreator.addToPlayerArray("playerToTableau", playerId, UnitCard.MARSHALL));
  const coinState1 = CoinState.create({ coinKey: UnitCoin.MARSHALL, store });
  store.dispatch(ActionCreator.addCoin(coinState1));
  const coinState2 = CoinState.create({ coinKey: UnitCoin.MARSHALL, store });
  store.dispatch(ActionCreator.addCoin(coinState2));
  const paymentCoinId = coinState1.id; // Marshall
  const attackerCoinId = 6; // Swordsman
  const victimCoinId = 25; // Archer
  const an1 = "e2"; // Raven control location.
  const an2 = "e4";
  const an3 = "f4";
  store.dispatch(ActionCreator.setUnit(an1, paymentCoinId));
  store.dispatch(ActionCreator.setUnit(an2, attackerCoinId));
  store.dispatch(ActionCreator.setUnit(an3, victimCoinId));
  const moveKey = Move.TACTIC;
  const moveStates = [
    MoveState.create({
      moveKey: Move.ATTACK,
      playerId,
      paymentCoinId,
      an1: an2,
      an2: an3,
      victimCoinId
    })
  ];
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, an1, moveStates });
  const tactic = Tactic[UnitCoin.MARSHALL];

  // Run.
  const result = tactic.label(moveState, store.getState());

  // Verify.
  assert.equal(result, "Tactic: Marshall at e2 orders Swordsman at e4 to attack Archer at f4");
});

QUnit.test("label() Royal Guard", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  store.dispatch(ActionCreator.addToPlayerArray("playerToTableau", playerId, UnitCard.ROYAL_GUARD));
  const coinState1 = CoinState.create({ coinKey: UnitCoin.ROYAL_GUARD, store });
  store.dispatch(ActionCreator.addCoin(coinState1));
  const paymentCoinId = 1; // Raven Royal Coin
  store.dispatch(ActionCreator.addToPlayerArray("playerToHand", playerId, paymentCoinId));
  const an1 = "e2"; // Raven control location.
  const an2 = "e3";
  store.dispatch(ActionCreator.setUnit(an1, coinState1.id)); // Royal Guard
  const moveKey = Move.TACTIC;
  const moveStates = [
    MoveState.create({ moveKey: Move.MOVE_A_UNIT, playerId, paymentCoinId, an1, an2 })
  ];
  const moveState = MoveState.create({
    moveKey,
    playerId,
    paymentCoinId: coinState1.id,
    an1,
    moveStates
  });
  const tactic = Tactic[UnitCoin.ROYAL_GUARD];

  // Run.
  const result = tactic.label(moveState, store.getState());

  // Verify.
  assert.equal(result, "Tactic: Royal Guard at e2 moves to e3");
});

const TacticTest = {};
export default TacticTest;
