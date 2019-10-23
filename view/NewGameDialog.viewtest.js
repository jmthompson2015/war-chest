/* eslint no-console: ["error", { allow: ["log"] }] */

import NewGameDialog from "./NewGameDialog.js";

function myCallback(playerInstances) {
  console.log(`myCallback() playerInstances = ${JSON.stringify(playerInstances, null, 2)}`);
}

const element1 = React.createElement(NewGameDialog, {
  callback: myCallback
});

ReactDOM.render(element1, document.getElementById("inputArea1"));
