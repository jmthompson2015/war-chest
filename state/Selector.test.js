import Board from "../artifact/Board.js";
import ControlMarker from "../artifact/ControlMarker.js";
import Team from "../artifact/Team.js";

import AppState from "./AppState.js";
import ActionCreator from "./ActionCreator.js";
import PlayerState from "./PlayerState.js";
import Reducer from "./Reducer.js";
import Selector from "./Selector.js";

QUnit.module("Selector");

const createPlayers2 = () => {
  const ravenPlayer1 = PlayerState.create({
    id: 1,
    name: "Alan",
    teamKey: Team.RAVEN
  });
  const wolfPlayer1 = PlayerState.create({
    id: 2,
    name: "Brian",
    teamKey: Team.WOLF
  });

  return [ravenPlayer1, wolfPlayer1];
};

const createPlayers4 = () => {
  const ravenPlayer1 = PlayerState.create({
    id: 1,
    name: "Alan",
    teamKey: Team.RAVEN
  });
  const wolfPlayer1 = PlayerState.create({
    id: 2,
    name: "Brian",
    teamKey: Team.WOLF
  });
  const ravenPlayer2 = PlayerState.create({
    id: 3,
    name: "Chris",
    teamKey: Team.RAVEN
  });
  const wolfPlayer2 = PlayerState.create({
    id: 4,
    name: "David",
    teamKey: Team.WOLF
  });

  return [ravenPlayer1, wolfPlayer1, ravenPlayer2, wolfPlayer2];
};

QUnit.test("bag()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinKey = "knight";
  const action = ActionCreator.addToPlayerArray("playerToBag", playerId, coinKey);
  const state = Reducer.root(state0, action);

  // Run.
  const result = Selector.bag(playerId, state);

  // Verify.
  assert.ok(result);
  assert.ok(Array.isArray(result));
  assert.equal(result.length, 1);
  assert.equal(result.includes(coinKey), true);
  assert.equal(result[0], coinKey);
});

QUnit.test("controlLocations()", assert => {
  // Setup.
  let state = AppState.create();
  const teamKey = Team.RAVEN;
  const controlPoints = Board.CONTROL_POINTS_2P;
  R.forEach(an => {
    const action = ActionCreator.setControl(an, ControlMarker.NEUTRAL);
    state = Reducer.root(state, action);
  }, controlPoints);
  const controlANs = Board.RAVEN_STARTER_CONTROL_POINTS_2P;
  R.forEach(an => {
    const action = ActionCreator.setControl(an, ControlMarker.RAVEN);
    state = Reducer.root(state, action);
  }, controlANs);

  // Run.
  const result = Selector.controlANs(teamKey, state);

  // Verify.
  assert.ok(result);
  assert.ok(Array.isArray(result));
  assert.equal(result.length, 2);
  assert.equal(result[0], "e2");
  assert.equal(result[1], "h1");
});

QUnit.test("morgue()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinKey = "knight";
  const action = ActionCreator.addToPlayerArray("playerToMorgue", playerId, coinKey);
  const state = Reducer.root(state0, action);

  // Run.
  const result = Selector.morgue(playerId, state);

  // Verify.
  assert.ok(result);
  assert.ok(Array.isArray(result));
  assert.equal(result.length, 1);
  assert.equal(result.includes(coinKey), true);
  assert.equal(result[0], coinKey);
});

QUnit.test("discardFacedown()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinKey = "knight";
  const action = ActionCreator.addToPlayerArray("playerToDiscardFacedown", playerId, coinKey);
  const state = Reducer.root(state0, action);

  // Run.
  const result = Selector.discardFacedown(playerId, state);

  // Verify.
  assert.ok(result);
  assert.ok(Array.isArray(result));
  assert.equal(result.length, 1);
  assert.equal(result.includes(coinKey), true);
  assert.equal(result[0], coinKey);
});

QUnit.test("discardFaceup()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinKey = "knight";
  const action = ActionCreator.addToPlayerArray("playerToDiscardFaceup", playerId, coinKey);
  const state = Reducer.root(state0, action);

  // Run.
  const result = Selector.discardFaceup(playerId, state);

  // Verify.
  assert.ok(result);
  assert.ok(Array.isArray(result));
  assert.equal(result.length, 1);
  assert.equal(result.includes(coinKey), true);
  assert.equal(result[0], coinKey);
});

QUnit.test("hand()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinKey = "knight";
  const action = ActionCreator.addToPlayerArray("playerToHand", playerId, coinKey);
  const state = Reducer.root(state0, action);

  // Run.
  const result = Selector.hand(playerId, state);

  // Verify.
  assert.ok(result);
  assert.ok(Array.isArray(result));
  assert.equal(result.length, 1);
  assert.equal(result.includes(coinKey), true);
  assert.equal(result[0], coinKey);
});

QUnit.test("isControlLocation()", assert => {
  // Setup.
  const state = AppState.create();

  // Run / Verify.
  assert.equal(Selector.isControlLocation("a1", state), false);
  assert.equal(Selector.isControlLocation("c6", state), true);
  assert.equal(Selector.isControlLocation("d4", state), true);
  assert.equal(Selector.isControlLocation("d7", state), true);
  assert.equal(Selector.isControlLocation("e2", state), true);
});

QUnit.test("isFourPlayer()", assert => {
  // Setup.
  const state0 = AppState.create();
  const players = createPlayers4();
  const action0 = ActionCreator.setPlayers(players);
  const state = Reducer.root(state0, action0);

  // Run / Verify.
  assert.equal(Selector.isTwoPlayer(state), false);
  assert.equal(Selector.isFourPlayer(state), true);
});

