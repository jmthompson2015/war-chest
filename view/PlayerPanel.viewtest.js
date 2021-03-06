/* eslint no-console: ["error", { allow: ["log"] }] */

import DamageTarget from "../artifact/DamageTarget.js";

import ActionCreator from "../state/ActionCreator.js";
import Selector from "../state/Selector.js";

import MoveFunction from "../model/MoveFunction.js";
import MoveGenerator from "../model/MoveGenerator.js";
import TestData from "../model/TestData.js";

import Endpoint from "./Endpoint.js";
import PlayerPanel from "./PlayerPanel.js";

function damageCallback({ playerId, damageTarget }) {
  console.log(
    `damageCallback() playerId = ${playerId} damageTarget = ${JSON.stringify(damageTarget)}`
  );
}

const handOnClick = ({ coinId, coinKey, eventSource, playerId }) => {
  console.log(`handOnClick()`);

  console.log(`coinId = ${coinId}`);
  console.log(`coinKey = ${coinKey}`);
  console.log(`eventSource = ${eventSource}`);
  console.log(`playerId = ${playerId}`);
};

const inputCallback = ({ playerId, moveState }) => {
  console.log(`inputCallback() playerId = ${playerId} moveState = ${JSON.stringify(moveState)}`);
};

const store = TestData.createStore();
store.dispatch(ActionCreator.addToPlayerArray("playerToDiscardFacedown", 1, 2)); // swordsman
store.dispatch(ActionCreator.addToPlayerArray("playerToDiscardFacedown", 1, 7)); // pikeman
store.dispatch(ActionCreator.addToPlayerArray("playerToDiscardFacedown", 1, 8)); // pikeman

store.dispatch(ActionCreator.addToPlayerArray("playerToDiscardFaceup", 1, 3)); // swordsman
store.dispatch(ActionCreator.addToPlayerArray("playerToDiscardFaceup", 1, 9)); // pikeman
store.dispatch(ActionCreator.addToPlayerArray("playerToDiscardFaceup", 1, 10)); // pikeman

store.dispatch(ActionCreator.addToPlayerArray("playerToMorgue", 1, 11)); // crossbowman
store.dispatch(ActionCreator.addToPlayerArray("playerToMorgue", 1, 16)); // light cavalry
store.dispatch(ActionCreator.addToPlayerArray("playerToMorgue", 1, 17)); // light cavalry
const state = store.getState();

const player = R.merge(Selector.player(1, state), { isComputer: false });
const labelFunction = moveState => MoveFunction.label(moveState, state);
const discardFacedown = Selector.coins(Selector.discardFacedown(1, state), state);
const discardFaceup = Selector.coins(Selector.discardFaceup(1, state), state);
const hand = Selector.coins(Selector.hand(1, state), state);
const morgue = Selector.coins(Selector.morgue(1, state), state);
const supply = Selector.coins(Selector.supply(1, state), state);
const tableau = Selector.tableau(1, state);

const initiativePlayer = Selector.initiativePlayer(state);
const isInitiativePlayer = player.id === initiativePlayer.id;

const paymentCoinState = hand[1];
const moveStates = MoveGenerator.generateForCoin(player, paymentCoinState, state);

const element = React.createElement(PlayerPanel, {
  coinInstances: state.coinInstances,
  labelFunction,
  player,
  discardFacedown,
  discardFaceup,
  hand,
  morgue,
  supply,
  tableau,

  customKey: "panel1",
  damageCallback,
  damageTargets: DamageTarget.values(),
  handOnClick,
  inputCallback,
  isInitiativePlayer,
  moveStates,
  paymentCoinState,
  resourceBase: Endpoint.LOCAL_RESOURCE
});
ReactDOM.render(element, document.getElementById("panel"));
