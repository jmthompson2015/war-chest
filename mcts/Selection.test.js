import ActionCreator from "../state/ActionCreator.js";

import TestData from "../model/TestData.js";

import Expansion from "./Expansion.js";
import Selection from "./Selection.js";
import Node from "./Node.js";

QUnit.module("Selection");

QUnit.test("execute() root", assert => {
  // Setup.
  const store = TestData.createStore();
  store.dispatch(ActionCreator.setCurrentPlayer(1));
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(ActionCreator.setVerbose(false));
  const root = Node.create({ state: store.getState() });

  // Run.
  const result = Selection.execute(root);

  // Verify.
  assert.ok(result);
  assert.equal(result, root);
  const { children } = result;
  assert.ok(children);
  assert.equal(
    Array.isArray(children),
    true,
    `Array.isArray(children) ? ${Array.isArray(children)}`
  );
  assert.equal(children.length, 0, `children.length = ${children.length}`);
});

QUnit.test("execute() child", assert => {
  // Setup.
  const store = TestData.createStore();
  store.dispatch(ActionCreator.setCurrentPlayer(1));
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(ActionCreator.setVerbose(false));
  const root = Node.create({ state: store.getState() });
  const child = Expansion.execute(root);
  const leaf = Expansion.execute(child);
  assert.ok(leaf);

  // Run.
  const result = Selection.execute(root);

  // Verify.
  assert.ok(result);
  const { children } = result;
  assert.ok(children);
  assert.equal(
    Array.isArray(children),
    true,
    `Array.isArray(children) ? ${Array.isArray(children)}`
  );
  assert.equal(children.length, 0, `children.length = ${children.length}`);
});

const SelectionTest = {};
export default SelectionTest;
