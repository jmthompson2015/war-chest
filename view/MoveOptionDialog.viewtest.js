/* eslint no-console: ["error", { allow: ["log"] }] */

import ArrayUtils from "../util/ArrayUtilities.js";

import Resolver from "../artifact/Resolver.js";

import Selector from "../state/Selector.js";

import MoveFunction from "../model/MoveFunction.js";
import MoveGenerator from "../model/MoveGenerator.js";
import TestData from "../model/TestData.js";

import MoveOptionDialog from "./MoveOptionDialog.js";
import Endpoint from "./Endpoint.js";

function myCallback({ playerId, moveState }) {
  console.log(`myCallback() playerId = ${playerId} moveState = ${JSON.stringify(moveState)}`);
}

const store = TestData.createStore();
const state = store.getState();
const player1 = Selector.player(1, state);
const hand1 = Selector.coins(Selector.hand(1, state), state);
const paymentCoinState1 = ArrayUtils.randomElement(hand1);
const paymentCoin1 = Resolver.coin(paymentCoinState1.coinKey);
const labelFunction = moveState => MoveFunction.label(moveState, state);
const moveStates1 = MoveGenerator.generateForCoin(player1, paymentCoin1, state);
const element1 = React.createElement(MoveOptionDialog, {
  callback: myCallback,
  coinInstances: state.coinInstances,
  labelFunction,
  moveStates: moveStates1,
  paymentCoin: paymentCoin1,
  player: player1,

  customKey: "MoveOptionDialog1",
  resourceBase: Endpoint.LOCAL_RESOURCE
});

ReactDOM.render(element1, document.getElementById("inputArea1"));

const player2 = Selector.player(2, state);
const hand2 = Selector.coins(Selector.hand(2, state), state);
const paymentCoinState2 = ArrayUtils.randomElement(hand2);
const paymentCoin2 = Resolver.coin(paymentCoinState2.coinKey);
const moveStates2 = MoveGenerator.generateForCoin(player2, paymentCoin2, state);
const element2 = React.createElement(MoveOptionDialog, {
  callback: myCallback,
  coinInstances: state.coinInstances,
  labelFunction,
  moveStates: moveStates2,
  paymentCoin: paymentCoin2,
  player: player2,

  customKey: "MoveOptionDialog2",
  resourceBase: Endpoint.LOCAL_RESOURCE
});

ReactDOM.render(element2, document.getElementById("inputArea2"));
