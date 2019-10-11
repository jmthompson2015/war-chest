import Phase from "../artifact/Phase.js";

import ActionCreator from "../state/ActionCreator.js";

import TestData from "../model/TestData.js";

import StatusBarContainer from "./StatusBarContainer.js";

const store = TestData.createStore();
store.dispatch(ActionCreator.setUnit("e2", 2)); // swordsman
store.dispatch(ActionCreator.setUnit("d7", 22)); // archer
store.dispatch(ActionCreator.setUnit("d7", 23)); // archer
store.dispatch(ActionCreator.setRound(12));
store.dispatch(ActionCreator.setCurrentPlayer(2));
store.dispatch(ActionCreator.setCurrentPhase(Phase.DRAW_THREE_COINS));
store.dispatch(ActionCreator.setUserMessage("Somebody attacked someone."));

const container = React.createElement(StatusBarContainer, { helpBase: "../view/" });
const element = React.createElement(ReactRedux.Provider, { store }, container);
ReactDOM.render(element, document.getElementById("panel"));
