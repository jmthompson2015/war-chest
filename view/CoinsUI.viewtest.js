import UnitCoin from "../artifact/UnitCoin.js";

import CoinState from "../state/CoinState.js";

import CoinsUI from "./CoinsUI.js";
import Endpoint from "./Endpoint.js";

const coinStates = [
  CoinState.create({ coinKey: UnitCoin.ARCHER }),
  CoinState.create({ coinKey: UnitCoin.BERSERKER, count: 2, isFaceup: false }),
  CoinState.create({ coinKey: UnitCoin.CAVALRY, count: 3 })
];

const element = React.createElement(CoinsUI, {
  coinStates,
  resourceBase: Endpoint.LOCAL_RESOURCE
});
ReactDOM.render(element, document.getElementById("panel"));
