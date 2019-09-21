import UnitCoin from "../artifact/UnitCoin.js";

import ActionCreator from "../state/ActionCreator.js";

import TestData from "../model/TestData.js";

import GamePanel from "./GamePanel.js";

const store = TestData.createStore();
store.dispatch(ActionCreator.setUnit("e2", UnitCoin.SWORDSMAN));
store.dispatch(ActionCreator.setUnit("d7", UnitCoin.ARCHER));
store.dispatch(ActionCreator.setUnit("d7", UnitCoin.ARCHER));
const state = store.getState();

const element = React.createElement(GamePanel, { state });

ReactDOM.render(element, document.getElementById("panel"));
