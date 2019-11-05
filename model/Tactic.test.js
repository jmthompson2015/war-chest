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

QUnit.test("execute() Archer", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 2;
  const hand2 = Selector.hand(playerId, store.getState());
  const paymentCoinId = hand2[1]; // Archer
  const hand1 = Selector.hand(1, store.getState());
  const victimCoinId = hand1[1]; // Swordsman
  const an1 = "e2"; // Raven control location.
  const an2 = "e4";
  store.dispatch(ActionCreator.setUnit(an1, 22)); // Archer
  store.dispatch(ActionCreator.setUnit(an2, victimCoinId));
  const moveKey = Move.TACTIC;
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, an1, an2, victimCoinId });

  // Run.
  Tactic[UnitCoin.ARCHER].execute(moveState, store);

  // Verify.
  const resultHand = Selector.hand(playerId, store.getState());
  assert.ok(resultHand);
  assert.equal(resultHand.length, 2);
  const resultFromUnit = Selector.unit(an1, store.getState());
  assert.ok(resultFromUnit);
  assert.equal(resultFromUnit.join(), 22);
  const resultToUnit = Selector.unit(an2, store.getState());
  assert.equal(resultToUnit, undefined);
  const resultMorgue = Selector.morgue(1, store.getState());
  assert.ok(resultMorgue);
  assert.equal(resultMorgue.length, 1);
  assert.equal(resultMorgue.join(), victimCoinId);
});

QUnit.test("execute() Crossbowman", assert => {
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
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, an1, an2, victimCoinId });

  // Run.
  Tactic[UnitCoin.CROSSBOWMAN].execute(moveState, store);

  // Verify.
  const resultHand = Selector.hand(playerId, store.getState());
  assert.ok(resultHand);
  assert.equal(resultHand.length, 3);
  const resultFromUnit = Selector.unit(an1, store.getState());
  assert.ok(resultFromUnit);
  assert.equal(resultFromUnit.join(), 11);
  const resultToUnit = Selector.unit(an2, store.getState());
  assert.equal(resultToUnit, undefined);
  const resultMorgue = Selector.morgue(2, store.getState());
  assert.ok(resultMorgue);
  assert.equal(resultMorgue.length, 1);
  assert.equal(resultMorgue.join(), victimCoinId);
});

QUnit.test("execute() Light Cavalry", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const paymentCoinId = 20; // Light Cavalry
  store.dispatch(ActionCreator.addToPlayerArray("playerToHand", playerId, paymentCoinId));
  const an1 = "e2"; // Raven control location.
  const an2 = "e4";
  store.dispatch(ActionCreator.setUnit(an1, 16)); // Light Cavalry
  const moveKey = Move.TACTIC;
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, an1, an2 });

  // Run.
  Tactic[UnitCoin.LIGHT_CAVALRY].execute(moveState, store);

  // Verify.
  const resultHand = Selector.hand(playerId, store.getState());
  assert.ok(resultHand);
  assert.equal(resultHand.length, 3);
  const resultFromUnit = Selector.unit(an1, store.getState());
  assert.equal(resultFromUnit, undefined);
  const resultToUnit = Selector.unit(an2, store.getState());
  assert.ok(resultToUnit);
  assert.equal(resultToUnit.join(""), 16);
});

QUnit.test("execute() Royal Guard", assert => {
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
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, an1, an2 });

  // Run.
  Tactic[UnitCoin.ROYAL_GUARD].execute(moveState, store);

  // Verify.
  const resultHand = Selector.hand(playerId, store.getState());
  assert.ok(resultHand);
  assert.equal(resultHand.length, 3);
  const resultFromUnit = Selector.unit(an1, store.getState());
  assert.equal(resultFromUnit, undefined);
  const resultToUnit = Selector.unit(an2, store.getState());
  assert.ok(resultToUnit);
  assert.equal(resultToUnit.join(""), 39);
});

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
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, an1, an2, victimCoinId });
  const tactic = Tactic[UnitCoin.ARCHER];

  // Run.
  const result = tactic.label(moveState, store.getState());

  // Verify.
  assert.equal(result, "Tactic: Archer at e2 attacks Swordsman at e4");
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
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, an1, an2, victimCoinId });
  const tactic = Tactic[UnitCoin.CROSSBOWMAN];

  // Run.
  const result = tactic.label(moveState, store.getState());

  // Verify.
  assert.equal(result, "Tactic: Crossbowman at e2 attacks Archer at e4");
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
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, an1, an2 });
  const tactic = Tactic[UnitCoin.LIGHT_CAVALRY];

  // Run.
  const result = tactic.label(moveState, store.getState());

  // Verify.
  assert.equal(result, "Tactic: Light Cavalry at e2 moves to e4");
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
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, an1, an2 });
  const tactic = Tactic[UnitCoin.ROYAL_GUARD];

  // Run.
  const result = tactic.label(moveState, store.getState());

  // Verify.
  assert.equal(result, "Tactic: Royal Guard at e2 moves to e3");
});

const TacticTest = {};
export default TacticTest;