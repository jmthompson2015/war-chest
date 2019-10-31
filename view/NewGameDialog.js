import Resolver from "../artifact/Resolver.js";
import Team from "../artifact/Team.js";

import PlayerState from "../state/PlayerState.js";

import Setup from "../model/Setup.js";

import NewPlayerPanel from "./NewPlayerPanel.js";

const RU = ReactComponent.ReactUtilities;

const PLAYER_COUNTS = [2, 4];
const INITIAL_PLAYER1 = PlayerState.create({
  id: 1,
  name: "Alfred",
  teamKey: Team.RAVEN,
  isComputer: false,
  strategy: "HumanPlayerStrategy"
});
const INITIAL_PLAYER2 = PlayerState.create({
  id: 2,
  name: "Bruce",
  teamKey: Team.WOLF,
  strategy: "SimplePlayerStrategy"
});
const INITIAL_PLAYER3 = PlayerState.create({
  id: 3,
  name: "Clark",
  teamKey: Team.RAVEN,
  strategy: "SimplePlayerStrategy"
});
const INITIAL_PLAYER4 = PlayerState.create({
  id: 4,
  name: "Diana",
  teamKey: Team.WOLF,
  strategy: "SimplePlayerStrategy"
});
const INITIAL_PLAYERS2 = {
  1: INITIAL_PLAYER1,
  2: INITIAL_PLAYER2
};
const INITIAL_PLAYERS4 = {
  1: INITIAL_PLAYER1,
  2: INITIAL_PLAYER2,
  3: INITIAL_PLAYER3,
  4: INITIAL_PLAYER4
};

const createButtons = onClick => {
  const okButton = ReactDOMFactories.button({ key: "okButton", onClick }, "OK");

  return ReactDOMFactories.span({}, okButton);
};

const createCountSelect = (count, onChange) => {
  const mapFunction = playerCount =>
    ReactDOMFactories.option(
      {
        key: playerCount,
        value: playerCount
      },
      playerCount
    );
  const countOptions = R.map(mapFunction, PLAYER_COUNTS);

  return ReactDOMFactories.select({ defaultValue: count, onChange }, countOptions);
};

const createNewPlayerPanel = (playerState, tableau, onChange) => {
  const panel = React.createElement(NewPlayerPanel, {
    key: `player${playerState.id}`,
    playerId: playerState.id,
    onChange,
    customKey: `player${playerState.id}`,
    tableau,
    team: Resolver.team(playerState.teamKey),
    initialName: playerState.name,
    initialStrategy: playerState.strategy
  });
  return ReactDOMFactories.div({ key: `player${playerState.id}`, className: "ma1" }, panel);
};

const createInitialInput = (
  customKey,
  count,
  players,
  playerToTableau,
  handleCountChange,
  handlePlayerChange
) => {
  const countSelect = createCountSelect(count, handleCountChange);
  const playerPanel1 = createNewPlayerPanel(players[1], playerToTableau[1], handlePlayerChange);
  const playerPanel2 = createNewPlayerPanel(players[2], playerToTableau[2], handlePlayerChange);

  const countPromptCell = RU.createCell("Player Count:", "countPromptCell");
  const countSelectCell = RU.createCell(countSelect, "countCell");
  const rows1 = [];
  rows1.push(RU.createRow([countPromptCell, countSelectCell], "countSelectRow"));
  const countTable = RU.createTable(rows1, "countTable");

  const cells = [playerPanel1, playerPanel2];

  if (count > 2) {
    const playerPanel3 = createNewPlayerPanel(players[3], playerToTableau[3], handlePlayerChange);
    const playerPanel4 = createNewPlayerPanel(players[4], playerToTableau[4], handlePlayerChange);

    cells.push(playerPanel3);
    cells.push(playerPanel4);
  }

  const playerTable = RU.createFlexboxWrap(cells, `playerTable${count}`, "f6 tl");

  const rows2 = [];
  rows2.push(RU.createRow(RU.createCell(countTable), "countTableRow"));
  rows2.push(RU.createRow(RU.createCell(playerTable), `playerTableRow${count}`));

  return RU.createTable(rows2, `initialInput${count}`, "f6 tl");
};

// /////////////////////////////////////////////////////////////////////////////////////////////////
class NewGameDialog extends React.Component {
  constructor(props) {
    super(props);

    const initialPlayers = props.initialCount === 2 ? INITIAL_PLAYERS2 : INITIAL_PLAYERS4;
    const playerToTableau = Setup.determinePlayerToTableau(
      props.initialCount,
      props.initialPlayerToTableau
    );
    this.state = { players: initialPlayers, playerToTableau };

    this.handleCountChange = this.handleCountChangeFunction.bind(this);
    this.handlePlayerChange = this.handlePlayerChangeFunction.bind(this);
    this.ok = this.okFunction.bind(this);
  }

  get count() {
    const { players } = this.state;

    return Object.keys(players).length;
  }

  handleCountChangeFunction(event) {
    const { initialPlayerToTableau } = this.props;
    const { players } = this.state;
    const newCount = parseInt(event.target.value, 10);
    const newPlayers =
      newCount === 2
        ? R.omit([3, 4], players)
        : R.assoc(3, INITIAL_PLAYER3, R.assoc(4, INITIAL_PLAYER4, players));
    const newPlayerToTableau = Setup.determinePlayerToTableau(newCount, initialPlayerToTableau);

    this.setState({ players: newPlayers, playerToTableau: newPlayerToTableau });
  }

  handlePlayerChangeFunction(playerState) {
    const { players } = this.state;
    const newPlayers = R.assoc(playerState.id, playerState, players);

    this.setState({ players: newPlayers });
  }

  okFunction() {
    const { callback } = this.props;
    const { players, playerToTableau } = this.state;

    callback(players, playerToTableau);
  }

  render() {
    const { customKey } = this.props;
    const { players, playerToTableau } = this.state;
    const message = "Configure Players";
    const initialInput = createInitialInput(
      customKey,
      this.count,
      players,
      playerToTableau,
      this.handleCountChange,
      this.handlePlayerChange
    );
    const buttons = createButtons(this.ok);

    return React.createElement(ReactComponent.OptionPane, {
      key: `${customKey}${this.count}`,
      panelClass: "bg-wc-medium center f6 ma0 tc",
      title: "New Game",
      message,
      initialInput,
      buttons,
      titleClass: "b bg-wc-dark f6 tc wc-light"
    });
  }
}

NewGameDialog.propTypes = {
  callback: PropTypes.func.isRequired,
  initialPlayerToTableau: PropTypes.shape().isRequired,

  customKey: PropTypes.string,
  initialCount: PropTypes.number
};

NewGameDialog.defaultProps = {
  customKey: "NewGameDialog",
  initialCount: 2
};

export default NewGameDialog;
