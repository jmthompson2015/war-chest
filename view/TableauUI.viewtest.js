import UnitCard from "../artifact/UnitCard.js";

import TableauUI from "./TableauUI.js";
import Endpoint from "./Endpoint.js";

const cardKeys = UnitCard.keys();
const tableau = cardKeys.slice(0, 4);

const element = React.createElement(TableauUI, {
  tableau,
  resourceBase: Endpoint.LOCAL_RESOURCE
});
ReactDOM.render(element, document.getElementById("panel"));
