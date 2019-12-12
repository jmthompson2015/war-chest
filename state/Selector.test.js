import Board from "../artifact/Board.js";
import ControlMarker from "../artifact/ControlMarker.js";
import DamageTarget from "../artifact/DamageTarget.js";
import Resolver from "../artifact/Resolver.js";
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

const addCoin = (id, coinKey, state) => {
  const coin = CoinState.create({ id, coinKey });
  const action = ActionCreator.addCoin(coin);

  return Reducer.root(state, action);
};

const addCoinToSupply = (playerId, id, coinKey, state) => {
  const state1 = addCoin(id, coinKey, state);
  const action1 = ActionCreator.addToPlayerArray("playerToSupply", playerId, id);

  return Reducer.root(state1, action1);
};

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

const fillBoard4 = state => {
  const state1 = addCoin(1, UnitCoin.ARCHER, state);
  const an1 = "e2";
  const action1 = ActionCreator.setUnit(an1, 1);
  const state2 = Reducer.root(state1, action1);

  const state3 = addCoin(2, UnitCoin.CROSSBOWMAN, state2);
  const an2 = "d7";
  const action3 = ActionCreator.setUnit(an2, 2);
  const state4 = Reducer.root(state3, action3);

  const state5 = addCoin(3, UnitCoin.KNIGHT, state4);
  const an3 = "h1";
  const action5 = ActionCreator.setUnit(an3, 3);
  const state6 = Reducer.root(state5, action5);

  const state7 = addCoin(4, UnitCoin.MARSHALL, state6);
  const an4 = "g6";
  const action7 = ActionCreator.setUnit(an4, 4);

  return Reducer.root(state7, action7);
};

const fillTableau4 = state => {
  const myCardKeys = {
    1: [UnitCard.ARCHER, UnitCard.BERSERKER, UnitCard.CAVALRY],
    2: [UnitCard.CROSSBOWMAN, UnitCard.ENSIGN, UnitCard.FOOTMAN],
    3: [UnitCard.KNIGHT, UnitCard.LANCER, UnitCard.LIGHT_CAVALRY],
    4: [UnitCard.MARSHALL, UnitCard.MERCENARY, UnitCard.PIKEMAN]
  };
  let myState = state;

  for (let playerId = 1; playerId <= 4; playerId += 1) {
    const cardKeys = myCardKeys[playerId];
    const reduceFunction = (accum, cardKey) => {
      const action = ActionCreator.addToPlayerArray("playerToTableau", playerId, cardKey);
      return Reducer.root(accum, action);
    };
    myState = R.reduce(reduceFunction, myState, cardKeys);
  }

  return myState;
};

// /////////////////////////////////////////////////////////////////////////////////////////////////
QUnit.test("ansByType()", assert => {
  // Setup.
  const state0 = AppState.create();
  const players = createPlayers2();
  const action0 = ActionCreator.setPlayers(players);
  const state1 = Reducer.root(state0, action0);
  const an1 = "e2";
  const state2 = addCoin(Selector.nextCoinId(state1), UnitCoin.SWORDSMAN, state1);
  const coin1 = Selector.coin(1, state2);
  const action2 = ActionCreator.setUnit(an1, coin1.id);
  const state3 = Reducer.root(state2, action2);

  const an2 = "f2";
  const state4 = addCoin(Selector.nextCoinId(state3), UnitCoin.ARCHER, state3);
  const coin2 = Selector.coin(2, state4);
  const action4 = ActionCreator.setUnit(an2, coin2.id);
  const state = Reducer.root(state4, action4);

  // Run.
  const result1 = Selector.ansByType(UnitCoin.SWORDSMAN, state);

  // Verify.
  assert.ok(result1);
  assert.equal(Array.isArray(result1), true);
  assert.equal(result1.length, 1);
  assert.equal(result1.join(), "e2");

  // Run.
  const result2 = Selector.ansByType(UnitCoin.ARCHER, state);

  // Verify.
  assert.ok(result2);
  assert.equal(Array.isArray(result2), true);
  assert.equal(result2.length, 1);
  assert.equal(result2.join(), "f2");

  // Run.
  const result3 = Selector.ansByType(UnitCoin.BERSERKER, state);

  // Verify.
  assert.ok(result3);
  assert.equal(Array.isArray(result3), true);
  assert.equal(result3.length, 0);
});

