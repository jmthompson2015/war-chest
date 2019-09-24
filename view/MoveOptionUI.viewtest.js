/* eslint no-console: ["error", { allow: ["log"] }] */

import ArrayUtils from "../util/ArrayUtilities.js";

import Move from "../artifact/Move.js";
import Resolver from "../artifact/Resolver.js";
import UnitCoin from "../artifact/UnitCoin.js";

import MoveState from "../state/MoveState.js";
import Selector from "../state/Selector.js";

import MoveGenerator from "../model/MoveGenerator.js";
import TestData from "../model/TestData.js";

import MoveOptionUI from "./MoveOptionUI.js";
import Endpoint from "./Endpoint.js";

function myOnChange(moveState) {
  console.log(`myOnChange() moveState = ${JSON.stringify(moveState)}`);
}

const moveStates1 = [
  MoveState.create({
    moveKey: Move.DEPLOY,
    playerId: 1,
    paymentCoinKey: UnitCoin.ARCHER,
    an: "e2"
  }),
  MoveState.create({ moveKey: Move.BOLSTER, playerId: 1, paymentCoinKey: UnitCoin.BERSERKER }),
  MoveState.create({ moveKey: Move.MOVE_A_UNIT, playerId: 1, paymentCoinKey: UnitCoin.CAVALRY })
];
const element1 = React.createElement(MoveOptionUI, {
  moveStates: moveStates1,
  customKey: "MoveOptionUI1",
  onChange: myOnChange,
  resourceBase: Endpoint.LOCAL_RESOURCE
});

ReactDOM.render(element1, document.getElementById("panel1"));

const store = TestData.createStore();
const state = store.getState();
const player = Selector.player(1, state);
const hand = Selector.hand(1, state);
const paymentCoinKey = ArrayUtils.randomElement(hand);
const paymentCoin = Resolver.coin(paymentCoinKey);
const moveStates2 = MoveGenerator.generateForCoin(player, paymentCoin, state);
const element2 = React.createElement(MoveOptionUI, {
  moveStates: moveStates2,
  customKey: "MoveOptionUI2",
  onChange: myOnChange,
  resourceBase: Endpoint.LOCAL_RESOURCE
});

ReactDOM.render(element2, document.getElementById("panel2"));
