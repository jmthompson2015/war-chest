import Move from "../artifact/Move.js";
import Phase from "../artifact/Phase.js";

import ActionCreator from "../state/ActionCreator.js";
import Selector from "../state/Selector.js";

import TestData from "../model/TestData.js";

import MCTS from "./MonteCarloTreeSearch.js";

QUnit.module("MCTS");

const ALLOWED_TIME = 500;

QUnit.test("execute() payment coin", assert => {
  // Setup.
  const store = TestData.createStore();
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(ActionCreator.setRound(1));
  store.dispatch(ActionCreator.setCurrentPhase(Phase.PLAY_COINS));
  const players2 = Selector.playersInOrder(store.getState());
  const playerIds = R.map(R.prop("id"), players2);
  store.dispatch(ActionCreator.setCurrentPlayerOrder(playerIds));
  store.dispatch(ActionCreator.setCurrentPlayer(1));
  store.dispatch(ActionCreator.setVerbose(false));

  // Run.
  const done = assert.async();
  const callback = bestMove => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    assert.ok(bestMove);
    assert.equal([1, 6, 10].includes(bestMove), true, `bestMove = ${bestMove}`);
    done();
  };

  MCTS.execute(store.getState(), ALLOWED_TIME).then(callback);
});

QUnit.test("execute() move", assert => {
  // Setup.
  const store = TestData.createStore();
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(ActionCreator.setRound(1));
  store.dispatch(ActionCreator.setCurrentPhase(Phase.PLAY_COINS));
  const players2 = Selector.playersInOrder(store.getState());
  const playerIds = R.map(R.prop("id"), players2);
  store.dispatch(ActionCreator.setCurrentPlayerOrder(playerIds));
  store.dispatch(ActionCreator.setCurrentPlayer(1));
  store.dispatch(ActionCreator.setCurrentPaymentCoin(6));
  store.dispatch(ActionCreator.setVerbose(false));

  // Run.
  const done = assert.async();
  const callback = bestMove => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    assert.ok(bestMove);
    assert.equal(
      [Move.RECRUIT, Move.DEPLOY, Move.PASS].includes(bestMove.moveKey),
      true,
      `bestMove = ${JSON.stringify(bestMove)}`
    );
    done();
  };

  MCTS.execute(store.getState(), ALLOWED_TIME).then(callback);
});

const MCTSTest = {};
export default MCTSTest;
