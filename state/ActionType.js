const ActionType = {};

ActionType.ADD_COIN = "addCoin";
ActionType.ADD_GAME_RECORD = "addGameRecord";
ActionType.ADD_TO_PLAYER_ARRAY = "addToPlayerArray";
ActionType.CLEAR_UNIT = "clearUnit";
ActionType.MOVE_A_UNIT = "moveAUnit";
ActionType.POP_INPUT_CALLBACK = "popInputCallback";
ActionType.PUSH_INPUT_CALLBACK = "pushInputCallback";
ActionType.REFILL_BAG = "refillBag";
ActionType.REMOVE_FROM_PLAYER_ARRAY = "removeFromPlayerArray";
ActionType.SET_CONTROL = "setControl";
ActionType.SET_CURRENT_DAMAGE_CALLBACK = "setCurrentDamageCallback";
ActionType.SET_CURRENT_DAMAGE_TARGET = "setCurrentDamageTarget";
ActionType.SET_CURRENT_HAND_CALLBACK = "setCurrentHandCallback";
ActionType.SET_CURRENT_MOVE = "setCurrentMove";
ActionType.SET_CURRENT_MOVES = "setCurrentMoves";
ActionType.SET_CURRENT_PAYMENT_COIN = "setCurrentPaymentCoin";
ActionType.SET_CURRENT_PHASE = "setCurrentPhase";
ActionType.SET_CURRENT_PLAYER = "setCurrentPlayer";
ActionType.SET_CURRENT_PLAYER_ORDER = "setCurrentPlayerOrder";
ActionType.SET_DELAY = "setDelay";
ActionType.SET_INITIATIVE_CHANGED_THIS_ROUND = "setInitiativeChangedThisRound";
ActionType.SET_INITIATIVE_PLAYER = "setInitiativePlayer";
ActionType.SET_MCTS_ROOT = "setMctsRoot";
ActionType.SET_PLAYERS = "setPlayers";
ActionType.SET_PLAYER_STRATEGY = "setPlayerStrategy";
ActionType.SET_PLAYER_TO_TABLEAU = "setPlayerToTableau";
ActionType.SET_ROUND = "setRound";
ActionType.SET_UNIT = "setUnit";
ActionType.SET_USER_MESSAGE = "setUserMessage";
ActionType.SET_VERBOSE = "setVerbose";
ActionType.SET_WINNER = "setWinner";
ActionType.TRANSFER_BAG_TO_HAND = "transferBagToHand";
ActionType.TRANSFER_BETWEEN_PLAYER_ARRAYS = "transferBetweenPlayerArrays";
ActionType.TRANSFER_BOARD_TO_DISCARD_FACEUP = "transferBoardToDiscardFaceup"; // Berserker.
ActionType.TRANSFER_BOARD_TO_MORGUE = "transferBoardToMorgue"; // Attacked.
ActionType.TRANSFER_HAND_TO_BOARD = "transferHandToBoard"; // Deploy or bolster.
ActionType.TRANSFER_HAND_TO_DISCARD_FACEDOWN = "transferHandToDiscardFacedown"; // Payment.
ActionType.TRANSFER_HAND_TO_DISCARD_FACEUP = "transferHandToDiscardFaceup";
ActionType.TRANSFER_SUPPLY_TO_DISCARD_FACEUP = "transferSupplyToDiscardFaceup"; // Recruit.
ActionType.TRANSFER_SUPPLY_TO_MORGUE = "transferSupplyToMorgue";

Object.freeze(ActionType);

export default ActionType;
