import Resolver from "../artifact/Resolver.js";

import Endpoint from "./Endpoint.js";
import LayeredCanvas from "./LayeredCanvas.js";

const drawFunction1 = imageSrc => (context, width, height, imageMap) => {
  const image = imageMap[imageSrc];

  if (!R.isNil(image)) {
    context.drawImage(image, 0, 0, width, height);
  }
};
const drawFunction2 = count => (context0, width, height) => {
  if (count > 1) {
    const context = context0;
    context.save();
    context.beginPath();
    context.fillStyle = "rgba(211, 211, 211, 0.5)";
    context.arc(width / 2.0, height / 2.0, width / 4.0, 0, 2.0 * Math.PI);
    context.fill();
    context.restore();
  }
};
const drawFunction3 = count => (context0, width, height) => {
  if (count > 1) {
    const context = context0;
    context.save();
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "bold 24px serif";
    context.fillText(count, width / 2.0, height / 2.0);
    context.restore();
  }
};

class CoinUI extends React.PureComponent {
  render() {
    const {
      coin,
      count,
      eventSource,
      isFaceup,
      customKey,
      onClick,
      resourceBase,
      width
    } = this.props;

    const imageSrc = Resolver.coinImage(coin.key, isFaceup);
    const image = `${resourceBase}${imageSrc}`;
    const drawLayerFunctions = [drawFunction1(image), drawFunction2(count), drawFunction3(count)];
    const clientProps = {
      "data-source": eventSource,
      "data-coin-key": coin.key,
      "data-count": count,
      "data-is-faceup": isFaceup
    };

    return React.createElement(LayeredCanvas, {
      clientProps,
      drawLayerFunctions,
      height: width,
      images: [image],
      customKey,
      onClick,
      title: coin.name,
      width
    });
  }
}

CoinUI.propTypes = {
  coin: PropTypes.shape().isRequired,

  count: PropTypes.number,
  eventSource: PropTypes.string,
  isFaceup: PropTypes.bool,
  customKey: PropTypes.string,
  onClick: PropTypes.func,
  resourceBase: PropTypes.string,
  width: PropTypes.number
};

CoinUI.defaultProps = {
  count: 1,
  eventSource: "CoinUI",
  isFaceup: true,
  customKey: undefined,
  onClick: () => {},
  resourceBase: Endpoint.NETWORK_RESOURCE,
  width: 50
};

export default CoinUI;
