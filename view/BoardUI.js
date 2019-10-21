import Board from "../artifact/Board.js";
import ControlMarker from "../artifact/ControlMarker.js";
import Resolver from "../artifact/Resolver.js";
import UnitCoin from "../artifact/UnitCoin.js";

import Endpoint from "./Endpoint.js";

const TWO_PI = 2.0 * Math.PI;

const drawCoins = (context0, center, size, an, tokens, resourceBase, imageMap) => {
  if (tokens && tokens.length > 0) {
    const context = context0;
    const corners = Board.boardCalculator.computeCorners(center, size, Board.IS_FLAT);
    const boundingBox = ReactGameBoard.BoardCalculator.boundingBox(corners);
    const { height, width, x, y } = boundingBox;
    const diameter = 0.9 * Math.min(width, height);
    const count = tokens.length;
    const img = imageMap[`${resourceBase}${tokens[0].image}`];

    if (img) {
      ReactGameBoard.BoardCalculator.drawCircularImage(context, corners, img);
      if (count > 1) {
        context.save();
        context.fillStyle = "rgba(211, 211, 211, 0.5)";
        context.beginPath();
        context.arc(x + width / 2.0, y + height / 2.0, diameter / 4.0, 0, TWO_PI);
        context.fill();
        context.restore();

        context.save();
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "bold 24px serif";
        context.fillText(count, x + width / 2.0, y + height / 2.0);
        context.restore();
      }
    }
  }
};

const drawControl = (context, center, size, an, token, resourceBase, imageMap) => {
  const corners = Board.boardCalculator.computeCorners(center, size, Board.IS_FLAT);
  const img = imageMap[`${resourceBase}${token.image}`];

  if (img) {
    ReactGameBoard.BoardCalculator.drawRectangularImage(context, corners, img);
  }
};

const drawTokenFunction = resourceBase => (context0, center, size, an, tokens, imageMap) => {
  const context = context0;

  if (tokens) {
    if (Array.isArray(tokens) && tokens.length > 0) {
      const token0 = tokens[0];

      if (token0.image.indexOf("Control") >= 0) {
        drawControl(context, center, size, an, token0, resourceBase, imageMap);
        drawCoins(context, center, size, an, tokens.slice(1), resourceBase, imageMap);
      } else {
        drawCoins(context, center, size, an, tokens, resourceBase, imageMap);
      }
    }
  } else {
    context.save();
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "Green";
    context.font = "24px serif";
    context.fillText(an, center.x, center.y);
    context.restore();
  }
};

const cellColorFunction = an => (Board.HEX_4P.includes(an) ? "hsl(40,30%,45%)" : "hsl(40,30%,60%)");

const cellImageFunction = isTwoPlayer => an => {
  const controlPoints = isTwoPlayer ? Board.CONTROL_POINTS_2P : Board.CONTROL_POINTS_4P;

  return controlPoints.includes(an) ? "resource/control/NeutralControlMarker.png" : undefined;
};

const isCellUsedFunction = isTwoPlayer => an => {
  const unused = isTwoPlayer ? Board.UNUSED_2P : Board.UNUSED_4P;

  return !unused.includes(an);
};

// /////////////////////////////////////////////////////////////////////////////////////////////////
class BoardUI extends React.PureComponent {
  render() {
    const { anToControl, anToTokens, customKey, isTwoPlayer, resourceBase } = this.props;

    const images0 = R.map(c => `${resourceBase}${R.prop("image")(c)}`, UnitCoin.values());
    const images1 = R.map(c => `${resourceBase}${R.prop("image")(c)}`, ControlMarker.values());
    const images = [`${resourceBase}resource/control/NeutralControlMarker.png`].concat(
      images0.concat(images1)
    );

    const reduceFunction1 = (accum, an) => {
      const controlKey = anToControl[an];
      const control = Resolver.control(controlKey);
      const oldTokens = accum[controlKey] || [];
      const newTokens = R.append(control, oldTokens);
      return R.assoc(an, newTokens, accum);
    };
    const myANToTokens1 = R.reduce(reduceFunction1, {}, Object.keys(anToControl));

    const reduceFunction2 = (accum, an) => {
      const coinKeys = anToTokens[an];
      const coins = Resolver.coins(coinKeys);
      const oldTokens = accum[an] || [];
      const newTokens = R.concat(oldTokens, coins);
      return R.assoc(an, newTokens, accum);
    };
    const myANToTokens2 = R.reduce(reduceFunction2, {}, Object.keys(anToTokens));

    // Merge.
    const myANs = R.uniq(R.concat(Object.keys(myANToTokens1), Object.keys(myANToTokens2)));
    const reduceFunction3 = (accum, an) => {
      const tokens1 = myANToTokens1[an] || [];
      const tokens2 = myANToTokens2[an] || [];
      return R.assoc(an, R.concat(tokens1, tokens2), accum);
    };
    const myANToTokens = R.reduce(reduceFunction3, {}, myANs);

    return React.createElement(ReactGameBoard, {
      anToTokens: myANToTokens,
      boardCalculator: Board.boardCalculator,
      coordinateCalculator: Board.coordinateCalculator,
      drawTokenFunction: drawTokenFunction(resourceBase),

      backgroundColor: "hsl(40,30%,75%)",
      cellColorFunction,
      cellImageFunction: cellImageFunction(isTwoPlayer),
      customKey,
      gridColor: "hsl(40,30%,75%)",
      gridLineWidth: 3,
      images,
      isCellUsedFunction: isCellUsedFunction(isTwoPlayer)
    });
  }
}

BoardUI.propTypes = {
  anToControl: PropTypes.shape().isRequired,
  anToTokens: PropTypes.shape().isRequired,

  customKey: PropTypes.string,
  isTwoPlayer: PropTypes.bool,
  resourceBase: PropTypes.string
};

BoardUI.defaultProps = {
  customKey: "hexBoardCanvas",
  isTwoPlayer: true,
  resourceBase: Endpoint.NETWORK_RESOURCE
};

export default BoardUI;
