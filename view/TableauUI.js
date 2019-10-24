import Resolver from "../artifact/Resolver.js";

import CardsUI from "./CardsUI.js";
import Endpoint from "./Endpoint.js";

const { CollapsiblePane } = ReactComponent;

class TableauUI extends React.PureComponent {
  render() {
    const { resourceBase, tableau } = this.props;
    const cards = Resolver.cards(tableau);
    const customKey = "tableau";
    const element = React.createElement(CardsUI, { cards, customKey, resourceBase, width: 125 });

    return React.createElement(CollapsiblePane, {
      key: "tableau",
      element,
      className: "bg-wc-medium center ma1 tc",
      header: "Tableau",
      headerClass: "b bg-wc-dark f6 tc wc-light"
    });
  }
}

TableauUI.propTypes = {
  tableau: PropTypes.arrayOf(PropTypes.string).isRequired,

  resourceBase: PropTypes.string
};

TableauUI.defaultProps = {
  resourceBase: Endpoint.NETWORK_RESOURCE
};

export default TableauUI;
