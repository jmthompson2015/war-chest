import PlayerState from "../state/PlayerState.js";

import Endpoint from "./Endpoint.js";
import TableauUI from "./TableauUI.js";

const { ReactUtilities: RU } = ReactComponent;

const computerTypes = ["MCTSPlayerStrategy", "RandomPlayerStrategy", "SimplePlayerStrategy"];
const humanTypes = ["HumanPlayerStrategy"];
const typeToName = {
  HumanPlayerStrategy: "Human",
  MCTSPlayerStrategy: "MCTS (computer)",
  RandomPlayerStrategy: "Random (computer)",
  SimplePlayerStrategy: "Simple (computer)"
};
const playerTypes = R.concat(computerTypes, humanTypes).sort();

const createNameInput = (name, onChange) =>
  ReactDOMFactories.input({ type: "text", size: 12, value: name, onChange });

const createStrategySelect = (strategy, onChange) => {
  const mapFunction = playerType =>
    ReactDOMFactories.option({ key: playerType, value: playerType }, typeToName[playerType]);
  const strategyOptions = R.map(mapFunction, playerTypes);

  return ReactDOMFactories.select({ defaultValue: strategy, onChange }, strategyOptions);
};

// /////////////////////////////////////////////////////////////////////////////////////////////////
class NewPlayerPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = { name: props.initialName, strategy: props.initialStrategy };

    this.handleNameChange = this.handleNameChangeFunction.bind(this);
    this.handleTypeChange = this.handleTypeChangeFunction.bind(this);
  }

  handleNameChangeFunction(event) {
    const { onChange, playerId, team } = this.props;
    const { strategy } = this.state;
    const name = event.target.value;
    this.setState({ name });
    const player = PlayerState.create({
      id: playerId,
      name,
      teamKey: team.key,
      isComputer: computerTypes.includes(strategy),
      strategy
    });

    onChange(player);
  }

  handleTypeChangeFunction(event) {
    const { onChange, playerId, team } = this.props;
    const { name } = this.state;
    const strategy = event.target.value;
    this.setState({ strategy });
    const player = PlayerState.create({
      id: playerId,
      name,
      teamKey: team.key,
      isComputer: computerTypes.includes(strategy),
      strategy
    });

    onChange(player);
  }

  render() {
    const { customKey, playerId, resourceBase, tableau, team } = this.props;
    const { name, strategy } = this.state;
    const nameInput = createNameInput(name, this.handleNameChange);
    const strategySelect = createStrategySelect(strategy, this.handleTypeChange);
    const tableauUI = React.createElement(TableauUI, { tableau, resourceBase });

    const titleCell = RU.createCell(`Player ${playerId}`, "titleCell");
    const teamPromptCell = RU.createCell("Team:", "teamPromptCell");
    const teamOutputCell = RU.createCell(team.name, "teamOutputCell");
    const namePromptCell = RU.createCell("Name:", "namePromptCell");
    const nameInputCell = RU.createCell(nameInput, "nameInputCell");
    const strategyPromptCell = RU.createCell("Type:", "strategyPromptCell");
    const strategySelectCell = RU.createCell(strategySelect, "strategySelectCell");
    const tableauCell = RU.createCell(tableauUI, "tableauCell");

    const rows1 = [];
    rows1.push(RU.createRow([teamPromptCell, teamOutputCell], "teamRow"));
    rows1.push(RU.createRow([namePromptCell, nameInputCell], "nameRow"));
    rows1.push(RU.createRow([strategyPromptCell, strategySelectCell], "strategyRow"));

    const inputTable = RU.createTable(rows1, "inputTable", "f6 tl");

    const rows2 = [];
    rows2.push(RU.createRow(titleCell, "titleRow", "b center f5 ma0 tc"));
    rows2.push(RU.createRow(inputTable, "inputTableRow"));
    rows2.push(RU.createRow(tableauCell, "tableauRow"));

    return RU.createTable(rows2, `${customKey}${team.key}`, "bg-wc-light center f6 ma0 tc");
  }
}

NewPlayerPanel.propTypes = {
  onChange: PropTypes.func.isRequired,
  playerId: PropTypes.number.isRequired,
  tableau: PropTypes.arrayOf(PropTypes.string).isRequired,
  team: PropTypes.shape().isRequired,

  customKey: PropTypes.string,
  initialName: PropTypes.string,
  initialStrategy: PropTypes.string,
  resourceBase: PropTypes.string
};

NewPlayerPanel.defaultProps = {
  customKey: "NewPlayerPanel",
  initialName: "Alfred",
  initialStrategy: "SimplePlayerStrategy",
  resourceBase: Endpoint.NETWORK_RESOURCE
};

export default NewPlayerPanel;
