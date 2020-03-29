import ArrayUtils from "../util/ArrayUtilities.js";

import CoinState from "../state/CoinState.js";

const Node = {};

const C = Math.sqrt(2.0); // exploration parameter

Node.create = ({
  // Required.
  state,
  // Optional.
  children = [],
  parent,
  playoutCount = 0,
  winCount = 0
}) => ({
  children,
  parent,
  playoutCount,
  state,
  winCount
});

Node.accept = (node, visitor) => {
  visitor.visit(node);

  if (node.children.length > 0) {
    const forEachFunction = c => Node.accept(c, visitor);
    R.forEach(forEachFunction, node.children);
  }
};

Node.best = (evalFunction, nodes) => {
  let answer;

  if (nodes) {
    if (nodes.length === 1) {
      [answer] = nodes;
    } else {
      const ratingToNodes = R.groupBy(evalFunction, nodes);
      const ratings = Object.keys(ratingToNodes);
      ratings.sort();
      const bestRating = R.last(ratings);
      const bestNodes = ratingToNodes[bestRating];

      answer = bestNodes.length === 1 ? bestNodes[0] : ArrayUtils.randomElement(bestNodes);
    }
  }

  return answer;
};

Node.exploitation = node => {
  const wi = node.winCount;
  const ni = node.playoutCount;

  return ni !== 0 ? wi / ni : Number.POSITIVE_INFINITY;
};

Node.exploration = node => {
  const Ni = node.parent ? Math.max(node.parent.playoutCount, 1) : 1;
  const ni = node.playoutCount;

  return ni !== 0 ? C * Math.sqrt(Math.log(Ni) / ni) : Number.POSITIVE_INFINITY;
};

Node.level = node0 => {
  let node = node0;
  let answer = 1;

  while (node.parent) {
    answer += 1;
    node = node.parent;
  }

  return answer;
};

Node.toString = node => {
  const nodeString = JSON.stringify(R.pick(["playoutCount", "winCount"], node));
  const { state } = node;
  const paymentCoin = state.coinInstances[state.currentPaymentCoinId];
  const paymentCoinString = paymentCoin ? CoinState.toString(paymentCoin) : undefined;
  const moveStates = state.currentMoves;
  const moveCount = moveStates ? moveStates.length : undefined;
  const childrenLength = node.children ? node.children.length : undefined;
  const uct = Math.round(Node.uct(node) * 1000) / 1000;
  const exploit = Math.round(Node.exploitation(node) * 1000) / 1000;

  return (
    `${nodeString} paymentCoin = ${paymentCoinString} moveCount = ${moveCount}` +
    ` children.length = ${childrenLength} uct = ${uct} exploit = ${exploit}`
  );
};

// Upper Confidence Bound applied to trees
Node.uct = node => {
  return Node.exploitation(node) + Node.exploration(node);
};

Object.freeze(Node);

export default Node;
