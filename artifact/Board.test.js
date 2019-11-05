import Board from "./Board.js";

QUnit.module("Board");

QUnit.test("Board.boardCalculator", assert => {
  assert.ok(Board.boardCalculator);
});

QUnit.test("Board.coordinateCalculator", assert => {
  assert.ok(Board.coordinateCalculator);
});

QUnit.test("distance()", assert => {
  assert.equal(Board.distance("e2", "d3"), 1);
  assert.equal(Board.distance("e2", "e4"), 2);
  assert.equal(Board.distance("e2", "f4"), 3);
  assert.equal(Board.distance("e2", "g4"), 4);
  assert.equal(Board.distance("e2", "h4"), 5);
});

QUnit.test("isNeighbor()", assert => {
  assert.equal(Board.isNeighbor("e2", "d3"), true);
  assert.equal(Board.isNeighbor("e2", "e3"), true);
  assert.equal(Board.isNeighbor("e2", "f1"), true);
  assert.equal(Board.isNeighbor("e2", "f2"), true);
  assert.equal(Board.isNeighbor("e2", "g1"), false);
});

QUnit.test("isStraightLine()", assert => {
  // Setup.
  const an = "e2";

  // Run / Verify.
  assert.equal(Board.isStraightLine(an, "c4"), true);
  assert.equal(Board.isStraightLine(an, "d4"), false);
  assert.equal(Board.isStraightLine(an, "e4"), true);
  assert.equal(Board.isStraightLine(an, "f3"), false);
  assert.equal(Board.isStraightLine(an, "g1"), false);
  assert.equal(Board.isStraightLine(an, "g2"), true);
});

QUnit.test("middleAN() e2-e4", assert => {
  // Setup.
  const an = "e2";

  // Run / Verify.
  assert.equal(Board.middleAN(an, "c4"), "d3", `${an} to c4`);
  assert.equal(Board.middleAN(an, "d4"), undefined, `${an} to d4`);
  assert.equal(Board.middleAN(an, "e4"), "e3", `${an} to e4`);
  assert.equal(Board.middleAN(an, "f3"), undefined, `${an} to f3`);
  assert.equal(Board.middleAN(an, "g2"), "f2", `${an} to g2`);
  assert.equal(Board.middleAN(an, "g1"), undefined, `${an} to g1`);
});

QUnit.test("neighbors() two player", assert => {
  // Setup.
  const an = "e2";

  // Run.
  const result = Board.neighbors(an);

  // Verify.
  assert.ok(result);
  assert.equal(result.length, 4);
  assert.equal(result[0], "d3");
  assert.equal(result[1], "e3");
  assert.equal(result[2], "f1");
  assert.equal(result[3], "f2");
});

QUnit.test("neighbors() four player", assert => {
  // Setup.
  const an = "b5";
  const isTwoPlayer = false;

  // Run.
  const result = Board.neighbors(an, isTwoPlayer);

  // Verify.
  assert.ok(result);
  assert.equal(result.length, 4);
  assert.equal(result[0], "a6");
  assert.equal(result[1], "b6");
  assert.equal(result[2], "c4");
  assert.equal(result[3], "c5");
});

QUnit.test("ringANs() f4 1", assert => {
  // Setup.
  const an = "f4";
  const distance = 1;
  const isTwoPlayer = false;

  // Run.
  const result = Board.ringANs(an, distance, isTwoPlayer);

  // Verify.
  assert.ok(result);
  assert.equal(result.length, 6);
  assert.equal(result[0], "e4");
  assert.equal(result[1], "e5");
  assert.equal(result[2], "f3");
  assert.equal(result[3], "f5");
  assert.equal(result[4], "g3");
  assert.equal(result[5], "g4");
});

QUnit.test("ringANs() e2 2", assert => {
  // Setup.
  const an = "e2";
  const distance = 2;
  const isTwoPlayer = false;

  // Run.
  const result = Board.ringANs(an, distance, isTwoPlayer);

  // Verify.
  assert.ok(result);
  assert.equal(result.length, 6);
  assert.equal(result[0], "c4");
  assert.equal(result[1], "d4");
  assert.equal(result[2], "e4");
  assert.equal(result[3], "f3");
  assert.equal(result[4], "g1");
  assert.equal(result[5], "g2");
});

QUnit.test("ringANs() f4 2", assert => {
  // Setup.
  const an = "f4";
  const distance = 2;
  const isTwoPlayer = false;

  // Run.
  const result = Board.ringANs(an, distance, isTwoPlayer);

  // Verify.
  assert.ok(result);
  assert.equal(result.length, 12);
  assert.equal(result[0], "d4");
  assert.equal(result[1], "d5");
  assert.equal(result[2], "d6");
  assert.equal(result[3], "e3");
  assert.equal(result[4], "e6");
  assert.equal(result[5], "f2");
  assert.equal(result[6], "f6");
  assert.equal(result[7], "g2");
  assert.equal(result[8], "g5");
  assert.equal(result[9], "h2");
  assert.equal(result[10], "h3");
  assert.equal(result[11], "h4");
});

const BoardTest = {};
export default BoardTest;
