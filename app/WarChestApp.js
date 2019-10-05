import Team from "../artifact/Team.js";

import PlayerState from "../state/PlayerState.js";

import GamePanelContainer from "../container/GamePanelContainer.js";

import Game from "./Game.js";

const WarChestApp = {};

const createPlayers = isTwoPlayer => {
  const ravenPlayer = PlayerState.create({
    id: 1,
    name: "Alfred",
    teamKey: Team.RAVEN
  });
  const wolfPlayer = PlayerState.create({
    id: 2,
    name: "Bruce",
    teamKey: Team.WOLF,
    isComputer: false,
    strategy: "HumanPlayerStrategy"
  });

  const answer = [ravenPlayer, wolfPlayer];

  if (!isTwoPlayer) {
    const ravenPlayer2 = PlayerState.create({
      id: 3,
      name: "Clark",
      teamKey: Team.RAVEN
    });
    const wolfPlayer2 = PlayerState.create({
      id: 4,
      name: "Diana",
      teamKey: Team.WOLF,
      isComputer: false,
      strategy: "HumanPlayerStrategy"
    });

    answer.push([ravenPlayer2, wolfPlayer2]);
  }

  return answer;
};

const isTwoPlayer = true;
const players = createPlayers(isTwoPlayer);
const game = new Game(players);
const { store } = game;

const connector = ReactRedux.connect(GamePanelContainer.mapStateToProps)(GamePanelContainer);
const element = React.createElement(ReactRedux.Provider, { store }, React.createElement(connector));
ReactDOM.render(element, document.getElementById("panel"));

game.execute();

Object.freeze(WarChestApp);

export default WarChestApp;
