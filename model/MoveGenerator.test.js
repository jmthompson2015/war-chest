import Move from "../artifact/Move.js";
import UnitCard from "../artifact/UnitCard.js";
import UnitCoin from "../artifact/UnitCoin.js";

import ActionCreator from "../state/ActionCreator.js";
import CoinState from "../state/CoinState.js";
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
  an1,
  an2,
  an3,
  recruitCoinId,
  victimCoinId
) => {
  assert.ok(moveState);
  assert.equal(moveState.moveKey, moveKey, "moveKey");
  assert.equal(moveState.playerId, playerId, "playerId");
  assert.equal(moveState.paymentCoinId, paymentCoinId, "paymentCoinId");
  assert.equal(moveState.an1, an1, "an1");
  assert.equal(moveState.an2, an2, "an2");
  assert.equal(moveState.an3, an3, "an3");
  assert.equal(moveState.recruitCoinId, recruitCoinId, "recruitCoinId");
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
    undefined, // an1
    undefined, // an2
    undefined, // an3
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
  const an1 = "e2";
  const an21 = "d3";
  const an22 = "e3";
  const an23 = "f2";
  store.dispatch(ActionCreator.setUnit(an1, 2)); // Swordsman
  store.dispatch(ActionCreator.setUnit(an21, 22)); // Archer
  store.dispatch(ActionCreator.setUnit(an22, 26)); // Cavalry
  store.dispatch(ActionCreator.setUnit(an23, 30)); // Lancer
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
    an1,
    an21,
    undefined, // an3
    undefined, // recruitCoinId
    22 // victimCoinId
  );
  const moveLast = result[result.length - 1];
  verifyMoveState(
    assert,
    moveLast,
    Move.ATTACK,
    playerId,
    paymentCoinId,
    an1,
    an23,
    undefined, // an3
    undefined, // recruitCoinId
    30 // victimCoinId
  );
});

QUnit.test("generateBolsters()", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const an1 = "e2";
  store.dispatch(ActionCreator.setUnit(an1, 2)); // Swordsman
  const paymentCoinId = 6; // Swordsman
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());

  // Run.
  const result = MoveGenerator.generateBolsters(player, paymentCoin, store.getState());

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 1, `result.length=${result.length}`);
  const move0 = result[0];
  verifyMoveState(assert, move0, Move.BOLSTER, playerId, paymentCoinId, an1);
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
    undefined, // an1
    undefined, // an2
    undefined, // an3
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
  const an1 = "e2";
  const an21 = "d3";
  const an22 = "e3";
  const an23 = "f2";
  store.dispatch(ActionCreator.setUnit(an1, 2)); // Swordsman
  store.dispatch(ActionCreator.setUnit(an21, 22)); // Archer
  store.dispatch(ActionCreator.setUnit(an22, 26)); // Cavalry
  store.dispatch(ActionCreator.setUnit(an23, 30)); // Lancer
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
    an1,
    "f1", // an2
    undefined, // an3
    undefined // recruitCoinId
  );
  const moveLast = result[result.length - 1];
  verifyMoveState(
    assert,
    moveLast,
    Move.ATTACK,
    playerId,
    paymentCoinId,
    an1,
    an23, // an2
    undefined, // an3
    undefined, // recruitCoinId
    30 // victimCoinId
  );
});

QUnit.test("generateMoveAUnits()", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const an1 = "e2";
  store.dispatch(ActionCreator.setUnit(an1, 2)); // Swordsman
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
    an1,
    "d3", // an2
    undefined, // an3
    undefined // recruitCoinId
  );
  const moveLast = result[result.length - 1];
  verifyMoveState(
    assert,
    moveLast,
    Move.MOVE_A_UNIT,
    playerId,
    paymentCoinId,
    an1,
    "f2", // an2
    undefined, // an3
    undefined // recruitCoinId
  );
});

