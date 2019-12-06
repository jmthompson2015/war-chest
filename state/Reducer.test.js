import UnitCard from "../artifact/UnitCard.js";

import AppState from "./AppState.js";
import ActionCreator from "./ActionCreator.js";
import CoinState from "./CoinState.js";
import PlayerState from "./PlayerState.js";
import Reducer from "./Reducer.js";
import Selector from "./Selector.js";

QUnit.module("Reducer");

QUnit.test("addCoin()", assert => {
  // Setup.
  const state = AppState.create();
  const coinKey = "knight";
  const coinState = CoinState.create({ id: Selector.nextCoinId(state), coinKey });
  const action = ActionCreator.addCoin(coinState);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const coins = result.coinInstances;
  assert.ok(coins);
  assert.equal(Object.keys(coins).length, 1);
  const coin = coins[1];
  assert.ok(coin);
  assert.equal(coin.id, 1);
  assert.equal(coin.coinKey, coinKey);
});

QUnit.test("addToPlayerBag()", assert => {
  // Setup.
  const state = AppState.create();
  const playerId = 3;
  const coinId = 12;
  const action = ActionCreator.addToPlayerArray("playerToBag", playerId, coinId);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const bag = result.playerToBag[playerId];
  assert.ok(bag);
  assert.ok(Array.isArray(bag));
  assert.equal(bag.length, 1);
  assert.equal(bag.includes(coinId), true);
  assert.equal(bag[0], coinId);
});

QUnit.test("addToPlayerMorgue()", assert => {
  // Setup.
  const state = AppState.create();
  const playerId = 3;
  const coinId = 12;
  const action = ActionCreator.addToPlayerArray("playerToMorgue", playerId, coinId);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const morgue = result.playerToMorgue[playerId];
  assert.ok(morgue);
  assert.ok(Array.isArray(morgue));
  assert.equal(morgue.length, 1);
  assert.equal(morgue[0], coinId);
});

QUnit.test("addToPlayerDiscardFacedown()", assert => {
  // Setup.
  const state = AppState.create();
  const playerId = 3;
  const coinId = 12;
  const action = ActionCreator.addToPlayerArray("playerToDiscardFacedown", playerId, coinId);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const discard = result.playerToDiscardFacedown[playerId];
  assert.ok(discard);
  assert.ok(Array.isArray(discard));
  assert.equal(discard.length, 1);
  assert.equal(discard[0], coinId);
});

QUnit.test("addToPlayerDiscardFaceup()", assert => {
  // Setup.
  const state = AppState.create();
  const playerId = 3;
  const coinId = 12;
  const action = ActionCreator.addToPlayerArray("playerToDiscardFaceup", playerId, coinId);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const discard = result.playerToDiscardFaceup[playerId];
  assert.ok(discard);
  assert.ok(Array.isArray(discard));
  assert.equal(discard.length, 1);
  assert.equal(discard[0], coinId);
});

QUnit.test("addToPlayerHand()", assert => {
  // Setup.
  const state = AppState.create();
  const playerId = 3;
  const coinId = 12;
  const action = ActionCreator.addToPlayerArray("playerToHand", playerId, coinId);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const hand = result.playerToHand[playerId];
  assert.ok(hand);
  assert.ok(Array.isArray(hand));
  assert.equal(hand.length, 1);
  assert.equal(hand[0], coinId);
});

QUnit.test("addToPlayerSupply()", assert => {
  // Setup.
  const state = AppState.create();
  const playerId = 3;
  const coinId = 12;
  const action = ActionCreator.addToPlayerArray("playerToSupply", playerId, coinId);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const supply = result.playerToSupply[playerId];
  assert.ok(supply);
  assert.ok(Array.isArray(supply));
  assert.equal(supply.length, 1);
  assert.equal(supply[0], coinId);
});

QUnit.test("moveAUnit()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinId = 12;
  const an1 = "e2";
  const an2 = "d2";
  const action0 = ActionCreator.setUnit(an1, coinId);
  const state = Reducer.root(state0, action0);
  const action = ActionCreator.moveAUnit(playerId, an1, an2);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const { anToTokens } = result;
  assert.ok(anToTokens);
  assert.equal(anToTokens[an1], undefined);
  assert.equal(anToTokens[an2].join(), coinId);
});

QUnit.test("popInputCallback()", assert => {
  // Setup.
  const state0 = AppState.create();
  const callback = 12;
  const action0 = ActionCreator.pushInputCallback(callback);
  const state = Reducer.root(state0, action0);
  const action = ActionCreator.popInputCallback(callback);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const stack = result.inputCallbackStack;
  assert.ok(stack);
  assert.equal(Array.isArray(stack), true);
  assert.equal(stack.length, 0);
});

