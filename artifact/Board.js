const { BoardCalculator, CoordinateCalculator, HexBoardUtilities } = ReactGameBoard;

const Board = {};

Board.IS_SQUARE = false;
Board.IS_FLAT = true;
Board.UNUSED_4P = Immutable([
  "a1",
  "a2",
  "a3",
  "a4",
  "a5",
  "b1",
  "b2",
  "b3",
  "b4",
  "c1",
  "c2",
  "c3",
  "d1",
  "d2",
  "e1",
  "g7",
  "h6",
  "h7",
  "i5",
  "i6",
  "i7",
  "j4",
  "j5",
  "j6",
  "j7",
  "k3",
  "k4",
  "k5",
  "k6",
  "k7"
]);
Board.HEX_4P = Immutable(["a6", "a7", "b5", "b6", "b7", "j1", "j2", "j3", "k1", "k2"]);
Board.UNUSED_2P = Immutable(Board.HEX_4P.concat(Board.UNUSED_4P));
Board.CONTROL_POINTS_2P = Immutable(["c6", "d4", "d7", "e2", "e5", "g3", "g6", "h1", "h4", "i2"]);
Board.CONTROL_POINTS_4P = Immutable(["a7", "b5", "j3", "k1"].concat(Board.CONTROL_POINTS_2P));
Board.RAVEN_STARTER_CONTROL_POINTS_2P = Immutable(["e2", "h1"]);
Board.WOLF_STARTER_CONTROL_POINTS_2P = Immutable(["d7", "g6"]);
Board.RAVEN_STARTER_CONTROL_POINTS_4P = Immutable(
  ["b5"].concat(Board.RAVEN_STARTER_CONTROL_POINTS_2P)
);
Board.WOLF_STARTER_CONTROL_POINTS_4P = Immutable(
  Board.WOLF_STARTER_CONTROL_POINTS_2P.concat(["j3"])
);

Board.FILE_COUNT = 11;
Board.RANK_COUNT = 7;

Board.boardCalculator = new BoardCalculator(Board.IS_SQUARE, Board.IS_FLAT);
Board.coordinateCalculator = new CoordinateCalculator(Board.FILE_COUNT, Board.RANK_COUNT);

Board.cubeDirection = (an1, an2) => {
  const q1 = Board.coordinateCalculator.anToFile(an1);
  const r1 = Board.coordinateCalculator.anToRank(an1);
  const cube1 = HexBoardUtilities.axialToCube({ q: q1, r: r1 });

  const q2 = Board.coordinateCalculator.anToFile(an2);
  const r2 = Board.coordinateCalculator.anToRank(an2);
  const cube2 = HexBoardUtilities.axialToCube({ q: q2, r: r2 });

  const diff = HexBoardUtilities.createCube({
    x: cube2.x - cube1.x,
    y: cube2.y - cube1.y,
    z: cube2.z - cube1.z
  });
  const max = Math.max(Math.abs(diff.x), Math.max(Math.abs(diff.y), Math.abs(diff.z)));

  return HexBoardUtilities.createCube({
    x: diff.x / max,
    y: diff.y / max,
    z: diff.z / max
  });
};

Board.cubeDirectionIndex = (an1, an2) => {
  const direction = Board.cubeDirection(an1, an2);
  const filterFunction = i => R.equals(direction, HexBoardUtilities.cubeDirection(i));
  const indices = R.filter(filterFunction, [0, 1, 2, 3, 4, 5]);

  return indices.length > 0 ? indices[0] : undefined;
};

Board.distance = (an1, an2) => {
  const q1 = Board.coordinateCalculator.anToFile(an1);
  const r1 = Board.coordinateCalculator.anToRank(an1);
  const hex1 = { q: q1, r: r1 };
  const q2 = Board.coordinateCalculator.anToFile(an2);
  const r2 = Board.coordinateCalculator.anToRank(an2);
  const hex2 = { q: q2, r: r2 };

  return HexBoardUtilities.hexDistance(hex1, hex2);
};

Board.isNeighbor = (an1, an2, isTwoPlayer = true) =>
  Board.neighbors(an1, isTwoPlayer).includes(an2);

Board.isStraightLine = (an1, an2) => {
  const q1 = Board.coordinateCalculator.anToFile(an1);
  const r1 = Board.coordinateCalculator.anToRank(an1);
  const q2 = Board.coordinateCalculator.anToFile(an2);
  const r2 = Board.coordinateCalculator.anToRank(an2);
  const deltaQ = q2 - q1;
  const deltaR = r2 - r1;

  return deltaR === -deltaQ || (deltaQ === 0 && deltaR !== 0) || (deltaQ !== 0 && deltaR === 0);
};

Board.middleAN = (an1, an2) => {
  let answer;

  if (Board.distance(an1, an2) === 2 && Board.isStraightLine(an1, an2)) {
    const q1 = Board.coordinateCalculator.anToFile(an1);
    const r1 = Board.coordinateCalculator.anToRank(an1);
    const q2 = Board.coordinateCalculator.anToFile(an2);
    const r2 = Board.coordinateCalculator.anToRank(an2);
    const deltaQ = q2 - q1;
    const deltaR = r2 - r1;
    const q = q1 + deltaQ / 2.0;
    const r = r1 + deltaR / 2.0;

    answer = Board.coordinateCalculator.fileRankToAN(q, r);
  }

  return answer;
};

Board.neighborInDirection = (an, directionIndex) => {
  const q = Board.coordinateCalculator.anToFile(an);
  const r = Board.coordinateCalculator.anToRank(an);
  const cube = HexBoardUtilities.axialToCube({ q, r });
  const direction = HexBoardUtilities.cubeDirection(directionIndex);

  const cube2 = HexBoardUtilities.createCube({
    x: cube.x + direction.x,
    y: cube.y + direction.y,
    z: cube.z + direction.z
  });
  const hex2 = HexBoardUtilities.cubeToAxial(cube2);

  return Board.coordinateCalculator.fileRankToAN(hex2.q, hex2.r);
};

Board.neighbors = (an, isTwoPlayer = true) => {
  const q = Board.coordinateCalculator.anToFile(an);
  const r = Board.coordinateCalculator.anToRank(an);
  const hex = { q, r };
  const hexNeighbors = HexBoardUtilities.hexNeighbors(hex);
  const reduceFunction = (accum, n) => {
    const neighborAN = Board.coordinateCalculator.fileRankToAN(n.q, n.r);
    return R.isNil(neighborAN) ? accum : R.append(neighborAN, accum);
  };
  const neighbors = R.reduce(reduceFunction, [], hexNeighbors);
  const unused = isTwoPlayer ? Board.UNUSED_2P : Board.UNUSED_4P;

  return R.without(unused, neighbors).sort();
};

Board.ringANs = (an, distance = 2, isTwoPlayer = true) => {
  const q0 = Board.coordinateCalculator.anToFile(an);
  const r0 = Board.coordinateCalculator.anToRank(an);
  const hex0 = { q: q0, r: r0 };
  let neighbors = [];

  for (let r = 1; r <= Board.RANK_COUNT; r += 1) {
    for (let q = 1; q <= Board.FILE_COUNT; q += 1) {
      const hex = { q, r };
      if (HexBoardUtilities.hexDistance(hex, hex0) === distance) {
        const neighborAN = Board.coordinateCalculator.fileRankToAN(q, r);
        neighbors = R.append(neighborAN, neighbors);
      }
    }
  }

  const unused = isTwoPlayer ? Board.UNUSED_2P : Board.UNUSED_4P;

  return R.without(unused, neighbors).sort();
};

Object.freeze(Board);

export default Board;
