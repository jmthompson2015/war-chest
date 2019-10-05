import Phase from "../artifact/Phase.js";
import Resolver from "../artifact/Resolver.js";

import StatusBarUI from "./StatusBarUI.js";

const element = React.createElement(StatusBarUI, {
  phaseName: Resolver.phase(Phase.DRAW_THREE_COINS).name,
  playerName: "Clark",
  round: 12,
  userMessage: "Somebody attacked someone."
});
ReactDOM.render(element, document.getElementById("statusBarPanel"));
