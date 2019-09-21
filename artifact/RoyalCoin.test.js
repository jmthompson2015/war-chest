import RoyalCoin from "./RoyalCoin.js";

QUnit.module("RoyalCoin");

QUnit.test("RoyalCoin properties Raven", assert => {
  const coinKey = RoyalCoin.RAVEN;
  const properties = RoyalCoin.properties[coinKey];
  assert.equal(properties.name, "Raven Royal Coin");
  assert.equal(properties.image, "resource/coin/RavenRoyalCoin.png");
  assert.equal(properties.key, "raven");
});

QUnit.test("RoyalCoin properties Wolf", assert => {
  const coinKey = RoyalCoin.WOLF;
  const properties = RoyalCoin.properties[coinKey];
  assert.equal(properties.name, "Wolf Royal Coin");
  assert.equal(properties.image, "resource/coin/WolfRoyalCoin.png");
  assert.equal(properties.key, "wolf");
});

QUnit.test("keys and values", assert => {
  // Run.
  const result = RoyalCoin.keys();
  const ownPropertyNames = Object.getOwnPropertyNames(RoyalCoin);

  // Verify.
  ownPropertyNames.forEach(key => {
    const key2 = RoyalCoin[key];

    if (key !== "properties" && typeof key2 === "string") {
      assert.ok(RoyalCoin.properties[key2], `Missing value for key = ${key}`);
    }
  });

  result.forEach(value => {
    const p = ownPropertyNames.filter(key => RoyalCoin[key] === value);
    assert.equal(p.length, 1, `Missing key for value = ${value}`);
  });
});

QUnit.test("RoyalCoin.keys()", assert => {
  // Run.
  const result = RoyalCoin.keys();

  // Verify.
  assert.ok(result);
  const length = 2;
  assert.equal(result.length, length);
  assert.equal(result[0], RoyalCoin.RAVEN);
  assert.equal(result[length - 1], RoyalCoin.WOLF);
});

const RoyalCoinTest = {};
export default RoyalCoinTest;
