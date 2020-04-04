import ArrayUtils from "../util/ArrayUtilities.js";

import Move from "../artifact/Move.js";
import Resolver from "../artifact/Resolver.js";
import UnitCard from "../artifact/UnitCard.js";
import UnitCoin from "../artifact/UnitCoin.js";

import ActionCreator from "../state/ActionCreator.js";
import CoinState from "../state/CoinState.js";
import MoveState from "../state/MoveState.js";
import Selector from "../state/Selector.js";

import MoveFunction from "./MoveFunction.js";
import TestData from "./TestData.js";

// const logDebug = store => {
//   console.log(`coinInstances = ${JSON.stringify(store.getState().coinInstances, null, 2)}`);
//   console.log(`tableau1 = ${JSON.stringify(Selector.tableau(1, store.getState()))}`);
//   console.log(`hand1 = ${JSON.stringify(Selector.hand(1, store.getState()))}`);
//   console.log(`tableau2 = ${JSON.stringify(Selector.tableau(2, store.getState()))}`);
//   console.log(`hand2 = ${JSON.stringify(Selector.hand(2, store.getState()))}`);
// };

QUnit.module("MoveFunction");

const randomUnitCoinState = (array, state) => {
  let coinState;

  do {
    const randomCoinId = ArrayUtils.randomElement(array);
    coinState = Selector.coin(randomCoinId, state);
  } while (!Resolver.isUnitCoin(coinState.coinKey));

  return coinState;
};

QUnit.test("attack execute()", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinId = hand[1];
  const hand2 = Selector.hand(2, store.getState());
  const victimCoinId = hand2[1];
  const an1 = "e2"; // Raven control location.
  const an2 = "f2";
  store.dispatch(ActionCreator.setUnit(an1, paymentCoinId));
  store.dispatch(ActionCreator.setUnit(an2, victimCoinId));
  const moveKey = Move.ATTACK;
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, an1, an2, victimCoinId });

  // Run.
  MoveFunction[moveKey].execute(moveState, store);

  // Verify.
  const resultHand = Selector.hand(playerId, store.getState());
  assert.ok(resultHand);
  assert.equal(resultHand.length, 2);
  const resultFromUnit = Selector.unit(an1, store.getState());
  assert.ok(resultFromUnit);
  assert.equal(resultFromUnit.join(), paymentCoinId);
  const resultToUnit = Selector.unit(an2, store.getState());
  assert.equal(resultToUnit, undefined);
  const resultMorgue = Selector.morgue(2, store.getState());
  assert.ok(resultMorgue);
  assert.equal(resultMorgue.length, 1);
  assert.equal(resultMorgue.join(), victimCoinId);
});

QUnit.test("attack execute() Pikeman", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 2;
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinId = hand[1];
  const victimCoinId = 7; // Pikeman
  const an1 = "e2"; // Raven control location.
  const an2 = "f2";
  store.dispatch(ActionCreator.setUnit(an1, paymentCoinId));
  store.dispatch(ActionCreator.setUnit(an2, victimCoinId));
  const moveKey = Move.ATTACK;
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, an1, an2, victimCoinId });

  // Run.
  MoveFunction[moveKey].execute(moveState, store);

  // Verify.
  const resultHand = Selector.hand(playerId, store.getState());
  assert.ok(resultHand);
  assert.equal(resultHand.length, 2);
  const resultFromUnit = Selector.unit(an1, store.getState());
  assert.equal(resultFromUnit, undefined);
  const resultToUnit = Selector.unit(an2, store.getState());
  assert.equal(resultToUnit, undefined);
  const resultMorgue1 = Selector.morgue(1, store.getState());
  assert.ok(resultMorgue1);
  assert.equal(resultMorgue1.length, 1);
  assert.equal(resultMorgue1.join(), victimCoinId);
  const resultMorgue2 = Selector.morgue(2, store.getState());
  assert.ok(resultMorgue2);
  assert.equal(resultMorgue2.length, 1);
  assert.equal(resultMorgue2.join(), paymentCoinId);
});

