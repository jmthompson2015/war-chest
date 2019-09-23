/* eslint no-console: ["error", { allow: ["log"] }] */

import UnitCoin from "../artifact/UnitCoin.js";

import CoinState from "../state/CoinState.js";

import CoinsUI from "./CoinsUI.js";
import Endpoint from "./Endpoint.js";

const myOnClick = event => {
  console.log(`myOnClick()`);

  const element = event.currentTarget;
  const { coinkey, count, isfaceup } = element.dataset;

  console.log(`coinkey = ${coinkey}`);
  console.log(`count = ${count}`);
  console.log(`isfaceup = ${isfaceup}`);
};

const coinStates = [
  CoinState.create({ coinKey: UnitCoin.ARCHER }),
  CoinState.create({ coinKey: UnitCoin.BERSERKER, count: 2, isFaceup: false }),
  CoinState.create({ coinKey: UnitCoin.CAVALRY, count: 3 })
];

const element = React.createElement(CoinsUI, {
  coinStates,
  onClick: myOnClick,
  resourceBase: Endpoint.LOCAL_RESOURCE
});
ReactDOM.render(element, document.getElementById("panel"));
