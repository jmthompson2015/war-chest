import Phase from "../artifact/Phase.js";
import Resolver from "../artifact/Resolver.js";
import Team from "../artifact/Team.js";

import ActionCreator from "../state/ActionCreator.js";
import Selector from "../state/Selector.js";

import TestData from "../model/TestData.js";

import Expansion from "./Expansion.js";
import Node from "./Node.js";
import Selection from "./Selection.js";
import Simulation from "./Simulation.js";

QUnit.module("Simulation");

QUnit.test("execute()", assert => {
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
  const root = Node.create({ state: store.getState() });
  const leaf = Selection.execute(root);
  const child = Expansion.execute(leaf);
  const teamRaven = Resolver.team(Team.RAVEN);
  const teamWolf = Resolver.team(Team.WOLF);

  // Run.
  const done = assert.async();
  const callback = result => {
    assert.ok(true, "test resumed from async operation");
    // Verify.
    assert.equal([teamRaven, teamWolf, undefined].includes(result), true, `result = ${result}`);
    done();
  };

  Simulation.execute(child).then(callback);
});

const SimulationTest = {};
export default SimulationTest;
