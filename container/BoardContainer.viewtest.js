import ActionCreator from "../state/ActionCreator.js";

import TestData from "../model/TestData.js";

import Endpoint from "../view/Endpoint.js";

import BoardContainer from "./BoardContainer.js";

const store = TestData.createStore();
store.dispatch(ActionCreator.setUnit("e2", 2)); // swordsman
store.dispatch(ActionCreator.setUnit("d7", 22)); // archer
store.dispatch(ActionCreator.setUnit("d7", 23)); // archer

const container = React.createElement(BoardContainer, { resourceBase: Endpoint.LOCAL_RESOURCE });
const element = React.createElement(ReactRedux.Provider, { store }, container);
ReactDOM.render(element, document.getElementById("panel"));
