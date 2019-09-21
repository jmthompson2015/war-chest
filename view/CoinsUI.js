import Resolver from "../artifact/Resolver.js";

import Endpoint from "./Endpoint.js";
import LabeledImage from "./LabeledImage.js";
import ReactUtils from "./ReactUtilities.js";

class CoinsUI extends React.PureComponent {
  render() {
    const { coinStates, resourceBase, width } = this.props;

    const mapFunction = coinState => {
      const coin = Resolver.coin(coinState.coinKey);
      const image = Resolver.coinImage(coinState.coinKey, coinState.isFaceup);
      const element = React.createElement(LabeledImage, {
        key: coin.name,
        height: width,
        image,
        label: String(coinState.count),
        labelClass: "b f3 tc black",
        resourceBase,
        showOne: false,
        title: coin.name,
        width
      });

      return ReactUtils.createCell(element, `coinCell${coin.name}`, "alignTop pa1 v-top");
    };

    const coinCells = R.map(mapFunction, coinStates);
    const row = ReactUtils.createRow(coinCells);

    return ReactUtils.createTable(row, "coinsUITable", "bg-light-gray center");
  }
}

CoinsUI.propTypes = {
  coinStates: PropTypes.arrayOf().isRequired,

  resourceBase: PropTypes.string,
  width: PropTypes.number
};

CoinsUI.defaultProps = {
  resourceBase: Endpoint.NETWORK_RESOURCE,
  width: 50
};

export default CoinsUI;
