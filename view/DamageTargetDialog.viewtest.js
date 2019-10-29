/* eslint no-console: ["error", { allow: ["log"] }] */

import Selector from "../state/Selector.js";

import DamageTarget from "../artifact/DamageTarget.js";

import TestData from "../model/TestData.js";

import DamageTargetDialog from "./DamageTargetDialog.js";
import Endpoint from "./Endpoint.js";

function myCallback({ playerId, damageTarget }) {
  console.log(`myCallback() playerId = ${playerId} damageTarget = ${JSON.stringify(damageTarget)}`);
}

const store = TestData.createStore();
const state = store.getState();
const player = Selector.player(1, state);
const element = React.createElement(DamageTargetDialog, {
  callback: myCallback,
  damageTargets: DamageTarget.values(),
  player,

  resourceBase: Endpoint.LOCAL_RESOURCE
});

ReactDOM.render(element, document.getElementById("inputArea"));
