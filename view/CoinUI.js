import Resolver from "../artifact/Resolver.js";

import Endpoint from "./Endpoint.js";
import LabeledImage from "./LabeledImage.js";

class CoinUI extends React.PureComponent {
  render() {
    const { coin, count, isFaceup, resourceBase, width } = this.props;

    const image = Resolver.coinImage(coin.key, isFaceup);

    return React.createElement(LabeledImage, {
      key: `${coin.key}${coin.name}${count}${isFaceup}`,
      height: width,
      image,
      label: String(count),
      labelClass: "b black f3 tc",
      resourceBase,
      title: coin.name,
      width
    });
  }
}

CoinUI.propTypes = {
  coin: PropTypes.shape().isRequired,

  count: PropTypes.number,
  isFaceup: PropTypes.bool,
  resourceBase: PropTypes.string,
  width: PropTypes.number
};

CoinUI.defaultProps = {
  count: 1,
  isFaceup: true,
  resourceBase: Endpoint.NETWORK_RESOURCE,
  width: 50
};

export default CoinUI;
