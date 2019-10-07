import Board from "./Board.js";

QUnit.module("Board");

QUnit.test("Board.boardCalculator", assert => {
  assert.ok(Board.boardCalculator);
});

QUnit.test("Board.coordinateCalculator", assert => {
  assert.ok(Board.coordinateCalculator);
});

QUnit.test("isNeighbor()", assert => {
  assert.equal(Board.isNeighbor("e2", "d3"), true);
  assert.equal(Board.isNeighbor("e2", "e3"), true);
  assert.equal(Board.isNeighbor("e2", "f1"), true);
  assert.equal(Board.isNeighbor("e2", "f2"), true);
  assert.equal(Board.isNeighbor("e2", "g1"), false);
});

QUnit.test("neighbors()", assert => {
  // Setup.
  const an = "e2";

  // Run.
  const result = Board.neighbors(an);

  // Verify.
  assert.ok(result);
  // console.log(`result = ${JSON.stringify(result)}`);
  assert.equal(result.length, 4);
  assert.equal(result[0], "d3");
  assert.equal(result[1], "e3");
  assert.equal(result[2], "f1");
  assert.equal(result[3], "f2");
});

const BoardTest = {};
export default BoardTest;
