import Resolver from "../artifact/Resolver.js";

import CoinState from "../state/CoinState.js";

import CoinsUI from "./CoinsUI.js";
import DamageTargetDialog from "./DamageTargetDialog.js";
import Endpoint from "./Endpoint.js";
import MoveOptionDialog from "./MoveOptionDialog.js";
import TableauUI from "./TableauUI.js";

const { ReactUtilities: RU, TitledElement } = ReactComponent;

const titleClass = "b bg-wc-dark f6 tc wc-light";

const mergeCoinStates = coinStates => {
  const reduceFunction = (accum, coinState0) => {
    const coinState1 = accum[coinState0.coinKey];
    const count = coinState1 ? coinState1.count : 0;
    const coinState = CoinState.create({ coinKey: coinState0.coinKey, count: count + 1 });
    return R.assoc(coinState0.coinKey, coinState, accum);
  };
  const coinStateMap = R.reduce(reduceFunction, {}, coinStates);

  return Object.values(coinStateMap);
};

const createDamageArea = (damageTargets, callback, player) => {
  const customKey = `damageArea${player.id}`;
  const element = React.createElement(DamageTargetDialog, {
    callback,
    damageTargets,
    player,
    customKey: "damage"
  });

  return ReactDOMFactories.div({ key: customKey, id: customKey }, element);
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
  const coinStates2 = mergeCoinStates(discardFaceup);
  const coinStates = R.concat(coinStates1, coinStates2);
  const customKey = "discard";
  const element = React.createElement(CoinsUI, { coinStates, customKey, resourceBase });

  return React.createElement(TitledElement, {
    key: "discard",
    element,
    title: "Discard",
    titleClass
  });
};

const createHandUI = (hand, paymentCoin, resourceBase, onClick) => {
  const customKey = "hand";
  const eventSource = "hand";
  const element = React.createElement(CoinsUI, {
    coinStates: hand,
    customKey,
    eventSource,
    highlightedCoin: paymentCoin,
    onClick,
    resourceBase
  });

  return React.createElement(TitledElement, { key: "hand", element, title: "Hand", titleClass });
};

const createInitiativeUI = (initiativeTeamKey, resourceBase) => {
  const coinStates = [CoinState.create({ coinKey: initiativeTeamKey })];
  const customKey = "initiative";
  const element = React.createElement(CoinsUI, { coinStates, customKey, resourceBase });

  return React.createElement(TitledElement, {
    key: "initiative",
    element,
    title: "Initiative",
    titleClass
  });
};

const createInputArea = (
  callback,
  coinInstances,
  labelFunction,
  moveStates,
  paymentCoinState,
  player
) => {
  const customKey = `inputArea${player.id}`;
  const paymentCoin = paymentCoinState ? Resolver.coin(paymentCoinState.coinKey) : undefined;
  let element;

  if (moveStates && moveStates.length > 0 && paymentCoin) {
    element = React.createElement(MoveOptionDialog, {
      callback,
      coinInstances,
      labelFunction,
      moveStates,
      paymentCoin,
      player,
      customKey: "move"
    });
  }

  return ReactDOMFactories.div({ key: customKey, id: customKey }, element);
};

const createMorgueUI = (morgue, resourceBase) => {
  const coinStates = mergeCoinStates(morgue);
  const customKey = "morgue";
  const element = React.createElement(CoinsUI, { coinStates, customKey, resourceBase });

  return React.createElement(TitledElement, {
    key: "morgue",
    element,
    title: "Morgue",
    titleClass
  });
};

const createSupplyUI = (supply, resourceBase) => {
  const coinStates = mergeCoinStates(supply);
  const customKey = "supply";
  const element = React.createElement(CoinsUI, { coinStates, customKey, resourceBase });

  return React.createElement(TitledElement, {
    key: "supply",
    element,
    title: "Supply",
    titleClass
  });
};

