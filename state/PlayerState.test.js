import PlayerState from "./PlayerState.js";

QUnit.module("PlayerState");

const PROPS = ["id", "name", "teamKey", "isComputer"];

const createTestData = () => PlayerState.create({ id: 1, name: 2, teamKey: 3, isComputer: 4 });

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
    player.id = 12;
    assert.ok(false, "Should have thrown an exception");
  } catch (e) {
    assert.ok(true);
  }
});

const PlayerStateTest = {};
export default PlayerStateTest;
