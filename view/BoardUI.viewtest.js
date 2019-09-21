import UnitCoin from "../artifact/UnitCoin.js";

import ActionCreator from "../state/ActionCreator.js";
import Selector from "../state/Selector.js";

import TestData from "../model/TestData.js";

import BoardUI from "./BoardUI.js";
import Endpoint from "./Endpoint.js";

const store1 = TestData.createStore();
store1.dispatch(ActionCreator.setUnit("e2", UnitCoin.SWORDSMAN));
store1.dispatch(ActionCreator.setUnit("d7", UnitCoin.ARCHER));
store1.dispatch(ActionCreator.setUnit("d7", UnitCoin.ARCHER));
const state1 = store1.getState();

const anToControl1 = Selector.anToControl(state1);
const anToTokens1 = Selector.anToTokens(state1);

const element1 = React.createElement(BoardUI, {
  anToControl: anToControl1,
  anToTokens: anToTokens1,
  myKey: "hexBoardCanvas1",
  resourceBase: Endpoint.LOCAL_RESOURCE
});

ReactDOM.render(element1, document.getElementById("panel1"));

const store2 = TestData.createStore(false);
const state2 = store2.getState();

const anToControl2 = Selector.anToControl(state2);
const anToTokens2 = Selector.anToTokens(state2);

const element2 = React.createElement(BoardUI, {
  anToControl: anToControl2,
  anToTokens: anToTokens2,
  isTwoPlayer: false,
  myKey: "hexBoardCanvas2",
  resourceBase: Endpoint.LOCAL_RESOURCE
});

ReactDOM.render(element2, document.getElementById("panel2"));
