/* eslint no-underscore-dangle: ["error", { "allow": ["_state"] }] */

import ActionCreator from "../state/ActionCreator.js";
import Reducer from "../state/Reducer.js";

import GameOver from "./GameOver.js";
import MoveFunction from "./MoveFunction.js";
import MoveGenerator from "./MoveGenerator.js";

class MCTSGame {
  constructor(state) {
    this._state = Immutable(state);
  }

  get state() {
    return this._state;
  }

  clone() {
    return new MCTSGame(this._state);
  }

  getCurrentPlayer() {
    const { currentPlayerId } = this._state;

    return this._state.playerInstances[currentPlayerId];
  }

  getPossibleMoves() {
    const player = this.getCurrentPlayer();

    return MoveGenerator.generate(player, this._state);
  }

  getWinner() {
    return GameOver.getWinner(this._state);
  }

  isGameOver() {
    return GameOver.isGameOver(this._state);
  }

  performMove(moveState) {
    const store = Redux.createStore(Reducer.root, this._state);

    if (R.isNil(moveState.coinId)) {
      MoveFunction.execute(moveState, store);
    } else {
      store.dispatch(ActionCreator.setCurrentPaymentCoin(moveState.coinId));
    }

    this._state = store.getState();
  }
}

Object.freeze(MCTSGame);

export default MCTSGame;
