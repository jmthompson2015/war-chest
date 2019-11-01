import ControlMarker from "../artifact/ControlMarker.js";
import Team from "../artifact/Team.js";
import UnitCard from "../artifact/UnitCard.js";

import ActionCreator from "../state/ActionCreator.js";
import PlayerState from "../state/PlayerState.js";
import Selector from "../state/Selector.js";

import Game from "./Game.js";
import GameOver from "./GameOver.js";

QUnit.module("GameOver");

const createPlayers = () => {
  const ravenPlayer = PlayerState.create({
    id: 1,
    name: "Alfred",
    teamKey: Team.RAVEN
  });
  const wolfPlayer = PlayerState.create({
    id: 2,
    name: "Bruce",
    teamKey: Team.WOLF
  });

  return [ravenPlayer, wolfPlayer];
};

const createPlayerToTableau = () => {
  const cardKeys = UnitCard.keys();

  return {
    1: cardKeys.slice(0, 4),
    2: cardKeys.slice(4, 8)
  };
};

QUnit.test("isGameOver() false", assert => {
  // Setup.
  const players = createPlayers();
  const playerToTableau = createPlayerToTableau();
  const roundLimit = 1;
  const game = new Game(players, playerToTableau, roundLimit);
  const { store } = game;
  store.dispatch(ActionCreator.setDelay(0));

  // Run.
  const result = GameOver.isGameOver(store);

  // Verify.
  assert.equal(result, false);
});

QUnit.test("isGameOver() true", assert => {
  // Setup.
  const players = createPlayers();
  const playerToTableau = createPlayerToTableau();
  const game = new Game(players, playerToTableau);
  const { store } = game;
  const controlKey = ControlMarker.RAVEN;
  store.dispatch(ActionCreator.setControl("d4", controlKey));
  store.dispatch(ActionCreator.setControl("e5", controlKey));
  store.dispatch(ActionCreator.setControl("g3", controlKey));
  store.dispatch(ActionCreator.setControl("i2", controlKey));

  // Run.
  const result = GameOver.isGameOver(store);

  // Verify.
  assert.equal(result, true);
  const team = Selector.winner(store.getState());
  assert.ok(team);
  assert.equal(team.key, Team.RAVEN);
});

const GameOverTest = {};
export default GameOverTest;