QUnit.test("attack isLegal() true", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoin = randomUnitCoinState(hand, store.getState());
  const hand2 = Selector.hand(2, store.getState());
  const victimCoin = randomUnitCoinState(hand2, store.getState());
  const an1 = "e2"; // Raven control location.
  const an2 = "f2";
  store.dispatch(ActionCreator.setUnit(an1, paymentCoin.id));
  store.dispatch(ActionCreator.setUnit(an2, victimCoin.id));
  const move = MoveFunction[Move.ATTACK];

  // Run.
  const result = move.isLegal(player, paymentCoin, an1, an2, store.getState());

  // Verify.
  assert.equal(result, true);
});

QUnit.test("attack isLegal() Archer false", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 2;
  const player = Selector.player(playerId, store.getState());
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoin = Selector.coin(hand[1], store.getState());
  const hand2 = Selector.hand(2, store.getState());
  const victimCoin = randomUnitCoinState(hand2, store.getState());
  const an1 = "e2"; // Raven control location.
  const an2 = "f2";
  store.dispatch(ActionCreator.setUnit(an1, paymentCoin.id));
  store.dispatch(ActionCreator.setUnit(an2, victimCoin.id));
  const move = MoveFunction[Move.ATTACK];

  // Run.
  const result = move.isLegal(player, paymentCoin, an1, an2, store.getState());

  // Verify.
  assert.equal(result, false);
});

QUnit.test("bolster execute()", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoin = randomUnitCoinState(hand, store.getState());
  const an1 = "e2"; // Raven control location.
  store.dispatch(ActionCreator.setUnit(an1, paymentCoin.id));
  const moveKey = Move.BOLSTER;
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId: paymentCoin.id, an1 });

  // Run.
  MoveFunction[moveKey].execute(moveState, store);

  // Verify.
  const resultHand = Selector.hand(playerId, store.getState());
  assert.ok(resultHand);
  assert.equal(resultHand.length, 2);
  const resultUnit = Selector.unit(an1, store.getState());
  assert.ok(resultUnit);
  assert.equal(Array.isArray(resultUnit), true);
  assert.equal(resultUnit.length, 2);
  assert.equal(resultUnit[0], paymentCoin.id);
  assert.equal(resultUnit[1], paymentCoin.id);
});

QUnit.test("bolster isLegal() true", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoin = randomUnitCoinState(hand, store.getState());
  const an1 = "e2"; // Raven control location.
  store.dispatch(ActionCreator.setUnit(an1, paymentCoin.id));
  const move = MoveFunction[Move.BOLSTER];

  // Run.
  const result = move.isLegal(player, paymentCoin, an1, store.getState());

  // Verify.
  assert.equal(result, true);
});

QUnit.test("claimInitiative execute()", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  store.dispatch(ActionCreator.setInitiativePlayer(2));
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoin = randomUnitCoinState(hand, store.getState());
  const moveKey = Move.CLAIM_INITIATIVE;
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId: paymentCoin.id });

  // Run.
  MoveFunction[moveKey].execute(moveState, store);

  // Verify.
  const resultHand = Selector.hand(playerId, store.getState());
  assert.ok(resultHand);
  assert.equal(resultHand.length, 2);
  assert.equal(Selector.initiativePlayer(store.getState()).id, playerId);
  assert.equal(Selector.initiativeChangedThisRound(store.getState()), true);
});

QUnit.test("claimInitiative isLegal() true", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  store.dispatch(ActionCreator.setInitiativePlayer(2));
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinId = ArrayUtils.randomElement(hand);
  const paymentCoinState = Selector.coin(paymentCoinId, store.getState());
  const move = MoveFunction[Move.CLAIM_INITIATIVE];

  // Run.
  const result = move.isLegal(player, paymentCoinState, store.getState());

  // Verify.
  assert.equal(result, true);
});

