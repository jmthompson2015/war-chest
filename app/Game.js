/* eslint no-underscore-dangle: ["error", { "allow": ["_roundLimit", "_store"] }] */

import Team from "../artifact/Team.js";

import ActionCreator from "../state/ActionCreator.js";
import Reducer from "../state/Reducer.js";
import Selector from "../state/Selector.js";

import Setup from "../model/Setup.js";

import Round from "./Round.js";

const isGameOver = (roundLimit, store) => {
  const state = store.getState();
  const isTwoPlayer = Selector.isTwoPlayer(state);
  const isFourPlayer = Selector.isFourPlayer(state);
  let winner;

  const ravenControlANs = Selector.controlANs(Team.RAVEN, state);

  if (
    (isTwoPlayer && ravenControlANs.length >= 6) ||
    (isFourPlayer && ravenControlANs.length >= 8)
  ) {
    winner = Team.RAVEN;
  } else {
    const wolfControlANs = Selector.controlANs(Team.WOLF, state);

    if (
      (isTwoPlayer && wolfControlANs.length >= 6) ||
      (isFourPlayer && wolfControlANs.length >= 8)
    ) {
      winner = Team.WOLF;
    }
  }

  if (!R.isNil(winner)) {
    store.dispatch(ActionCreator.setWinner(winner));
  }

  return !R.isNil(winner) || Selector.round(store.getState()) >= roundLimit;
};

const executeGame = (roundLimit, resolve, store) => {
  if (isGameOver(roundLimit, store)) {
    resolve();
  } else {
    Round.execute(store).then(() => {
      executeGame(roundLimit, resolve, store);
    });
  }
};

// /////////////////////////////////////////////////////////////////////////////////////////////////
class Game {
  constructor(players, roundLimit = 100) {
    this._store = Redux.createStore(Reducer.root);
    this._store.dispatch(ActionCreator.setPlayers(players));
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
