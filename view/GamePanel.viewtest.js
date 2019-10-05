/* eslint no-console: ["error", { allow: ["log"] }] */

import Phase from "../artifact/Phase.js";
import UnitCoin from "../artifact/UnitCoin.js";

import ActionCreator from "../state/ActionCreator.js";

import TestData from "../model/TestData.js";

import GamePanel from "./GamePanel.js";

const store = TestData.createStore();
store.dispatch(ActionCreator.setUnit("e2", UnitCoin.SWORDSMAN));
store.dispatch(ActionCreator.setUnit("d7", UnitCoin.ARCHER));
store.dispatch(ActionCreator.setUnit("d7", UnitCoin.ARCHER));
store.dispatch(ActionCreator.setRound(3));
store.dispatch(ActionCreator.setCurrentPhase(Phase.PLAY_COINS));
store.dispatch(ActionCreator.setCurrentPlayer(2));
store.dispatch(ActionCreator.setUserMessage("Choose a coin from your hand."));
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
