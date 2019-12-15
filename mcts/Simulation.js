import Team from "../artifact/Team.js";

import ActionCreator from "../state/ActionCreator.js";
import PlayerState from "../state/PlayerState.js";
import Reducer from "../state/Reducer.js";
import Selector from "../state/Selector.js";

import GameOver from "../model/GameOver.js";
import MoveGenerator from "../model/MoveGenerator.js";
import PhaseFunction from "../model/PhaseFunction.js";
import Round from "../model/Round.js";
import SimplePlayerStrategy from "../model/SimplePlayerStrategy.js";

const Simulation = {};

const STRATEGY_NAME = "SimplePlayerStrategy";
const STRATEGY = SimplePlayerStrategy;

const createPlayers = isTwoPlayer => {
  const player1 = PlayerState.create({
    id: 1,
    name: "Alfred",
    teamKey: Team.RAVEN,
    strategy: STRATEGY_NAME
  });
  const player2 = PlayerState.create({
    id: 2,
    name: "Bruce",
    teamKey: Team.WOLF,
    strategy: STRATEGY_NAME
  });

  const answer = [player1, player2];

  if (!isTwoPlayer) {
    const player3 = PlayerState.create({
      id: 3,
      name: "Clark",
      teamKey: Team.RAVEN,
      strategy: STRATEGY_NAME
    });
    const player4 = PlayerState.create({
      id: 4,
      name: "Diana",
      teamKey: Team.WOLF,
      strategy: STRATEGY_NAME
    });

    answer.push(player3, player4);
  }

  return answer;
};

const finishChoose = (resolve, store, callback) => {
  const state = store.getState();
  const paymentCoin = Selector.currentPaymentCoin(state);
  const moves = Selector.currentMoves(state);

  if (paymentCoin && R.isEmpty(moves)) {
    const currentPlayer = Selector.currentPlayer(state);
    const moveStates = MoveGenerator.generateForCoin(currentPlayer, paymentCoin, state);
    store.dispatch(ActionCreator.setCurrentMoves(moveStates));
    PhaseFunction.finishChoosePaymentCoin(paymentCoin.id, resolve, store, callback);
  } else {
    const moveStates = Selector.currentMoves(state);
    const moveState = Selector.currentMove(state);
    PhaseFunction.finishChooseMove(moveState, moveStates, paymentCoin, resolve, store, callback);
  }
};

const executeRound = (roundLimit, resolve, store) => {
  if (GameOver.isGameOver(store, roundLimit)) {
    const winningTeam = Selector.winner(store.getState());
    resolve(winningTeam);
  } else {
    Round.execute(store).then(() => {
      executeRound(roundLimit, resolve, store);
    });
  }
};

Simulation.execute = (child, roundLimit = 100) =>
  new Promise(resolve => {
    const { state } = child;
    const playerId = state.currentPlayerId;
    const store = Redux.createStore(Reducer.root, state);
    const players = createPlayers(Selector.isTwoPlayer(state));
    store.dispatch(ActionCreator.setPlayers(players));
    R.forEach(player => {
      store.dispatch(ActionCreator.setPlayerStrategy(player.id, STRATEGY));
    }, players);
    store.dispatch(ActionCreator.setCurrentPlayer(playerId));
    const myResolve = () => {
      executeRound(roundLimit, resolve, store);
    };
    finishChoose(myResolve, store, PhaseFunction.executePlayCoins);
  });

Object.freeze(Simulation);

export default Simulation;
