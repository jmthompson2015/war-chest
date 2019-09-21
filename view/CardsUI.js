import CardImage from "./CardImage.js";
import Endpoint from "./Endpoint.js";
import ReactUtils from "./ReactUtilities.js";

class CardsUI extends React.PureComponent {
  render() {
    const { cards, resourceBase, width } = this.props;

    const mapFunction = card => {
      const element = React.createElement(CardImage, { card, resourceBase, width });

      return ReactUtils.createCell(element, `cardCell${card.name}`, "alignTop v-top");
    };

    const cardCells = R.map(mapFunction, cards);
    const row = ReactUtils.createRow(cardCells);

    return ReactUtils.createTable(row, "cardsUITable", "center");
  }
}

CardsUI.propTypes = {
  cards: PropTypes.arrayOf().isRequired,

  resourceBase: PropTypes.string,
  width: PropTypes.number
};

CardsUI.defaultProps = {
  resourceBase: Endpoint.NETWORK_RESOURCE,
  width: 200
};

export default CardsUI;
