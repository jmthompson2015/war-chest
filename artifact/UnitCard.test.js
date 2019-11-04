/* eslint no-console: ["error", { allow: ["log"] }] */

import UnitCard from "./UnitCard.js";

QUnit.module("UnitCard");

QUnit.test("UnitCard properties Archer", assert => {
  const cardKey = UnitCard.ARCHER;
  const properties = UnitCard.properties[cardKey];
  assert.equal(properties.name, "Archer");
  assert.equal(properties.image, "resource/card/Archer.jpg");
  assert.equal(properties.initialCount, 4);
  assert.equal(
    properties.tactic,
    "<b>Attack</b> a unit two spaces away. The intervening space may be occupied by a unit."
  );
  assert.equal(properties.attribute, undefined);
  assert.equal(
    properties.restriction,
    "The Archer can only <b>attack</b> by using its <b>tactic</b>."
  );
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

QUnit.test("keys()", assert => {
  // Run.
  const result = UnitCard.keys();

  // Verify.
  assert.ok(result);
  const length = 16;
  assert.equal(result.length, length);
  assert.equal(result[0], UnitCard.ARCHER);
  assert.equal(result[length - 1], UnitCard.WARRIOR_PRIEST);
});

QUnit.test("keysWithTactics()", assert => {
  // Run.
  const result = UnitCard.keysWithTactics();

  // Verify.
  assert.ok(result);
  const length = 9;
  assert.equal(result.length, length);
  assert.equal(result[0], UnitCard.ARCHER);
  assert.equal(result[length - 1], UnitCard.ROYAL_GUARD);
});

QUnit.skip("report", assert => {
  const values = UnitCard.values();

  console.log(`Tactic`);
  R.forEach(card => {
    if (card.tactic) {
      console.log(`${card.name}: ${card.tactic}`);
    }
  }, values);

  console.log(`Attribute`);
  R.forEach(card => {
    if (card.attribute) {
      console.log(`${card.name}: ${card.attribute}`);
    }
  }, values);

  console.log(`Restriction`);
  R.forEach(card => {
    if (card.restriction) {
      console.log(`${card.name}: ${card.restriction}`);
    }
  }, values);

  assert.ok(true);
});

QUnit.test("valuesWithTactics()", assert => {
  // Run.
  const result = UnitCard.valuesWithTactics();

  // Verify.
  assert.ok(result);
  const length = 9;
  assert.equal(result.length, length);
  assert.equal(result[0].key, UnitCard.ARCHER);
  assert.equal(result[length - 1].key, UnitCard.ROYAL_GUARD);
});

const UnitCardTest = {};
export default UnitCardTest;
