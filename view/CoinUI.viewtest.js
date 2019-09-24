/* eslint no-console: ["error", { allow: ["log"] }] */

import Resolver from "../artifact/Resolver.js";
import UnitCoin from "../artifact/UnitCoin.js";

import CoinUI from "./CoinUI.js";
import Endpoint from "./Endpoint.js";

const myOnClick = event => {
  console.log(`myOnClick()`);

  const element = event.currentTarget;
  const { coinkey, count, isfaceup } = element.dataset;

  console.log(`coinkey = ${coinkey}`);
  console.log(`count = ${count}`);
  console.log(`isfaceup = ${isfaceup}`);
};

const coin1 = Resolver.coin(UnitCoin.ARCHER);
const element1 = React.createElement(CoinUI, {
  coin: coin1,
  customKey: "coin1",
  onClick: myOnClick,
  resourceBase: Endpoint.LOCAL_RESOURCE
});

ReactDOM.render(element1, document.getElementById("panel1"));

const coin2 = Resolver.coin(UnitCoin.BERSERKER);
const element2 = React.createElement(CoinUI, {
  coin: coin2,
  count: 2,
  customKey: "coin2",
  isHighlighted: true,
  onClick: myOnClick,
  resourceBase: Endpoint.LOCAL_RESOURCE
});

ReactDOM.render(element2, document.getElementById("panel2"));

const coin3 = Resolver.coin(UnitCoin.CAVALRY);
const element3 = React.createElement(CoinUI, {
  coin: coin3,
  count: 3,
  isFaceup: false,
  customKey: "coin3",
  onClick: myOnClick,
  resourceBase: Endpoint.LOCAL_RESOURCE
});

ReactDOM.render(element3, document.getElementById("panel3"));
