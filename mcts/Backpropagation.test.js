import Resolver from "../artifact/Resolver.js";
import Team from "../artifact/Team.js";

import ActionCreator from "../state/ActionCreator.js";

import TestData from "../model/TestData.js";

import Backpropagation from "./Backpropagation.js";
import Expansion from "./Expansion.js";
import Node from "./Node.js";
import Selection from "./Selection.js";

QUnit.module("Backpropagation");

QUnit.test("execute() draw", assert => {
  // Setup.
  const store = TestData.createStore();
  store.dispatch(ActionCreator.setCurrentPlayer(1));
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(ActionCreator.setVerbose(false));
  const root = Node.create({ state: store.getState() });
  const leaf = Selection.execute(root);
  const child = Expansion.execute(leaf);
  const winningTeam = undefined;

  // Run.
  Backpropagation.execute(winningTeam, child);

  // Verify.
  assert.equal(root.winCount, 0.5);
  assert.equal(root.lossCount, 0.5);
  assert.equal(root.playoutCount, 1);
});

QUnit.test("execute() loss", assert => {
  // Setup.
  const store = TestData.createStore();
  store.dispatch(ActionCreator.setCurrentPlayer(1));
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(ActionCreator.setVerbose(false));
  const root = Node.create({ state: store.getState() });
  const leaf = Selection.execute(root);
  const child = Expansion.execute(leaf);
  const winningTeam = Resolver.team(Team.WOLF);

  // Run.
  Backpropagation.execute(winningTeam, child);

  // Verify.
  assert.equal(root.winCount, 0);
  assert.equal(root.lossCount, 1);
  assert.equal(root.playoutCount, 1);
});

QUnit.test("execute() win", assert => {
  // Setup.
  const store = TestData.createStore();
  store.dispatch(ActionCreator.setCurrentPlayer(1));
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(ActionCreator.setVerbose(false));
  const root = Node.create({ state: store.getState() });
  const leaf = Selection.execute(root);
  const child = Expansion.execute(leaf);
  const winningTeam = Resolver.team(Team.RAVEN);

  // Run.
  Backpropagation.execute(winningTeam, child);

  // Verify.
  assert.equal(root.winCount, 1);
  assert.equal(root.lossCount, 0);
  assert.equal(root.playoutCount, 1);
});

const BackpropagationTest = {};
export default BackpropagationTest;
