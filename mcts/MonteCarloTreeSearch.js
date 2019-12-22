/* eslint no-console: ["error", { allow: ["log"] }] */

// Monte Carlo Tree Search
// see https://en.wikipedia.org/wiki/Monte_Carlo_tree_search

import CoinState from "../state/CoinState.js";
import Selector from "../state/Selector.js";

import Backpropagation from "./Backpropagation.js";
import Expansion from "./Expansion.js";
import Node from "./Node.js";
import Selection from "./Selection.js";
import Simulation from "./Simulation.js";

const MCTS = {};

const determineBestMove = root => {
  const bestChildNode = Node.best(R.prop("playoutCount"), root.children);
  let answer;

  if (bestChildNode) {
    const { state } = bestChildNode;
    const paymentCoin = Selector.currentPaymentCoin(state);
    const move = Selector.currentMove(state);

    if (move) {
      answer = move;
    } else {
      answer = paymentCoin ? paymentCoin.id : undefined;
    }
  }

  return answer;
};

const executeStep = (allowedTime, resolve, startTime, root, roundLimit, stats0) => {
  const stats = stats0;
  const time = Date.now();
  // console.log(`time diff = ${time - startTime} allowedTime = ${allowedTime}`);

  if (time - startTime > allowedTime) {
    const paymentCoinId = determineBestMove(root);
    console.log(`executeStep() root = ${Node.toString(root)}`);
    R.forEach(c => {
      console.log(`child = ${Node.toString(c)}`);
    }, root.children);
    console.log(
      `executeStep() bestMove = ${paymentCoinId} coin = ${CoinState.toString(
        Selector.coin(paymentCoinId, root.state)
      )}`
    );
    console.log(`executeStep() stats = ${JSON.stringify(stats)}`);
    resolve({ paymentCoinId, mctsRoot: root });
  } else {
    const leaf = Selection.execute(root);
    const child = Expansion.execute(leaf);
    Simulation.execute(child, roundLimit).then(winningTeam => {
      Backpropagation.execute(winningTeam, child);
      const key = winningTeam ? winningTeam.name : undefined;
      stats[key] += 1;
      executeStep(allowedTime, resolve, startTime, root, roundLimit, stats);
    });
  }
};

MCTS.execute = (choices, state, roundLimit = 100, allowedTime = 5000) =>
  new Promise(resolve => {
    const startTime = Date.now();
    const myState = { ...state, delay: 0, isVerbose: false };
    const root = Node.create({ state: myState });

    // Initialize children.
    const playerId = myState.currentPlayerId;
    root.children = Expansion.createPaymentCoinChildren(choices, playerId, myState, root);

    const stats = {
      Raven: 0,
      Wolf: 0,
      undefined: 0
    };
    executeStep(allowedTime, resolve, startTime, root, roundLimit, stats);
  });

Object.freeze(MCTS);

export default MCTS;
