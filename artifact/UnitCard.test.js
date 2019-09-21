import UnitCard from "./UnitCard.js";

QUnit.module("UnitCard");

QUnit.test("UnitCard properties Archer", assert => {
  const cardKey = UnitCard.ARCHER;
  const properties = UnitCard.properties[cardKey];
  assert.equal(properties.name, "Archer");
  assert.equal(properties.image, "resource/card/Archer.jpg");
  assert.equal(properties.key, "archer");
});

QUnit.test("keys and values", assert => {
  // Run.
  const result = UnitCard.keys();
  const ownPropertyNames = Object.getOwnPropertyNames(UnitCard);

  // Verify.
  ownPropertyNames.forEach(key => {
    const key2 = UnitCard[key];

    if (key !== "properties" && typeof key2 === "string") {
      assert.ok(UnitCard.properties[key2], `Missing value for key = ${key}`);
    }
  });

  result.forEach(value => {
    const p = ownPropertyNames.filter(key => UnitCard[key] === value);
    assert.equal(p.length, 1, `Missing key for value = ${value}`);
  });
});

QUnit.test("UnitCard.keys()", assert => {
  // Run.
  const result = UnitCard.keys();

  // Verify.
  assert.ok(result);
  const length = 16;
  assert.equal(result.length, length);
  assert.equal(result[0], UnitCard.ARCHER);
  assert.equal(result[length - 1], UnitCard.WARRIOR_PRIEST);
});

const UnitCardTest = {};
export default UnitCardTest;
