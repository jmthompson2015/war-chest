import ActionCreator from "../state/ActionCreator.js";
import Selector from "../state/Selector.js";

import Game from "./Game.js";

QUnit.module("Game");

QUnit.test("execute() ", assert => {
  // Setup.
  const game = new Game();
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
