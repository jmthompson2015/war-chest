import AppState from "./AppState.js";
import ActionCreator from "./ActionCreator.js";
import PlayerState from "./PlayerState.js";
import Reducer from "./Reducer.js";

QUnit.module("Reducer");

QUnit.test("addToPlayerBag()", assert => {
  // Setup.
  const state = AppState.create();
  const playerId = 3;
  const coinKey = "knight";
  const action = ActionCreator.addToPlayerArray("playerToBag", playerId, coinKey);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const bag = result.playerToBag[playerId];
  assert.ok(bag);
  assert.ok(Array.isArray(bag));
  assert.equal(bag.length, 1);
  assert.equal(bag.includes(coinKey), true);
  assert.equal(bag[0], coinKey);
});

QUnit.test("addToPlayerMorgue()", assert => {
  // Setup.
  const state = AppState.create();
  const playerId = 3;
  const coinKey = "knight";
  const action = ActionCreator.addToPlayerArray("playerToMorgue", playerId, coinKey);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const morgue = result.playerToMorgue[playerId];
  assert.ok(morgue);
  assert.ok(Array.isArray(morgue));
  assert.equal(morgue.length, 1);
  assert.equal(morgue[0], coinKey);
});

QUnit.test("addToPlayerDiscardFacedown()", assert => {
  // Setup.
  const state = AppState.create();
  const playerId = 3;
  const coinKey = "knight";
  const action = ActionCreator.addToPlayerArray("playerToDiscardFacedown", playerId, coinKey);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const discard = result.playerToDiscardFacedown[playerId];
  assert.ok(discard);
  assert.ok(Array.isArray(discard));
  assert.equal(discard.length, 1);
  assert.equal(discard[0], coinKey);
});

QUnit.test("addToPlayerDiscardFaceup()", assert => {
  // Setup.
  const state = AppState.create();
  const playerId = 3;
  const coinKey = "knight";
  const action = ActionCreator.addToPlayerArray("playerToDiscardFaceup", playerId, coinKey);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const discard = result.playerToDiscardFaceup[playerId];
  assert.ok(discard);
  assert.ok(Array.isArray(discard));
  assert.equal(discard.length, 1);
  assert.equal(discard[0], coinKey);
});

QUnit.test("addToPlayerHand()", assert => {
  // Setup.
  const state = AppState.create();
  const playerId = 3;
  const coinKey = "knight";
  const action = ActionCreator.addToPlayerArray("playerToHand", playerId, coinKey);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const hand = result.playerToHand[playerId];
  assert.ok(hand);
  assert.ok(Array.isArray(hand));
  assert.equal(hand.length, 1);
  assert.equal(hand[0], coinKey);
});

QUnit.test("addToPlayerSupply()", assert => {
  // Setup.
  const state = AppState.create();
  const playerId = 3;
  const coinKey = "knight";
  const action = ActionCreator.addToPlayerArray("playerToSupply", playerId, coinKey);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const supply = result.playerToSupply[playerId];
  assert.ok(supply);
  assert.ok(Array.isArray(supply));
  assert.equal(supply.length, 1);
  assert.equal(supply[0], coinKey);
});

QUnit.test("moveAUnit()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinKey = "knight";
  const fromAN = "e2";
  const toAN = "d2";
  const action0 = ActionCreator.setUnit(fromAN, coinKey);
  const state = Reducer.root(state0, action0);
  const action = ActionCreator.moveAUnit(playerId, fromAN, toAN);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const { anToTokens } = result;
  assert.ok(anToTokens);
  assert.equal(anToTokens[fromAN], undefined);
  assert.equal(anToTokens[toAN].join(","), coinKey);
});

QUnit.test("removeFromPlayerHand()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinKey = "knight";
  const action0 = ActionCreator.addToPlayerArray("playerToHand", playerId, coinKey);
  const state = Reducer.root(state0, action0);
  const action = ActionCreator.removeFromPlayerArray("playerToHand", playerId, coinKey);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const hand = result.playerToHand[playerId];
  assert.ok(hand);
  assert.ok(Array.isArray(hand));
  assert.equal(hand.length, 0);
});

QUnit.test("setControl()", assert => {
  // Setup.
  const state = AppState.create();
  const an = "a1";
  const controlKey = "raven";
  const action = ActionCreator.setControl(an, controlKey);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  assert.equal(result.anToControl[an], controlKey);
});

QUnit.test("setInitiativePlayer()", assert => {
  // Setup.
  const state = AppState.create();
  const playerId = 3;
  const action = ActionCreator.setInitiativePlayer(playerId);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  assert.equal(result.initiativePlayerId, playerId);
});

