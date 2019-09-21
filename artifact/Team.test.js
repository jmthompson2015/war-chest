import Team from "./Team.js";

QUnit.module("Team");

QUnit.test("Team properties Raven", assert => {
  const teamKey = Team.RAVEN;
  const properties = Team.properties[teamKey];
  assert.equal(properties.name, "Raven");
  assert.equal(properties.key, "raven");
});

QUnit.test("keys and values", assert => {
  // Run.
  const result = Team.keys();
  const ownPropertyNames = Object.getOwnPropertyNames(Team);

  // Verify.
  ownPropertyNames.forEach(key => {
    const key2 = Team[key];

    if (key !== "properties" && typeof key2 === "string") {
      assert.ok(Team.properties[key2], `Missing value for key = ${key}`);
    }
  });

  result.forEach(value => {
    const p = ownPropertyNames.filter(key => Team[key] === value);
    assert.equal(p.length, 1, `Missing key for value = ${value}`);
  });
});

QUnit.test("Team.keys()", assert => {
  // Run.
  const result = Team.keys();

  // Verify.
  assert.ok(result);
  const length = 2;
  assert.equal(result.length, length);
  assert.equal(result[0], Team.RAVEN);
  assert.equal(result[length - 1], Team.WOLF);
});

const TeamTest = {};
export default TeamTest;