QUnit.test("generateMoveAUnits() four player", assert => {
  // Setup.
  const isTwoPlayer = false;
  const store = TestData.createStore(isTwoPlayer);
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const an1 = "b5";
  store.dispatch(ActionCreator.setUnit(an1, 2)); // Swordsman
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
    an1,
    "a6" // an2
  );
  const moveLast = result[result.length - 1];
  verifyMoveState(
    assert,
    moveLast,
    Move.MOVE_A_UNIT,
    playerId,
    paymentCoinId,
    an1,
    "c5" // an2
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
    undefined, // an1,
    undefined, // an2,
    undefined, // an3,
    2 // recruitCoinId
  );
  const moveLast = result[result.length - 1];
  verifyMoveState(
    assert,
    moveLast,
    Move.RECRUIT,
    playerId,
    paymentCoinId,
    undefined, // an1,
    undefined, // an2,
    undefined, // an3,
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
    "e2" // an1
  );
  assert.equal(move0.moveStates.length, 1);
  verifyMoveState(
    assert,
    move0.moveStates[0],
    Move.ATTACK,
    playerId,
    paymentCoinId,
    "e2", // an1
    "e4", // an2
    undefined, // an3
    undefined, // recruitCoinId
    2 // victimCoinId
  );
});

QUnit.test("generateTactics() Cavalry", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 2;
  const player = Selector.player(playerId, store.getState());
  const paymentCoinId = 29; // Cavalry
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());
  const an1 = "e2";
  const an3 = "e4";
  store.dispatch(ActionCreator.setUnit(an1, 26)); // Cavalry
  store.dispatch(ActionCreator.setUnit(an3, 2)); // Swordsman

  // Run.
  const result = MoveGenerator.generateTactics(player, paymentCoin, store.getState());

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 1, `result.length=${result.length}`);
  const move0 = result[0];
  verifyMoveState(assert, move0, Move.TACTIC, playerId, paymentCoinId, an1);
  const { moveStates } = move0;
  assert.ok(moveStates, `moveStates = ${JSON.stringify(moveStates)}`);
  assert.equal(Array.isArray(moveStates), true);
  assert.equal(moveStates.length, 2, `moveStates.length = ${moveStates.length}`);
  const moveState0 = moveStates[0];
  assert.ok(moveState0, `moveState0 = ${JSON.stringify(moveState0)}`);
  assert.equal(moveState0.moveKey, Move.MOVE_A_UNIT);
  const moveStateLast = moveStates[moveStates.length - 1];
  assert.ok(moveStateLast, `moveStateLast = ${JSON.stringify(moveStateLast)}`);
  assert.equal(moveStateLast.moveKey, Move.ATTACK);
});

QUnit.test("generateTactics() Crossbowman", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const paymentCoinId = 15; // Crossbowman
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());
  store.dispatch(ActionCreator.setUnit("e2", 11)); // Crossbowman
  store.dispatch(ActionCreator.setUnit("e4", 22)); // Archer

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
    "e2" // an1
  );
  assert.equal(move0.moveStates.length, 1);
  verifyMoveState(
    assert,
    move0.moveStates[0],
    Move.ATTACK,
    playerId,
    paymentCoinId,
    "e2", // an1
    "e4", // an2
    undefined, // an3
    undefined, // recruitCoinId
    22 // victimCoinId
  );
});