QUnit.test("control execute()", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoin = randomUnitCoinState(hand, store.getState());
  const an1 = "e5"; // Neutral control location.
  store.dispatch(ActionCreator.setUnit(an1, paymentCoin.id));
  const moveKey = Move.CONTROL;
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId: paymentCoin.id, an1 });

  // Run.
  MoveFunction[moveKey].execute(moveState, store);

  // Verify.
  const resultHand = Selector.hand(playerId, store.getState());
  assert.ok(resultHand);
  assert.equal(resultHand.length, 2);
  const resultControlKey = Selector.control(an1, store.getState());
  assert.ok(resultControlKey);
  assert.equal(resultControlKey, player.teamKey);
});

QUnit.test("control isLegal() true", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoin = randomUnitCoinState(hand, store.getState());
  const an1 = "e5"; // Neutral control location.
  store.dispatch(ActionCreator.setUnit(an1, paymentCoin.id));
  const move = MoveFunction[Move.CONTROL];

  // Run.
  const result = move.isLegal(player, paymentCoin, an1, store.getState());

  // Verify.
  assert.equal(result, true);
});

QUnit.test("deploy execute()", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoin = randomUnitCoinState(hand, store.getState());
  const an1 = "e2"; // Raven control location.
  const moveKey = Move.DEPLOY;
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId: paymentCoin.id, an1 });

  // Run.
  MoveFunction[moveKey].execute(moveState, store);

  // Verify.
  const resultHand = Selector.hand(playerId, store.getState());
  assert.ok(resultHand);
  assert.equal(resultHand.length, 2);
  const resultUnit = Selector.unit(an1, store.getState());
  assert.ok(resultUnit);
  assert.equal(Array.isArray(resultUnit), true);
  assert.equal(resultUnit.length, 1);
  assert.equal(resultUnit[0], paymentCoin.id);
});

QUnit.test("deploy isLegal() true", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoin = randomUnitCoinState(hand, store.getState());
  const an1 = "e2"; // Raven control location.
  const move = MoveFunction[Move.DEPLOY];

  // Run.
  const result = move.isLegal(player, paymentCoin, an1, store.getState());

  // Verify.
  assert.equal(result, true);
});

QUnit.test("moveAUnit execute()", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoin = randomUnitCoinState(hand, store.getState());
  const an1 = "e2"; // Raven control location.
  const an2 = "f2";
  store.dispatch(ActionCreator.setUnit(an1, paymentCoin.id));
  const moveKey = Move.MOVE_A_UNIT;
  const moveState = MoveState.create({
    moveKey,
    playerId,
    paymentCoinId: paymentCoin.id,
    an1,
    an2
  });

  // Run.
  MoveFunction[moveKey].execute(moveState, store);

  // Verify.
  const resultHand = Selector.hand(playerId, store.getState());
  assert.ok(resultHand);
  assert.equal(resultHand.length, 2);
  const resultFromUnit = Selector.unit(an1, store.getState());
  assert.equal(resultFromUnit, undefined);
  const resultToUnit = Selector.unit(an2, store.getState());
  assert.ok(resultToUnit);
  assert.equal(resultToUnit.join(""), paymentCoin.id);
});

QUnit.test("moveAUnit isLegal() true", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoin = randomUnitCoinState(hand, store.getState());
  const an1 = "e2"; // Raven control location.
  const an2 = "f2";
  store.dispatch(ActionCreator.setUnit(an1, paymentCoin.id));
  const move = MoveFunction[Move.MOVE_A_UNIT];

  // Run.
  const result = move.isLegal(player, paymentCoin, an1, an2, store.getState());

  // Verify.
  assert.equal(result, true);
});

QUnit.test("pass execute()", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinId = ArrayUtils.randomElement(hand);
  const moveKey = Move.PASS;
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId });

  // Run.
  MoveFunction[moveKey].execute(moveState, store);

  // Verify.
  const resultHand = Selector.hand(playerId, store.getState());
  assert.ok(resultHand);
  assert.equal(resultHand.length, 2);
});