QUnit.test("pushInputCallback()", assert => {
  // Setup.
  const state = AppState.create();
  const callback = 12;
  const action = ActionCreator.pushInputCallback(callback);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const stack = result.inputCallbackStack;
  assert.ok(stack);
  assert.equal(Array.isArray(stack), true);
  assert.equal(stack[0], callback);
});

QUnit.test("refillBag()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 1;
  const coinId0 = 12;
  const action0 = ActionCreator.addToPlayerArray("playerToDiscardFacedown", playerId, coinId0);
  const state1 = Reducer.root(state0, action0);
  const state2 = Reducer.root(state1, action0);
  const coinId3 = 13;
  const action3 = ActionCreator.addToPlayerArray("playerToDiscardFaceup", playerId, coinId3);
  const state = Reducer.root(state2, action3);
  const action = ActionCreator.refillBag(playerId);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const discardFacedown = result.playerToDiscardFacedown[playerId];
  assert.equal(discardFacedown.length, 0);
  const discardFaceup = result.playerToDiscardFaceup[playerId];
  assert.equal(discardFaceup.length, 0);
  const bag = result.playerToBag[playerId];
  assert.equal(bag.length, 3);
});

QUnit.test("removeFromPlayerHand()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinId = 12;
  const action0 = ActionCreator.addToPlayerArray("playerToHand", playerId, coinId);
  const state = Reducer.root(state0, action0);
  const action = ActionCreator.removeFromPlayerArray("playerToHand", playerId, coinId);

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
  const an1 = "a1";
  const controlKey = "raven";
  const action = ActionCreator.setControl(an1, controlKey);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  assert.equal(result.anToControl[an1], controlKey);
});

QUnit.test("setCurrentDamageCallback()", assert => {
  // Setup.
  const state = AppState.create();
  const callback = 12;
  const action = ActionCreator.setCurrentDamageCallback(callback);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  assert.equal(result.currentDamageCallback, callback);
});

QUnit.test("setCurrentDamageTarget()", assert => {
  // Setup.
  const state = AppState.create();
  const damageTargetKey = 12;
  const action = ActionCreator.setCurrentDamageTarget(damageTargetKey);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  assert.equal(result.currentDamageTargetKey, damageTargetKey);
});

QUnit.test("setCurrentHandCallback()", assert => {
  // Setup.
  const state = AppState.create();
  const callback = 12;
  const action = ActionCreator.setCurrentHandCallback(callback);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  assert.equal(result.currentHandCallback, callback);
});

QUnit.test("setCurrentMove()", assert => {
  // Setup.
  const state = AppState.create();
  const moveState = 12;
  const action = ActionCreator.setCurrentMove(moveState);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  assert.equal(result.currentMove, moveState);
});

QUnit.test("setCurrentMoves()", assert => {
  // Setup.
  const state = AppState.create();
  const moveStates = 12;
  const action = ActionCreator.setCurrentMoves(moveStates);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  assert.equal(result.currentMoves, moveStates);
});

QUnit.test("setCurrentPaymentCoin()", assert => {
  // Setup.
  const state = AppState.create();
  const coinId = 12;
  const action = ActionCreator.setCurrentPaymentCoin(coinId);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  assert.equal(result.currentPaymentCoinId, coinId);
});

QUnit.test("setCurrentPhase()", assert => {
  // Setup.
  const state = AppState.create();
  const phaseKey = "bogus";
  const action = ActionCreator.setCurrentPhase(phaseKey);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  assert.equal(result.currentPhaseKey, phaseKey);
});

QUnit.test("setCurrentPlayer()", assert => {
  // Setup.
  const state = AppState.create();
  const playerId = 12;
  const action = ActionCreator.setCurrentPlayer(playerId);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  assert.equal(result.currentPlayerId, playerId);
});

QUnit.test("setCurrentPlayerOrder()", assert => {
  // Setup.
  const state = AppState.create();
  const playerIds = [4, 3, 2, 1];
  const action = ActionCreator.setCurrentPlayerOrder(playerIds);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  assert.equal(result.currentPlayerOrder.join(), playerIds.join());
});

