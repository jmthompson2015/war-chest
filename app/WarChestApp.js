import GamePanelContainer from "../container/GamePanelContainer.js";

import Game from "./Game.js";

const WarChestApp = {};

const game = new Game();
const { store } = game;

const connector = ReactRedux.connect(GamePanelContainer.mapStateToProps)(GamePanelContainer);
const element = React.createElement(ReactRedux.Provider, { store }, React.createElement(connector));
ReactDOM.render(element, document.getElementById("panel"));

game.execute();

Object.freeze(WarChestApp);

export default WarChestApp;
