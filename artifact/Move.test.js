/* eslint no-console: ["error", { allow: ["log"] }] */

import Move from "./Move.js";

QUnit.module("Move");

QUnit.test("Move properties Claim Initiative", assert => {
  const tokenKey = Move.CLAIM_INITIATIVE;
  const properties = Move.properties[tokenKey];
  assert.equal(properties.name, "Claim Initiative");
  assert.equal(properties.isFaceup, false);
  assert.equal(properties.isManeuver, false);
  assert.equal(properties.key, "claimInitiative");
});

QUnit.test("keys and values", assert => {
  // Run.
  const result = Move.keys();
  const ownPropertyNames = Object.getOwnPropertyNames(Move);

  // Verify.
  ownPropertyNames.forEach(key => {
    const key2 = Move[key];

    if (key !== "properties" && typeof key2 === "string") {
      assert.ok(Move.properties[key2], `Missing value for key = ${key}`);
    }
  });

  result.forEach(value => {
    const p = ownPropertyNames.filter(key => Move[key] === value);
    assert.equal(p.length, 1, `Missing key for value = ${value}`);
  });
});

QUnit.test("Move.keys()", assert => {
  // Run.
  const result = Move.keys();

  // Verify.
  assert.ok(result);
  const length = 9;
  assert.equal(result.length, length);
  assert.equal(result[0], Move.CLAIM_INITIATIVE);
  assert.equal(result[length - 1], Move.TACTIC);
});

QUnit.test("Move.facedowns()", assert => {
  // Run.
  const result = Move.facedowns();

  // Verify.
  assert.ok(result);
  const length = 3;
  assert.equal(result.length, length);
  assert.equal(result[0], Move.properties[Move.CLAIM_INITIATIVE]);
  assert.equal(result[length - 1], Move.properties[Move.PASS]);
});

QUnit.test("Move.faceups()", assert => {
  // Run.
  const result = Move.faceups();

  // Verify.
  assert.ok(result);
  const length = 6;
  assert.equal(result.length, length);
  assert.equal(result[0], Move.properties[Move.DEPLOY]);
  assert.equal(result[length - 1], Move.properties[Move.TACTIC]);
});

QUnit.test("Move.maneuverKeys()", assert => {
  // Run.
  const result = Move.maneuverKeys();

  // Verify.
  assert.ok(result);
  const length = 4;
  assert.equal(result.length, length);
  assert.equal(result[0], Move.MOVE_A_UNIT);
  assert.equal(result[1], Move.CONTROL);
  assert.equal(result[2], Move.ATTACK);
  assert.equal(result[3], Move.TACTIC);
});

QUnit.test("Move.maneuvers()", assert => {
  // Run.
  const result = Move.maneuvers();

  // Verify.
  assert.ok(result);
  const length = 4;
  assert.equal(result.length, length);
  assert.equal(result[0], Move.properties[Move.MOVE_A_UNIT]);
  assert.equal(result[1], Move.properties[Move.CONTROL]);
  assert.equal(result[2], Move.properties[Move.ATTACK]);
  assert.equal(result[3], Move.properties[Move.TACTIC]);
});

const MoveTest = {};
export default MoveTest;
