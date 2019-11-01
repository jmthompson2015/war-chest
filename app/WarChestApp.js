import Selector from "../state/Selector.js";

import Game from "../model/Game.js";
import Setup from "../model/Setup.js";

import Endpoint from "../view/Endpoint.js";
import NewGameDialog from "../view/NewGameDialog.js";

import BoardContainer from "../container/BoardContainer.js";
import PlayerPanelContainer from "../container/PlayerPanelContainer.js";
import StatusBarContainer from "../container/StatusBarContainer.js";

const WarChestApp = {};

const isLocal = true;
const resourceBase = isLocal ? Endpoint.LOCAL_RESOURCE : undefined;
const helpBase = isLocal ? `${Endpoint.LOCAL_RESOURCE}view/` : undefined;

const playGame = (playerInstances, playerToTableau) => {
  document.getElementById("newGamePanel").style.display = "none";

  const players = Object.values(playerInstances);
  const game = new Game(players, playerToTableau);
  const { store } = game;

  // Status Bar
  const container1 = React.createElement(StatusBarContainer, { helpBase });
  const element1 = React.createElement(ReactRedux.Provider, { store }, container1);
  ReactDOM.render(element1, document.getElementById("statusBarPanel"));

  // Board Panel
  const container2 = React.createElement(BoardContainer, { resourceBase });
  const element2 = React.createElement(ReactRedux.Provider, { store }, container2);
  ReactDOM.render(element2, document.getElementById("boardPanel"));

  // Player Panel A
  const container3 = React.createElement(PlayerPanelContainer, { playerId: 1, resourceBase });
  const element3 = React.createElement(ReactRedux.Provider, { store }, container3);
  ReactDOM.render(element3, document.getElementById("playerPanelA"));

  if (Selector.isFourPlayer(store.getState())) {
    // Player Panel B
    const container4 = React.createElement(PlayerPanelContainer, { playerId: 2, resourceBase });
    const element4 = React.createElement(ReactRedux.Provider, { store }, container4);
    ReactDOM.render(element4, document.getElementById("playerPanelB"));
  }

  // Player Panel C
  const myPlayerId = Selector.isTwoPlayer(store.getState()) ? 2 : 3;
  const container5 = React.createElement(PlayerPanelContainer, {
    playerId: myPlayerId,
    resourceBase
  });
  const element5 = React.createElement(ReactRedux.Provider, { store }, container5);
  ReactDOM.render(element5, document.getElementById("playerPanelC"));

  if (Selector.isFourPlayer(store.getState())) {
    // Player Panel D
    const container6 = React.createElement(PlayerPanelContainer, { playerId: 4, resourceBase });
    const element6 = React.createElement(ReactRedux.Provider, { store }, container6);
    ReactDOM.render(element6, document.getElementById("playerPanelD"));
  }

  game.execute();
};

const element1 = React.createElement(NewGameDialog, {
  initialPlayerToTableau: Setup.createInitialPlayerToTableau(),
  callback: playGame
});

ReactDOM.render(element1, document.getElementById("newGamePanel"));

Object.freeze(WarChestApp);

export default WarChestApp;
