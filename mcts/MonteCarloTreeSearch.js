/* eslint no-console: ["error", { allow: ["log"] }] */

// Monte Carlo Tree Search
// see https://en.wikipedia.org/wiki/Monte_Carlo_tree_search

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
    const bestMove = determineBestMove(root);
    console.log(
      `executeStep() root = ${JSON.stringify(R.omit(["children", "parent", "state"], root))}`
    );
    console.log(
      `executeStep() bestMove = ${JSON.stringify(bestMove)} coin = ${JSON.stringify(
        R.omit(["isFaceup", "isHighlighted"], Selector.coin(bestMove, root.state))
      )}`
    );
    console.log(`stats = ${JSON.stringify(stats, null, 2)}`);
    resolve({ paymentCoinId: bestMove, mctsRoot: root });
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
    const paymentCoin = Selector.currentPaymentCoin(myState);
    const playerId = myState.currentPlayerId;
    root.children = paymentCoin
      ? Expansion.createMoveChildren(choices, playerId, myState, root)
      : Expansion.createPaymentCoinChildren(choices, playerId, myState, root);

    const stats = {
      Raven: 0,
      Wolf: 0,
      undefined: 0
    };
    executeStep(allowedTime, resolve, startTime, root, roundLimit, stats);
  });

Object.freeze(MCTS);

export default MCTS;