QUnit.test("bag()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinId = 12;
  const action = ActionCreator.addToPlayerArray("playerToBag", playerId, coinId);
  const state = Reducer.root(state0, action);

  // Run.
  const result = Selector.bag(playerId, state);

  // Verify.
  assert.ok(result);
  assert.ok(Array.isArray(result));
  assert.equal(result.length, 1);
  assert.equal(result.includes(coinId), true);
  assert.equal(result[0], coinId);
});

QUnit.test("canBeAttacked()", assert => {
  // Setup.
  const state0 = AppState.create();
  const players = createPlayers2();
  const action0 = ActionCreator.setPlayers(players);
  const state1 = Reducer.root(state0, action0);
  const an1 = "e2";
  const state2 = addCoin(Selector.nextCoinId(state1), UnitCoin.SWORDSMAN, state1);
  const coin1 = Selector.coin(1, state2);
  const action2 = ActionCreator.setUnit(an1, coin1.id);
  const state3 = Reducer.root(state2, action2);

  const an2 = "e3";
  const state4 = addCoin(Selector.nextCoinId(state3), UnitCoin.ARCHER, state3);
  const coin2 = Selector.coin(2, state4);
  const action4 = ActionCreator.setUnit(an2, coin2.id);
  const state = Reducer.root(state4, action4);

  // Run / Verify.
  assert.equal(Selector.canBeAttacked(an1, an2, state), true);
});

QUnit.test("canBeAttacked() Knight", assert => {
  // Setup.
  const state0 = AppState.create();
  const players = createPlayers2();
  const action0 = ActionCreator.setPlayers(players);
  const state1 = Reducer.root(state0, action0);
  const an1 = "e2";
  const state2 = addCoin(Selector.nextCoinId(state1), UnitCoin.SWORDSMAN, state1);
  const coin1 = Selector.coin(1, state2);
  const action2 = ActionCreator.setUnit(an1, coin1.id);
  const state3 = Reducer.root(state2, action2);

  const an2 = "e3";
  const state4 = addCoin(Selector.nextCoinId(state3), UnitCoin.KNIGHT, state3);
  const coin2 = Selector.coin(2, state4);
  const action4 = ActionCreator.setUnit(an2, coin2.id);
  const state5 = Reducer.root(state4, action4);

  // Run / Verify.
  assert.equal(Selector.canBeAttacked(an1, an2, state5), false);

  // Bolster.
  const state6 = addCoin(Selector.nextCoinId(state5), UnitCoin.SWORDSMAN, state5);
  const coin3 = Selector.coin(3, state6);
  const action6 = ActionCreator.setUnit(an1, coin3.id);
  const state = Reducer.root(state6, action6);

  // Run / Verify.
  assert.equal(Selector.canBeAttacked(an1, an2, state), true);
});

QUnit.test("canDeploy()", assert => {
  // Setup.
  const state0 = AppState.create();
  const players = createPlayers2();
  const action0 = ActionCreator.setPlayers(players);
  const state1 = Reducer.root(state0, action0);
  const an1 = "e2";
  const state2 = addCoin(Selector.nextCoinId(state1), UnitCoin.SWORDSMAN, state1);
  const coin1 = Selector.coin(1, state2);
  const action2 = ActionCreator.setUnit(an1, coin1.id);
  const state3 = Reducer.root(state2, action2);

  const an2 = "f2";
  const state4 = addCoin(Selector.nextCoinId(state3), UnitCoin.ARCHER, state3);
  const coin2 = Selector.coin(2, state4);
  const action4 = ActionCreator.setUnit(an2, coin2.id);
  const state = Reducer.root(state4, action4);

  // Run / Verify.
  assert.equal(Selector.canDeploy(UnitCoin.ARCHER, state), false);
  assert.equal(Selector.canDeploy(UnitCoin.BERSERKER, state), true);
  assert.equal(Selector.canDeploy(UnitCoin.CAVALRY, state), true);
  assert.equal(Selector.canDeploy(UnitCoin.CROSSBOWMAN, state), true);
  assert.equal(Selector.canDeploy(UnitCoin.SWORDSMAN, state), false);
});

