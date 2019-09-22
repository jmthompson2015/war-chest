import Resolver from "../artifact/Resolver.js";
import UnitCoin from "../artifact/UnitCoin.js";

import CoinUI from "./CoinUI.js";
import Endpoint from "./Endpoint.js";

const coin1 = Resolver.coin(UnitCoin.ARCHER);
const element1 = React.createElement(CoinUI, {
  coin: coin1,
  resourceBase: Endpoint.LOCAL_RESOURCE
});

ReactDOM.render(element1, document.getElementById("panel1"));

const coin2 = Resolver.coin(UnitCoin.BERSERKER);
const element2 = React.createElement(CoinUI, {
  coin: coin2,
  count: 2,
  resourceBase: Endpoint.LOCAL_RESOURCE
});

ReactDOM.render(element2, document.getElementById("panel2"));

const coin3 = Resolver.coin(UnitCoin.BERSERKER);
const element3 = React.createElement(CoinUI, {
  coin: coin3,
  count: 3,
  isFaceup: false,
  resourceBase: Endpoint.LOCAL_RESOURCE
});

ReactDOM.render(element3, document.getElementById("panel3"));
