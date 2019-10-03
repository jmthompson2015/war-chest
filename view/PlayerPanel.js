import Resolver from "../artifact/Resolver.js";

import CoinState from "../state/CoinState.js";

import CardsUI from "./CardsUI.js";
import CoinsUI from "./CoinsUI.js";
import Endpoint from "./Endpoint.js";
import MoveOptionDialog from "./MoveOptionDialog.js";

const { ReactUtilities: RU, TitledElement } = ReactComponent;

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

const createInputArea = (callback, moveStates, paymentCoin, player) => {
  const myKey = `inputArea${player.id}`;
  let element;

  if (!R.isEmpty(moveStates)) {
    const customKey = "move";
    element = React.createElement(MoveOptionDialog, {
      callback,
      moveStates,
      paymentCoin,
      player,
      customKey
    });
  }

  return ReactDOMFactories.div({ key: myKey, id: myKey }, element);
};

const createMorgueUI = (morgue, resourceBase) => {
  const coinStates = createCoinStates(morgue);
  const customKey = "morgue";
  const element = React.createElement(CoinsUI, { coinStates, customKey, resourceBase });

  return React.createElement(TitledElement, { key: "morgue", element, title: "Morgue" });
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
      handOnClick,
      inputCallback,
      isInitiativePlayer,
      moveStates,
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
      const handUI = createHandUI(hand, paymentCoin, resourceBase, handOnClick);
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

    if (!R.isNil(paymentCoin)) {
      const inputArea = createInputArea(inputCallback, moveStates, paymentCoin, player);
      cells = R.append(inputArea, cells);
    }

    return RU.createFlexboxWrap(cells, customKey, className);
  }
}

PlayerPanel.propTypes = {
  player: PropTypes.shape().isRequired,

  discardFaceup: PropTypes.arrayOf(PropTypes.string).isRequired,
  discardFacedown: PropTypes.arrayOf(PropTypes.string).isRequired,
  hand: PropTypes.arrayOf(PropTypes.string).isRequired,
  morgue: PropTypes.arrayOf(PropTypes.string).isRequired,
  supply: PropTypes.arrayOf(PropTypes.string).isRequired,
  tableau: PropTypes.arrayOf(PropTypes.string).isRequired,

  className: PropTypes.string,
  customKey: PropTypes.string,
  handOnClick: PropTypes.func,
  inputCallback: PropTypes.func,
  isInitiativePlayer: PropTypes.bool,
  moveStates: PropTypes.arrayOf(),
  paymentCoin: PropTypes.shape(),
  resourceBase: PropTypes.string
};

PlayerPanel.defaultProps = {
  className: undefined,
  customKey: "playerPanel",
  handOnClick: () => {},
  inputCallback: () => {},
  isInitiativePlayer: false,
  moveStates: undefined,
  paymentCoin: undefined,
  resourceBase: Endpoint.NETWORK_RESOURCE
};

export default PlayerPanel;
