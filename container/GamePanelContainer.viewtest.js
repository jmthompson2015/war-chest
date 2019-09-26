import UnitCoin from "../artifact/UnitCoin.js";

import ActionCreator from "../state/ActionCreator.js";

import TestData from "../model/TestData.js";

import GamePanelContainer from "./GamePanelContainer.js";

const store = TestData.createStore();
store.dispatch(ActionCreator.setUnit("e2", UnitCoin.SWORDSMAN));
store.dispatch(ActionCreator.setUnit("d7", UnitCoin.ARCHER));
store.dispatch(ActionCreator.setUnit("d7", UnitCoin.ARCHER));

const createContainer = () => {
  const container = GamePanelContainer(store.getState());

  ReactDOM.render(container, document.getElementById("panel"));
};

createContainer();
