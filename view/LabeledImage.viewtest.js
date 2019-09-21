import RoyalCoin from "../artifact/RoyalCoin.js";
import UnitCoin from "../artifact/UnitCoin.js";

import Endpoint from "./Endpoint.js";
import LabeledImage from "./LabeledImage.js";
import ReactUtils from "./ReactUtilities.js";

const cells = [];
const forEachIndexed = R.addIndex(R.forEach);
const royalCoins = RoyalCoin.values();
const eachFunction = (coin, i) => {
  const element = React.createElement(LabeledImage, {
    key: coin.name,
    height: 100,
    image: coin.image,
    label: `${i + 1}`,
    labelClass: "b f1 tc black",
    resourceBase: Endpoint.LOCAL_RESOURCE,
    showOne: false,
    title: coin.name,
    width: 100
  });

  cells.push(element);
};
forEachIndexed(eachFunction, royalCoins);

const coins = UnitCoin.values();
forEachIndexed(eachFunction, coins);

ReactDOM.render(ReactUtils.createFlexboxWrap(cells), document.getElementById("panel"));