// /////////////////////////////////////////////////////////////////////////////////////////////////
class PlayerPanel extends React.Component {
  constructor(props) {
    super(props);

    this.handOnClick = this.handOnClickFunction.bind(this);
  }

  handOnClickFunction(props) {
    const { handOnClick, player } = this.props;

    if (handOnClick) {
      handOnClick(R.merge(props, { playerId: player.id }));
    }
  }

  render() {
    const {
      coinInstances,
      labelFunction,
      player,

      discardFacedown,
      discardFaceup,
      hand,
      morgue,
      supply,
      tableau,

      className,
      customKey,
      damageCallback,
      damageTargets,
      inputCallback,
      isInitiativePlayer,
      moveStates,
      paymentCoinState,
      resourceBase
    } = this.props;

    let cells = [];

    if (isInitiativePlayer) {
      const initiativeUI = createInitiativeUI(player.teamKey, resourceBase);
      cells = R.append(initiativeUI, cells);
    }

    if (!R.isEmpty(morgue)) {
      const morgueUI = createMorgueUI(morgue, resourceBase);
      cells = R.append(morgueUI, cells);
    }

    if (!R.isEmpty(discardFacedown) || !R.isEmpty(discardFaceup)) {
      const discardUI = createDiscardUI(player, discardFacedown, discardFaceup, resourceBase);
      cells = R.append(discardUI, cells);
    }

    if (!R.isEmpty(supply)) {
      const supplyUI = createSupplyUI(supply, resourceBase);
      cells = R.append(supplyUI, cells);
    }

    const tableauUI = React.createElement(TableauUI, { key: "tableau", tableau, resourceBase });
    cells = R.append(tableauUI, cells);

    if (!R.isEmpty(hand)) {
      const myHand = player.isComputer ? R.map(c => R.merge(c, { isFaceup: false }), hand) : hand;
      const handUI = createHandUI(myHand, paymentCoinState, resourceBase, this.handOnClick);
      cells = R.append(handUI, cells);
    }

    if (!R.isNil(moveStates)) {
      const inputArea = createInputArea(
        inputCallback,
        coinInstances,
        labelFunction,
        moveStates,
        paymentCoinState,
        player
      );
      cells = R.append(inputArea, cells);
    }

    if (!R.isNil(damageTargets)) {
      const damageArea = createDamageArea(damageTargets, damageCallback, player);
      cells = R.append(damageArea, cells);
    }

    const element = RU.createFlexboxWrap(cells, customKey, className);
    const title = `Player ${player.name}`;

    return React.createElement(TitledElement, {
      key: `playerPanel${player.id}`,
      element,
      title,
      className: "bg-wc-light center",
      titleClass: `b bg-wc-medium f4 tc`
    });
  }
}

PlayerPanel.propTypes = {
  coinInstances: PropTypes.shape().isRequired,
  labelFunction: PropTypes.func.isRequired,
  player: PropTypes.shape().isRequired,

  discardFaceup: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  discardFacedown: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  hand: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  morgue: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  supply: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  tableau: PropTypes.arrayOf(PropTypes.string).isRequired,

  className: PropTypes.string,
  customKey: PropTypes.string,
  damageCallback: PropTypes.func,
  damageTargets: PropTypes.arrayOf(PropTypes.shape()),
  handOnClick: PropTypes.func,
  inputCallback: PropTypes.func,
  isInitiativePlayer: PropTypes.bool,
  moveStates: PropTypes.arrayOf(PropTypes.shape()),
  paymentCoinState: PropTypes.shape(),
  resourceBase: PropTypes.string
};

PlayerPanel.defaultProps = {
  className: undefined,
  customKey: "playerPanel",
  damageCallback: undefined,
  damageTargets: undefined,
  handOnClick: undefined,
  inputCallback: undefined,
  isInitiativePlayer: false,
  moveStates: undefined,
  paymentCoinState: undefined,
  resourceBase: Endpoint.NETWORK_RESOURCE
};

export default PlayerPanel;
