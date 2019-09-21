/* eslint no-console: ["error", { allow: ["log"] }] */

import Phase from "./Phase.js";

QUnit.module("Phase");

QUnit.test("Phase properties Draw 3 Coins", assert => {
  const phaseKey = Phase.DRAW_THREE_COINS;
  const properties = Phase.properties[phaseKey];
  assert.equal(properties.name, "Draw 3 Coins");
  assert.equal(properties.key, "drawThreeCoins");
});

QUnit.test("keys and values", assert => {
  // Run.
  const result = Phase.keys();
  const ownPropertyNames = Object.getOwnPropertyNames(Phase);

  // Verify.
  ownPropertyNames.forEach(key => {
    const key2 = Phase[key];

    if (key !== "properties" && typeof key2 === "string") {
      assert.ok(Phase.properties[key2], `Missing value for key = ${key}`);
    }
  });

  result.forEach(value => {
    const p = ownPropertyNames.filter(key => Phase[key] === value);
    assert.equal(p.length, 1, `Missing key for value = ${value}`);
  });
});

QUnit.test("Phase.keys()", assert => {
  // Run.
  const result = Phase.keys();

  // Verify.
  assert.ok(result);
  const length = 2;
  assert.equal(result.length, length);
  assert.equal(result[0], Phase.DRAW_THREE_COINS);
  assert.equal(result[length - 1], Phase.PLAY_COINS);
});

const PhaseTest = {};
export default PhaseTest;