QUnit.test("pass isLegal() true", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinId = ArrayUtils.randomElement(hand);
  const paymentCoinState = Selector.coin(paymentCoinId, store.getState());
  const move = MoveFunction[Move.PASS];

  // Run.
  const result = move.isLegal(player, paymentCoinState, store.getState());

  // Verify.
  assert.equal(result, true);
});

QUnit.test("recruit execute()", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  store.dispatch(ActionCreator.setInitiativePlayer(2));
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinId = ArrayUtils.randomElement(hand);
  const supply = Selector.hand(playerId, store.getState());
  const recruitCoin = randomUnitCoinState(supply, store.getState());
  const moveKey = Move.RECRUIT;
  const moveState = MoveState.create({
    moveKey,
    playerId,
    paymentCoinId,
    recruitCoinId: recruitCoin.id
  });

  // Run.
  MoveFunction[moveKey].execute(moveState, store);

  // Verify.
  const resultHand = Selector.hand(playerId, store.getState());
  assert.ok(resultHand);
  assert.equal(resultHand.length, 2);
  const resultDiscardFacedown = Selector.discardFacedown(playerId, store.getState());
  assert.equal(resultDiscardFacedown.includes(paymentCoinId), true);
  const resultDiscardFaceup = Selector.discardFaceup(playerId, store.getState());
  assert.equal(resultDiscardFaceup.includes(recruitCoin.id), true);
});

QUnit.test("recruit isLegal() true", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  store.dispatch(ActionCreator.setInitiativePlayer(2));
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoin = randomUnitCoinState(hand, store.getState());
  const supply = Selector.supply(playerId, store.getState());
  const recruitCoin = randomUnitCoinState(supply, store.getState());
  const move = MoveFunction[Move.RECRUIT];

  // Run.
  const result = move.isLegal(player, paymentCoin, recruitCoin, store.getState());

  // Verify.
  assert.equal(result, true, `paymentCoin=${paymentCoin.id} recruitCoin=${recruitCoin.id}`);
});

QUnit.test("tactic execute() Archer", assert => {
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
  const moveStates = [{ moveKey: Move.ATTACK, playerId, paymentCoinId, an1, an2, victimCoinId }];
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, an1, moveStates });

  // Run.
  MoveFunction.execute(moveState, store);

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

QUnit.test("tactic execute() Archer Pikeman", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 2;
  const hand2 = Selector.hand(playerId, store.getState());
  const paymentCoinId = hand2[1]; // Archer
  const hand1 = Selector.hand(1, store.getState());
  const victimCoinId = hand1[2]; // Pikeman
  const an1 = "e2"; // Raven control location.
  const an2 = "e4";
  store.dispatch(ActionCreator.setUnit(an1, 22)); // Archer
  store.dispatch(ActionCreator.setUnit(an2, victimCoinId));
  const moveKey = Move.TACTIC;
  const moveStates = [{ moveKey: Move.ATTACK, playerId, paymentCoinId, an1, an2, victimCoinId }];
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, an1, moveStates });

  // Run.
  MoveFunction.execute(moveState, store);

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

QUnit.test("tactic execute() Cavalry", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 2;
  const paymentCoinId = 29; // Cavalry
  store.dispatch(ActionCreator.addToPlayerArray("playerToHand", playerId, paymentCoinId));
  const victimCoinId = 2; // Swordsman
  const an1 = "e2"; // Raven control location.
  const an2 = "e3";
  const an3 = "e4";
  store.dispatch(ActionCreator.setUnit(an1, 26)); // Cavalry
  store.dispatch(ActionCreator.setUnit(an3, victimCoinId)); // Swordsman
  const moveKey = Move.TACTIC;
  const moveStates = [
    { moveKey: Move.MOVE_A_UNIT, playerId, paymentCoinId, an1, an2 },
    { moveKey: Move.ATTACK, playerId, paymentCoinId, an1: an2, an2: an3, victimCoinId }
  ];
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, an1, moveStates });

  // Run.
  MoveFunction.execute(moveState, store);

  // Verify.
  const resultHand = Selector.hand(playerId, store.getState());
  assert.ok(resultHand);
  assert.equal(resultHand.length, 3, `resultHand.length = ${resultHand.length}`);
  const resultFromUnit = Selector.unit(an1, store.getState());
  assert.equal(resultFromUnit, undefined);
  const resultToUnit = Selector.unit(an2, store.getState());
  assert.ok(resultToUnit);
  assert.equal(resultToUnit.join(""), 26);
});

