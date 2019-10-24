/* eslint no-console: ["error", { allow: ["log"] }] */

import UnitCard from "../artifact/UnitCard.js";

import NewGameDialog from "./NewGameDialog.js";

function myCallback(playerInstances, playerToTableau) {
  console.log(`myCallback() playerInstances = ${JSON.stringify(playerInstances, null, 2)}`);
  console.log(`myCallback() playerToTableau = ${JSON.stringify(playerToTableau, null, 2)}`);
}

const cardKeys = UnitCard.keys();
const initialPlayerToTableau = {
  1: cardKeys.slice(0, 4),
  2: cardKeys.slice(4, 8),
  3: cardKeys.slice(8, 11),
  4: cardKeys.slice(11, 14)
};
console.log(`initialPlayerToTableau = ${JSON.stringify(initialPlayerToTableau, null, 2)}`);

const element1 = React.createElement(NewGameDialog, {
  callback: myCallback,
  initialPlayerToTableau
});

ReactDOM.render(element1, document.getElementById("inputArea1"));
