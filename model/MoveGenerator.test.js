import Move from "../artifact/Move.js";

import ActionCreator from "../state/ActionCreator.js";
import Selector from "../state/Selector.js";

import MoveGenerator from "./MoveGenerator.js";
import TestData from "./TestData.js";

QUnit.module("MoveGenerator");

// const logDebug = store => {
//   console.log(`coinInstances = ${JSON.stringify(store.getState().coinInstances, null, 2)}`);
//   console.log(`tableau1 = ${JSON.stringify(Selector.tableau(1, store.getState()))}`);
//   console.log(`hand1 = ${JSON.stringify(Selector.hand(1, store.getState()))}`);
//   console.log(`tableau2 = ${JSON.stringify(Selector.tableau(2, store.getState()))}`);
//   console.log(`hand2 = ${JSON.stringify(Selector.hand(2, store.getState()))}`);
// };

const verifyMoveState = (
  assert,
  moveState,
  moveKey,
  playerId,
  paymentCoinId,
  an,
  recruitCoinId,
  toAN,
  victimCoinId
) => {
  assert.ok(moveState);
  assert.equal(moveState.moveKey, moveKey, "moveKey");
  assert.equal(moveState.playerId, playerId, "playerId");
  assert.equal(moveState.paymentCoinId, paymentCoinId, "paymentCoinId");
  assert.equal(moveState.an, an, "an");
  assert.equal(moveState.recruitCoinId, recruitCoinId, "recruitCoinId");
  assert.equal(moveState.toAN, toAN, "toAN");
  assert.equal(moveState.victimCoinId, victimCoinId, "victimCoinId");
};

QUnit.test("generate()", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());

  // Run.
  const result = MoveGenerator.generate(player, store.getState());

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 19, `result.length=${result.length}`);
  const move0 = result[0];
  verifyMoveState(
    assert,
    move0,
    Move.RECRUIT,
    1, // playerId
    10, // paymentCoinId
    undefined, // an
    2 // recruitCoinId
  );
  const moveLast = result[result.length - 1];
  verifyMoveState(assert, moveLast, Move.PASS, 1, 1);
});

QUnit.test("generateAttacks()", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const an = "e2";
  const toAN1 = "d3";
  const toAN2 = "e3";
  const toAN3 = "f2";
  store.dispatch(ActionCreator.setUnit(an, 2)); // Swordsman
  store.dispatch(ActionCreator.setUnit(toAN1, 22)); // Archer
  store.dispatch(ActionCreator.setUnit(toAN2, 26)); // Cavalry
  store.dispatch(ActionCreator.setUnit(toAN3, 30)); // Lancer
  const paymentCoinId = 6; // Swordsman
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());

  // Run.
  const result = MoveGenerator.generateAttacks(player, paymentCoin, store.getState());

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 3, `result.length=${result.length}`);
  const move0 = result[0];
  verifyMoveState(
    assert,
    move0,
    Move.ATTACK,
    playerId,
    paymentCoinId,
    an,
    undefined, // recruitCoinId
    toAN1,
    22 // victimCoinId
  );
  const moveLast = result[result.length - 1];
  verifyMoveState(
    assert,
    moveLast,
    Move.ATTACK,
    playerId,
    paymentCoinId,
    an,
    undefined, // recruitCoinId
    toAN3,
    30 // victimCoinId
  );
});

QUnit.test("generateBolsters()", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const an = "e2";
  store.dispatch(ActionCreator.setUnit(an, 2)); // Swordsman
  const paymentCoinId = 6; // Swordsman
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());

  // Run.
  const result = MoveGenerator.generateBolsters(player, paymentCoin, store.getState());

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 1, `result.length=${result.length}`);
  const move0 = result[0];
  verifyMoveState(assert, move0, Move.BOLSTER, playerId, paymentCoinId, "e2");
});

QUnit.test("generateClaimInitiatives()", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 2;
  const player = Selector.player(playerId, store.getState());
  const paymentCoinId = 25; // Archer.
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());

  // Run.
  const result = MoveGenerator.generateClaimInitiatives(player, paymentCoin, store.getState());

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 1, `result.length=${result.length}`);
  const move0 = result[0];
  verifyMoveState(assert, move0, Move.CLAIM_INITIATIVE, playerId, paymentCoinId);
});

