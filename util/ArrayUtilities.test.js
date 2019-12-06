import ArrayUtilities from "./ArrayUtilities.js";

QUnit.module("ArrayUtilities");

QUnit.test("ArrayUtilities.randomElement()", assert => {
  // Setup.
  const array = [1, 2, 3, 4, 5];

  // Run.
  const result = ArrayUtilities.randomElement(array);

  // Verify.
  assert.ok(result);
  assert.equal(result >= 1 && result <= 5, true);
});

QUnit.test("ArrayUtilities.remove()", assert => {
  // Setup.
  const array = [1, 2, 3, 4, 5];

  // Run.
  const result = ArrayUtilities.remove(3, array);

  // Verify.
  assert.ok(result);
  assert.equal(result.join(","), "1,2,4,5");
});

QUnit.test("ArrayUtilities.remove() duplicates", assert => {
  // Setup.
  const array = [1, 1, 2, 3, 4, 5];

  // Run.
  const result = ArrayUtilities.remove(1, array);

  // Verify.
  assert.ok(result);
  assert.equal(result.join(","), "1,2,3,4,5");
});

const ArrayUtilitiesTest = {};
export default ArrayUtilitiesTest;
