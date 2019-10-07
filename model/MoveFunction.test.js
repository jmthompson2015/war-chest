/* eslint no-console: ["error", { allow: ["log"] }] */

import ArrayUtils from "../util/ArrayUtilities.js";

import Move from "../artifact/Move.js";
import Resolver from "../artifact/Resolver.js";

import ActionCreator from "../state/ActionCreator.js";
import MoveState from "../state/MoveState.js";
import Selector from "../state/Selector.js";

import MoveFunction from "./MoveFunction.js";
import TestData from "./TestData.js";

QUnit.module("MoveFunction");

const randomUnitCoinKey = array => {
  let answer;

  do {
    answer = ArrayUtils.randomElement(array);
  } while (!Resolver.isUnitCoin(answer));

  return answer;
};

QUnit.test("attack execute() ", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinKey = randomUnitCoinKey(hand);
  const hand2 = Selector.hand(2, store.getState());
  const victimCoinKey = ArrayUtils.randomElement(hand2);
  const fromAN = "e2"; // Raven control location.
  const toAN = "d2";
  store.dispatch(ActionCreator.setUnit(fromAN, paymentCoinKey));
  store.dispatch(ActionCreator.setUnit(toAN, victimCoinKey));
  const moveKey = Move.ATTACK;
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinKey, fromAN, toAN });

  // Run.
  MoveFunction[moveKey].execute(moveState, store);

  // Verify.
  const resultHand = Selector.hand(playerId, store.getState());
  assert.ok(resultHand);
  assert.equal(resultHand.length, 2);
  const resultFromUnit = Selector.unit(fromAN, store.getState());
  assert.ok(resultFromUnit);
  console.log(`resultFromUnit = ${JSON.stringify(resultFromUnit)}`);
  assert.equal(resultFromUnit.join(""), paymentCoinKey);
  const resultToUnit = Selector.unit(toAN, store.getState());
  assert.ok(resultToUnit);
  assert.equal(resultToUnit.join(""), "");
});

QUnit.test("attack isLegal() true", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinKey = randomUnitCoinKey(hand);
  const paymentCoin = Resolver.coin(paymentCoinKey);
  const hand2 = Selector.hand(2, store.getState());
  const victimCoinKey = ArrayUtils.randomElement(hand2);
  const fromAN = "e2"; // Raven control location.
  const toAN = "d2";
  store.dispatch(ActionCreator.setUnit(fromAN, paymentCoinKey));
  store.dispatch(ActionCreator.setUnit(toAN, victimCoinKey));
  const move = MoveFunction[Move.ATTACK];

  // Run.
  const result = move.isLegal(player, paymentCoin, fromAN, toAN, store.getState());

  // Verify.
  assert.equal(result, true);
});

QUnit.test("bolster execute() ", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinKey = randomUnitCoinKey(hand);
  const an = "e2"; // Raven control location.
  store.dispatch(ActionCreator.setUnit(an, paymentCoinKey));
  const moveKey = Move.BOLSTER;
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinKey, an });

  // Run.
  MoveFunction[moveKey].execute(moveState, store);

  // Verify.
  const resultHand = Selector.hand(playerId, store.getState());
  assert.ok(resultHand);
  assert.equal(resultHand.length, 2);
  const resultUnit = Selector.unit(an, store.getState());
  console.log(`resultUnit = ${JSON.stringify(resultUnit)}`);
  assert.ok(resultUnit);
  assert.equal(Array.isArray(resultUnit), true);
  assert.equal(resultUnit.length, 2);
  assert.equal(resultUnit[0], paymentCoinKey);
  assert.equal(resultUnit[1], paymentCoinKey);
});

QUnit.test("bolster isLegal() true", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const hand = Selector.hand(playerId, store.getState());
  const coinKey = randomUnitCoinKey(hand);
  const coin = Resolver.coin(coinKey);
  const an = "e2"; // Raven control location.
  store.dispatch(ActionCreator.setUnit(an, coinKey));
  const move = MoveFunction[Move.BOLSTER];

  // Run.
  const result = move.isLegal(player, coin, an, store.getState());

  // Verify.
  assert.equal(result, true);
});

QUnit.test("claimInitiative execute() ", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  store.dispatch(ActionCreator.setInitiativePlayer(2));
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinKey = ArrayUtils.randomElement(hand);
  const moveKey = Move.CLAIM_INITIATIVE;
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinKey });

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
  const paymentCoinKey = ArrayUtils.randomElement(hand);
  const paymentCoin = Resolver.coin(paymentCoinKey);
  const move = MoveFunction[Move.CLAIM_INITIATIVE];

  // Run.
  const result = move.isLegal(player, paymentCoin, store.getState());

  // Verify.
  assert.equal(result, true);
});

