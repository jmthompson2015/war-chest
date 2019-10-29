/* eslint no-console: ["error", { allow: ["log"] }] */

import ActionCreator from "../state/ActionCreator.js";
import PlayerState from "../state/PlayerState.js";
import Selector from "../state/Selector.js";

import MoveGenerator from "../model/MoveGenerator.js";
import TestData from "../model/TestData.js";

import Endpoint from "../view/Endpoint.js";

import PlayerPanelContainer from "./PlayerPanelContainer.js";

const myDamageCallback = (playerId, damageTarget) => {
  console.log(
    `myDamageCallback() playerId = ${playerId} damageTarget = ${JSON.stringify(damageTarget)}`
  );
};

const myHandOnClick = (playerId, coinId) => {
  console.log(`myHandOnClick() playerId = ${playerId} coinId = ${coinId}`);
};

const myInputCallback = (playerId, moveState) => {
  console.log(`myInputCallback() playerId = ${playerId} moveState = ${JSON.stringify(moveState)}`);
};

const store = TestData.createStore();

const oldPlayer1 = Selector.player(1, store.getState());
const newPlayer1 = PlayerState.create({
  id: oldPlayer1.id,
  name: oldPlayer1.name,
  teamKey: oldPlayer1.teamKey,
  isComputer: false,
  strategy: "HumanPlayerStrategy"
});
const oldPlayers = store.getState().playerInstances;
const newPlayers = R.assoc(newPlayer1.id, newPlayer1, oldPlayers);
newPlayers[newPlayer1.id] = newPlayer1;
store.dispatch(ActionCreator.setPlayers(Object.values(newPlayers)));

store.dispatch(ActionCreator.setUnit("e2", 2)); // swordsman
store.dispatch(ActionCreator.setUnit("d7", 22)); // archer
store.dispatch(ActionCreator.setUnit("d7", 23)); // archer
store.dispatch(ActionCreator.setCurrentPlayer(1));
store.dispatch(ActionCreator.setCurrentHandCallback(myHandOnClick));
store.dispatch(ActionCreator.pushInputCallback(myInputCallback));
store.dispatch(ActionCreator.setCurrentDamageCallback(myDamageCallback));
const state = store.getState();

const playerId = 1;
const player = Selector.player(playerId, state);
const hand = Selector.coins(Selector.hand(player.id, state), state);
const paymentCoin = hand[1];
store.dispatch(ActionCreator.setCurrentPaymentCoin(paymentCoin.id));
const moveStates = MoveGenerator.generateForCoin(player, paymentCoin, state);
store.dispatch(ActionCreator.setCurrentMoves(moveStates));

const container = React.createElement(PlayerPanelContainer, {
  playerId,
  resourceBase: Endpoint.LOCAL_RESOURCE
});
const element = React.createElement(ReactRedux.Provider, { store }, container);
ReactDOM.render(element, document.getElementById("panel"));
