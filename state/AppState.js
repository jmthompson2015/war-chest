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
  currentDamageCallback = null,
  currentDamageTargetKey = null,
  currentPlayerOrder = null,
  currentPhaseKey = null,
  currentPlayerId = null,
  currentPaymentCoinId = null,
  currentHandCallback = null,
  currentMoves = [],
  currentMove = null,
  inputCallbackStack = [],

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
    currentDamageCallback,
    currentDamageTargetKey,
    currentPlayerOrder,
    currentPhaseKey,
    currentPlayerId,
    currentPaymentCoinId,
    currentHandCallback,
    currentMoves,
    currentMove,
    inputCallbackStack,

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
