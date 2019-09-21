import ControlMarker from "./ControlMarker.js";

QUnit.module("ControlMarker");

QUnit.test("ControlMarker properties Neutral", assert => {
  const tokenKey = ControlMarker.NEUTRAL;
  const properties = ControlMarker.properties[tokenKey];
  assert.equal(properties.name, "Neutral Control Marker");
  assert.equal(properties.image, "resource/control/NeutralControlMarker.png");
  assert.equal(properties.key, "neutral");
});

QUnit.test("keys and values", assert => {
  // Run.
  const result = ControlMarker.keys();
  const ownPropertyNames = Object.getOwnPropertyNames(ControlMarker);

  // Verify.
  ownPropertyNames.forEach(key => {
    const key2 = ControlMarker[key];

    if (key !== "properties" && typeof key2 === "string") {
      assert.ok(ControlMarker.properties[key2], `Missing value for key = ${key}`);
    }
  });

  result.forEach(value => {
    const p = ownPropertyNames.filter(key => ControlMarker[key] === value);
    assert.equal(p.length, 1, `Missing key for value = ${value}`);
  });
});

QUnit.test("ControlMarker.keys()", assert => {
  // Run.
  const result = ControlMarker.keys();

  // Verify.
  assert.ok(result);
  const length = 3;
  assert.equal(result.length, length);
  assert.equal(result[0], ControlMarker.NEUTRAL);
  assert.equal(result[length - 1], ControlMarker.WOLF);
});

const ControlMarkerTest = {};
export default ControlMarkerTest;
