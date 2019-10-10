/* eslint no-console: ["error", { allow: ["log"] }] */

import Phase from "../artifact/Phase.js";

import ActionCreator from "../state/ActionCreator.js";

import TestData from "../model/TestData.js";

import GamePanel from "./GamePanel.js";

const store = TestData.createStore();
store.dispatch(ActionCreator.setUnit("e2", 2)); // swordsman
store.dispatch(ActionCreator.setUnit("d7", 22)); // archer
store.dispatch(ActionCreator.setUnit("d7", 23)); // archer
store.dispatch(ActionCreator.setRound(3));
store.dispatch(ActionCreator.setCurrentPhase(Phase.PLAY_COINS));
store.dispatch(ActionCreator.setCurrentPlayer(2));
store.dispatch(ActionCreator.setUserMessage("Choose a coin from your hand."));
const state = store.getState();

const handOnClick = ({ id, coinKey, eventSource, playerId }) => {
  console.log(`handOnClick()`);

  console.log(`id = ${id}`);
  console.log(`coinKey = ${coinKey}`);
  console.log(`eventSource = ${eventSource}`);
  console.log(`playerId = ${playerId}`);
};

const inputCallback = ({ playerId, moveState }) => {
  console.log(`inputCallback() playerId = ${playerId} moveState = ${JSON.stringify(moveState)}`);
};

const element = React.createElement(GamePanel, { handOnClick, inputCallback, state });

ReactDOM.render(element, document.getElementById("panel"));
