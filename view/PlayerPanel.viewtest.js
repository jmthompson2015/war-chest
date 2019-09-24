/* eslint no-console: ["error", { allow: ["log"] }] */

import Resolver from "../artifact/Resolver.js";
import UnitCoin from "../artifact/UnitCoin.js";

import ActionCreator from "../state/ActionCreator.js";
import Selector from "../state/Selector.js";

import MoveGenerator from "../model/MoveGenerator.js";
import TestData from "../model/TestData.js";

import Endpoint from "./Endpoint.js";
import PlayerPanel from "./PlayerPanel.js";

const myOnClick = event => {
  console.log(`myOnClick()`);

  const element = event.currentTarget;
  const { coinkey, count, isfaceup } = element.dataset;

  console.log(`coinkey = ${coinkey}`);
  console.log(`count = ${count}`);
  console.log(`isfaceup = ${isfaceup}`);
};

const store = TestData.createStore();
store.dispatch(ActionCreator.addToPlayerArray("playerToDiscardFacedown", 1, UnitCoin.SWORDSMAN));
store.dispatch(ActionCreator.addToPlayerArray("playerToDiscardFacedown", 1, UnitCoin.PIKEMAN));
store.dispatch(ActionCreator.addToPlayerArray("playerToDiscardFacedown", 1, UnitCoin.PIKEMAN));

store.dispatch(ActionCreator.addToPlayerArray("playerToDiscardFaceup", 1, UnitCoin.SWORDSMAN));
store.dispatch(ActionCreator.addToPlayerArray("playerToDiscardFaceup", 1, UnitCoin.PIKEMAN));
store.dispatch(ActionCreator.addToPlayerArray("playerToDiscardFaceup", 1, UnitCoin.PIKEMAN));

store.dispatch(ActionCreator.addToPlayerArray("playerToMorgue", 1, UnitCoin.CROSSBOWMAN));
store.dispatch(ActionCreator.addToPlayerArray("playerToMorgue", 1, UnitCoin.LIGHT_CAVALRY));
store.dispatch(ActionCreator.addToPlayerArray("playerToMorgue", 1, UnitCoin.LIGHT_CAVALRY));
const state = store.getState();

const player = Selector.player(1, state);
const discardFacedown = Selector.discardFacedown(1, state);
const discardFaceup = Selector.discardFaceup(1, state);
const hand = Selector.hand(1, state);
const morgue = Selector.morgue(1, state);
const supply = Selector.supply(1, state);
const tableau = Selector.tableau(1, state);

const paymentCoin = Resolver.coin(hand[1]);
const moveStates = MoveGenerator.generateForCoin(player, paymentCoin, state);

const element = React.createElement(PlayerPanel, {
  player,
  discardFacedown,
  discardFaceup,
  hand,
  morgue,
  moveStates,
  supply,
  tableau,
  onClick: myOnClick,
  resourceBase: Endpoint.LOCAL_RESOURCE
});
ReactDOM.render(element, document.getElementById("panel"));
