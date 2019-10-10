/* eslint no-console: ["error", { allow: ["log"] }] */

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
store.dispatch(ActionCreator.setUnit("e2", 2)); // swordsman
store.dispatch(ActionCreator.setUnit("d7", 22)); // archer
store.dispatch(ActionCreator.setUnit("d7", 23)); // archer
store.dispatch(ActionCreator.setCurrentPlayer(1));
store.dispatch(ActionCreator.setCurrentHandCallback(myHandOnClick));
store.dispatch(ActionCreator.setCurrentInputCallback(myInputCallback));

const connector = ReactRedux.connect(GamePanelContainer.mapStateToProps)(GamePanelContainer);
const element = React.createElement(ReactRedux.Provider, { store }, React.createElement(connector));
ReactDOM.render(element, document.getElementById("panel"));
