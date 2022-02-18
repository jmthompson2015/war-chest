/* eslint no-console: ["error", { allow: ["log"] }] */

import UnitCard from "../artifact/UnitCard.js";

import ActionCreator from "../state/ActionCreator.js";
import PlayerState from "../state/PlayerState.js";
import Reducer from "../state/Reducer.js";
import Selector from "../state/Selector.js";

import Setup from "./Setup.js";

QUnit.module("Setup");

QUnit.test("Setup.determinePlayerToTableau() 2", (assert) => {
  // Setup.
  const playerCount = 2;
  const cardKeys = UnitCard.keys();
  const initialPlayerToTableau = {
    1: cardKeys.slice(0, 4),
    2: cardKeys.slice(4, 8),
  };

  // Run.
  const result = Setup.determinePlayerToTableau(playerCount, initialPlayerToTableau);

  // Verify.
  assert.ok(result);
  assert.equal(Object.keys(result).length, playerCount);

  const tableau1 = result[1];
  assert.ok(tableau1);
  assert.equal(tableau1.length, 4);
  assert.equal(tableau1[0], UnitCard.ARCHER);
  assert.equal(tableau1[tableau1.length - 1], UnitCard.CROSSBOWMAN);

  const tableau2 = result[2];
  assert.ok(tableau2);
  assert.equal(tableau2.length, 4);
  assert.equal(tableau2[0], UnitCard.ENSIGN);
  assert.equal(tableau2[tableau2.length - 1], UnitCard.LANCER);
});

QUnit.test("Setup.determinePlayerToTableau() 4", (assert) => {
  // Setup.
  const playerCount = 4;
  const cardKeys = UnitCard.keys();
  const initialPlayerToTableau = {
    1: cardKeys.slice(0, 4),
    2: cardKeys.slice(4, 8),
    3: cardKeys.slice(8, 11),
    4: cardKeys.slice(11, 14),
  };

  // Run.
  const result = Setup.determinePlayerToTableau(playerCount, initialPlayerToTableau);

  // Verify.
  assert.ok(result);
  assert.equal(Object.keys(result).length, playerCount);

  const tableau1 = result[1];
  assert.ok(tableau1);
  assert.equal(tableau1.length, 3);

  const tableau2 = result[2];
  assert.ok(tableau2);
  assert.equal(tableau2.length, 3);

  const tableau3 = result[3];
  assert.ok(tableau3);
  assert.equal(tableau3.length, 3);

  const tableau4 = result[4];
  assert.ok(tableau4);
  assert.equal(tableau4.length, 3);
});

QUnit.test("Setup.createInitialPlayerToTableau()", (assert) => {
  // Setup.

  // Run.
  const result = Setup.createInitialPlayerToTableau();

  // Verify.
  assert.ok(result);
  assert.equal(Object.keys(result).length, 4);

  const tableau1 = result[1];
  assert.ok(tableau1);
  assert.equal(tableau1.length, 4);

  const tableau2 = result[2];
  assert.ok(tableau2);
  assert.equal(tableau2.length, 4);

  const tableau3 = result[3];
  assert.ok(tableau3);
  assert.equal(tableau3.length, 3);

  const tableau4 = result[4];
  assert.ok(tableau4);
  assert.equal(tableau4.length, 3);
});

QUnit.test("Setup.execute()", (assert) => {
  // Setup.
  const store = Redux.createStore(Reducer.root);
  const ravenPlayer = PlayerState.create({ id: 1, name: "Raven" });
  const wolfPlayer = PlayerState.create({ id: 2, name: "Wolf" });
  store.dispatch(ActionCreator.setPlayers([ravenPlayer, wolfPlayer]));
  const initialPlayerToTableau = Setup.createInitialPlayerToTableau();
  const playerToTableau = Setup.determinePlayerToTableau(2, initialPlayerToTableau);
  store.dispatch(ActionCreator.setPlayerToTableau(playerToTableau));

  // Run.
  Setup.execute(store);

  // Verify.
  const state = store.getState();
  const { anToControl, anToTokens, playerInstances } = state;
  assert.ok(anToControl);
  assert.equal(Object.keys(anToControl).length, 10);
  assert.ok(anToTokens);
  assert.equal(Object.keys(anToTokens).length, 0);
  assert.ok(playerInstances);
  assert.equal(Object.keys(playerInstances).length, 2);

  const player1Bag = Selector.bag(1, state);
  assert.ok(player1Bag);
  assert.equal(player1Bag.length, 9, `player1Bag.length = ${player1Bag.length}`);
  const player2Bag = Selector.bag(2, state);
  assert.ok(player2Bag);
  assert.equal(player2Bag.length, 9, `player2Bag.length = ${player2Bag.length}`);
  assert.equal([1, 2].includes(Selector.initiativePlayer(state).id), true);

  const player1Tableau = Selector.tableau(1, state);
  assert.ok(player1Tableau);
  assert.equal(player1Tableau.length, 4);
  const player2Tableau = Selector.tableau(2, state);
  assert.ok(player2Tableau);
  assert.equal(player2Tableau.length, 4);

  const player1Supply = Selector.supply(1, state);
  assert.ok(player1Supply);
  assert.equal(player1Supply.length >= 8 && player1Supply.length <= 12, true);
  const player2Supply = Selector.supply(2, state);
  assert.ok(player2Supply);
  assert.equal(player2Supply.length >= 8 && player2Supply.length <= 12, true);
});

QUnit.skip("state", (assert) => {
  // Setup.
  const store = Redux.createStore(Reducer.root);
  const ravenPlayer = PlayerState.create({ id: 1, name: "Raven" });
  const wolfPlayer = PlayerState.create({ id: 2, name: "Wolf" });
  store.dispatch(ActionCreator.setPlayers([ravenPlayer, wolfPlayer]));
  Setup.execute(store);

  // Run / Verify.
  assert.ok(store);
});

const SetupTest = {};
export default SetupTest;
