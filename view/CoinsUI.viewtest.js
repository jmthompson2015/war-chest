/* eslint no-console: ["error", { allow: ["log"] }] */

import UnitCoin from "../artifact/UnitCoin.js";

import CoinState from "../state/CoinState.js";

import CoinsUI from "./CoinsUI.js";
import Endpoint from "./Endpoint.js";

const myOnClick = ({ id, coinKey, eventSource }) => {
  console.log(`myOnClick()`);

  console.log(`id = ${id}`);
  console.log(`coinKey = ${coinKey}`);
  console.log(`eventSource = ${eventSource}`);
};

const coinStates = [
  CoinState.create({ id: 1, coinKey: UnitCoin.ARCHER }),
  CoinState.create({ id: 2, coinKey: UnitCoin.BERSERKER, count: 2, isFaceup: false }),
  CoinState.create({ id: 3, coinKey: UnitCoin.CAVALRY, count: 3, isHighlighted: true })
];
const highlightedCoin = coinStates[1];

const element = React.createElement(CoinsUI, {
  coinStates,
  highlightedCoin,
  onClick: myOnClick,
  resourceBase: Endpoint.LOCAL_RESOURCE
});
ReactDOM.render(element, document.getElementById("panel"));
