const Node = {};

Node.create = ({
  // Required.
  state,
  // Optional.
  children = [],
  lossCount = 0,
  parent,
  playoutCount = 0,
  winCount = 0
} = {}) => ({
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
  let rating;
  const reduceFunction = (accum, node) => {
    const myRating = evalFunction(node);

    if (!rating || evalFunction(node) > rating) {
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
  const c = 2; // exploration parameter
  const Ni = node.parent ? node.parent.playoutCount : 0;
  const ni = node.playoutCount;

  return Ni !== 0 && ni !== 0 ? c * Math.sqrt(Math.log(Ni) / ni) : Number.POSITIVE_INFINITY;
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