QUnit.test("tactic execute() Crossbowman", assert => {
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
  const moveStates = [{ moveKey: Move.ATTACK, playerId, paymentCoinId, an1, an2, victimCoinId }];
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, an1, moveStates });

  // Run.
  MoveFunction.execute(moveState, store);

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

QUnit.test("tactic execute() Ensign", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  store.dispatch(ActionCreator.addToPlayerArray("playerToTableau", playerId, UnitCard.ENSIGN));
  const coinState1 = CoinState.create({ coinKey: UnitCoin.ENSIGN, store });
  store.dispatch(ActionCreator.addCoin(coinState1));
  const coinState2 = CoinState.create({ coinKey: UnitCoin.ENSIGN, store });
  store.dispatch(ActionCreator.addCoin(coinState2));
  const paymentCoinId = coinState1.id; // Ensign
  store.dispatch(ActionCreator.addToPlayerArray("playerToHand", playerId, paymentCoinId));
  const moveCoinId = 6; // Swordsman
  const an1 = "e2"; // Raven control location.
  const an2 = "e4";
  const an3 = "f4";
  store.dispatch(ActionCreator.setUnit(an1, coinState2.id)); // Marshall
  store.dispatch(ActionCreator.setUnit(an2, moveCoinId)); // Swordsman
  const moveKey = Move.TACTIC;
  const moveStates = [{ moveKey: Move.MOVE_A_UNIT, playerId, paymentCoinId, an1: an2, an2: an3 }];
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, an1, moveStates });

  // Run.
  MoveFunction.execute(moveState, store);

  // Verify.
  const resultHand = Selector.hand(playerId, store.getState());
  assert.ok(resultHand);
  assert.equal(resultHand.length, 3, `resultHand.length = ${resultHand.length}`);
  const resultFromUnit = Selector.unit(an2, store.getState());
  assert.equal(resultFromUnit, undefined, `resultFromUnit = ${resultFromUnit}`);
  const resultToUnit = Selector.unit(an3, store.getState());
  assert.ok(resultToUnit);
  assert.equal(resultToUnit.join(), moveCoinId, `resultToUnit = ${resultToUnit.join()}`);
  const resultMorgue = Selector.morgue(2, store.getState());
  assert.ok(resultMorgue);
  assert.equal(resultMorgue.length, 0);
});

QUnit.test("tactic execute() Light Cavalry", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const paymentCoinId = 20; // Light Cavalry
  store.dispatch(ActionCreator.addToPlayerArray("playerToHand", playerId, paymentCoinId));
  const an1 = "e2"; // Raven control location.
  const an2 = "e4";
  store.dispatch(ActionCreator.setUnit(an1, 16)); // Light Cavalry
  const moveKey = Move.TACTIC;
  const moveStates = [{ moveKey: Move.MOVE_A_UNIT, playerId, paymentCoinId, an1, an2 }];
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, an1, moveStates });

  // Run.
  MoveFunction.execute(moveState, store);

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

