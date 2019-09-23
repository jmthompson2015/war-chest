/* eslint no-console: ["error", { allow: ["log"] }] */

import RoyalCoin from "../artifact/RoyalCoin.js";
import UnitCoin from "../artifact/UnitCoin.js";

import Endpoint from "./Endpoint.js";
import LayeredCanvas from "./LayeredCanvas.js";
import ReactUtils from "./ReactUtilities.js";

const myOnClick = () => {
  console.log(`myOnClick()`);
};

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
    context.font = "bold 36px serif";
    context.fillText(count, width / 2.0, height / 2.0);
    context.restore();
  }
};

const size = 75;
const royalCoins = RoyalCoin.values();
const unitCoins = UnitCoin.values();
const coins = R.concat(royalCoins, unitCoins);
const mapIndexed = R.addIndex(R.map);
const mapFunction = (coin, i) => {
  const image = Endpoint.LOCAL_RESOURCE + coin.image;
  const count = i > 1 ? i - 1 : 1;
  const drawLayerFunctions = [drawFunction1(image), drawFunction2(count), drawFunction3(count)];
  const canvas = React.createElement(LayeredCanvas, {
    drawLayerFunctions,
    backgroundColor: "OliveDrab",
    customKey: `layeredCanvas${i}`,
    height: size,
    images: [image],
    onClick: myOnClick,
    title: coin.name,
    width: size
  });

  return ReactUtils.createCell(canvas, coin.key);
};

const cells = mapIndexed(mapFunction, coins);
const element = ReactUtils.createFlexboxWrap(cells);

ReactDOM.render(element, document.getElementById("panel1"));
