import Resolver from "../artifact/Resolver.js";

import Endpoint from "./Endpoint.js";

const { LayeredCanvas } = ReactComponent;

const TWO_PI = 2.0 * Math.PI;

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
    context.fillStyle = "rgba(211, 211, 211, 0.5)";
    context.beginPath();
    context.arc(width / 2.0, height / 2.0, width / 4.0, 0, TWO_PI);
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
const drawFunction4 = (context0, width, height) => {
  const lineWidth = 5;
  const radius = (width - lineWidth) / 2.0;
  const context = context0;
  context.save();
  context.strokeStyle = "blue";
  context.lineWidth = lineWidth;
  context.beginPath();
  context.arc(width / 2.0, height / 2.0, radius, 0, TWO_PI);
  context.stroke();
  context.restore();
};

class CoinUI extends React.PureComponent {
  render() {
    const {
      coin,
      count,
      eventSource,
      isFaceup,
      isHighlighted,
      customKey,
      onClick,
      resourceBase,
      width
    } = this.props;

    const imageSrc = Resolver.coinImage(coin.key, isFaceup);
    const image = `${resourceBase}${imageSrc}`;
    let drawLayerFunctions = [drawFunction1(image), drawFunction2(count), drawFunction3(count)];

    if (isHighlighted) {
      drawLayerFunctions = R.append(drawFunction4, drawLayerFunctions);
    }

    const clientProps = {
      "data-source": eventSource,
      "data-coin-key": coin.key,
      "data-count": count,
      "data-is-faceup": isFaceup
    };

    return React.createElement(LayeredCanvas, {
      drawLayerFunctions,

      clientProps,
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
  isHighlighted: PropTypes.bool,
  customKey: PropTypes.string,
  onClick: PropTypes.func,
  resourceBase: PropTypes.string,
  width: PropTypes.number
};

CoinUI.defaultProps = {
  count: 1,
  eventSource: "CoinUI",
  isFaceup: true,
  isHighlighted: false,
  customKey: undefined,
  onClick: () => {},
  resourceBase: Endpoint.NETWORK_RESOURCE,
  width: 50
};

export default CoinUI;
