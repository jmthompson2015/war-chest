/* eslint no-console: ["error", { allow: ["log"] }] */

import UnitCoin from "../artifact/UnitCoin.js";

import CoinState from "../state/CoinState.js";

import CoinUI from "./CoinUI.js";
import Endpoint from "./Endpoint.js";

const myOnClick = ({ id, coinKey, eventSource }) => {
  console.log(`myOnClick()`);

  console.log(`id = ${id}`);
  console.log(`coinKey = ${coinKey}`);
  console.log(`eventSource = ${eventSource}`);
};

const coinState1 = CoinState.create({ id: 1, coinKey: UnitCoin.ARCHER });
const element1 = React.createElement(CoinUI, {
  coinState: coinState1,
  customKey: "coin1",
  onClick: myOnClick,
  resourceBase: Endpoint.LOCAL_RESOURCE
});

ReactDOM.render(element1, document.getElementById("panel1"));

const coinState2 = CoinState.create({ id: 2, coinKey: UnitCoin.BERSERKER });
const element2 = React.createElement(CoinUI, {
  coinState: coinState2,
  count: 2,
  customKey: "coin2",
  isHighlighted: true,
  onClick: myOnClick,
  resourceBase: Endpoint.LOCAL_RESOURCE
});

ReactDOM.render(element2, document.getElementById("panel2"));

const coinState3 = CoinState.create({ id: 3, coinKey: UnitCoin.CAVALRY });
const element3 = React.createElement(CoinUI, {
  coinState: coinState3,
  count: 3,
  isFaceup: false,
  customKey: "coin3",
  onClick: myOnClick,
  resourceBase: Endpoint.LOCAL_RESOURCE
});

ReactDOM.render(element3, document.getElementById("panel3"));