QUnit.test("canDeploy() Footman", assert => {
  // Setup.
  const state0 = AppState.create();
  const players = createPlayers4();
  const action0 = ActionCreator.setPlayers(players);
  const state1 = Reducer.root(state0, action0);

  // Run / Verify.
  assert.equal(
    Selector.canDeploy(UnitCoin.FOOTMAN, state1),
    true,
    `ansByType = ${JSON.stringify(Selector.ansByType(UnitCoin.FOOTMAN, state1))}`
  );

  const an1 = "e2";
  const state2 = addCoin(Selector.nextCoinId(state1), UnitCoin.FOOTMAN, state1);
  const coin1 = Selector.coin(1, state2);
  const action2 = ActionCreator.setUnit(an1, coin1.id);
  const state3 = Reducer.root(state2, action2);

  // Run / Verify.
  assert.equal(
    Selector.canDeploy(UnitCoin.FOOTMAN, state3),
    true,
    `ansByType = ${JSON.stringify(Selector.ansByType(UnitCoin.FOOTMAN, state3))}`
  );

  const an2 = "f2";
  const state4 = addCoin(Selector.nextCoinId(state3), UnitCoin.FOOTMAN, state3);
  const coin2 = Selector.coin(2, state4);
  const action4 = ActionCreator.setUnit(an2, coin2.id);
  const state = Reducer.root(state4, action4);

  // Run / Verify.
  assert.equal(
    Selector.canDeploy(UnitCoin.FOOTMAN, state),
    false,
    `ansByType = ${JSON.stringify(Selector.ansByType(UnitCoin.FOOTMAN, state))}`
  );
});

QUnit.test("coin()", assert => {
  // Setup.
  const state0 = AppState.create();
  const coinId = 1;
  const coinKey = UnitCoin.KNIGHT;
  const state = addCoin(coinId, coinKey, state0);

  // Run / Verify.
  const result = Selector.coin(coinId, state);

  // Run / Verify.
  assert.ok(result);
  assert.equal(result.id, coinId);
  assert.equal(result.coinKey, coinKey);
});

QUnit.test("coinForUnit()", assert => {
  // Setup.
  const state0 = AppState.create();
  const players = createPlayers2();
  const action0 = ActionCreator.setPlayers(players);
  const state1 = Reducer.root(state0, action0);
  const an1 = "e2";
  const state2 = addCoin(Selector.nextCoinId(state1), UnitCoin.SWORDSMAN, state1);
  const coin1 = Selector.coin(1, state2);
  const action2 = ActionCreator.setUnit(an1, coin1.id);
  const state = Reducer.root(state2, action2);

  // Run.
  const result = Selector.coinForUnit(an1, state);

  // Verify.
  assert.ok(result);
  assert.equal(result.id, 1);
  assert.equal(result.coinKey, UnitCoin.SWORDSMAN);
});

QUnit.test("coinIdForUnit()", assert => {
  // Setup.
  const state0 = AppState.create();
  const players = createPlayers2();
  const action0 = ActionCreator.setPlayers(players);
  const state1 = Reducer.root(state0, action0);
  const an1 = "e2";
  const state2 = addCoin(Selector.nextCoinId(state1), UnitCoin.SWORDSMAN, state1);
  const coin1 = Selector.coin(1, state2);
  const action2 = ActionCreator.setUnit(an1, coin1.id);
  const state = Reducer.root(state2, action2);

  // Run.
  const result = Selector.coinIdForUnit(an1, state);

  // Verify.
  assert.ok(result);
  assert.equal(result, 1);
});

QUnit.test("coinKeyForUnit()", assert => {
  // Setup.
  const state0 = AppState.create();
  const players = createPlayers2();
  const action0 = ActionCreator.setPlayers(players);
  const state1 = Reducer.root(state0, action0);
  const an1 = "e2";
  const state2 = addCoin(Selector.nextCoinId(state1), UnitCoin.SWORDSMAN, state1);
  const coin1 = Selector.coin(1, state2);
  const action2 = ActionCreator.setUnit(an1, coin1.id);
  const state = Reducer.root(state2, action2);

  // Run.
  const result = Selector.coinKeyForUnit(an1, state);

  // Verify.
  assert.ok(result);
  assert.equal(result, UnitCoin.SWORDSMAN);
});