QUnit.test("setDelay()", assert => {
  // Setup.
  const state = AppState.create();
  const delay = 12;
  const action = ActionCreator.setDelay(delay);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  assert.equal(result.delay, delay);
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

QUnit.test("setPlayerToTableau()", assert => {
  // Setup.
  const state = AppState.create();
  const cardKeys = UnitCard.keys();
  const playerToTableau0 = {
    1: cardKeys.slice(0, 4),
    2: cardKeys.slice(4, 8)
  };
  const action = ActionCreator.setPlayerToTableau(playerToTableau0);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const { playerToTableau } = result;
  assert.ok(playerToTableau);

  const resultTableau1 = playerToTableau[1];
  assert.ok(resultTableau1);
  assert.equal(Array.isArray(resultTableau1), true);
  assert.equal(resultTableau1.length, 4);
  assert.equal(resultTableau1[0], UnitCard.ARCHER);
  assert.equal(resultTableau1[resultTableau1.length - 1], UnitCard.CROSSBOWMAN);

  const resultTableau2 = playerToTableau[2];
  assert.ok(resultTableau2);
  assert.equal(Array.isArray(resultTableau2), true);
  assert.equal(resultTableau2.length, 4);
  assert.equal(resultTableau2[0], UnitCard.ENSIGN);
  assert.equal(resultTableau2[resultTableau2.length - 1], UnitCard.LANCER);
});

QUnit.test("setRound()", assert => {
  // Setup.
  const state = AppState.create();
  const round = 123;
  const action = ActionCreator.setRound(round);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  assert.equal(result.round, round);
});

QUnit.test("setUnit()", assert => {
  // Setup.
  const state0 = AppState.create();
  const an1 = "a1";
  const coinId = 1;
  const coinKey = "knight";
  const coin = CoinState.create({ id: coinId, coinKey });
  const action0 = ActionCreator.addCoin(coin);
  const state = Reducer.root(state0, action0);
  const action = ActionCreator.setUnit(an1, coinId);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const unit = result.anToTokens[an1];
  assert.ok(unit);
  assert.equal(Array.isArray(unit), true);
  assert.equal(unit.length, 1);
  assert.equal(unit[0], coinId);
});

QUnit.test("setUnit() 2", assert => {
  // Setup.
  const state1 = AppState.create();
  const an1 = "a1";
  const coinKey = "knight";
  const coinId1 = 1;
  const coin1 = CoinState.create({ id: coinId1, coinKey });
  const action1 = ActionCreator.addCoin(coin1);
  const state2 = Reducer.root(state1, action1);
  const coinId2 = 2;
  const coin2 = CoinState.create({ id: coinId2, coinKey });
  const action2 = ActionCreator.addCoin(coin2);
  const state3 = Reducer.root(state2, action2);

  const action3 = ActionCreator.setUnit(an1, coinId1);
  const state = Reducer.root(state3, action3);
  const action = ActionCreator.setUnit(an1, coinId2);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  assert.equal(result.anToTokens[an1].join(), "1,2");
});

QUnit.test("setUserMessage()", assert => {
  // Setup.
  const state = AppState.create();
  const userMessage = "bogus";
  const action = ActionCreator.setUserMessage(userMessage);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  assert.equal(result.userMessage, userMessage);
});

QUnit.test("setVerbose()", assert => {
  // Setup.
  const state = AppState.create();
  const isVerbose = false;
  const action = ActionCreator.setVerbose(isVerbose);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  assert.equal(result.isVerbose, isVerbose);
});

QUnit.test("transferBagToHand()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinId = 12;
  const action0 = ActionCreator.addToPlayerArray("playerToBag", playerId, coinId);
  const state = Reducer.root(state0, action0);
  const action = ActionCreator.transferBagToHand(playerId, coinId);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const bag = result.playerToBag[playerId];
  assert.ok(bag);
  assert.equal(bag.length, 0);
  const hand = result.playerToHand[playerId];
  assert.equal(hand.length, 1);
  assert.equal(hand[0], coinId);
});

QUnit.test("transferBoardToDiscardFaceup()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinId = 12;
  const an1 = "e2";
  const action0 = ActionCreator.setUnit(an1, coinId);
  const state = Reducer.root(state0, action0);
  const action = ActionCreator.transferBoardToDiscardFaceup(playerId, an1);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const resultUnit = result.anToTokens[an1];
  assert.equal(resultUnit, undefined);
  const resultDiscardFaceup = result.playerToDiscardFaceup[playerId];
  assert.ok(resultDiscardFaceup);
  assert.equal(Array.isArray(resultDiscardFaceup), true);
  assert.equal(resultDiscardFaceup.length, 1);
  assert.equal(resultDiscardFaceup[0], coinId);
});

QUnit.test("transferBoardToMorgue() 1", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinId = 12;
  const an1 = "e2";
  const action0 = ActionCreator.setUnit(an1, coinId);
  const state = Reducer.root(state0, action0);
  const action = ActionCreator.transferBoardToMorgue(playerId, an1);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const resultUnit = result.anToTokens[an1];
  assert.equal(resultUnit, undefined);
  const resultMorgue = result.playerToMorgue[playerId];
  assert.ok(resultMorgue);
  assert.equal(Array.isArray(resultMorgue), true);
  assert.equal(resultMorgue.length, 1);
  assert.equal(resultMorgue[0], coinId);
});

