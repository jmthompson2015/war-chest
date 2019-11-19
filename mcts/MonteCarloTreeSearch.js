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
  const bestChildNode = Node.best(Node.exploitation, root.children);
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

const executeStep = (allowedTime, resolve, startTime, root) => {
  const time = Date.now();
  // console.log(`time diff = ${time - startTime} allowedTime = ${allowedTime}`);

  if (time - startTime > allowedTime) {
    const bestMove = determineBestMove(root);
    console.log(
      `executeStep() root = ${JSON.stringify(R.omit(["children", "parent", "state"], root))}`
    );
    console.log(`executeStep() bestMove = ${JSON.stringify(bestMove)}`);
    resolve(bestMove);
  } else {
    const leaf = Selection.execute(root);
    const child = Expansion.execute(leaf);
    Simulation.execute(child).then(winningTeam => {
      Backpropagation.execute(winningTeam, child);
      executeStep(allowedTime, resolve, startTime, root);
    });
  }
};

MCTS.execute = (state, allowedTime = 1000) =>
  new Promise(resolve => {
    const startTime = Date.now();
    const myState = R.merge(state, { delay: 0, isVerbose: false });
    const root = Node.create({ state: myState });
    executeStep(allowedTime, resolve, startTime, root);
  });

Object.freeze(MCTS);

export default MCTS;
