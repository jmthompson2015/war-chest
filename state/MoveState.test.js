import MoveState from "./MoveState.js";

QUnit.module("MoveState");

const PROPS = [
  "moveKey",
  "playerId",
  "paymentCoinId",
  "an1",
  "an2",
  "an3",
  "recruitCoinId",
  "victimCoinId"
];

const createTestData = () =>
  MoveState.create({
    moveKey: 1,
    playerId: 2,
    paymentCoinId: 3,
    an1: 4,
    an2: 5,
    an3: 6,
    recruitCoinId: 7,
    victimCoinId: 8
  });

QUnit.test("create()", assert => {
  // Run.
  const player = createTestData();

  // Verify.
  PROPS.forEach((prop, i) => {
    assert.equal(player[prop], i + 1);
  });
});

QUnit.test("create() immutable", assert => {
  // Setup.
  const player = createTestData();

  // Run / Verify.
  try {
    player.playerId = 12;
    assert.ok(false, "Should have thrown an exception");
  } catch (e) {
    assert.ok(true);
  }
});

const PlayerStateTest = {};
export default PlayerStateTest;
