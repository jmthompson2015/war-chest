const AppState = {};

AppState.create = ({
  anToControl = {},
  anToTokens = {},
  appName = "Vizzini App",
  delay = 1000,
  initiativeChangedThisRound = false,
  initiativePlayerId,
  isGameOver = false,
  userMessage = null,
  winner = null,

  round = 0,
  currentPlayerOrder = null,
  currentPhaseKey = null,
  currentPlayerId = null,
  currentPaymentCoinId = null,
  currentHandCallback = null,
  currentMoves = [],
  currentMove = null,
  currentInputCallback = null,

  playerToBag = {},
  playerToDiscardFacedown = {},
  playerToDiscardFaceup = {},
  playerToHand = {},
  playerToMorgue = {},
  playerToSupply = {},
  playerToTableau = {},

  coinInstances = {},
  playerInstances = {}
} = {}) =>
  Immutable({
    anToControl,
    anToTokens,
    appName,
    delay,
    initiativeChangedThisRound,
    initiativePlayerId,
    isGameOver,
    userMessage,
    winner,

    round,
    currentPlayerOrder,
    currentPhaseKey,
    currentPlayerId,
    currentPaymentCoinId,
    currentHandCallback,
    currentMoves,
    currentMove,
    currentInputCallback,

    playerToBag,
    playerToDiscardFacedown,
    playerToDiscardFaceup,
    playerToHand,
    playerToMorgue,
    playerToSupply,
    playerToTableau,

    coinInstances,
    playerInstances
  });

Object.freeze(AppState);

export default AppState;
