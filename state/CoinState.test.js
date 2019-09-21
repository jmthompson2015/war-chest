import CoinState from "./CoinState.js";

QUnit.module("CoinState");

const PROPS = ["coinKey", "count", "isFaceup"];

const createTestData = () => CoinState.create({ coinKey: 1, count: 2, isFaceup: 3 });

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
    player.count = 12;
    assert.ok(false, "Should have thrown an exception");
  } catch (e) {
    assert.ok(true);
  }
});

const PlayerStateTest = {};
export default PlayerStateTest;
