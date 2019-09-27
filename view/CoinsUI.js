import Resolver from "../artifact/Resolver.js";

import CoinUI from "./CoinUI.js";
import Endpoint from "./Endpoint.js";
import ReactUtils from "./ReactUtilities.js";

class CoinsUI extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleOnClick = this.handleOnClickFunction.bind(this);
  }

  handleOnClickFunction(event) {
    const { onClick } = this.props;

    onClick(event);
  }

  render() {
    const { coinStates, customKey, eventSource, resourceBase, width } = this.props;

    const mapIndexed = R.addIndex(R.map);
    const mapFunction = (coinState, i) => {
      const { coinKey, count, isFaceup, isHighlighted } = coinState;
      const coin = Resolver.coin(coinKey);
      const customKeySuffix = `${coin.key}-${coin.name}-${count}-${isFaceup}-${i}`;
      const customKey2 = `${customKey}${customKeySuffix}`;
      const element = React.createElement(CoinUI, {
        coin,
        count,
        isFaceup,
        isHighlighted,
        customKey: customKey2,
        eventSource,
        onClick: this.handleOnClick,
        resourceBase,
        width
      });

      return ReactUtils.createCell(element, `coinCell${customKeySuffix}`, "alignTop pa1 v-top");
    };

    const coinCells = mapIndexed(mapFunction, coinStates);
    const row = ReactUtils.createRow(coinCells);

    return ReactUtils.createTable(row, "coinsUITable", "center");
  }
}

CoinsUI.propTypes = {
  coinStates: PropTypes.arrayOf(PropTypes.shape()).isRequired,

  customKey: PropTypes.string,
  eventSource: PropTypes.string,
  onClick: PropTypes.func,
  resourceBase: PropTypes.string,
  width: PropTypes.number
};

CoinsUI.defaultProps = {
  customKey: "CoinsUI",
  eventSource: "CoinsUI",
  onClick: () => {},
  resourceBase: Endpoint.NETWORK_RESOURCE,
  width: 50
};

export default CoinsUI;
