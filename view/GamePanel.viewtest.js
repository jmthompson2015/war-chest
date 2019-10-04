/* eslint no-console: ["error", { allow: ["log"] }] */

import UnitCoin from "../artifact/UnitCoin.js";

import ActionCreator from "../state/ActionCreator.js";

import TestData from "../model/TestData.js";

import GamePanel from "./GamePanel.js";

const store = TestData.createStore();
store.dispatch(ActionCreator.setUnit("e2", UnitCoin.SWORDSMAN));
store.dispatch(ActionCreator.setUnit("d7", UnitCoin.ARCHER));
store.dispatch(ActionCreator.setUnit("d7", UnitCoin.ARCHER));
store.dispatch(ActionCreator.setCurrentPlayer(2));
const state = store.getState();

const handOnClick = ({ coinKey, count, eventSource, isFaceup, isHighlighted, playerId }) => {
  console.log(`handOnClick()`);

  console.log(`coinKey = ${coinKey}`);
  console.log(`count = ${count}`);
  console.log(`eventSource = ${eventSource}`);
  console.log(`isFaceup ? ${isFaceup}`);
  console.log(`isHighlighted ? ${isHighlighted}`);
  console.log(`playerId = ${playerId}`);
};

const inputCallback = ({ playerId, moveState }) => {
  console.log(`inputCallback() playerId = ${playerId} moveState = ${JSON.stringify(moveState)}`);
};

const element = React.createElement(GamePanel, { handOnClick, inputCallback, state });

ReactDOM.render(element, document.getElementById("panel"));
