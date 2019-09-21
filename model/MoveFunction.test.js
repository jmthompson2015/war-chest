/* eslint no-console: ["error", { allow: ["log"] }] */

import ArrayUtils from "../util/ArrayUtilities.js";

import Move from "../artifact/Move.js";
import Resolver from "../artifact/Resolver.js";

import ActionCreator from "../state/ActionCreator.js";
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
  const myMove = move.execute(player, paymentCoin, fromAN, toAN);

  // Run.
  myMove(store);

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
  const player = Selector.player(playerId, store.getState());
  const hand = Selector.hand(playerId, store.getState());
  const coinKey = randomUnitCoinKey(hand);
  const coin = Resolver.coin(coinKey);
  const an = "e2"; // Raven control location.
  store.dispatch(ActionCreator.setUnit(an, coinKey));
  const move = MoveFunction[Move.BOLSTER];
  const myMove = move.execute(player, coin, an);

  // Run.
  myMove(store);

  // Verify.
  const resultHand = Selector.hand(playerId, store.getState());
  assert.ok(resultHand);
  assert.equal(resultHand.length, 2);
  const resultUnit = Selector.unit(an, store.getState());
  console.log(`resultUnit = ${JSON.stringify(resultUnit)}`);
  assert.ok(resultUnit);
  assert.equal(Array.isArray(resultUnit), true);
  assert.equal(resultUnit.length, 2);
  assert.equal(resultUnit[0], coinKey);
  assert.equal(resultUnit[1], coinKey);
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
  const player = Selector.player(playerId, store.getState());
  store.dispatch(ActionCreator.setInitiativePlayer(2));
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinKey = ArrayUtils.randomElement(hand);
  const paymentCoin = Resolver.coin(paymentCoinKey);
  const move = MoveFunction[Move.CLAIM_INITIATIVE];
  const myMove = move.execute(player, paymentCoin);
  console.log(
    `Selector.isInitiativePlayer(player, store.getState()) ? ${Selector.isInitiativePlayer(
      player,
      store.getState()
    )}`
  );

  // Run.
  myMove(store);

  // Verify.
  const resultHand = Selector.hand(playerId, store.getState());
  assert.ok(resultHand);
  assert.equal(resultHand.length, 2);
  assert.equal(Selector.initiativePlayer(store.getState()).id, player.id);
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
  const paymentCoin = Resolver.coin(paymentCoinKey);
  const an = "e5"; // Neutral control location.
  store.dispatch(ActionCreator.setUnit(an, paymentCoinKey));
  const move = MoveFunction[Move.CONTROL];
  const myMove = move.execute(player, paymentCoin, an);

  // Run.
  myMove(store);

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
  const player = Selector.player(playerId, store.getState());
  const hand = Selector.hand(playerId, store.getState());
  const coinKey = randomUnitCoinKey(hand);
  const coin = Resolver.coin(coinKey);
  const an = "e2"; // Raven control location.
  const move = MoveFunction[Move.DEPLOY];
  const myMove = move.execute(player, coin, an);

  // Run.
  myMove(store);

  // Verify.
  const resultHand = Selector.hand(playerId, store.getState());
  assert.ok(resultHand);
  assert.equal(resultHand.length, 2);
  const resultUnit = Selector.unit(an, store.getState());
  assert.ok(resultUnit);
  assert.equal(Array.isArray(resultUnit), true);
  assert.equal(resultUnit.length, 1);
  assert.equal(resultUnit[0], coinKey);
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
  const player = Selector.player(playerId, store.getState());
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinKey = randomUnitCoinKey(hand);
  const paymentCoin = Resolver.coin(paymentCoinKey);
  const fromAN = "e2"; // Raven control location.
  const toAN = "d2";
  store.dispatch(ActionCreator.setUnit(fromAN, paymentCoinKey));
  const move = MoveFunction[Move.MOVE_A_UNIT];
  const myMove = move.execute(player, paymentCoin, fromAN, toAN);

  // Run.
  myMove(store);

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
  const toAN = "d2";
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
  const player = Selector.player(playerId, store.getState());
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinKey = ArrayUtils.randomElement(hand);
  const paymentCoin = Resolver.coin(paymentCoinKey);
  const move = MoveFunction[Move.PASS];
  const myMove = move.execute(player, paymentCoin);

  // Run.
  myMove(store);

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
  const player = Selector.player(playerId, store.getState());
  store.dispatch(ActionCreator.setInitiativePlayer(2));
  const hand = Selector.hand(playerId, store.getState());
  const paymentCoinKey = ArrayUtils.randomElement(hand);
  const paymentCoin = Resolver.coin(paymentCoinKey);
  const supply = Selector.hand(playerId, store.getState());
  const recruitCoinKey = randomUnitCoinKey(supply);
  const recruitCoin = Resolver.coin(recruitCoinKey);
  const move = MoveFunction[Move.RECRUIT];
  const myMove = move.execute(player, paymentCoin, recruitCoin);

  // Run.
  myMove(store);

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