QUnit.test("generateControls()", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const an1 = "d4";
  store.dispatch(ActionCreator.setUnit(an1, 2)); // Swordsman
  const paymentCoinId = 6; // Swordsman
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());

  // Run.
  const result = MoveGenerator.generateControls(player, paymentCoin, store.getState());

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 1, `result.length=${result.length}`);
  const move0 = result[0];
  verifyMoveState(assert, move0, Move.CONTROL, playerId, paymentCoinId, an1);
});

QUnit.test("generateDeploys()", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const paymentCoinId = 6; // Swordsman
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());

  // Run.
  const result = MoveGenerator.generateDeploys(player, paymentCoin, store.getState());

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 2, `result.length=${result.length}`);
  const move0 = result[0];
  verifyMoveState(assert, move0, Move.DEPLOY, playerId, paymentCoinId, "e2");
  const moveLast = result[result.length - 1];
  verifyMoveState(assert, moveLast, Move.DEPLOY, playerId, paymentCoinId, "h1");
});

QUnit.test("generateDeploys() Scout", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 2;
  const player = Selector.player(playerId, store.getState());
  store.dispatch(ActionCreator.setUnit("d6", 22)); // Archer
  store.dispatch(
    ActionCreator.transferBetweenPlayerArrays("playerToSupply", "playerToHand", playerId, 38)
  );
  const paymentCoinId = 38; // Scout
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());

  // Run.
  const result = MoveGenerator.generateDeploys(player, paymentCoin, store.getState());

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 7, `result.length=${result.length}`);
  const move0 = result[0];
  verifyMoveState(assert, move0, Move.DEPLOY, playerId, paymentCoinId, "d7");
  const moveLast = result[result.length - 1];
  verifyMoveState(assert, moveLast, Move.DEPLOY, playerId, paymentCoinId, "e6");
});

QUnit.test("generateForCoin()", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinId = hand[0];
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());

  // Run.
  const result = MoveGenerator.generateForCoin(player, paymentCoin, store.getState());

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 5, `result.length=${result.length}`);
  const move0 = result[0];
  verifyMoveState(
    assert,
    move0,
    Move.RECRUIT,
    1, // playerId
    1, // paymentCoinId
    undefined, // an
    2 // recruitCoinId
  );
  const moveLast = result[result.length - 1];
  verifyMoveState(assert, moveLast, Move.PASS, 1, 1);
});

QUnit.test("generateForCoin() Scout", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 2;
  const player = Selector.player(playerId, store.getState());
  const paymentCoinId = 34; // Scout.
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());
  store.dispatch(ActionCreator.addToPlayerArray("playerToHand", playerId, paymentCoinId));
  store.dispatch(ActionCreator.setUnit("e2", 22)); // Archer.

  // Run.
  const result = MoveGenerator.generateForCoin(player, paymentCoin, store.getState());

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 12, `result.length=${result.length}`);
  const move0 = result[0];
  verifyMoveState(assert, move0, Move.CLAIM_INITIATIVE, playerId, paymentCoinId);
  const moveLast = result[result.length - 1];
  verifyMoveState(assert, moveLast, Move.DEPLOY, playerId, paymentCoinId, "f2");
});

QUnit.test("generateManeuvers()", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const an = "e2";
  const toAN1 = "d3";
  const toAN2 = "e3";
  const toAN3 = "f2";
  store.dispatch(ActionCreator.setUnit(an, 2)); // Swordsman
  store.dispatch(ActionCreator.setUnit(toAN1, 22)); // Archer
  store.dispatch(ActionCreator.setUnit(toAN2, 26)); // Cavalry
  store.dispatch(ActionCreator.setUnit(toAN3, 30)); // Lancer
  const paymentCoinId = 6; // Swordsman
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());

  // Run.
  const result = MoveGenerator.generateManeuvers(player, paymentCoin, store.getState());

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 4, `result.length=${result.length}`);
  const move0 = result[0];
  verifyMoveState(
    assert,
    move0,
    Move.MOVE_A_UNIT,
    playerId,
    paymentCoinId,
    an,
    undefined, // recruitCoinId
    "f1"
  );
  const moveLast = result[result.length - 1];
  verifyMoveState(
    assert,
    moveLast,
    Move.ATTACK,
    playerId,
    paymentCoinId,
    an,
    undefined, // recruitCoinId
    toAN3,
    30 // victimCoinId
  );
});

