const AppState = {};

AppState.create = ({
  anToControl = {},
  anToTokens = {},
  appName = "Vizzini App",
  initiativeChangedThisRound = false,
  initiativePlayerId,
  isGameOver = false,
  winner = null,

  round = 0,
  currentPhaseKey = null,
  currentPlayerId = null,
  currentPaymentCoinKey = null,

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
    initiativeChangedThisRound,
    initiativePlayerId,
    isGameOver,
    winner,

    round,
    currentPhaseKey,
    currentPlayerId,
    currentPaymentCoinKey,

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
