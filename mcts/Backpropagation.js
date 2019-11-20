import Selector from "../state/Selector.js";

const Backpropagation = {};

Backpropagation.execute = (winningTeam, child) => {
  let node = child;

  while (node) {
    const { state } = node;
    const player = Selector.currentPlayer(state);

    if (R.isNil(winningTeam)) {
      // Draw.
      node.winCount += 0.5;
    } else if (winningTeam.key === player.teamKey) {
      // Win.
      node.winCount += 1;
    }

    node.playoutCount += 1;
    node = node.parent;
  }
};

Object.freeze(Backpropagation);

export default Backpropagation;
