import ActionCreator from "./ActionCreator.js";
import ActionType from "./ActionType.js";
import PlayerState from "./PlayerState.js";

QUnit.module("ActionCreator");

QUnit.test("all action types", (assert) => {
  // Setup.
  const actionTypeKeys = Object.getOwnPropertyNames(ActionType);
  assert.equal(actionTypeKeys.length, 39);

  // Run / Verify.
  actionTypeKeys.forEach((key) => {
    assert.ok(ActionCreator[ActionType[key]], `actionType = ${key} ${ActionType[key]}`);
  });
});

QUnit.test("addToPlayerBag()", (assert) => {
  // Setup.
  const playerId = 3;
  const coinId = 12;

  // Run.
  const result = ActionCreator.addToPlayerArray("playerToBag", playerId, coinId);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.ADD_TO_PLAYER_ARRAY);
  assert.equal(result.arrayName, "playerToBag");
  assert.equal(result.playerId, playerId);
  assert.equal(result.coinId, coinId);
});

QUnit.test("addToPlayerMorgue()", (assert) => {
  // Setup.
  const playerId = 3;
  const coinId = 12;

  // Run.
  const result = ActionCreator.addToPlayerArray("playerToMorgue", playerId, coinId);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.ADD_TO_PLAYER_ARRAY);
  assert.equal(result.arrayName, "playerToMorgue");
  assert.equal(result.playerId, playerId);
  assert.equal(result.coinId, coinId);
});

QUnit.test("addToPlayerDiscardFacedown()", (assert) => {
  // Setup.
  const playerId = 3;
  const coinId = 12;

  // Run.
  const result = ActionCreator.addToPlayerArray("addToPlayerDiscardFacedown", playerId, coinId);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.ADD_TO_PLAYER_ARRAY);
  assert.equal(result.arrayName, "addToPlayerDiscardFacedown");
  assert.equal(result.playerId, playerId);
  assert.equal(result.coinId, coinId);
});

QUnit.test("addToPlayerDiscardFaceup()", (assert) => {
  // Setup.
  const playerId = 3;
  const coinId = 12;

  // Run.
  const result = ActionCreator.addToPlayerArray("addToPlayerDiscardFaceup", playerId, coinId);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.ADD_TO_PLAYER_ARRAY);
  assert.equal(result.arrayName, "addToPlayerDiscardFaceup");
  assert.equal(result.playerId, playerId);
  assert.equal(result.coinId, coinId);
});

QUnit.test("addToPlayerHand()", (assert) => {
  // Setup.
  const playerId = 3;
  const coinId = 12;

  // Run.
  const result = ActionCreator.addToPlayerArray("playerToHand", playerId, coinId);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.ADD_TO_PLAYER_ARRAY);
  assert.equal(result.arrayName, "playerToHand");
  assert.equal(result.playerId, playerId);
  assert.equal(result.coinId, coinId);
});

QUnit.test("addToPlayerSupply()", (assert) => {
  // Setup.
  const playerId = 3;
  const coinId = 12;

  // Run.
  const result = ActionCreator.addToPlayerArray("playerToSupply", playerId, coinId);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.ADD_TO_PLAYER_ARRAY);
  assert.equal(result.arrayName, "playerToSupply");
  assert.equal(result.playerId, playerId);
  assert.equal(result.coinId, coinId);
});

QUnit.test("moveAUnit()", (assert) => {
  // Setup.
  const playerId = 3;
  const an1 = "a1";
  const an2 = "b1";

  // Run.
  const result = ActionCreator.moveAUnit(playerId, an1, an2);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.MOVE_A_UNIT);
  assert.equal(result.playerId, playerId);
  assert.equal(result.an1, an1);
  assert.equal(result.an2, an2);
});

QUnit.test("setControl()", (assert) => {
  // Setup.
  const an = "a1";
  const controlKey = "raven";

  // Run.
  const result = ActionCreator.setControl(an, controlKey);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.SET_CONTROL);
  assert.equal(result.an, an);
  assert.equal(result.controlKey, controlKey);
});

QUnit.test("setInitiativePlayer()", (assert) => {
  // Setup.
  const playerId = 3;

  // Run.
  const result = ActionCreator.setInitiativePlayer(playerId);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.SET_INITIATIVE_PLAYER);
  assert.equal(result.playerId, playerId);
});

