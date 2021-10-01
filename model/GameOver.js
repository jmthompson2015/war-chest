/* eslint no-console: ["error", { allow: ["info"] }] */

import Resolver from "../artifact/Resolver.js";
import Team from "../artifact/Team.js";

import Selector from "../state/Selector.js";

const GameOver = {};

GameOver.getWinner = (state) => {
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

  return winnerTeamKey;
};

GameOver.isGameOver = (state, roundLimit = 100) => {
  const winnerTeamKey = GameOver.getWinner(state);

  if (!R.isNil(winnerTeamKey)) {
    const team = Resolver.team(winnerTeamKey);
    console.info(`Team ${team.name} won!`);
    return true;
  }

  const round = Selector.round(state);

  if (round >= roundLimit) {
    console.info(`Over roundLimit: ${round}`);
    return true;
  }

  return false;
};

Object.freeze(GameOver);

export default GameOver;
