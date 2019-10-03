import ActionCreator from "./ActionCreator.js";
import ActionType from "./ActionType.js";

QUnit.module("ActionType");

QUnit.test("all action creators", assert => {
  // Setup.
  const actionCreatorKeys = Object.getOwnPropertyNames(ActionCreator);
  assert.equal(actionCreatorKeys.length, 18);
  const actionTypeKeys = Object.getOwnPropertyNames(ActionType);
  const actionTypes = actionTypeKeys.map(key => ActionType[key]);

  // Run / Verify.
  assert.equal(actionCreatorKeys.length, actionTypeKeys.length);

  actionCreatorKeys.forEach(key => {
    assert.equal(actionTypes.includes(key), true, `actionCreator = ${key}`);
  });
});

const ActionTypeTest = {};
export default ActionTypeTest;