QUnit.test("coinType()", assert => {
  // Setup.
  const state0 = AppState.create();
  const coinId = 1;
  const coinKey = UnitCoin.KNIGHT;
  const state = addCoin(coinId, coinKey, state0);

  // Run / Verify.
  const result = Selector.coinType(coinId, state);

  // Run / Verify.
  assert.ok(result);
  // assert.equal(result, Resolver.coin(coinKey));
  assert.equal(JSON.stringify(result), JSON.stringify(Resolver.coin(coinKey)));
});

QUnit.test("coins()", assert => {
  // Setup.
  let state = AppState.create();
  const unitCoinKeys = UnitCoin.keys();
  for (let id = 1; id <= 5; id += 1) {
    const coinKey = unitCoinKeys[id - 1];
    state = addCoin(id, coinKey, state);
  }
  const coinIds = [1, 3, 5];

  // Run / Verify.
  const result = Selector.coins(coinIds, state);

  // Run / Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, coinIds.length);
  const result0 = result[0];
  assert.ok(result0);
  assert.equal(result0.id, 1);
  assert.equal(result0.coinKey, UnitCoin.ARCHER);
  const result1 = result[1];
  assert.ok(result1);
  assert.equal(result1.id, 3);
  assert.equal(result1.coinKey, UnitCoin.CAVALRY);
  const result2 = result[2];
  assert.ok(result2);
  assert.equal(result2.id, 5);
  assert.equal(result2.coinKey, UnitCoin.ENSIGN);
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

QUnit.test("damageTargets() 1", assert => {
  // Setup.
  const state0 = AppState.create();
  const players = createPlayers2();
  const action0 = ActionCreator.setPlayers(players);
  const state = Reducer.root(state0, action0);
  const playerId = 1;

  // Run.
  const result = Selector.damageTargets(playerId, state);

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 1);
  assert.equal(result[0].key, DamageTarget.BOARD);
});

QUnit.test("damageTargets() 2", assert => {
  // Setup.
  const state0 = AppState.create();
  const players = createPlayers2();
  const action0 = ActionCreator.setPlayers(players);
  const state1 = Reducer.root(state0, action0);
  const playerId = 1;
  const state2 = addCoin(Selector.nextCoinId(state1), UnitCoin.ROYAL_GUARD, state1);
  const coin1 = Selector.coin(1, state2);
  const action2 = ActionCreator.addToPlayerArray("playerToSupply", playerId, coin1.id);
  const state = Reducer.root(state2, action2);

  // Run.
  const result = Selector.damageTargets(playerId, state);

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 2);
  assert.equal(result[0].key, DamageTarget.SUPPLY);
  assert.equal(result[1].key, DamageTarget.BOARD);
});

QUnit.test("delay()", assert => {
  // Setup.
  const state = AppState.create();

  // Run.
  const result = Selector.delay(state);

  // Verify.
  assert.equal(result, 1000);
});

QUnit.test("discardFacedown()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinId = 12;
  const action = ActionCreator.addToPlayerArray("playerToDiscardFacedown", playerId, coinId);
  const state = Reducer.root(state0, action);

  // Run.
  const result = Selector.discardFacedown(playerId, state);

  // Verify.
  assert.ok(result);
  assert.ok(Array.isArray(result));
  assert.equal(result.length, 1);
  assert.equal(result.includes(coinId), true);
  assert.equal(result[0], coinId);
});

QUnit.test("discardFaceup()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinId = 12;
  const action = ActionCreator.addToPlayerArray("playerToDiscardFaceup", playerId, coinId);
  const state = Reducer.root(state0, action);

  // Run.
  const result = Selector.discardFaceup(playerId, state);

  // Verify.
  assert.ok(result);
  assert.ok(Array.isArray(result));
  assert.equal(result.length, 1);
  assert.equal(result.includes(coinId), true);
  assert.equal(result[0], coinId);
});

