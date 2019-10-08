import Board from "../artifact/Board.js";
import ControlMarker from "../artifact/ControlMarker.js";
import Team from "../artifact/Team.js";
import UnitCard from "../artifact/UnitCard.js";
import UnitCoin from "../artifact/UnitCoin.js";

import AppState from "./AppState.js";
import ActionCreator from "./ActionCreator.js";
import CoinState from "./CoinState.js";
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

QUnit.test("delay()", assert => {
  // Setup.
  const state = AppState.create();

  // Run.
  const result = Selector.delay(state);

  // Verify.
  assert.equal(result, 1000);
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

QUnit.test("isEnemyUnit()", assert => {
  // Setup.
  const state0 = AppState.create();
  const players = createPlayers4();
  const action0 = ActionCreator.setPlayers(players);
  const state1 = Reducer.root(state0, action0);
  const coinKey1 = UnitCoin.SWORDSMAN;
  const action1 = ActionCreator.addToPlayerArray("playerToTableau", 1, coinKey1);
  const state2 = Reducer.root(state1, action1);
  const coinKey2 = UnitCoin.ARCHER;
  const action2 = ActionCreator.addToPlayerArray("playerToTableau", 2, coinKey2);
  const state = Reducer.root(state2, action2);

  // Run / Verify.
  assert.equal(Selector.isEnemyUnit(1, coinKey1, state), false);
  assert.equal(Selector.isEnemyUnit(1, coinKey2, state), true);
  assert.equal(Selector.isEnemyUnit(2, coinKey1, state), true);
  assert.equal(Selector.isEnemyUnit(2, coinKey2, state), false);
});

QUnit.test("isEnemyUnitAt()", assert => {
  // Setup.
  const state0 = AppState.create();
  const players = createPlayers4();
  const action0 = ActionCreator.setPlayers(players);
  const state1 = Reducer.root(state0, action0);
  const an1 = "e2";
  const coinKey1 = UnitCoin.SWORDSMAN;
  const action1 = ActionCreator.setUnit(an1, coinKey1);
  const state2 = Reducer.root(state1, action1);
  const action2 = ActionCreator.addToPlayerArray("playerToTableau", 1, coinKey1);
  const state3 = Reducer.root(state2, action2);
  const an2 = "f2";
  const coinKey2 = UnitCoin.ARCHER;
  const action3 = ActionCreator.setUnit(an2, coinKey2);
  const state4 = Reducer.root(state3, action3);
  const action4 = ActionCreator.addToPlayerArray("playerToTableau", 2, coinKey2);
  const state = Reducer.root(state4, action4);

  // Run / Verify.
  assert.equal(Selector.isEnemyUnitAt(1, an1, state), false);
  assert.equal(Selector.isEnemyUnitAt(1, an2, state), true);
  assert.equal(Selector.isEnemyUnitAt(2, an1, state), true);
  assert.equal(Selector.isEnemyUnitAt(2, an2, state), false);
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

QUnit.test("isFriendlyUnit()", assert => {
  // Setup.
  const state0 = AppState.create();
  const players = createPlayers4();
  const action0 = ActionCreator.setPlayers(players);
  const state1 = Reducer.root(state0, action0);
  const coinKey1 = UnitCoin.SWORDSMAN;
  const action1 = ActionCreator.addToPlayerArray("playerToTableau", 1, coinKey1);
  const state2 = Reducer.root(state1, action1);
  const coinKey2 = UnitCoin.ARCHER;
  const action2 = ActionCreator.addToPlayerArray("playerToTableau", 2, coinKey2);
  const state = Reducer.root(state2, action2);

  // Run / Verify.
  assert.equal(Selector.isFriendlyUnit(1, coinKey1, state), true);
  assert.equal(Selector.isFriendlyUnit(1, coinKey2, state), false);
  assert.equal(Selector.isFriendlyUnit(2, coinKey1, state), false);
  assert.equal(Selector.isFriendlyUnit(2, coinKey2, state), true);
});

QUnit.test("isFriendlyUnitAt()", assert => {
  // Setup.
  const state0 = AppState.create();
  const players = createPlayers4();
  const action0 = ActionCreator.setPlayers(players);
  const state1 = Reducer.root(state0, action0);

  const an1 = "e2";
  const coinKey1 = UnitCoin.SWORDSMAN;
  const action1 = ActionCreator.setUnit(an1, coinKey1);
  const state2 = Reducer.root(state1, action1);
  const action2 = ActionCreator.addToPlayerArray("playerToTableau", 1, coinKey1);
  const state3 = Reducer.root(state2, action2);
  const an2 = "f2";
  const coinKey2 = UnitCoin.ARCHER;
  const action3 = ActionCreator.setUnit(an2, coinKey2);
  const state4 = Reducer.root(state3, action3);
  const action4 = ActionCreator.addToPlayerArray("playerToTableau", 2, coinKey2);
  const state = Reducer.root(state4, action4);

  // Run / Verify.
  assert.equal(Selector.isFriendlyUnitAt(1, an1, state), true);
  assert.equal(Selector.isFriendlyUnitAt(1, an2, state), false);
  assert.equal(Selector.isFriendlyUnitAt(2, an1, state), false);
  assert.equal(Selector.isFriendlyUnitAt(2, an2, state), true);
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

QUnit.test("nextCoinId()", assert => {
  // Setup.
  const state1 = AppState.create();

  // Run / Verify.
  assert.equal(Selector.nextCoinId(state1), 1);

  const coin = CoinState.create({ id: 12, coinKey: UnitCoin.KNIGHT });
  const action1 = ActionCreator.addCoin(coin);
  const state2 = Reducer.root(state1, action1);

  // Run / Verify.
  assert.equal(Selector.nextCoinId(state2), 13);
});

QUnit.test("nextPlayerId()", assert => {
  // Setup.
  const state1 = AppState.create();

  // Run / Verify.
  assert.equal(Selector.nextPlayerId(state1), 1);

  const players = createPlayers2();
  const action1 = ActionCreator.setPlayers(players);
  const state2 = Reducer.root(state1, action1);

  // Run / Verify.
  assert.equal(Selector.nextPlayerId(state2), 3);
});

QUnit.test("playerForCard() 1", assert => {
  // Setup.
  const state0 = AppState.create();
  const players = createPlayers4();
  const action0 = ActionCreator.setPlayers(players);
  const state1 = Reducer.root(state0, action0);
  const playerId = 1;
  const cardKey = "knight";
  const action1 = ActionCreator.addToPlayerArray("playerToTableau", playerId, cardKey);
  const state = Reducer.root(state1, action1);

  // Run.
  const result = Selector.playerForCard(cardKey, state);

  // Verify.
  assert.ok(result);
  assert.equal(result.id, playerId);
});

QUnit.test("playerForCard() none", assert => {
  // Setup.
  const state0 = AppState.create();
  const players = createPlayers4();
  const action0 = ActionCreator.setPlayers(players);
  const state1 = Reducer.root(state0, action0);
  const playerId = 1;
  const cardKey = "knight";
  const action1 = ActionCreator.addToPlayerArray("playerToTableau", playerId, UnitCard.ARCHER);
  const state = Reducer.root(state1, action1);

  // Run.
  const result = Selector.playerForCard(cardKey, state);

  // Verify.
  assert.equal(result, undefined);
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

QUnit.test("playerUnitANs()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 1;
  const coinKey = "knight";
  const action0 = ActionCreator.addToPlayerArray("playerToHand", playerId, coinKey);
  const state1 = Reducer.root(state0, action0);
  const action1 = ActionCreator.addToPlayerArray("playerToTableau", playerId, coinKey);
  const state2 = Reducer.root(state1, action1);
  const an = "e2";
  const action2 = ActionCreator.setUnit(an, coinKey);
  const state = Reducer.root(state2, action2);

  // Run.
  const result = Selector.playerUnitANs(playerId, state);

  // Verify.
  assert.ok(result);
  assert.equal(result.length, 1);
  assert.equal(result[0], an);
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
