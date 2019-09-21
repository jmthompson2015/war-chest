import Board from "./Board.js";

QUnit.module("Board");

QUnit.test("Board.boardCalculator", assert => {
  assert.ok(Board.boardCalculator);
});

QUnit.test("Board.coordinateCalculator", assert => {
  assert.ok(Board.coordinateCalculator);
});

const BoardTest = {};
export default BoardTest;
