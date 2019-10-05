import ActionCreator from "./ActionCreator.js";
import ActionType from "./ActionType.js";
import PlayerState from "./PlayerState.js";

QUnit.module("ActionCreator");

QUnit.test("addToPlayerBag()", assert => {
  // Setup.
  const playerId = 3;
  const coinKey = "knight";

  // Run.
  const result = ActionCreator.addToPlayerArray("playerToBag", playerId, coinKey);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.ADD_TO_PLAYER_ARRAY);
  assert.equal(result.arrayName, "playerToBag");
  assert.equal(result.playerId, playerId);
  assert.equal(result.coinKey, coinKey);
});

QUnit.test("addToPlayerMorgue()", assert => {
  // Setup.
  const playerId = 3;
  const coinKey = "knight";

  // Run.
  const result = ActionCreator.addToPlayerArray("playerToMorgue", playerId, coinKey);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.ADD_TO_PLAYER_ARRAY);
  assert.equal(result.arrayName, "playerToMorgue");
  assert.equal(result.playerId, playerId);
  assert.equal(result.coinKey, coinKey);
});

QUnit.test("addToPlayerDiscardFacedown()", assert => {
  // Setup.
  const playerId = 3;
  const coinKey = "knight";

  // Run.
  const result = ActionCreator.addToPlayerArray("addToPlayerDiscardFacedown", playerId, coinKey);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.ADD_TO_PLAYER_ARRAY);
  assert.equal(result.arrayName, "addToPlayerDiscardFacedown");
  assert.equal(result.playerId, playerId);
  assert.equal(result.coinKey, coinKey);
});

QUnit.test("addToPlayerDiscardFaceup()", assert => {
  // Setup.
  const playerId = 3;
  const coinKey = "knight";

  // Run.
  const result = ActionCreator.addToPlayerArray("addToPlayerDiscardFaceup", playerId, coinKey);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.ADD_TO_PLAYER_ARRAY);
  assert.equal(result.arrayName, "addToPlayerDiscardFaceup");
  assert.equal(result.playerId, playerId);
  assert.equal(result.coinKey, coinKey);
});

QUnit.test("addToPlayerHand()", assert => {
  // Setup.
  const playerId = 3;
  const coinKey = "knight";

  // Run.
  const result = ActionCreator.addToPlayerArray("playerToHand", playerId, coinKey);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.ADD_TO_PLAYER_ARRAY);
  assert.equal(result.arrayName, "playerToHand");
  assert.equal(result.playerId, playerId);
  assert.equal(result.coinKey, coinKey);
});

QUnit.test("addToPlayerSupply()", assert => {
  // Setup.
  const playerId = 3;
  const coinKey = "knight";

  // Run.
  const result = ActionCreator.addToPlayerArray("playerToSupply", playerId, coinKey);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.ADD_TO_PLAYER_ARRAY);
  assert.equal(result.arrayName, "playerToSupply");
  assert.equal(result.playerId, playerId);
  assert.equal(result.coinKey, coinKey);
});

QUnit.test("all action types", assert => {
  // Setup.
  const actionTypeKeys = Object.getOwnPropertyNames(ActionType);
  assert.equal(actionTypeKeys.length, 22);

  // Run / Verify.
  actionTypeKeys.forEach(key => {
    assert.ok(ActionCreator[ActionType[key]], `actionType = ${key} ${ActionType[key]}`);
  });
});

QUnit.test("bagToHand()", assert => {
  // Setup.
  const playerId = 3;
  const coinKey = "knight";

  // Run.
  const result = ActionCreator.transferBetweenPlayerArrays(
    "playerToBag",
    "playerToHand",
    playerId,
    coinKey
  );

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.TRANSFER_BETWEEN_PLAYER_ARRAYS);
  assert.equal(result.fromArrayName, "playerToBag");
  assert.equal(result.toArrayName, "playerToHand");
  assert.equal(result.playerId, playerId);
  assert.equal(result.coinKey, coinKey);
});

QUnit.test("boardToMorgue()", assert => {
  // Setup.
  const an = "a1";
  const playerId = 3;

  // Run.
  const result = ActionCreator.boardToMorgue(playerId, an);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.BOARD_TO_MORGUE);
  assert.equal(result.playerId, playerId);
  assert.equal(result.an, an);
});

QUnit.test("discardToBag()", assert => {
  // Setup.
  const playerId = 3;
  const coinKey = "knight";

  // Run.
  const result = ActionCreator.transferBetweenPlayerArrays(
    "playerToDiscard",
    "playerToBag",
    playerId,
    coinKey
  );

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.TRANSFER_BETWEEN_PLAYER_ARRAYS);
  assert.equal(result.fromArrayName, "playerToDiscard");
  assert.equal(result.toArrayName, "playerToBag");
  assert.equal(result.playerId, playerId);
  assert.equal(result.coinKey, coinKey);
});

QUnit.test("handToBoard()", assert => {
  // Setup.
  const playerId = 3;
  const coinKey = "knight";
  const an = "a1";

  // Run.
  const result = ActionCreator.handToBoard(playerId, coinKey, an);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.HAND_TO_BOARD);
  assert.equal(result.playerId, playerId);
  assert.equal(result.coinKey, coinKey);
  assert.equal(result.an, an);
});

QUnit.test("moveAUnit()", assert => {
  // Setup.
  const playerId = 3;
  const fromAN = "a1";
  const toAN = "b1";

  // Run.
  const result = ActionCreator.moveAUnit(playerId, fromAN, toAN);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.MOVE_A_UNIT);
  assert.equal(result.playerId, playerId);
  assert.equal(result.fromAN, fromAN);
  assert.equal(result.toAN, toAN);
});

QUnit.test("setControl()", assert => {
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

QUnit.test("setInitiativePlayer()", assert => {
  // Setup.
  const playerId = 3;

  // Run.
  const result = ActionCreator.setInitiativePlayer(playerId);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.SET_INITIATIVE_PLAYER);
  assert.equal(result.playerId, playerId);
});

QUnit.test("setPlayers()", assert => {
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

QUnit.test("supplyToBag()", assert => {
  // Setup.
  const playerId = 3;
  const coinKey = "knight";

  // Run.
  const result = ActionCreator.transferBetweenPlayerArrays(
    "playerToSupply",
    "playerToBag",
    playerId,
    coinKey
  );

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.TRANSFER_BETWEEN_PLAYER_ARRAYS);
  assert.equal(result.fromArrayName, "playerToSupply");
  assert.equal(result.toArrayName, "playerToBag");
  assert.equal(result.playerId, playerId);
  assert.equal(result.coinKey, coinKey);
});

QUnit.test("supplyToDiscard()", assert => {
  // Setup.
  const playerId = 3;
  const coinKey = "knight";

  // Run.
  const result = ActionCreator.transferBetweenPlayerArrays(
    "playerToSupply",
    "playerToDiscard",
    playerId,
    coinKey
  );

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.TRANSFER_BETWEEN_PLAYER_ARRAYS);
  assert.equal(result.fromArrayName, "playerToSupply");
  assert.equal(result.toArrayName, "playerToDiscard");
  assert.equal(result.playerId, playerId);
  assert.equal(result.coinKey, coinKey);
});

const ActionCreatorTest = {};
export default ActionCreatorTest;
