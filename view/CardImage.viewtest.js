import UnitCard from "../artifact/UnitCard.js";

import CardImage from "./CardImage.js";
import Endpoint from "./Endpoint.js";

const { ReactUtilities: RU } = ReactComponent;

function addCardImage(cells, card) {
  const element = React.createElement(CardImage, {
    card,
    resourceBase: Endpoint.LOCAL_RESOURCE,
    width: 200
  });

  cells.push(
    ReactDOMFactories.div(
      {
        key: `card${cells.length}`,
        className: "fl pa1 v-top"
      },
      element
    )
  );
}

const cells = [];
const cards = UnitCard.values();
R.forEach(card => {
  addCardImage(cells, card);
}, cards);

ReactDOM.render(RU.createFlexboxWrap(cells), document.getElementById("panel"));
