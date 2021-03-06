import ActionCreator from "../state/ActionCreator.js";

import TestData from "../model/TestData.js";

import Node from "./Node.js";

QUnit.module("Node");

const PROPS = ["children", "parent", "playoutCount", "state", "winCount"];

const createTestData = () =>
  Node.create({ children: 1, parent: 2, playoutCount: 3, state: 4, winCount: 5 });

const round4 = n => Math.round(n * 1000.0) / 1000.0;

QUnit.test("best() single rating", assert => {
  // Setup.
  const node1 = Node.create({ state: 1, winCount: 0, playoutCount: 10 });
  const node2 = Node.create({ state: 2, winCount: 1, playoutCount: 10 });
  const node3 = Node.create({ state: 3, winCount: 2, playoutCount: 10 });
  const node4 = Node.create({ state: 4, winCount: 3, playoutCount: 10 });
  const nodes = [node1, node2, node3, node4];

  // Run.
  const result = Node.best(Node.exploitation, nodes);

  // Verify.
  assert.ok(result);
  assert.equal(result.playoutCount, 10);
  assert.equal(result.state, 4);
  assert.equal(result.winCount, 3);
});

QUnit.test("best() dual rating", assert => {
  // Setup.
  const node1 = Node.create({ state: 1, winCount: 0, playoutCount: 10 });
  const node2 = Node.create({ state: 2, winCount: 1, playoutCount: 10 });
  const node3 = Node.create({ state: 3, winCount: 2, playoutCount: 10 });
  const node4 = Node.create({ state: 4, winCount: 3, playoutCount: 10 });
  const node5 = Node.create({ state: 5, winCount: 3, playoutCount: 10 });
  const nodes = [node1, node2, node3, node4, node5];

  // Run.
  const result = Node.best(Node.exploitation, nodes);

  // Verify.
  assert.ok(result);
  assert.equal(result.playoutCount, 10);
  assert.equal([4, 5].includes(result.state), true, `result.state = ${result.state}`);
  assert.equal(result.winCount, 3);
});

QUnit.test("create()", assert => {
  // Run.
  const node = createTestData();

  // Verify.
  PROPS.forEach((prop, i) => {
    assert.equal(node[prop], i + 1);
  });
});

QUnit.test("exploitation()", assert => {
  // Setup.
  const node1 = Node.create({ state: 1, winCount: 0, playoutCount: 0 });
  const node2 = Node.create({ state: 2, winCount: 1, playoutCount: 0 });
  const node3 = Node.create({ state: 2, winCount: 0, playoutCount: 10 });
  const node4 = Node.create({ state: 2, winCount: 1, playoutCount: 10 });
  const node5 = Node.create({ state: 3, winCount: 2, playoutCount: 10 });

  // Run / Verify.
  assert.equal(Node.exploitation(node1), Number.POSITIVE_INFINITY);
  assert.equal(Node.exploitation(node2), Number.POSITIVE_INFINITY);
  assert.equal(Node.exploitation(node3), 0);
  assert.equal(Node.exploitation(node4), 0.1);
  assert.equal(Node.exploitation(node5), 0.2);
});

QUnit.test("exploration()", assert => {
  // Setup.
  const parent1 = Node.create({ state: -1, playoutCount: 0 });
  const parent2 = Node.create({ state: -2, playoutCount: 20 });
  const node1 = Node.create({ state: 1, playoutCount: 0 });
  const node2 = Node.create({ state: 2, playoutCount: 10 });
  const node3 = Node.create({ state: 1, parent: parent1, playoutCount: 0 });
  const node4 = Node.create({ state: 2, parent: parent1, playoutCount: 10 });
  const node5 = Node.create({ state: 3, parent: parent2, playoutCount: 0 });
  const node6 = Node.create({ state: 4, parent: parent2, playoutCount: 10 });

  // Run / Verify.
  assert.equal(Node.exploration(node1), Number.POSITIVE_INFINITY);
  assert.equal(Node.exploration(node2), 0);
  assert.equal(round4(Node.exploration(node3)), Number.POSITIVE_INFINITY);
  assert.equal(round4(Node.exploration(node4)), 0);
  assert.equal(round4(Node.exploration(node5)), Number.POSITIVE_INFINITY);
  assert.equal(round4(Node.exploration(node6)), 0.774);
});

QUnit.test("level()", assert => {
  // Setup.
  const node1 = Node.create({ state: 1 });
  const node2 = Node.create({ state: 2, parent: node1 });
  const node3 = Node.create({ state: 3, parent: node2 });
  const node4 = Node.create({ state: 4, parent: node3 });

  // Run / Verify.
  assert.equal(Node.level(node1), 1);
  assert.equal(Node.level(node2), 2);
  assert.equal(Node.level(node3), 3);
  assert.equal(Node.level(node4), 4);
});

QUnit.test("toString()", assert => {
  // Setup.
  const store = TestData.createStore();
  store.dispatch(ActionCreator.setCurrentPaymentCoin(1));
  const node = Node.create({ state: store.getState(), playoutCount: 2, winCount: 1 });

  // Run.
  const result = Node.toString(node);

  // Verify.
  assert.ok(result);
  assert.equal(
    result,
    '{"playoutCount":2,"winCount":1} paymentCoin = {"id":1,"coinKey":"raven"} moveCount = 0' +
      " children.length = 0 uct = 0.5 exploit = 0.5"
  );
});

const NodeTest = {};
export default NodeTest;
