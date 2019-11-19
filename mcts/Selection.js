import Node from "./Node.js";

const Selection = {};

Selection.execute = root => {
  let answer = root;

  while (answer.children.length > 0) {
    answer = Node.best(Node.uct, answer.children);
  }

  return answer;
};

Object.freeze(Selection);

export default Selection;
