import DamageTarget from "./DamageTarget.js";

QUnit.module("DamageTarget");

QUnit.test("DamageTarget properties Supply", assert => {
  const damageKey = DamageTarget.SUPPLY;
  const properties = DamageTarget.properties[damageKey];
  assert.equal(properties.name, "Supply");
  assert.equal(properties.key, "supply");
});

QUnit.test("keys and values", assert => {
  // Run.
  const result = DamageTarget.keys();
  const ownPropertyNames = Object.getOwnPropertyNames(DamageTarget);

  // Verify.
  ownPropertyNames.forEach(key => {
    const key2 = DamageTarget[key];

    if (key !== "properties" && typeof key2 === "string") {
      assert.ok(DamageTarget.properties[key2], `Missing value for key = ${key}`);
    }
  });

  result.forEach(value => {
    const p = ownPropertyNames.filter(key => DamageTarget[key] === value);
    assert.equal(p.length, 1, `Missing key for value = ${value}`);
  });
});

QUnit.test("DamageTarget.keys()", assert => {
  // Run.
  const result = DamageTarget.keys();

  // Verify.
  assert.ok(result);
  const length = 2;
  assert.equal(result.length, length);
  assert.equal(result[0], DamageTarget.SUPPLY);
  assert.equal(result[length - 1], DamageTarget.BOARD);
});

const DamageTargetTest = {};
export default DamageTargetTest;
