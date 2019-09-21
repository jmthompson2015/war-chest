import UnitCoin from "./UnitCoin.js";

QUnit.module("UnitCoin");

QUnit.test("UnitCoin properties Archer", assert => {
  const coinKey = UnitCoin.ARCHER;
  const properties = UnitCoin.properties[coinKey];
  assert.equal(properties.name, "Archer");
  assert.equal(properties.image, "resource/coin/Archer.png");
  assert.equal(properties.key, "archer");
});

QUnit.test("keys and values", assert => {
  // Run.
  const result = UnitCoin.keys();
  const ownPropertyNames = Object.getOwnPropertyNames(UnitCoin);

  // Verify.
  ownPropertyNames.forEach(key => {
    const key2 = UnitCoin[key];

    if (key !== "properties" && typeof key2 === "string") {
      assert.ok(UnitCoin.properties[key2], `Missing value for key = ${key}`);
    }
  });

  result.forEach(value => {
    const p = ownPropertyNames.filter(key => UnitCoin[key] === value);
    assert.equal(p.length, 1, `Missing key for value = ${value}`);
  });
});

QUnit.test("UnitCoin.keys()", assert => {
  // Run.
  const result = UnitCoin.keys();

  // Verify.
  assert.ok(result);
  const length = 16;
  assert.equal(result.length, length);
  assert.equal(result[0], UnitCoin.ARCHER);
  assert.equal(result[length - 1], UnitCoin.WARRIOR_PRIEST);
});

const UnitCoinTest = {};
export default UnitCoinTest;
