import ArrayUtils from "../util/ArrayUtilities.js";

import Move from "../artifact/Move.js";
import Resolver from "../artifact/Resolver.js";

import ActionCreator from "../state/ActionCreator.js";
import MoveState from "../state/MoveState.js";
import Selector from "../state/Selector.js";

import MoveFunction from "./MoveFunction.js";
import TestData from "./TestData.js";

QUnit.module("MoveFunction");

const randomUnitCoinState = (array, state) => {
  let coinState;

  do {
    const randomCoinId = ArrayUtils.randomElement(array);
    coinState = Selector.coin(randomCoinId, state);
  } while (!Resolver.isUnitCoin(coinState.coinKey));

  return coinState;
};

QUnit.test("attack execute() ", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinId = hand[1];
  const hand2 = Selector.hand(2, store.getState());
  const victimCoinId = hand2[1];
  const fromAN = "e2"; // Raven control location.
  const toAN = "f2";
  store.dispatch(ActionCreator.setUnit(fromAN, paymentCoinId));
  store.dispatch(ActionCreator.setUnit(toAN, victimCoinId));
  const moveKey = Move.ATTACK;
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, fromAN, toAN });

  // Run.
  MoveFunction[moveKey].execute(moveState, store);

  // Verify.
  const resultHand = Selector.hand(playerId, store.getState());
  assert.ok(resultHand);
  assert.equal(resultHand.length, 2);
  const resultFromUnit = Selector.unit(fromAN, store.getState());
  assert.ok(resultFromUnit);
  assert.equal(resultFromUnit.join(), paymentCoinId);
  const resultToUnit = Selector.unit(toAN, store.getState());
  assert.equal(resultToUnit, undefined);
  const resultMorgue = Selector.morgue(2, store.getState());
  assert.ok(resultMorgue);
  assert.equal(resultMorgue.length, 1);
  assert.equal(resultMorgue.join(), victimCoinId);
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
  const fromAN = "e2"; // Raven control location.
  const toAN = "f2";
  store.dispatch(ActionCreator.setUnit(fromAN, paymentCoin.id));
  store.dispatch(ActionCreator.setUnit(toAN, victimCoin.id));
  const move = MoveFunction[Move.ATTACK];

  // Run.
  const result = move.isLegal(player, paymentCoin, fromAN, toAN, store.getState());

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
  const fromAN = "e2"; // Raven control location.
  const toAN = "f2";
  store.dispatch(ActionCreator.setUnit(fromAN, paymentCoin.id));
  store.dispatch(ActionCreator.setUnit(toAN, victimCoin.id));
  const move = MoveFunction[Move.ATTACK];

  // Run.
  const result = move.isLegal(player, paymentCoin, fromAN, toAN, store.getState());

  // Verify.
  assert.equal(result, false);
});

QUnit.test("bolster execute() ", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoin = randomUnitCoinState(hand, store.getState());
  const an = "e2"; // Raven control location.
  store.dispatch(ActionCreator.setUnit(an, paymentCoin.id));
  const moveKey = Move.BOLSTER;
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId: paymentCoin.id, an });

  // Run.
  MoveFunction[moveKey].execute(moveState, store);

  // Verify.
  const resultHand = Selector.hand(playerId, store.getState());
  assert.ok(resultHand);
  assert.equal(resultHand.length, 2);
  const resultUnit = Selector.unit(an, store.getState());
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
  const an = "e2"; // Raven control location.
  store.dispatch(ActionCreator.setUnit(an, paymentCoin.id));
  const move = MoveFunction[Move.BOLSTER];

  // Run.
  const result = move.isLegal(player, paymentCoin, an, store.getState());

  // Verify.
  assert.equal(result, true);
});

QUnit.test("claimInitiative execute() ", assert => {
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

QUnit.test("control execute() ", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoin = randomUnitCoinState(hand, store.getState());
  const an = "e5"; // Neutral control location.
  store.dispatch(ActionCreator.setUnit(an, paymentCoin.id));
  const moveKey = Move.CONTROL;
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId: paymentCoin.id, an });

  // Run.
  MoveFunction[moveKey].execute(moveState, store);

  // Verify.
  const resultHand = Selector.hand(playerId, store.getState());
  assert.ok(resultHand);
  assert.equal(resultHand.length, 2);
  const resultControlKey = Selector.control(an, store.getState());
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
  const an = "e5"; // Neutral control location.
  store.dispatch(ActionCreator.setUnit(an, paymentCoin.id));
  const move = MoveFunction[Move.CONTROL];

  // Run.
  const result = move.isLegal(player, paymentCoin, an, store.getState());

  // Verify.
  assert.equal(result, true);
});

QUnit.test("deploy execute() ", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoin = randomUnitCoinState(hand, store.getState());
  const an = "e2"; // Raven control location.
  const moveKey = Move.DEPLOY;
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinId: paymentCoin.id, an });

  // Run.
  MoveFunction[moveKey].execute(moveState, store);

  // Verify.
  const resultHand = Selector.hand(playerId, store.getState());
  assert.ok(resultHand);
  assert.equal(resultHand.length, 2);
  const resultUnit = Selector.unit(an, store.getState());
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
  const an = "e2"; // Raven control location.
  const move = MoveFunction[Move.DEPLOY];

  // Run.
  const result = move.isLegal(player, paymentCoin, an, store.getState());

  // Verify.
  assert.equal(result, true);
});

QUnit.test("moveAUnit execute() ", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoin = randomUnitCoinState(hand, store.getState());
  const fromAN = "e2"; // Raven control location.
  const toAN = "f2";
  store.dispatch(ActionCreator.setUnit(fromAN, paymentCoin.id));
  const moveKey = Move.MOVE_A_UNIT;
  const moveState = MoveState.create({
    moveKey,
    playerId,
    paymentCoinId: paymentCoin.id,
    fromAN,
    toAN
  });

  // Run.
  MoveFunction[moveKey].execute(moveState, store);

  // Verify.
  const resultHand = Selector.hand(playerId, store.getState());
  assert.ok(resultHand);
  assert.equal(resultHand.length, 2);
  const resultFromUnit = Selector.unit(fromAN, store.getState());
  assert.equal(resultFromUnit, undefined);
  const resultToUnit = Selector.unit(toAN, store.getState());
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
  const fromAN = "e2"; // Raven control location.
  const toAN = "f2";
  store.dispatch(ActionCreator.setUnit(fromAN, paymentCoin.id));
  const move = MoveFunction[Move.MOVE_A_UNIT];

  // Run.
  const result = move.isLegal(player, paymentCoin, fromAN, toAN, store.getState());

  // Verify.
  assert.equal(result, true);
});

QUnit.test("pass execute() ", assert => {
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

QUnit.test("recruit execute() ", assert => {
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

const MoveFunctionTest = {};
export default MoveFunctionTest;