QUnit.test("hand()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinId = 12;
  const action = ActionCreator.addToPlayerArray("playerToHand", playerId, coinId);
  const state = Reducer.root(state0, action);

  // Run.
  const result = Selector.hand(playerId, state);

  // Verify.
  assert.ok(result);
  assert.ok(Array.isArray(result));
  assert.equal(result.length, 1);
  assert.equal(result.includes(coinId), true);
  assert.equal(result[0], coinId);
});

QUnit.test("isBolstered() false", assert => {
  // Setup.
  const state0 = AppState.create();
  const players = createPlayers2();
  const action0 = ActionCreator.setPlayers(players);
  const state1 = Reducer.root(state0, action0);
  const an = "e2";
  const state2 = addCoin(Selector.nextCoinId(state1), UnitCoin.SWORDSMAN, state1);
  const coin1 = Selector.coin(1, state2);
  const action2 = ActionCreator.setUnit(an, coin1.id);
  const state = Reducer.root(state2, action2);

  // Run / Verify.
  assert.equal(Selector.isBolstered(an, state), false);
});

QUnit.test("isBolstered() true", assert => {
  // Setup.
  const state0 = AppState.create();
  const players = createPlayers2();
  const action0 = ActionCreator.setPlayers(players);
  const state1 = Reducer.root(state0, action0);
  const an = "e2";
  const state2 = addCoin(Selector.nextCoinId(state1), UnitCoin.SWORDSMAN, state1);
  const coin1 = Selector.coin(1, state2);
  const action2 = ActionCreator.setUnit(an, coin1.id);
  const state3 = Reducer.root(state2, action2);
  const state4 = addCoin(Selector.nextCoinId(state3), UnitCoin.SWORDSMAN, state3);
  const coin2 = Selector.coin(1, state4);
  const action4 = ActionCreator.setUnit(an, coin2.id);
  const state = Reducer.root(state4, action4);

  // Run / Verify.
  assert.equal(Selector.isBolstered(an, state), true);
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
  const state2 = addCoin(Selector.nextCoinId(state1), UnitCoin.SWORDSMAN, state1);
  const coin1 = Selector.coin(1, state2);
  const action2 = ActionCreator.setUnit(an1, coin1.id);
  const state3 = Reducer.root(state2, action2);
  const action3 = ActionCreator.addToPlayerArray("playerToTableau", 1, coin1.coinKey);
  const state4 = Reducer.root(state3, action3);

  const an2 = "f2";
  const state5 = addCoin(Selector.nextCoinId(state4), UnitCoin.ARCHER, state4);
  const coin2 = Selector.coin(2, state5);
  const action5 = ActionCreator.setUnit(an2, coin2.id);
  const state6 = Reducer.root(state5, action5);
  const action6 = ActionCreator.addToPlayerArray("playerToTableau", 2, coin2.coinKey);
  const state = Reducer.root(state6, action6);

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
  const state2 = addCoin(Selector.nextCoinId(state1), UnitCoin.SWORDSMAN, state1);
  const coin1 = Selector.coin(1, state2);
  const action2 = ActionCreator.setUnit(an1, coin1.id);
  const state3 = Reducer.root(state2, action2);
  const action3 = ActionCreator.addToPlayerArray("playerToTableau", 1, coin1.coinKey);
  const state4 = Reducer.root(state3, action3);

  const an2 = "f2";
  const state5 = addCoin(Selector.nextCoinId(state4), UnitCoin.ARCHER, state4);
  const coin2 = Selector.coin(2, state5);
  const action5 = ActionCreator.setUnit(an2, coin2.id);
  const state6 = Reducer.root(state5, action5);
  const action6 = ActionCreator.addToPlayerArray("playerToTableau", 2, coin2.coinKey);
  const state = Reducer.root(state6, action6);

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

QUnit.test("isTypeInSupply()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 1;
  const state1 = addCoin(Selector.nextCoinId(state0), UnitCoin.KNIGHT, state0);
  const coin1 = Selector.coin(1, state1);
  const action1 = ActionCreator.addToPlayerArray("playerToSupply", playerId, coin1.id);
  const state = Reducer.root(state1, action1);

  // Run / Verify.
  assert.equal(Selector.isTypeInSupply(playerId, UnitCoin.KNIGHT, state), true);
  assert.equal(Selector.isTypeInSupply(playerId, UnitCoin.ROYAL_GUARD, state), false);
});

QUnit.test("isUnitType()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 1;
  const state1 = addCoin(Selector.nextCoinId(state0), UnitCoin.KNIGHT, state0);
  const coin1 = Selector.coin(1, state1);
  const action1 = ActionCreator.addToPlayerArray("playerToHand", playerId, coin1.id);
  const state2 = Reducer.root(state1, action1);
  const an = "e2";
  const action2 = ActionCreator.setUnit(an, coin1.id);
  const state = Reducer.root(state2, action2);

  // Run.
  const result = Selector.isUnitType(an, coin1.coinKey, state);

  // Verify.
  assert.equal(result, true);
});