QUnit.test("control execute() ", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinKey = randomUnitCoinKey(hand);
  const an = "e5"; // Neutral control location.
  store.dispatch(ActionCreator.setUnit(an, paymentCoinKey));
  const moveKey = Move.CONTROL;
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinKey, an });

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
  const paymentCoinKey = randomUnitCoinKey(hand);
  const paymentCoin = Resolver.coin(paymentCoinKey);
  const an = "e5"; // Neutral control location.
  store.dispatch(ActionCreator.setUnit(an, paymentCoinKey));
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
  const paymentCoinKey = randomUnitCoinKey(hand);
  const an = "e2"; // Raven control location.
  const moveKey = Move.DEPLOY;
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinKey, an });

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
  assert.equal(resultUnit[0], paymentCoinKey);
});

QUnit.test("deploy isLegal() true", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const hand = Selector.hand(playerId, store.getState());
  const coinKey = randomUnitCoinKey(hand);
  const coin = Resolver.coin(coinKey);
  const an = "e2"; // Raven control location.
  const move = MoveFunction[Move.DEPLOY];

  // Run.
  const result = move.isLegal(player, coin, an, store.getState());

  // Verify.
  assert.equal(result, true);
});

QUnit.test("moveAUnit execute() ", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinKey = randomUnitCoinKey(hand);
  const fromAN = "e2"; // Raven control location.
  const toAN = "f2";
  store.dispatch(ActionCreator.setUnit(fromAN, paymentCoinKey));
  const moveKey = Move.MOVE_A_UNIT;
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinKey, fromAN, toAN });

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
  assert.equal(resultToUnit.join(""), paymentCoinKey);
});

QUnit.test("moveAUnit isLegal() true", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinKey = randomUnitCoinKey(hand);
  const paymentCoin = Resolver.coin(paymentCoinKey);
  const fromAN = "e2"; // Raven control location.
  const toAN = "f2";
  store.dispatch(ActionCreator.setUnit(fromAN, paymentCoinKey));
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
  const paymentCoinKey = ArrayUtils.randomElement(hand);
  const moveKey = Move.PASS;
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinKey });

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
  const paymentCoinKey = ArrayUtils.randomElement(hand);
  const paymentCoin = Resolver.coin(paymentCoinKey);
  const move = MoveFunction[Move.PASS];

  // Run.
  const result = move.isLegal(player, paymentCoin, store.getState());

  // Verify.
  assert.equal(result, true);
});

QUnit.test("recruit execute() ", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  store.dispatch(ActionCreator.setInitiativePlayer(2));
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinKey = ArrayUtils.randomElement(hand);
  const supply = Selector.hand(playerId, store.getState());
  const recruitCoinKey = randomUnitCoinKey(supply);
  const moveKey = Move.RECRUIT;
  const moveState = MoveState.create({ moveKey, playerId, paymentCoinKey, recruitCoinKey });

  // Run.
  MoveFunction[moveKey].execute(moveState, store);

  // Verify.
  const resultHand = Selector.hand(playerId, store.getState());
  assert.ok(resultHand);
  assert.equal(resultHand.length, 2);
  const resultDiscardFacedown = Selector.discardFacedown(playerId, store.getState());
  assert.equal(resultDiscardFacedown.includes(paymentCoinKey), true);
  const resultDiscardFaceup = Selector.discardFaceup(playerId, store.getState());
  assert.equal(resultDiscardFaceup.includes(recruitCoinKey), true);
});

QUnit.test("recruit isLegal() true", assert => {
  // Setup.
  const store = TestData.createStore();
  const playerId = 1;
  const player = Selector.player(playerId, store.getState());
  store.dispatch(ActionCreator.setInitiativePlayer(2));
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinKey = ArrayUtils.randomElement(hand);
  const paymentCoin = Resolver.coin(paymentCoinKey);
  const supply = Selector.hand(playerId, store.getState());
  const recruitCoinKey = randomUnitCoinKey(supply);
  const recruitCoin = Resolver.coin(recruitCoinKey);
  const move = MoveFunction[Move.RECRUIT];

  // Run.
  const result = move.isLegal(player, paymentCoin, recruitCoin, store.getState());

  // Verify.
  assert.equal(result, true, `paymentCoin=${paymentCoinKey} recruitCoin=${recruitCoinKey}`);
});

const MoveFunctionTest = {};
export default MoveFunctionTest;
