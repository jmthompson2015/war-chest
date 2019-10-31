import Team from "../artifact/Team.js";

import ActionCreator from "../state/ActionCreator.js";
import Selector from "../state/Selector.js";

const GameOver = {};

GameOver.isGameOver = (store, roundLimit = 100) => {
  const state = store.getState();
  const isTwoPlayer = Selector.isTwoPlayer(state);
  const isFourPlayer = Selector.isFourPlayer(state);
  let winnerTeamKey;

  const ravenControlANs = Selector.controlANs(Team.RAVEN, state);

  if (
    (isTwoPlayer && ravenControlANs.length >= 6) ||
    (isFourPlayer && ravenControlANs.length >= 8)
  ) {
    winnerTeamKey = Team.RAVEN;
  } else {
    const wolfControlANs = Selector.controlANs(Team.WOLF, state);

    if (
      (isTwoPlayer && wolfControlANs.length >= 6) ||
      (isFourPlayer && wolfControlANs.length >= 8)
    ) {
      winnerTeamKey = Team.WOLF;
    }
  }

  if (!R.isNil(winnerTeamKey)) {
    store.dispatch(ActionCreator.setCurrentMoves([]));
    store.dispatch(ActionCreator.setWinner(winnerTeamKey));
    const team = Selector.winner(store.getState());
    store.dispatch(ActionCreator.setUserMessage(`Team ${team.name} won!`));
  }

  return !R.isNil(winnerTeamKey) || Selector.round(store.getState()) >= roundLimit;
};

Object.freeze(GameOver);

export default GameOver;
