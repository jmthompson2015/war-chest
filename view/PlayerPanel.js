import Resolver from "../artifact/Resolver.js";

import CoinState from "../state/CoinState.js";

import CardsUI from "./CardsUI.js";
import CoinsUI from "./CoinsUI.js";
import Endpoint from "./Endpoint.js";
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
  const element = React.createElement(CoinsUI, { coinStates, resourceBase });

  return React.createElement(TitledElement, { element, title: "Discard" });
};

const createHandUI = (hand, resourceBase) => {
  const reduceFunction = (accum, coinKey) => {
    const coinState = CoinState.create({ coinKey });
    return R.append(coinState, accum);
  };
  const coinStates = R.reduce(reduceFunction, [], hand);
  const element = React.createElement(CoinsUI, { coinStates, resourceBase });

  return React.createElement(TitledElement, { element, title: "Hand" });
};

const createMorgueUI = (morgue, resourceBase) => {
  const coinStates = createCoinStates(morgue);
  const element = React.createElement(CoinsUI, { coinStates, resourceBase });

  return React.createElement(TitledElement, { element, title: "Morgue" });
};

const createSupplyUI = (supply, resourceBase) => {
  const coinStates = createCoinStates(supply);
  const element = React.createElement(CoinsUI, { coinStates, resourceBase });

  return React.createElement(TitledElement, { element, title: "Supply" });
};

const createTableauUI = (tableau, resourceBase) => {
  const cards = Resolver.cards(tableau);
  const element = React.createElement(CardsUI, { cards, resourceBase, width: 125 });

  return React.createElement(TitledElement, { element, title: "Tableau" });
};

// /////////////////////////////////////////////////////////////////////////////////////////////////
class PlayerPanel extends React.Component {
  render() {
    const {
      className,
      discardFacedown,
      discardFaceup,
      hand,
      morgue,
      player,
      resourceBase,
      supply,
      tableau
    } = this.props;

    const discardUI = createDiscardUI(player, discardFacedown, discardFaceup, resourceBase);
    const handUI = createHandUI(hand, resourceBase);
    const morgueUI = createMorgueUI(morgue, resourceBase);
    const supplyUI = createSupplyUI(supply, resourceBase);
    const tableauUI = createTableauUI(tableau, resourceBase);

    const cells = [discardUI, handUI, morgueUI, supplyUI, tableauUI];

    return ReactUtils.createFlexboxWrap(cells, "titledElementTable", className);
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
  resourceBase: PropTypes.string
};

PlayerPanel.defaultProps = {
  className: undefined,
  resourceBase: Endpoint.NETWORK_RESOURCE
};

export default PlayerPanel;
