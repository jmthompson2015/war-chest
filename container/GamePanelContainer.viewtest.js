/* eslint no-console: ["error", { allow: ["log"] }] */

import UnitCoin from "../artifact/UnitCoin.js";

import ActionCreator from "../state/ActionCreator.js";

import TestData from "../model/TestData.js";

import GamePanelContainer from "./GamePanelContainer.js";

const myHandOnClick = coinId => {
  console.log(`myHandOnClick() coinId = ${coinId}`);
};

const myInputCallback = moveState => {
  console.log(`myInputCallback() moveState = ${JSON.stringify(moveState)}`);
};

const store = TestData.createStore();
store.dispatch(ActionCreator.setUnit("e2", UnitCoin.SWORDSMAN));
store.dispatch(ActionCreator.setUnit("d7", UnitCoin.ARCHER));
store.dispatch(ActionCreator.setUnit("d7", UnitCoin.ARCHER));
store.dispatch(ActionCreator.setCurrentPlayer(1));
store.dispatch(ActionCreator.setCurrentHandCallback(myHandOnClick));
store.dispatch(ActionCreator.setCurrentInputCallback(myInputCallback));

const connector = ReactRedux.connect(GamePanelContainer.mapStateToProps)(GamePanelContainer);
const element = React.createElement(ReactRedux.Provider, { store }, React.createElement(connector));
ReactDOM.render(element, document.getElementById("panel"));
