import Selector from "../state/Selector.js";

const Backpropagation = {};

Backpropagation.execute = (winningTeam, child) => {
  let node = child;

  while (node) {
    const { state } = node;
    const player = Selector.currentPlayer(state);

    if (winningTeam && winningTeam.key === player.teamKey) {
      node.winCount += 1;
    } else if (winningTeam && winningTeam.key !== player.teamKey) {
      node.lossCount += 1;
    } else {
      node.winCount += 0.5;
      node.lossCount += 0.5;
    }

    node.playoutCount += 1;
    node = node.parent;
  }
};

Object.freeze(Backpropagation);

export default Backpropagation;
