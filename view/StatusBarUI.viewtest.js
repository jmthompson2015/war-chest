import Phase from "../artifact/Phase.js";
import Resolver from "../artifact/Resolver.js";

import StatusBarUI from "./StatusBarUI.js";

const element = React.createElement(StatusBarUI, {
  phaseName: Resolver.phase(Phase.DRAW_THREE_COINS).name,
  playerName: "Clark",
  ravenScore: 2,
  round: 12,
  userMessage: "Somebody attacked someone.",
  wolfScore: 3
});
ReactDOM.render(element, document.getElementById("statusBarPanel"));
