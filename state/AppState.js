const AppState = {};

AppState.create = ({
  anToControl = {},
  anToTokens = {},
  appName = "Vizzini App",
  delay = 1000,
  initiativeChangedThisRound = false,
  initiativePlayerId,
  isGameOver = false,
  winner = null,

  round = 0,
  currentPhaseKey = null,
  currentPlayerId = null,
  currentPaymentCoinKey = null,
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
    winner,

    round,
    currentPhaseKey,
    currentPlayerId,
    currentPaymentCoinKey,
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

    playerInstances
  });

Object.freeze(AppState);

export default AppState;
