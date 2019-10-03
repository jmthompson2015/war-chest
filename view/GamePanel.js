/* eslint no-console: ["error", { allow: ["log"] }] */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["inputCallbackFunction"] }] */

import Selector from "../state/Selector.js";

import BoardUI from "./BoardUI.js";
import Endpoint from "./Endpoint.js";
import PlayerPanel from "./PlayerPanel.js";

const { ReactUtilities: RU } = ReactComponent;

const createBoardUI = state =>
  React.createElement(BoardUI, {
    anToControl: Selector.anToControl(state),
    anToTokens: Selector.anToTokens(state),
    myKey: "warChestCanvas",
    resourceBase: Endpoint.LOCAL_RESOURCE
  });

const isCurrentPlayer = (playerId, state) => {
  const currentPlayer = Selector.currentPlayer(state);

  return currentPlayer && playerId === currentPlayer.id;
};

const isInitiativePlayer = (playerId, state) => {
  const initiativePlayer = Selector.initiativePlayer(state);

  return initiativePlayer && playerId === initiativePlayer.id;
};

const createPlayerPanel = (moveStates, player, state, handOnClick, inputCallback) => {
  const paymentCoin = isCurrentPlayer(player.id, state)
    ? Selector.currentPaymentCoin(state)
    : undefined;

  return React.createElement(PlayerPanel, {
    myKey: `playerPanel${player.id}`,
    player,

    discardFacedown: Selector.discardFacedown(player.id, state),
    discardFaceup: Selector.discardFaceup(player.id, state),
    hand: Selector.hand(player.id, state),
    morgue: Selector.morgue(player.id, state),
    supply: Selector.supply(player.id, state),
    tableau: Selector.tableau(player.id, state),

    handOnClick,
    inputCallback,
    isInitiativePlayer: isInitiativePlayer(player.id, state),
    moveStates,
    paymentCoin,
    resourceBase: Endpoint.LOCAL_RESOURCE
  });
};

// /////////////////////////////////////////////////////////////////////////////////////////////////
class GamePanel extends React.Component {
  constructor(props) {
    super(props);

    this.handOnClick = this.handOnClickFunction.bind(this);
    this.inputCallback = this.inputCallbackFunction.bind(this);
  }

  handOnClickFunction(event) {
    const { state } = this.props;

    if (!R.isNil(state)) {
      const element = event.currentTarget;
      const { dataset } = element;
      const { source } = dataset;

      if (source === "hand") {
        const { coinKey, count, isFaceup } = dataset;
        console.log(`GamePanel.handleOnClickFunction() event = ${event}`);
        console.log(`source=${source} coinKey=${coinKey} count=${count} isFaceup=${isFaceup}`);
      }
    }
  }

  inputCallbackFunction({ playerId, moveState }) {
    console.log(
      `GamePanel.inputCallbackFunction() playerId = ${playerId} moveState = ${JSON.stringify(
        moveState
      )}`
    );
  }

  render() {
    const { className, state } = this.props;

    const player1 = Selector.player(1, state);
    const player2 = Selector.player(2, state);
    const currentPlayer = Selector.currentPlayer(state);
    let moveStates1 = [];
    let moveStates2 = [];

    if (currentPlayer && !currentPlayer.isComputer) {
      switch (currentPlayer.id) {
        case 1:
          moveStates1 = Selector.currentMoveStates(state);
          break;
        case 2:
          moveStates2 = Selector.currentMoveStates(state);
          break;
        default:
        // Nothing to do.
      }
    }

    const playerPanel1 = createPlayerPanel(
      moveStates1,
      player1,
      state,
      this.handOnClick,
      this.inputCallback
    );
    const boardUI = createBoardUI(state);
    const playerPanel2 = createPlayerPanel(
      moveStates2,
      player2,
      state,
      this.handOnClick,
      this.inputCallback
    );

    const rows = [
      RU.createRow(playerPanel1, "PlayerPanel1Row"),
      RU.createRow(boardUI, "BoardUIRow"),
      RU.createRow(playerPanel2, "PlayerPanel2Row")
    ];

    return RU.createTable(rows, "GameTable", className);
  }
}

GamePanel.propTypes = {
  state: PropTypes.shape().isRequired,

  className: PropTypes.string
};

GamePanel.defaultProps = {
  className: undefined
};

export default GamePanel;
