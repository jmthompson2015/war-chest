/* eslint no-underscore-dangle: ["error", { "allow": ["_roundLimit", "_store"] }] */

import ActionCreator from "../state/ActionCreator.js";
import Reducer from "../state/Reducer.js";

import Setup from "../model/Setup.js";

import GameOver from "./GameOver.js";
import Round from "./Round.js";

const executeGame = (roundLimit, resolve, store) => {
  if (GameOver.isGameOver(store, roundLimit)) {
    resolve();
  } else {
    Round.execute(store).then(() => {
      executeGame(roundLimit, resolve, store);
    });
  }
};

// /////////////////////////////////////////////////////////////////////////////////////////////////
class Game {
  constructor(players, playerToTableau, roundLimit = 100) {
    this._store = Redux.createStore(Reducer.root);
    this._store.dispatch(ActionCreator.setPlayers(players));
    this._store.dispatch(ActionCreator.setPlayerToTableau(playerToTableau));
    this._roundLimit = roundLimit;

    Setup.execute(this._store);
  }

  get roundLimit() {
    return this._roundLimit;
  }

  get state() {
    return this._store.getState();
  }

  get store() {
    return this._store;
  }

  execute() {
    return new Promise(resolve => {
      executeGame(this.roundLimit, resolve, this.store);
    });
  }
}

Object.freeze(Game);

export default Game;
