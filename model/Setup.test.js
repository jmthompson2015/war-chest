/* eslint no-console: ["error", { allow: ["log"] }] */

import ActionCreator from "../state/ActionCreator.js";
import PlayerState from "../state/PlayerState.js";
import Reducer from "../state/Reducer.js";
import Selector from "../state/Selector.js";

import Setup from "./Setup.js";

QUnit.module("Setup");

QUnit.test("Setup.execute()", assert => {
  // Setup.
  const store = Redux.createStore(Reducer.root);
  const ravenPlayer = PlayerState.create({ id: 1, name: "Raven" });
  const wolfPlayer = PlayerState.create({ id: 2, name: "Wolf" });
  store.dispatch(ActionCreator.setPlayers([ravenPlayer, wolfPlayer]));

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
  assert.equal(player1Bag.length, 9);
  const player2Bag = Selector.bag(2, state);
  assert.ok(player2Bag);
  assert.equal(player2Bag.length, 9);
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

QUnit.skip("state", assert => {
  // Setup.
  const store = Redux.createStore(Reducer.root);
  const ravenPlayer = PlayerState.create({ id: 1, name: "Raven" });
  const wolfPlayer = PlayerState.create({ id: 2, name: "Wolf" });
  store.dispatch(ActionCreator.setPlayers([ravenPlayer, wolfPlayer]));
  Setup.execute(store);

  // Run / Verify.
  assert.ok(store);
  console.log(`state = ${JSON.stringify(store.getState(), null, 3)}`);
});

const SetupTest = {};
export default SetupTest;
