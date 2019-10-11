import Team from "../artifact/Team.js";

import PlayerState from "../state/PlayerState.js";
import Selector from "../state/Selector.js";

import BoardContainer from "../container/BoardContainer.js";
import PlayerPanelContainer from "../container/PlayerPanelContainer.js";
import StatusBarContainer from "../container/StatusBarContainer.js";

import Game from "./Game.js";

const WarChestApp = {};

const createPlayers = isTwoPlayer => {
  const player1 = PlayerState.create({
    id: 1,
    name: "Alfred",
    teamKey: Team.RAVEN,
    isComputer: false,
    strategy: "HumanPlayerStrategy"
  });
  const player2 = PlayerState.create({ id: 2, name: "Bruce", teamKey: Team.WOLF });

  const answer = [player1, player2];

  if (!isTwoPlayer) {
    const player3 = PlayerState.create({ id: 3, name: "Clark", teamKey: Team.RAVEN });
    const player4 = PlayerState.create({ id: 4, name: "Diana", teamKey: Team.WOLF });

    answer.push(player3, player4);
  }

  return answer;
};

const players = createPlayers(true);
// const players = createPlayers(false);
const game = new Game(players);
const { store } = game;

// Status Bar
const container1 = React.createElement(StatusBarContainer);
const element1 = React.createElement(ReactRedux.Provider, { store }, container1);
ReactDOM.render(element1, document.getElementById("statusBarPanel"));

// Board Panel
const container2 = React.createElement(BoardContainer);
const element2 = React.createElement(ReactRedux.Provider, { store }, container2);
ReactDOM.render(element2, document.getElementById("boardPanel"));

// Player Panel A
const container3 = React.createElement(PlayerPanelContainer, { playerId: 1 });
const element3 = React.createElement(ReactRedux.Provider, { store }, container3);
ReactDOM.render(element3, document.getElementById("playerPanelA"));

if (Selector.isFourPlayer(store.getState())) {
  // Player Panel B
  const container4 = React.createElement(PlayerPanelContainer, { playerId: 2 });
  const element4 = React.createElement(ReactRedux.Provider, { store }, container4);
  ReactDOM.render(element4, document.getElementById("playerPanelB"));
}

// Player Panel C
const myPlayerId = Selector.isTwoPlayer(store.getState()) ? 2 : 3;
const container5 = React.createElement(PlayerPanelContainer, { playerId: myPlayerId });
const element5 = React.createElement(ReactRedux.Provider, { store }, container5);
ReactDOM.render(element5, document.getElementById("playerPanelC"));

if (Selector.isFourPlayer(store.getState())) {
  // Player Panel D
  const container6 = React.createElement(PlayerPanelContainer, { playerId: 4 });
  const element6 = React.createElement(ReactRedux.Provider, { store }, container6);
  ReactDOM.render(element6, document.getElementById("playerPanelD"));
}

game.execute();

Object.freeze(WarChestApp);

export default WarChestApp;