QUnit.test("tactic execute() Marshall", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  store.dispatch(ActionCreator.addToPlayerArray("playerToTableau", playerId, UnitCard.MARSHALL));
  const coinState1 = CoinState.create({ coinKey: UnitCoin.MARSHALL, store });
  store.dispatch(ActionCreator.addCoin(coinState1));
  const coinState2 = CoinState.create({ coinKey: UnitCoin.MARSHALL, store });
  store.dispatch(ActionCreator.addCoin(coinState2));
  const paymentCoinId = coinState1.id; // Marshall
  store.dispatch(ActionCreator.addToPlayerArray("playerToHand", playerId, paymentCoinId));
  const attackerCoinId = 6; // Swordsman
  const victimCoinId = 22; // Archer
  const an1 = "e2"; // Raven control location.
  const an2 = "e4";
  const an3 = "f4";
  store.dispatch(ActionCreator.setUnit(an1, coinState2.id)); // Marshall
  store.dispatch(ActionCreator.setUnit(an2, attackerCoinId)); // Swordsman
  store.dispatch(ActionCreator.setUnit(an3, victimCoinId)); // Archer
  const moveKey = Move.TACTIC;
  const moveStates = [
    { moveKey: Move.ATTACK, playerId, paymentCoinId, an1: an2, an2: an3, victimCoinId }
  ];
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, an1, moveStates });

  // Run.
  MoveFunction.execute(moveState, store);

  // Verify.
  const resultHand = Selector.hand(playerId, store.getState());
  assert.ok(resultHand);
  assert.equal(resultHand.length, 3, `resultHand.length = ${resultHand.length}`);
  const resultAttackUnit = Selector.unit(an2, store.getState());
  assert.ok(resultAttackUnit);
  assert.equal(
    resultAttackUnit.join(),
    attackerCoinId,
    `resultAttackUnit = ${resultAttackUnit.join()}`
  );
  const resultVictimUnit = Selector.unit(an3, store.getState());
  assert.equal(resultVictimUnit, undefined, `resultVictimUnit = ${resultVictimUnit}`);
  const resultMorgue = Selector.morgue(2, store.getState());
  assert.ok(resultMorgue);
  assert.equal(resultMorgue.length, 1);
  assert.equal(resultMorgue.join(), victimCoinId);
});

QUnit.test("tactic execute() Royal Guard", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  store.dispatch(ActionCreator.addToPlayerArray("playerToTableau", playerId, UnitCard.ROYAL_GUARD));
  const coinState1 = CoinState.create({ coinKey: UnitCoin.ROYAL_GUARD, store });
  store.dispatch(ActionCreator.addCoin(coinState1));
  const paymentCoinId = 1; // Raven Royal Coin
  const an1 = "e2"; // Raven control location.
  const an2 = "e3";
  store.dispatch(ActionCreator.setUnit(an1, coinState1.id)); // Royal Guard
  const moveKey = Move.TACTIC;
  const moveStates = [{ moveKey: Move.MOVE_A_UNIT, playerId, paymentCoinId, an1, an2 }];
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, an1, moveStates });

  // Run.
  MoveFunction.execute(moveState, store);

  // Verify.
  const resultHand = Selector.hand(playerId, store.getState());
  assert.ok(resultHand);
  assert.equal(resultHand.length, 2);
  assert.equal(resultHand.includes(paymentCoinId), false);
  const resultFromUnit = Selector.unit(an1, store.getState());
  assert.equal(resultFromUnit, undefined);
  const resultToUnit = Selector.unit(an2, store.getState());
  assert.ok(resultToUnit);
  assert.equal(resultToUnit.join(""), 39);
});

QUnit.test("createGameRecord()", assert => {
  // Setup.
  const store = TestData.createStore();
  store.dispatch(ActionCreator.setRound(1));
  const moveState1 = MoveState.create({
    moveKey: Move.DEPLOY,
    playerId: 1,
    paymentCoinId: 6,
    an1: "e2"
  });
  const moveState2 = MoveState.create({
    moveKey: Move.DEPLOY,
    playerId: 2,
    paymentCoinId: 25,
    an1: "d7"
  });

  // Run.
  const result1 = MoveFunction.createGameRecord(moveState1, store.getState());

  // Verify.
  assert.ok(result1);
  assert.equal(result1, "1.1 Alfred Raven Deploy: Swordsman to e2");
  store.dispatch(ActionCreator.addGameRecord(result1));

  // Run.
  const result2 = MoveFunction.createGameRecord(moveState2, store.getState());

  // Verify.
  assert.ok(result2);
  assert.equal(result2, "1.2 Bruce Wolf Deploy: Archer to d7");
});

const MoveFunctionTest = {};
export default MoveFunctionTest;
