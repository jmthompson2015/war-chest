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

Board.boardCalculator = new BoardCalculator(Board.IS_SQUARE, Board.IS_FLAT);
Board.coordinateCalculator = new CoordinateCalculator(11, 7);

Board.isNeighbor = (an, toAN, isTwoPlayer = true) =>
  Board.neighbors(an, isTwoPlayer).includes(toAN);

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

Object.freeze(Board);

export default Board;
