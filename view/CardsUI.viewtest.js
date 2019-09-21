import Resolver from "../artifact/Resolver.js";
import UnitCard from "../artifact/UnitCard.js";

import CardsUI from "./CardsUI.js";
import Endpoint from "./Endpoint.js";

const cards = [
  Resolver.card(UnitCard.ARCHER),
  Resolver.card(UnitCard.BERSERKER),
  Resolver.card(UnitCard.CAVALRY)
];

const element = React.createElement(CardsUI, {
  cards,
  resourceBase: Endpoint.LOCAL_RESOURCE,
  width: 150
});
ReactDOM.render(element, document.getElementById("panel"));
