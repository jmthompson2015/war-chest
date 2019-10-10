/* eslint no-console: ["error", { allow: ["log"] }] */

import Selector from "../state/Selector.js";

import BoardUI from "./BoardUI.js";
import Endpoint from "./Endpoint.js";
import PlayerPanel from "./PlayerPanel.js";
import StatusBarUI from "./StatusBarUI.js";

const { ReactUtilities: RU } = ReactComponent;

const createBoardUI = state => {
  const anToTokens = Selector.anToTokens(state);
  const reduceFunction = (accum, an) => {
    const coinIds = anToTokens[an];
    const coinStates = Selector.coins(coinIds, state);
    const coinKeys = R.map(c => c.coinKey, coinStates);

    return R.assoc(an, coinKeys, accum);
  };
  const myANToTokens = R.reduce(reduceFunction, {}, Object.keys(anToTokens));

  return React.createElement(BoardUI, {
    anToControl: Selector.anToControl(state),
    anToTokens: myANToTokens,
    customKey: "warChestCanvas",
    resourceBase: Endpoint.LOCAL_RESOURCE
  });
};

const isCurrentPlayer = (playerId, state) => {
  const currentPlayer = Selector.currentPlayer(state);

  return currentPlayer && playerId === currentPlayer.id;
};

const isInitiativePlayer = (playerId, state) => {
  const initiativePlayer = Selector.initiativePlayer(state);

  return initiativePlayer && playerId === initiativePlayer.id;
};

const createPlayerPanel = (
  coinInstances,
  moveStates,
  player,
  state,
  handOnClickIn,
  inputCallbackIn
) => {
  const myIsCurrentPlayer = isCurrentPlayer(player.id, state);
  const handOnClick = myIsCurrentPlayer ? handOnClickIn : undefined;
  const inputCallback = myIsCurrentPlayer ? inputCallbackIn : undefined;
  const paymentCoin = myIsCurrentPlayer ? Selector.currentPaymentCoin(state) : undefined;

  return React.createElement(PlayerPanel, {
    coinInstances,
    customKey: `playerPanel${player.id}`,
    player,

    discardFacedown: Selector.coins(Selector.discardFacedown(player.id, state), state),
    discardFaceup: Selector.coins(Selector.discardFaceup(player.id, state), state),
    hand: Selector.coins(Selector.hand(player.id, state), state),
    morgue: Selector.coins(Selector.morgue(player.id, state), state),
    supply: Selector.coins(Selector.supply(player.id, state), state),
    tableau: Selector.tableau(player.id, state),

    handOnClick,
    inputCallback,
    isInitiativePlayer: isInitiativePlayer(player.id, state),
    moveStates,
    paymentCoin,
    resourceBase: Endpoint.LOCAL_RESOURCE
  });
};

const createStatusBar = (round, phase, player, userMessage) => {
  return React.createElement(StatusBarUI, {
    phaseName: phase ? phase.name : undefined,
    playerName: player ? player.name : undefined,
    round,
    userMessage
  });
};

// /////////////////////////////////////////////////////////////////////////////////////////////////
class GamePanel extends React.Component {
  render() {
    const { className, handOnClick, inputCallback, state } = this.props;

    const { coinInstances } = state;
    const round = Selector.round(state);
    const currentPhase = Selector.currentPhase(state);
    const player1 = Selector.player(1, state);
    const player2 = Selector.player(2, state);
    const currentPlayer = Selector.currentPlayer(state);
    const userMessage = Selector.userMessage(state);
    let moveStates1 = [];
    let moveStates2 = [];

    if (currentPlayer && !currentPlayer.isComputer) {
      switch (currentPlayer.id) {
        case 1:
          moveStates1 = Selector.currentMoves(state);
          break;
        case 2:
          moveStates2 = Selector.currentMoves(state);
          break;
        default:
        // Nothing to do.
      }
    }

    const statusBar = createStatusBar(round, currentPhase, currentPlayer, userMessage);
    const playerPanel1 = createPlayerPanel(
      coinInstances,
      moveStates1,
      player1,
      state,
      handOnClick,
      inputCallback
    );
    const boardUI = createBoardUI(state);
    const playerPanel2 = createPlayerPanel(
      coinInstances,
      moveStates2,
      player2,
      state,
      handOnClick,
      inputCallback
    );

    const rows = [
      RU.createRow(statusBar, "StatusBarRow"),
      RU.createRow(playerPanel1, "PlayerPanel1Row"),
      RU.createRow(boardUI, "BoardUIRow"),
      RU.createRow(playerPanel2, "PlayerPanel2Row")
    ];

    return RU.createTable(rows, "GameTable", className);
  }
}

GamePanel.propTypes = {
  state: PropTypes.shape().isRequired,

  className: PropTypes.string,
  handOnClick: PropTypes.func,
  inputCallback: PropTypes.func
};

GamePanel.defaultProps = {
  className: undefined,
  handOnClick: () => {},
  inputCallback: () => {}
};

export default GamePanel;