QUnit.test("setPlayers()", assert => {
  // Setup.
  const state = AppState.create();
  const id1 = 1;
  const id2 = 2;
  const ravenPlayer = PlayerState.create({ id: id1, name: "Raven" });
  const wolfPlayer = PlayerState.create({ id: id2, name: "Wolf" });
  const players = [ravenPlayer, wolfPlayer];
  const action = ActionCreator.setPlayers(players);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const { playerInstances } = result;
  assert.ok(playerInstances);
  assert.equal(Object.keys(playerInstances).length, 2);
  assert.equal(playerInstances[id1], ravenPlayer);
  assert.equal(playerInstances[id2], wolfPlayer);
});

QUnit.test("setUnit()", assert => {
  // Setup.
  const state = AppState.create();
  const an = "a1";
  const coinKey = "knight";
  const action = ActionCreator.setUnit(an, coinKey);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  // console.log(`result = ${JSON.stringify(result)}`);
  assert.equal(result.anToTokens[an], coinKey);
});

QUnit.test("setUnit() 2", assert => {
  // Setup.
  const state0 = AppState.create();
  const an = "a1";
  const coinKey = "knight";
  const action0 = ActionCreator.setUnit(an, coinKey);
  const state = Reducer.root(state0, action0);
  const action = ActionCreator.setUnit(an, coinKey);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  assert.equal(result.anToTokens[an].join(), "knight,knight");
});

QUnit.test("bagToHand()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinKey = "knight";
  const action0 = ActionCreator.addToPlayerArray("playerToBag", playerId, coinKey);
  const state = Reducer.root(state0, action0);
  const action = ActionCreator.transferBetweenPlayerArrays(
    "playerToBag",
    "playerToHand",
    playerId,
    coinKey
  );

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const bag = result.playerToBag[playerId];
  assert.ok(bag);
  assert.equal(bag.length, 0);
  const hand = result.playerToHand[playerId];
  assert.equal(hand.length, 1);
  assert.equal(hand[0], coinKey);
});

QUnit.test("discardFacedownToBag()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinKey = "knight";
  const action0 = ActionCreator.addToPlayerArray("playerToDiscardFacedown", playerId, coinKey);
  const state = Reducer.root(state0, action0);
  const action = ActionCreator.transferBetweenPlayerArrays(
    "playerToDiscardFacedown",
    "playerToBag",
    playerId,
    coinKey
  );

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const discard = result.playerToDiscardFacedown[playerId];
  assert.ok(discard);
  assert.equal(discard.length, 0);
  const bag = result.playerToBag[playerId];
  assert.equal(bag.length, 1);
  assert.equal(bag[0], coinKey);
});

QUnit.test("discardFaceupToBag()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinKey = "knight";
  const action0 = ActionCreator.addToPlayerArray("playerToDiscardFaceup", playerId, coinKey);
  const state = Reducer.root(state0, action0);
  const action = ActionCreator.transferBetweenPlayerArrays(
    "playerToDiscardFaceup",
    "playerToBag",
    playerId,
    coinKey
  );

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const discard = result.playerToDiscardFaceup[playerId];
  assert.ok(discard);
  assert.equal(discard.length, 0);
  const bag = result.playerToBag[playerId];
  assert.equal(bag.length, 1);
  assert.equal(bag[0], coinKey);
});

QUnit.test("boardToMorgue()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinKey = "knight";
  const an = "e2";
  const action0 = ActionCreator.setUnit(an, coinKey);
  const state = Reducer.root(state0, action0);
  const action = ActionCreator.boardToMorgue(playerId, an);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const resultUnit = result.anToTokens[an];
  assert.equal(resultUnit.join(""), "");
  const resultMorgue = result.playerToMorgue[playerId];
  assert.ok(resultMorgue);
  assert.equal(Array.isArray(resultMorgue), true);
  assert.equal(resultMorgue.length, 1);
  assert.equal(resultMorgue[0], coinKey);
});

QUnit.test("handToBoard()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinKey = "knight";
  const an = "e2";
  const action0 = ActionCreator.addToPlayerArray("playerToHand", playerId, coinKey);
  const state = Reducer.root(state0, action0);
  const action = ActionCreator.handToBoard(playerId, coinKey, an);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const hand = result.playerToHand[playerId];
  assert.ok(hand);
  assert.equal(hand.length, 0);
  const unit = result.anToTokens[an];
  assert.ok(unit);
  assert.equal(Array.isArray(unit), true);
  assert.equal(unit.length, 1);
  assert.equal(unit[0], coinKey);
});

QUnit.test("supplyToBag()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinKey = "knight";
  const action0 = ActionCreator.addToPlayerArray("playerToSupply", playerId, coinKey);
  const state = Reducer.root(state0, action0);
  const action = ActionCreator.transferBetweenPlayerArrays(
    "playerToSupply",
    "playerToBag",
    playerId,
    coinKey
  );

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const supply = result.playerToSupply[playerId];
  assert.ok(supply);
  assert.equal(supply.length, 0);
  const bag = result.playerToBag[playerId];
  assert.equal(bag.length, 1);
  assert.equal(bag[0], coinKey);
});

const ReducerTest = {};
export default ReducerTest;
