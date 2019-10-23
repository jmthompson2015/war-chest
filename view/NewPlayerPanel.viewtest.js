/* eslint no-console: ["error", { allow: ["log"] }] */

import Resolver from "../artifact/Resolver.js";
import Team from "../artifact/Team.js";

import NewPlayerPanel from "./NewPlayerPanel.js";

function myCallback(playerState) {
  console.log(`myCallback() playerState = ${JSON.stringify(playerState)}`);
}

const element1 = React.createElement(NewPlayerPanel, {
  callback: myCallback,
  playerId: 1,
  team: Resolver.team(Team.RAVEN)
});

ReactDOM.render(element1, document.getElementById("inputArea1"));
