const Node = {};

const C = Math.sqrt(2.0); // exploration parameter

Node.create = ({
  // Required.
  state,
  // Optional.
  children = [],
  lossCount = 0,
  parent,
  playoutCount = 0,
  winCount = 0
}) => ({
  children,
  lossCount,
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
  let rating = Number.NEGATIVE_INFINITY;
  const reduceFunction = (accum, node) => {
    const myRating = evalFunction(node);

    if (myRating > rating) {
      rating = myRating;
      return node;
    }

    return accum;
  };

  return R.reduce(reduceFunction, undefined, nodes);
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

// Upper Confidence Bound applied to trees
Node.uct = node => {
  return Node.exploitation(node) + Node.exploration(node);
};

Object.freeze(Node);

export default Node;
