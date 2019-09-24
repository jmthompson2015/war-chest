import Resolver from "../artifact/Resolver.js";

import CoinState from "../state/CoinState.js";

import CardsUI from "./CardsUI.js";
import CoinsUI from "./CoinsUI.js";
import Endpoint from "./Endpoint.js";
import MoveOptionUI from "./MoveOptionUI.js";
import ReactUtils from "./ReactUtilities.js";
import TitledElement from "./TitledElement.js";

const createCoinStates = coinKeys => {
  const reduceFunction = (accum, coinKey) => {
    const coinState0 = accum[coinKey];
    const count = coinState0 ? coinState0.count : 0;
    const coinState = CoinState.create({ coinKey, count: count + 1 });
    return R.assoc(coinKey, coinState, accum);
  };
  const coinStateMap = R.reduce(reduceFunction, {}, coinKeys);

  return Object.values(coinStateMap);
};

const createDiscardUI = (player, discardFacedown, discardFaceup, resourceBase) => {
  const coinStates1 =
    discardFacedown.length > 0
      ? [
          CoinState.create({
            coinKey: player.teamKey,
            count: discardFacedown.length,
            isFaceup: false
          })
        ]
      : [];
  const coinStates2 = createCoinStates(discardFaceup);
  const coinStates = R.concat(coinStates1, coinStates2);
  const customKey = "discard";
  const element = React.createElement(CoinsUI, { coinStates, customKey, resourceBase });

  return React.createElement(TitledElement, { key: "discard", element, title: "Discard" });
};

const createHandUI = (hand, paymentCoin, resourceBase, onClick) => {
  const reduceFunction = (accum, coinKey) => {
    const isHighlighted = !R.isNil(paymentCoin) && coinKey === paymentCoin.key;
    const coinState = CoinState.create({ coinKey, isHighlighted });
    return R.append(coinState, accum);
  };
  const coinStates = R.reduce(reduceFunction, [], hand);
  const customKey = "hand";
  const eventSource = "hand";
  const element = React.createElement(CoinsUI, {
    coinStates,
    customKey,
    eventSource,
    onClick,
    resourceBase
  });

  return React.createElement(TitledElement, { key: "hand", element, title: "Hand" });
};

const createInitiativeUI = (initiativeTeamKey, resourceBase) => {
  const coinStates = [CoinState.create({ coinKey: initiativeTeamKey })];
  const customKey = "initiative";
  const element = React.createElement(CoinsUI, { coinStates, customKey, resourceBase });

  return React.createElement(TitledElement, { key: "initiative", element, title: "Initiative" });
};

const createMorgueUI = (morgue, resourceBase) => {
  const coinStates = createCoinStates(morgue);
  const customKey = "morgue";
  const element = React.createElement(CoinsUI, { coinStates, customKey, resourceBase });

  return React.createElement(TitledElement, { key: "morgue", element, title: "Morgue" });
};

const createMoveUI = moveStates => {
  const customKey = "move";
  const element = React.createElement(MoveOptionUI, { moveStates, customKey });

  return React.createElement(TitledElement, { key: "move", element, title: "Move" });
};

const createSupplyUI = (supply, resourceBase) => {
  const coinStates = createCoinStates(supply);
  const customKey = "supply";
  const element = React.createElement(CoinsUI, { coinStates, customKey, resourceBase });

  return React.createElement(TitledElement, { key: "supply", element, title: "Supply" });
};

const createTableauUI = (tableau, resourceBase) => {
  const cards = Resolver.cards(tableau);
  const customKey = "tableau";
  const element = React.createElement(CardsUI, { cards, customKey, resourceBase, width: 125 });

  return React.createElement(TitledElement, { key: "tableau", element, title: "Tableau" });
};

// /////////////////////////////////////////////////////////////////////////////////////////////////
class PlayerPanel extends React.Component {
  render() {
    const {
      player,
      discardFacedown,
      discardFaceup,
      hand,
      morgue,
      supply,
      tableau,

      className,
      customKey,
      isInitiativePlayer,
      moveStates,
      onClick,
      paymentCoin,
      resourceBase
    } = this.props;

    let cells = [];

    if (isInitiativePlayer) {
      const initiativeUI = createInitiativeUI(player.teamKey, resourceBase);
      cells = R.append(initiativeUI, cells);
    }

    if (!R.isEmpty(discardFacedown) || !R.isEmpty(discardFaceup)) {
      const discardUI = createDiscardUI(player, discardFacedown, discardFaceup, resourceBase);
      cells = R.append(discardUI, cells);
    }

    if (!R.isEmpty(hand)) {
      const handUI = createHandUI(hand, paymentCoin, resourceBase, onClick);
      cells = R.append(handUI, cells);
    }

    if (!R.isEmpty(morgue)) {
      const morgueUI = createMorgueUI(morgue, resourceBase);
      cells = R.append(morgueUI, cells);
    }

    if (!R.isEmpty(supply)) {
      const supplyUI = createSupplyUI(supply, resourceBase);
      cells = R.append(supplyUI, cells);
    }

    const tableauUI = createTableauUI(tableau, resourceBase);
    cells = R.append(tableauUI, cells);

    if (!R.isNil(moveStates) && !R.isEmpty(moveStates)) {
      const moveUI = createMoveUI(moveStates);
      cells = R.append(moveUI, cells);
    }

    return ReactUtils.createFlexboxWrap(cells, customKey, className);
  }
}

PlayerPanel.propTypes = {
  player: PropTypes.shape().isRequired,

  discardFaceup: PropTypes.arrayOf().isRequired,
  discardFacedown: PropTypes.arrayOf().isRequired,
  hand: PropTypes.arrayOf().isRequired,
  morgue: PropTypes.arrayOf().isRequired,
  supply: PropTypes.arrayOf().isRequired,
  tableau: PropTypes.arrayOf().isRequired,

  className: PropTypes.string,
  customKey: PropTypes.string,
  isInitiativePlayer: PropTypes.bool,
  moveStates: PropTypes.arrayOf(),
  onClick: PropTypes.func,
  paymentCoin: PropTypes.shape(),
  resourceBase: PropTypes.string
};

PlayerPanel.defaultProps = {
  className: undefined,
  customKey: "playerPanel",
  isInitiativePlayer: false,
  moveStates: undefined,
  onClick: () => {},
  paymentCoin: undefined,
  resourceBase: Endpoint.NETWORK_RESOURCE
};

export default PlayerPanel;