QUnit.test("generateTactics() Lancer", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 2;
  const player = Selector.player(playerId, store.getState());
  const paymentCoinId = 33; // Lancer
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());
  store.dispatch(
    ActionCreator.transferBetweenPlayerArrays(
      "playerToSupply",
      "playerToHand",
      playerId,
      paymentCoinId
    )
  );
  const an1 = "e2";
  store.dispatch(ActionCreator.setUnit(an1, 30)); // Lancer
  store.dispatch(ActionCreator.setUnit("e5", 2)); // Swordsman
  store.dispatch(ActionCreator.setUnit("f4", 3)); // Swordsman
  store.dispatch(ActionCreator.setUnit("g2", 4)); // Swordsman

  // Run.
  const result = MoveGenerator.generateTactics(player, paymentCoin, store.getState());

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 2, `result.length=${result.length}`);
  const move0 = result[0];
  verifyMoveState(assert, move0, Move.TACTIC, playerId, paymentCoinId, an1);
  const { moveStates: moveStates0 } = move0;
  assert.ok(moveStates0, `moveStates0 = ${JSON.stringify(moveStates0)}`);
  assert.equal(Array.isArray(moveStates0), true);
  assert.equal(moveStates0.length, 2, `moveStates0.length = ${moveStates0.length}`);
  const moveState00 = moveStates0[0];
  assert.ok(moveState00, `moveState0 = ${JSON.stringify(moveState00)}`);
  assert.equal(moveState00.moveKey, Move.MOVE_A_UNIT);
  assert.equal(moveState00.an2, "f2");
  const moveState0Last = moveStates0[moveStates0.length - 1];
  assert.ok(moveState0Last, `moveStateLast = ${JSON.stringify(moveState0Last)}`);
  assert.equal(moveState0Last.moveKey, Move.ATTACK);
  assert.equal(moveState0Last.an2, "g2");

  const move1 = result[1];
  verifyMoveState(assert, move0, Move.TACTIC, playerId, paymentCoinId, an1);
  const { moveStates: moveStates1 } = move1;
  assert.ok(moveStates1, `moveStates1 = ${JSON.stringify(moveStates1)}`);
  assert.equal(Array.isArray(moveStates1), true);
  assert.equal(moveStates1.length, 2, `moveStates1.length = ${moveStates1.length}`);
  const moveState10 = moveStates1[0];
  assert.ok(moveState10, `moveState10 = ${JSON.stringify(moveState10)}`);
  assert.equal(moveState10.moveKey, Move.MOVE_A_UNIT);
  assert.equal(moveState10.an2, "e4");
  const moveState1Last = moveStates1[moveStates1.length - 1];
  assert.ok(moveState1Last, `moveState1Last = ${JSON.stringify(moveState1Last)}`);
  assert.equal(moveState1Last.moveKey, Move.ATTACK);
  assert.equal(moveState1Last.an2, "e5");
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
    "h1" // an1
  );
  assert.equal(move0.moveStates.length, 1);
  verifyMoveState(
    assert,
    move0.moveStates[0],
    Move.MOVE_A_UNIT,
    playerId,
    paymentCoinId,
    "h1", // an1
    "f1" // an2
  );
  const moveLast = result[result.length - 1];
  verifyMoveState(
    assert,
    moveLast,
    Move.TACTIC,
    playerId,
    paymentCoinId,
    "h1" // an1,
  );
  assert.equal(moveLast.moveStates.length, 1);
  verifyMoveState(
    assert,
    moveLast.moveStates[0],
    Move.MOVE_A_UNIT,
    playerId,
    paymentCoinId,
    "h1", // an1,
    "i2" // an2
  );
});

QUnit.test("generateTactics() Royal Guard", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  store.dispatch(ActionCreator.addToPlayerArray("playerToTableau", playerId, UnitCard.ROYAL_GUARD));
  const coinState1 = CoinState.create({ coinKey: UnitCoin.ROYAL_GUARD, store });
  store.dispatch(ActionCreator.addCoin(coinState1));
  const paymentCoinId = 1; // Raven Royal Coin
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());
  store.dispatch(ActionCreator.setUnit("h1", coinState1.id)); // Royal Guard

  // Run.
  const result = MoveGenerator.generateTactics(player, paymentCoin, store.getState());

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 4, `result.length=${result.length}`);
  const move0 = result[0];
  verifyMoveState(
    assert,
    move0,
    Move.TACTIC,
    playerId,
    paymentCoinId,
    "h1" // an1
  );
  assert.equal(move0.moveStates.length, 1);
  verifyMoveState(
    assert,
    move0.moveStates[0],
    Move.MOVE_A_UNIT,
    playerId,
    paymentCoinId,
    "h1", // an1
    "g1" // an2
  );
  const moveLast = result[result.length - 1];
  verifyMoveState(
    assert,
    moveLast,
    Move.TACTIC,
    playerId,
    paymentCoinId,
    "h1" // an1,
  );
  assert.equal(moveLast.moveStates.length, 1);
  verifyMoveState(
    assert,
    moveLast.moveStates[0],
    Move.MOVE_A_UNIT,
    playerId,
    paymentCoinId,
    "h1", // an1,
    "i1" // an2
  );
});

const MoveGeneratorTest = {};
export default MoveGeneratorTest;
