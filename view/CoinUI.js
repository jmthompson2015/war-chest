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
  constructor(props) {
    super(props);

    this.handleOnClick = this.handleOnClickFunction.bind(this);
  }

  handleOnClickFunction() {
    const { coinState, eventSource, onClick } = this.props;

    onClick({ id: coinState.id, coinKey: coinState.coinKey, eventSource });
  }

  render() {
    const {
      coinState,
      count,
      customKey,
      isFaceup,
      isHighlighted,
      resourceBase,
      width
    } = this.props;

    const coin = Resolver.coin(coinState.coinKey);
    const imageSrc = Resolver.coinImage(coin.key, isFaceup);
    const image = `${resourceBase}${imageSrc}`;
    let drawLayerFunctions = [drawFunction1(image), drawFunction2(count), drawFunction3(count)];

    if (isHighlighted) {
      drawLayerFunctions = R.append(drawFunction4, drawLayerFunctions);
    }

    return React.createElement(LayeredCanvas, {
      drawLayerFunctions,

      height: width,
      images: [image],
      customKey,
      onClick: this.handleOnClick,
      title: coin.name,
      width
    });
  }
}

CoinUI.propTypes = {
  coinState: PropTypes.shape().isRequired,

  count: PropTypes.number,
  customKey: PropTypes.string,
  eventSource: PropTypes.string,
  isFaceup: PropTypes.bool,
  isHighlighted: PropTypes.bool,
  onClick: PropTypes.func,
  resourceBase: PropTypes.string,
  width: PropTypes.number
};

CoinUI.defaultProps = {
  count: 1,
  customKey: "CoinUI",
  eventSource: "CoinUI",
  isFaceup: true,
  isHighlighted: false,
  onClick: () => {},
  resourceBase: Endpoint.NETWORK_RESOURCE,
  width: 50
};

export default CoinUI;
