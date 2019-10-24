/* eslint no-console: ["error", { allow: ["log"] }] */

import Resolver from "../artifact/Resolver.js";
import Team from "../artifact/Team.js";
import UnitCard from "../artifact/UnitCard.js";

import NewPlayerPanel from "./NewPlayerPanel.js";

function myOnChange(playerState) {
  console.log(`myOnChange() playerState = ${JSON.stringify(playerState)}`);
}

const cardKeys = UnitCard.keys();
const tableau = cardKeys.slice(0, 4);

const element1 = React.createElement(NewPlayerPanel, {
  onChange: myOnChange,
  playerId: 1,
  tableau,
  team: Resolver.team(Team.RAVEN)
});

ReactDOM.render(element1, document.getElementById("inputArea1"));