QUnit.test("generateMoveAUnits()", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const an = "e2";
  store.dispatch(ActionCreator.setUnit(an, 2)); // Swordsman
  const paymentCoinId = 6; // Swordsman
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());

  // Run.
  const result = MoveGenerator.generateMoveAUnits(player, paymentCoin, store.getState());

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 4, `result.length=${result.length}`);
  const move0 = result[0];
  verifyMoveState(
    assert,
    move0,
    Move.MOVE_A_UNIT,
    playerId,
    paymentCoinId,
    an,
    undefined, // recruitCoinId
    "d3"
  );
  const moveLast = result[result.length - 1];
  verifyMoveState(
    assert,
    moveLast,
    Move.MOVE_A_UNIT,
    playerId,
    paymentCoinId,
    an,
    undefined, // recruitCoinId
    "f2"
  );
});

QUnit.test("generateMoveAUnits() four player", assert => {
  // Setup.
  const isTwoPlayer = false;
  const store = TestData.createStore(isTwoPlayer);
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const an = "b5";
  store.dispatch(ActionCreator.setUnit(an, 2)); // Swordsman
  const paymentCoinId = 6; // Swordsman
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());

  // Run.
  const result = MoveGenerator.generateMoveAUnits(player, paymentCoin, store.getState());

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 4, `result.length=${result.length}`);
  const move0 = result[0];
  verifyMoveState(
    assert,
    move0,
    Move.MOVE_A_UNIT,
    playerId,
    paymentCoinId,
    an,
    undefined, // recruitCoinId
    "a6"
  );
  const moveLast = result[result.length - 1];
  verifyMoveState(
    assert,
    moveLast,
    Move.MOVE_A_UNIT,
    playerId,
    paymentCoinId,
    an,
    undefined, // recruitCoinId
    "c5"
  );
});

QUnit.test("generatePasses()", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 2;
  const player = Selector.player(playerId, store.getState());
  const paymentCoinId = 25; // Archer.
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());

  // Run.
  const result = MoveGenerator.generatePasses(player, paymentCoin, store.getState());

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 1, `result.length=${result.length}`);
  const move0 = result[0];
  verifyMoveState(assert, move0, Move.PASS, playerId, paymentCoinId);
});

QUnit.test("generateRecruits()", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const paymentCoinId = 6; // Swordsman
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());

  // Run.
  const result = MoveGenerator.generateRecruits(player, paymentCoin, store.getState());

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 4, `result.length=${result.length}`);
  const move0 = result[0];
  verifyMoveState(
    assert,
    move0,
    Move.RECRUIT,
    playerId,
    paymentCoinId,
    undefined, // an,
    2 // recruitCoinId
  );
  const moveLast = result[result.length - 1];
  verifyMoveState(
    assert,
    moveLast,
    Move.RECRUIT,
    playerId,
    paymentCoinId,
    undefined, // an,
    16 // recruitCoinId
  );
});

QUnit.test("generateTactics() Archer", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 2;
  const player = Selector.player(playerId, store.getState());
  const paymentCoinId = 25; // Archer
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());
  store.dispatch(ActionCreator.setUnit("e2", 22)); // Archer
  store.dispatch(ActionCreator.setUnit("e4", 2)); // Swordsman

  // Run.
  const result = MoveGenerator.generateTactics(player, paymentCoin, store.getState());

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 1, `result.length=${result.length}`);
  const move0 = result[0];
  verifyMoveState(
    assert,
    move0,
    Move.TACTIC,
    playerId,
    paymentCoinId,
    "e2", // an,
    undefined, // recruitCoinId
    "e4", // toAN,
    2 // victimCoinId
  );
});

QUnit.test("generateTactics() Light Cavalry", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const paymentCoinId = 20; // Light Cavalry
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());
  store.dispatch(ActionCreator.setUnit("h1", 16)); // Light Cavalry

  // Run.
  const result = MoveGenerator.generateTactics(player, paymentCoin, store.getState());

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 6, `result.length=${result.length}`);
  const move0 = result[0];
  verifyMoveState(
    assert,
    move0,
    Move.TACTIC,
    playerId,
    paymentCoinId,
    "h1", // an,
    undefined, // recruitCoinId
    "f1" // toAN
  );
  const moveLast = result[result.length - 1];
  verifyMoveState(
    assert,
    moveLast,
    Move.TACTIC,
    playerId,
    paymentCoinId,
    "h1", // an,
    undefined, // recruitCoinId
    "i2" // toAN
  );
});

const MoveGeneratorTest = {};
export default MoveGeneratorTest;
