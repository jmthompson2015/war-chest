import Team from "../artifact/Team.js";

import ActionCreator from "../state/ActionCreator.js";
import PlayerState from "../state/PlayerState.js";
import Selector from "../state/Selector.js";

import Game from "./Game.js";

QUnit.module("Game");

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

QUnit.test("execute() ", assert => {
  // Setup.
  const isTwoPlayer = true;
  const players = createPlayers(isTwoPlayer);
  const roundLimit = 1;
  const game = new Game(players, roundLimit);
  const { store } = game;
  store.dispatch(ActionCreator.setDelay(0));

  // Run.
  const done = assert.async();
  const callback = () => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    assert.equal(Selector.round(store.getState()), 1);
    assert.equal(Selector.currentPhase(store.getState()), undefined);
    done();
  };

  game.execute().then(callback);
});

const GameTest = {};
export default GameTest;