QUnit.test("morgue()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const coinId = 12;
  const action = ActionCreator.addToPlayerArray("playerToMorgue", playerId, coinId);
  const state = Reducer.root(state0, action);

  // Run.
  const result = Selector.morgue(playerId, state);

  // Verify.
  assert.ok(result);
  assert.ok(Array.isArray(result));
  assert.equal(result.length, 1);
  assert.equal(result.includes(coinId), true);
  assert.equal(result[0], coinId);
});

QUnit.test("nextCoinId()", assert => {
  // Setup.
  const state1 = AppState.create();

  // Run / Verify.
  assert.equal(Selector.nextCoinId(state1), 1);

  const state2 = addCoin(12, UnitCoin.KNIGHT, state1);

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

QUnit.test("peekInputCallback()", assert => {
  // Setup.
  const state0 = AppState.create();
  const callback = 12;
  const action = ActionCreator.pushInputCallback(callback);
  const state = Reducer.root(state0, action);

  // Run.
  const result = Selector.peekInputCallback(state);

  // Verify.
  assert.ok(result);
  assert.equal(result, callback);
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
  const state00 = AppState.create();
  const playerId = 1;
  const coinId = 12;
  const state0 = addCoin(coinId, UnitCoin.KNIGHT, state00);
  const action0 = ActionCreator.addToPlayerArray("playerToHand", playerId, coinId);
  const state1 = Reducer.root(state0, action0);
  const action1 = ActionCreator.addToPlayerArray("playerToTableau", playerId, UnitCard.KNIGHT);
  const state2 = Reducer.root(state1, action1);
  const an = "e2";
  const action2 = ActionCreator.setUnit(an, coinId);
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
  const coinId = 12;
  const action = ActionCreator.addToPlayerArray("playerToSupply", playerId, coinId);
  const state = Reducer.root(state0, action);

  // Run.
  const result = Selector.supply(playerId, state);

  // Verify.
  assert.ok(result);
  assert.ok(Array.isArray(result));
  assert.equal(result.length, 1);
  assert.equal(result.includes(coinId), true);
  assert.equal(result[0], coinId);
});

QUnit.test("supplyCoinsByType()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 1;
  const state1 = addCoinToSupply(playerId, 1, UnitCoin.ARCHER, state0);
  const state2 = addCoinToSupply(playerId, 2, UnitCoin.ARCHER, state1);
  const state3 = addCoinToSupply(playerId, 3, UnitCoin.BERSERKER, state2);
  const state4 = addCoinToSupply(playerId, 4, UnitCoin.BERSERKER, state3);
  const state5 = addCoinToSupply(playerId, 5, UnitCoin.KNIGHT, state4);
  const state = addCoinToSupply(playerId, 6, UnitCoin.KNIGHT, state5);
  const coinKey = UnitCoin.KNIGHT;

  // Run.
  const result = Selector.supplyCoinsByType(playerId, coinKey, state);

  // Verify.
  assert.ok(result);
  assert.ok(Array.isArray(result));
  assert.equal(result.length, 2);
  const result0 = result[0];
  assert.ok(result0);
  assert.equal(result0.id, 5);
  assert.equal(result0.coinKey, coinKey);
  const result1 = result[1];
  assert.ok(result1);
  assert.equal(result1.id, 6);
  assert.equal(result1.coinKey, coinKey);
});

QUnit.test("tableau()", assert => {
  // Setup.
  const state0 = AppState.create();
  const playerId = 3;
  const cardKey = "knight";
  const state = fillTableau4(state0);

  // Run.
  const result = Selector.tableau(playerId, state);

  // Verify.
  assert.ok(result);
  assert.ok(Array.isArray(result));
  assert.equal(result.length, 3);
  assert.equal(result.includes(cardKey), true);
  assert.equal(result[0], cardKey);
});

QUnit.test("teamAdjacentANs()", assert => {
  // Setup.
  const state0 = AppState.create();
  const players = createPlayers4();
  const action0 = ActionCreator.setPlayers(players);
  const state1 = Reducer.root(state0, action0);
  const state2 = fillTableau4(state1);
  const state = fillBoard4(state2);

  // Run.
  const resultRaven = Selector.teamAdjacentANs(Team.RAVEN, state);

  // Verify.
  assert.ok(resultRaven);
  assert.equal(Array.isArray(resultRaven), true);
  assert.equal(resultRaven.length, 8, `resultRaven.length=${resultRaven.length}`);
  assert.equal(resultRaven[0], "d3");
  assert.equal(resultRaven[resultRaven.length - 1], "i1");

  // Run.
  const resultWolf = Selector.teamAdjacentANs(Team.WOLF, state);

  // Verify.
  assert.ok(resultWolf);
  assert.equal(Array.isArray(resultWolf), true);
  assert.equal(resultWolf.length, 8, `resultWolf.length=${resultWolf.length}`);
  assert.equal(resultWolf[0], "c7");
  assert.equal(resultWolf[resultWolf.length - 1], "h5");
});

QUnit.test("teamANs()", assert => {
  // Setup.
  const state0 = AppState.create();
  const players = createPlayers4();
  const action0 = ActionCreator.setPlayers(players);
  const state1 = Reducer.root(state0, action0);
  const state2 = fillTableau4(state1);
  const state = fillBoard4(state2);

  // Run.
  const resultRaven = Selector.teamANs(Team.RAVEN, state);

  // Verify.
  assert.ok(resultRaven);
  assert.equal(Array.isArray(resultRaven), true);
  assert.equal(resultRaven.length, 2);
  assert.equal(resultRaven[0], "e2");
  assert.equal(resultRaven[1], "h1");

  // Run.
  const resultWolf = Selector.teamANs(Team.WOLF, state);

  // Verify.
  assert.ok(resultWolf);
  assert.equal(Array.isArray(resultWolf), true);
  assert.equal(resultWolf.length, 2);
  assert.equal(resultWolf[0], "d7");
  assert.equal(resultWolf[1], "g6");
});

QUnit.test("teamPlayerIds() 2", assert => {
  // Setup.
  const state0 = AppState.create();
  const players = createPlayers2();
  const action0 = ActionCreator.setPlayers(players);
  const state = Reducer.root(state0, action0);

  // Run / Verify.
  assert.equal(Selector.teamPlayerIds(Team.RAVEN, state).join(), 1);
  assert.equal(Selector.teamPlayerIds(Team.WOLF, state).join(), 2);
});

QUnit.test("teamTableau() Raven 4", assert => {
  // Setup.
  const state0 = AppState.create();
  const players = createPlayers4();
  const action0 = ActionCreator.setPlayers(players);
  const state1 = Reducer.root(state0, action0);
  const state = fillTableau4(state1);

  // Run.
  const result = Selector.teamTableau(Team.RAVEN, state);

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 6);
  assert.equal(result[0], UnitCard.ARCHER);
  assert.equal(result[result.length - 1], UnitCard.LIGHT_CAVALRY);
});

QUnit.test("teamTableau() Wolf 4", assert => {
  // Setup.
  const state0 = AppState.create();
  const players = createPlayers4();
  const action0 = ActionCreator.setPlayers(players);
  const state1 = Reducer.root(state0, action0);
  const state = fillTableau4(state1);

  // Run.
  const result = Selector.teamTableau(Team.WOLF, state);

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true);
  assert.equal(result.length, 6);
  assert.equal(result[0], UnitCard.CROSSBOWMAN);
  assert.equal(result[result.length - 1], UnitCard.PIKEMAN);
});

const ReducerTest = {};
export default ReducerTest;
