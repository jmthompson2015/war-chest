import Resolver from "../artifact/Resolver.js";

import CoinUI from "./CoinUI.js";
import Endpoint from "./Endpoint.js";

const { ReactUtilities: RU } = ReactComponent;

const mapIndexed = R.addIndex(R.map);

class CoinsUI extends React.PureComponent {
  render() {
    const {
      coinStates,
      customKey,
      eventSource,
      highlightedCoin,
      onClick,
      resourceBase,
      width
    } = this.props;

    const mapFunction = (coinState, i) => {
      const { coinKey, count, id, isFaceup } = coinState;
      const isHighlighted = highlightedCoin && highlightedCoin.id === id;
      const coin = Resolver.coin(coinKey);
      const customKeySuffix = `${coin.key}-${coin.name}-${count}-${isFaceup}-${i}`;
      const customKey2 = `${customKey}${customKeySuffix}`;
      const element = React.createElement(CoinUI, {
        coinState,
        count,
        isFaceup,
        isHighlighted,
        customKey: customKey2,
        eventSource,
        onClick,
        resourceBase,
        width
      });

      return RU.createCell(element, `coinCell${customKeySuffix}`, "alignTop pa1 v-top");
    };

    const coinCells = mapIndexed(mapFunction, coinStates);
    const row = RU.createRow(coinCells);

    return RU.createTable(row, "coinsUITable", "bg-wc-medium center");
  }
}

CoinsUI.propTypes = {
  coinStates: PropTypes.arrayOf(PropTypes.shape()).isRequired,

  customKey: PropTypes.string,
  eventSource: PropTypes.string,
  highlightedCoin: PropTypes.shape(),
  onClick: PropTypes.func,
  resourceBase: PropTypes.string,
  width: PropTypes.number
};

CoinsUI.defaultProps = {
  customKey: "CoinsUI",
  eventSource: "CoinsUI",
  highlightedCoin: undefined,
  onClick: () => {},
  resourceBase: Endpoint.NETWORK_RESOURCE,
  width: 50
};

export default CoinsUI;
