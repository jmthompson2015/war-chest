import Board from "../artifact/Board.js";
import ControlMarker from "../artifact/ControlMarker.js";
import Resolver from "../artifact/Resolver.js";
import UnitCoin from "../artifact/UnitCoin.js";

import Endpoint from "./Endpoint.js";

const drawCoin = (context, center, size, an, token, resourceBase, imageMap) => {
  const corners = Board.boardCalculator.computeCorners(center, size, Board.IS_FLAT);
  const img = imageMap[`${resourceBase}${token.image}`];

  if (img) {
    ReactGameBoard.BoardCalculator.drawCircularImage(context, corners, img);
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
    if (Array.isArray(tokens)) {
      for (let i = 0; i < tokens.length; i += 1) {
        const token = tokens[i];
        if (token.image.indexOf("Control") >= 0) {
          drawControl(context, center, size, an, token, resourceBase, imageMap);
        } else {
          drawCoin(context, center, size, an, token, resourceBase, imageMap);
        }
      }
    } else if (tokens.image.indexOf("Control") >= 0) {
      drawControl(context, center, size, an, tokens, resourceBase, imageMap);
    } else {
      drawCoin(context, center, size, an, tokens, resourceBase, imageMap);
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
    const { anToControl, anToTokens, isTwoPlayer, myKey, resourceBase } = this.props;

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

    const myANToTokens = R.merge(myANToTokens1, myANToTokens2);

    return React.createElement(ReactGameBoard, {
      anToTokens: myANToTokens,
      boardCalculator: Board.boardCalculator,
      coordinateCalculator: Board.coordinateCalculator,
      drawTokenFunction: drawTokenFunction(resourceBase),

      backgroundColor: "hsl(40,30%,75%)",
      cellColorFunction,
      cellImageFunction: cellImageFunction(isTwoPlayer),
      gridColor: "hsl(40,30%,75%)",
      gridLineWidth: 3,
      images,
      isCellUsedFunction: isCellUsedFunction(isTwoPlayer),
      myKey
    });
  }
}

BoardUI.propTypes = {
  anToControl: PropTypes.shape().isRequired,
  anToTokens: PropTypes.shape().isRequired,

  isTwoPlayer: PropTypes.bool,
  myKey: PropTypes.string,
  resourceBase: PropTypes.string
};

BoardUI.defaultProps = {
  isTwoPlayer: true,
  myKey: "hexBoardCanvas",
  resourceBase: Endpoint.NETWORK_RESOURCE
};

export default BoardUI;