QUnit.test("isTwoPlayer()", assert => {
  // Setup.
  const state0 = AppState.create();
  const players = createPlayers2();
  const action0 = ActionCreator.setPlayers(players);
  const state = Reducer.root(state0, action0);

  // Run / Verify.
  assert.equal(Selector.isTwoPlayer(state), true);
  assert.equal(Selector.isFourPlayer(state), false);
});

QUnit.test("isUnitType()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 1;
  const coinKey = "knight";
  const action0 = ActionCreator.addToPlayerArray("playerToHand", playerId, coinKey);
  const an = "e2";
  const state1 = Reducer.root(state0, action0);
  const action1 = ActionCreator.setUnit(an, coinKey);
  const state = Reducer.root(state1, action1);

  // Run.
  const result = Selector.isUnitType(an, coinKey, state);

  // Verify.
  assert.equal(result, true);
});

QUnit.test("playersInOrder() 1", assert => {
  // Setup.
  const state0 = AppState.create();
  const players = createPlayers4();
  const action0 = ActionCreator.setPlayers(players);
  const state1 = Reducer.root(state0, action0);
  const action1 = ActionCreator.setInitiativePlayer(1);
  const state = Reducer.root(state1, action1);

  // Run.
  const result = Selector.playersInOrder(state);

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 4);
  assert.equal(result[0].id, 1);
  assert.equal(result[1].id, 2);
  assert.equal(result[2].id, 3);
  assert.equal(result[3].id, 4);
});

QUnit.test("playersInOrder() 2", assert => {
  // Setup.
  const state0 = AppState.create();
  const players = createPlayers4();
  const action0 = ActionCreator.setPlayers(players);
  const state1 = Reducer.root(state0, action0);
  const action1 = ActionCreator.setInitiativePlayer(2);
  const state = Reducer.root(state1, action1);

  // Run.
  const result = Selector.playersInOrder(state);

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 4);
  assert.equal(result[0].id, 2);
  assert.equal(result[1].id, 3);
  assert.equal(result[2].id, 4);
  assert.equal(result[3].id, 1);
});

QUnit.test("playersInOrder() 3", assert => {
  // Setup.
  const state0 = AppState.create();
  const players = createPlayers4();
  const action0 = ActionCreator.setPlayers(players);
  const state1 = Reducer.root(state0, action0);
  const action1 = ActionCreator.setInitiativePlayer(3);
  const state = Reducer.root(state1, action1);

  // Run.
  const result = Selector.playersInOrder(state);

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 4);
  assert.equal(result[0].id, 3);
  assert.equal(result[1].id, 4);
  assert.equal(result[2].id, 1);
  assert.equal(result[3].id, 2);
});

QUnit.test("playersInOrder() 4", assert => {
  // Setup.
  const state0 = AppState.create();
  const players = createPlayers4();
  const action0 = ActionCreator.setPlayers(players);
  const state1 = Reducer.root(state0, action0);
  const action1 = ActionCreator.setInitiativePlayer(4);
  const state = Reducer.root(state1, action1);

  // Run.
  const result = Selector.playersInOrder(state);

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 4);
  assert.equal(result[0].id, 4);
  assert.equal(result[1].id, 1);
  assert.equal(result[2].id, 2);
  assert.equal(result[3].id, 3);
});

QUnit.test("possibleControlANs()", assert => {
  // Setup.
  let state = AppState.create();
  const teamKey = Team.RAVEN;
  const controlPoints = Board.CONTROL_POINTS_2P;
  R.forEach(an => {
    const action = ActionCreator.setControl(an, ControlMarker.NEUTRAL);
    state = Reducer.root(state, action);
  }, controlPoints);
  let controlANs = Board.RAVEN_STARTER_CONTROL_POINTS_2P;
  R.forEach(an => {
    const action = ActionCreator.setControl(an, ControlMarker.RAVEN);
    state = Reducer.root(state, action);
  }, controlANs);
  controlANs = Board.WOLF_STARTER_CONTROL_POINTS_2P;
  R.forEach(an => {
    const action = ActionCreator.setControl(an, ControlMarker.WOLF);
    state = Reducer.root(state, action);
  }, controlANs);

  // Run.
  const result = Selector.possibleControlANs(teamKey, state);

  // Verify.
  assert.ok(result);
  assert.ok(Array.isArray(result));
  const length = 8;
  assert.equal(result.length, length);
  assert.equal(result[0], "c6");
  assert.equal(result[length - 1], "i2");
});

QUnit.test("supply()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinKey = "knight";
  const action = ActionCreator.addToPlayerArray("playerToSupply", playerId, coinKey);
  const state = Reducer.root(state0, action);

  // Run.
  const result = Selector.supply(playerId, state);

  // Verify.
  assert.ok(result);
  assert.ok(Array.isArray(result));
  assert.equal(result.length, 1);
  assert.equal(result.includes(coinKey), true);
  assert.equal(result[0], coinKey);
});

QUnit.test("tableau()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinKey = "knight";
  const action = ActionCreator.addToPlayerArray("playerToTableau", playerId, coinKey);
  const state = Reducer.root(state0, action);

  // Run.
  const result = Selector.tableau(playerId, state);

  // Verify.
  assert.ok(result);
  assert.ok(Array.isArray(result));
  assert.equal(result.length, 1);
  assert.equal(result.includes(coinKey), true);
  assert.equal(result[0], coinKey);
});

const ReducerTest = {};
export default ReducerTest;
