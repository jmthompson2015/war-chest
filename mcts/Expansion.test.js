import Move from "../artifact/Move.js";

import ActionCreator from "../state/ActionCreator.js";

import TestData from "../model/TestData.js";

import Expansion from "./Expansion.js";
import Node from "./Node.js";

QUnit.module("Expansion");

QUnit.test("execute() choose payment coin", assert => {
  // Setup.
  const store = TestData.createStore();
  store.dispatch(ActionCreator.setCurrentPlayer(1));
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(ActionCreator.setVerbose(false));
  const root = Node.create({ state: store.getState() });
  assert.equal(
    Array.isArray(root.children),
    true,
    `Array.isArray(root.children) ? ${Array.isArray(root.children)}`
  );
  assert.equal(root.children.length, 0, `root.children.length = ${root.children.length}`);

  // Run.
  const result = Expansion.execute(root);

  // Verify.
  assert.ok(result, "result !== undefined");
  const { children: rootChildren } = root;
  assert.equal(
    Array.isArray(rootChildren),
    true,
    `Array.isArray(rootChildren) ? ${Array.isArray(rootChildren)}`
  );
  assert.equal(rootChildren.length, 3, `rootChildren.length = ${rootChildren.length}`);
  assert.equal(rootChildren.includes(result), true, `rootChildren.includes(result)`);

  assert.equal(result.parent, root, "result.parent === root");
  const { state } = result;
  assert.ok(state, "state !== undefined");
  const { currentPaymentCoinId } = state;
  assert.ok(currentPaymentCoinId, `currentPaymentCoinId = ${currentPaymentCoinId}`);
  assert.equal(
    [1, 6, 10].includes(currentPaymentCoinId),
    true,
    `[1, 6, 10].includes(currentPaymentCoinId)`
  );

  const { children } = result;
  assert.ok(children, "children !== undefined");
  assert.equal(
    Array.isArray(children),
    true,
    `Array.isArray(children) ? ${Array.isArray(children)}`
  );
  assert.equal(children.length, 0, `children.length = ${children.length}`);
});

QUnit.test("execute() choose move", assert => {
  // Setup.
  const store = TestData.createStore();
  store.dispatch(ActionCreator.setCurrentPlayer(1));
  store.dispatch(ActionCreator.setDelay(0));
  store.dispatch(ActionCreator.setVerbose(false));
  const paymentCoinId = 6; // Swordsman
  store.dispatch(ActionCreator.setCurrentPaymentCoin(paymentCoinId));
  const root = Node.create({ state: store.getState() });
  assert.equal(
    Array.isArray(root.children),
    true,
    `Array.isArray(root.children) ? ${Array.isArray(root.children)}`
  );
  assert.equal(root.children.length, 0, `root.children.length = ${root.children.length}`);

  // Run.
  const result = Expansion.execute(root);

  // Verify.
  assert.ok(result, "result !== undefined");
  const { children: rootChildren } = root;
  assert.equal(
    Array.isArray(rootChildren),
    true,
    `Array.isArray(rootChildren) ? ${Array.isArray(rootChildren)}`
  );
  assert.equal(rootChildren.length, 6, `rootChildren.length = ${rootChildren.length}`);
  assert.equal(rootChildren.includes(result), true, `rootChildren.includes(result)`);

  assert.equal(result.parent, root, "result.parent === root");
  const { state } = result;
  assert.ok(state, "state !== undefined");
  const { currentPaymentCoinId } = state;
  assert.ok(currentPaymentCoinId, `currentPaymentCoinId = ${currentPaymentCoinId}`);
  assert.equal(
    [1, 6, 10].includes(currentPaymentCoinId),
    true,
    `[1, 6, 10].includes(currentPaymentCoinId)`
  );

  const { currentMoves } = state;
  assert.ok(currentMoves, "currentMoves !== undefined");
  assert.equal(Array.isArray(currentMoves), true);
  assert.equal(currentMoves.length, 6, `currentMoves.length = ${currentMoves.length}`);

  const { currentMove } = state;
  assert.ok(currentMove, "currentMove !== undefined");
  assert.equal(
    [Move.RECRUIT, Move.PASS, Move.DEPLOY].includes(currentMove.moveKey),
    true,
    `currentMove.moveKey = ${currentMove.moveKey}`
  );

  const { children } = result;
  assert.ok(children, "children !== undefined");
  assert.equal(
    Array.isArray(children),
    true,
    `Array.isArray(children) ? ${Array.isArray(children)}`
  );
  assert.equal(children.length, 0, `children.length = ${children.length}`);
});

const ExpansionTest = {};
export default ExpansionTest;
