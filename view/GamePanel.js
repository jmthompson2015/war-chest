/* eslint no-console: ["error", { allow: ["log"] }] */

import Selector from "../state/Selector.js";

import BoardUI from "./BoardUI.js";
import Endpoint from "./Endpoint.js";
import PlayerPanel from "./PlayerPanel.js";
import ReactUtils from "./ReactUtilities.js";

const createBoardUI = state =>
  React.createElement(BoardUI, {
    anToControl: Selector.anToControl(state),
    anToTokens: Selector.anToTokens(state),
    myKey: "warChestCanvas",
    resourceBase: Endpoint.LOCAL_RESOURCE
  });

const createPlayerPanel = (player, state, onClick) =>
  React.createElement(PlayerPanel, {
    myKey: `playerPanel${player.id}`,
    player,
    discardFacedown: Selector.discardFacedown(player.id, state),
    discardFaceup: Selector.discardFaceup(player.id, state),
    hand: Selector.hand(player.id, state),
    morgue: Selector.morgue(player.id, state),
    supply: Selector.supply(player.id, state),
    tableau: Selector.tableau(player.id, state),
    onClick,
    resourceBase: Endpoint.LOCAL_RESOURCE
  });

// /////////////////////////////////////////////////////////////////////////////////////////////////
class GamePanel extends React.Component {
  constructor(props) {
    super(props);

    this.handleOnClick = this.handleOnClickFunction.bind(this);
  }

  handleOnClickFunction(event) {
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

  render() {
    const { className, state } = this.props;

    const player1 = Selector.player(1, state);
    const player2 = Selector.player(2, state);

    const playerPanel1 = createPlayerPanel(player1, state, this.handleOnClick);
    const boardUI = createBoardUI(state);
    const playerPanel2 = createPlayerPanel(player2, state, this.handleOnClick);

    const rows = [
      ReactUtils.createRow(playerPanel1, "PlayerPanel1Row"),
      ReactUtils.createRow(boardUI, "BoardUIRow"),
      ReactUtils.createRow(playerPanel2, "PlayerPanel2Row")
    ];

    return ReactUtils.createTable(rows, "GameTable", className);
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