QUnit.test("setPlayers()", (assert) => {
  // Setup.
  const ravenPlayer = PlayerState.create({ id: 1, name: "Raven" });
  const wolfPlayer = PlayerState.create({ id: 2, name: "Wolf" });
  const players = [ravenPlayer, wolfPlayer];

  // Run.
  const result = ActionCreator.setPlayers(players);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.SET_PLAYERS);
  const resultPlayers = result.players;
  assert.ok(resultPlayers);
  assert.equal(resultPlayers.length, 2);
  assert.equal(resultPlayers[0], ravenPlayer);
  assert.equal(resultPlayers[1], wolfPlayer);
});

QUnit.test("transferBagToHand()", (assert) => {
  // Setup.
  const playerId = 3;
  const coinId = 12;

  // Run.
  const result = ActionCreator.transferBagToHand(playerId, coinId);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.TRANSFER_BAG_TO_HAND);
  assert.equal(result.playerId, playerId);
  assert.equal(result.coinId, coinId);
});

QUnit.test("transferBoardToDiscardFaceup()", (assert) => {
  // Setup.
  const an1 = "a1";
  const playerId = 3;

  // Run.
  const result = ActionCreator.transferBoardToDiscardFaceup(playerId, an1);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.TRANSFER_BOARD_TO_DISCARD_FACEUP);
  assert.equal(result.playerId, playerId);
  assert.equal(result.an1, an1);
});

QUnit.test("transferBoardToMorgue()", (assert) => {
  // Setup.
  const an1 = "a1";
  const playerId = 3;

  // Run.
  const result = ActionCreator.transferBoardToMorgue(playerId, an1);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.TRANSFER_BOARD_TO_MORGUE);
  assert.equal(result.playerId, playerId);
  assert.equal(result.an1, an1);
});

QUnit.test("transferHandToBoard()", (assert) => {
  // Setup.
  const playerId = 3;
  const coinId = 12;
  const an2 = "a1";

  // Run.
  const result = ActionCreator.transferHandToBoard(playerId, coinId, an2);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.TRANSFER_HAND_TO_BOARD);
  assert.equal(result.playerId, playerId);
  assert.equal(result.coinId, coinId);
  assert.equal(result.an2, an2);
});

QUnit.test("transferHandToDiscardFacedown()", (assert) => {
  // Setup.
  const playerId = 3;
  const coinId = 12;

  // Run.
  const result = ActionCreator.transferHandToDiscardFacedown(playerId, coinId);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.TRANSFER_HAND_TO_DISCARD_FACEDOWN);
  assert.equal(result.playerId, playerId);
  assert.equal(result.coinId, coinId);
});

QUnit.test("transferHandToDiscardFaceup()", (assert) => {
  // Setup.
  const playerId = 3;
  const coinId = 12;

  // Run.
  const result = ActionCreator.transferHandToDiscardFaceup(playerId, coinId);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.TRANSFER_HAND_TO_DISCARD_FACEUP);
  assert.equal(result.playerId, playerId);
  assert.equal(result.coinId, coinId);
});

QUnit.test("transferSupplyToDiscardFaceup()", (assert) => {
  // Setup.
  const playerId = 3;
  const coinId = 12;

  // Run.
  const result = ActionCreator.transferSupplyToDiscardFaceup(playerId, coinId);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.TRANSFER_SUPPLY_TO_DISCARD_FACEUP);
  assert.equal(result.playerId, playerId);
  assert.equal(result.coinId, coinId);
});

QUnit.test("transferSupplyToHand()", (assert) => {
  // Setup.
  const playerId = 3;
  const coinId = 12;

  // Run.
  const result = ActionCreator.transferBetweenPlayerArrays(
    "playerToSupply",
    "playerToHand",
    playerId,
    coinId
  );

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.TRANSFER_BETWEEN_PLAYER_ARRAYS);
  assert.equal(result.fromArrayName, "playerToSupply");
  assert.equal(result.toArrayName, "playerToHand");
  assert.equal(result.playerId, playerId);
  assert.equal(result.coinId, coinId);
});

QUnit.test("transferSupplyToMorgue()", (assert) => {
  // Setup.
  const playerId = 3;
  const coinId = 12;

  // Run.
  const result = ActionCreator.transferSupplyToMorgue(playerId, coinId);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.TRANSFER_SUPPLY_TO_MORGUE);
  assert.equal(result.playerId, playerId);
  assert.equal(result.coinId, coinId);
});

const ActionCreatorTest = {};
export default ActionCreatorTest;