QUnit.test("transferBoardToMorgue() 2", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinId = 12;
  const an1 = "e2";
  const action0 = ActionCreator.setUnit(an1, coinId);
  const state1 = Reducer.root(state0, action0);
  const state = Reducer.root(state1, action0);
  const action = ActionCreator.transferBoardToMorgue(playerId, an1);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const resultUnit = result.anToTokens[an1];
  assert.equal(resultUnit.join(), coinId);
  const resultMorgue = result.playerToMorgue[playerId];
  assert.ok(resultMorgue);
  assert.equal(Array.isArray(resultMorgue), true);
  assert.equal(resultMorgue.length, 1);
  assert.equal(resultMorgue[0], coinId);
});

QUnit.test("transferHandToBoard()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinId = 1;
  const an = "e2";
  const action0 = ActionCreator.addToPlayerArray("playerToHand", playerId, coinId);
  const state = Reducer.root(state0, action0);
  const action = ActionCreator.transferHandToBoard(playerId, coinId, an);

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
  assert.equal(unit[0], coinId);
});

QUnit.test("transferHandToDiscardFacedown()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinId = 1;
  const action0 = ActionCreator.addToPlayerArray("playerToHand", playerId, coinId);
  const state = Reducer.root(state0, action0);
  const action = ActionCreator.transferHandToDiscardFacedown(playerId, coinId);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const hand = result.playerToHand[playerId];
  assert.ok(hand);
  assert.equal(hand.length, 0);
  const discardFacedown = result.playerToDiscardFacedown[playerId];
  assert.ok(discardFacedown);
  assert.equal(Array.isArray(discardFacedown), true);
  assert.equal(discardFacedown.length, 1);
  assert.equal(discardFacedown[0], coinId);
});

QUnit.test("transferHandToDiscardFaceup()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinId = 1;
  const action0 = ActionCreator.addToPlayerArray("playerToHand", playerId, coinId);
  const state = Reducer.root(state0, action0);
  const action = ActionCreator.transferHandToDiscardFaceup(playerId, coinId);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const hand = result.playerToHand[playerId];
  assert.ok(hand);
  assert.equal(hand.length, 0);
  const discardFaceup = result.playerToDiscardFaceup[playerId];
  assert.ok(discardFaceup);
  assert.equal(Array.isArray(discardFaceup), true);
  assert.equal(discardFaceup.length, 1);
  assert.equal(discardFaceup[0], coinId);
});

QUnit.test("transferSupplyToDiscardFaceup()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinId = 1;
  const action0 = ActionCreator.addToPlayerArray("playerToSupply", playerId, coinId);
  const state = Reducer.root(state0, action0);
  const action = ActionCreator.transferSupplyToDiscardFaceup(playerId, coinId);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const supply = result.playerToSupply[playerId];
  assert.ok(supply);
  assert.equal(supply.length, 0);
  const discardFaceup = result.playerToDiscardFaceup[playerId];
  assert.ok(discardFaceup);
  assert.equal(Array.isArray(discardFaceup), true);
  assert.equal(discardFaceup.length, 1);
  assert.equal(discardFaceup[0], coinId);
});

QUnit.test("transferSupplyToHand()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinId = 1;
  const action0 = ActionCreator.addToPlayerArray("playerToSupply", playerId, coinId);
  const state = Reducer.root(state0, action0);
  const action = ActionCreator.transferBetweenPlayerArrays(
    "playerToSupply",
    "playerToHand",
    playerId,
    coinId
  );

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const supply = result.playerToSupply[playerId];
  assert.ok(supply);
  assert.equal(supply.length, 0);
  const hand = result.playerToHand[playerId];
  assert.ok(hand);
  assert.equal(Array.isArray(hand), true);
  assert.equal(hand.length, 1);
  assert.equal(hand[0], coinId);
});

QUnit.test("transferSupplyToMorgue()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinId = 1;
  const action0 = ActionCreator.addToPlayerArray("playerToSupply", playerId, coinId);
  const state = Reducer.root(state0, action0);
  const action = ActionCreator.transferSupplyToMorgue(playerId, coinId);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  const supply = result.playerToSupply[playerId];
  assert.ok(supply);
  assert.equal(supply.length, 0);
  const morgue = result.playerToMorgue[playerId];
  assert.ok(morgue);
  assert.equal(Array.isArray(morgue), true);
  assert.equal(morgue.length, 1);
  assert.equal(morgue[0], coinId);
});

const ReducerTest = {};
export default ReducerTest;
