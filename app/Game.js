/* eslint no-underscore-dangle: ["error", { "allow": ["_store"] }] */

import Team from "../artifact/Team.js";

import ActionCreator from "../state/ActionCreator.js";
import PlayerState from "../state/PlayerState.js";
import Reducer from "../state/Reducer.js";
import Selector from "../state/Selector.js";

import Setup from "../model/Setup.js";

import Round from "./Round.js";

const createPlayers = isTwoPlayer => {
  const ravenPlayer = PlayerState.create({
    id: 1,
    name: "Alfred",
    teamKey: Team.RAVEN
  });
  const wolfPlayer = PlayerState.create({
    id: 2,
    name: "Bruce",
    teamKey: Team.WOLF
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
      teamKey: Team.WOLF
    });

    answer.push([ravenPlayer2, wolfPlayer2]);
  }

  return answer;
};

const isGameOver = store => {
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

  return !R.isNil(winner) || Selector.round(store.getState()) > 0;
};

const executeGame = (resolve, store) => {
  if (isGameOver(store)) {
    resolve();
  } else {
    Round.execute(store).then(() => {
      executeGame(resolve, store);
    });
  }
};

// /////////////////////////////////////////////////////////////////////////////////////////////////
class Game {
  constructor() {
    const isTwoPlayer = true;
    this._store = Redux.createStore(Reducer.root);
    const players = createPlayers(isTwoPlayer);
    this._store.dispatch(ActionCreator.setPlayers(players));

    Setup.execute(this._store);
  }

  get state() {
    return this._store.getState();
  }

  get store() {
    return this._store;
  }

  execute() {
    return new Promise(resolve => {
      executeGame(resolve, this.store);
    });
  }
}

Object.freeze(Game);

export default Game;
