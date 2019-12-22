import CoinState from "./CoinState.js";

QUnit.module("CoinState");

const PROPS = ["id", "coinKey", "count", "isFaceup", "isHighlighted"];

const createTestData = () =>
  CoinState.create({ id: 1, coinKey: 2, count: 3, isFaceup: 4, isHighlighted: 5 });

QUnit.test("create()", assert => {
  // Run.
  const coin = createTestData();

  // Verify.
  PROPS.forEach((prop, i) => {
    assert.equal(coin[prop], i + 1);
  });
});

QUnit.test("create() immutable", assert => {
  // Setup.
  const coin = createTestData();

  // Run / Verify.
  try {
    coin.count = 12;
    assert.ok(false, "Should have thrown an exception");
  } catch (e) {
    assert.ok(true);
  }
});

QUnit.test("toString()", assert => {
  // Setup.
  const coin = createTestData();

  // Run.
  const result = CoinState.toString(coin);

  // Verify.
  assert.ok(result);
  assert.equal(result, '{"id":1,"coinKey":2}');
});

const PlayerStateTest = {};
export default PlayerStateTest;
