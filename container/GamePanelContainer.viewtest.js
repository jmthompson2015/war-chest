import UnitCoin from "../artifact/UnitCoin.js";

import ActionCreator from "../state/ActionCreator.js";

import TestData from "../model/TestData.js";

import GamePanelContainer from "./GamePanelContainer.js";

const store = TestData.createStore();
store.dispatch(ActionCreator.setUnit("e2", UnitCoin.SWORDSMAN));
store.dispatch(ActionCreator.setUnit("d7", UnitCoin.ARCHER));
store.dispatch(ActionCreator.setUnit("d7", UnitCoin.ARCHER));

const connector = ReactRedux.connect(GamePanelContainer.mapStateToProps)(GamePanelContainer);
const element = React.createElement(ReactRedux.Provider, { store }, React.createElement(connector));
ReactDOM.render(element, document.getElementById("panel"));
