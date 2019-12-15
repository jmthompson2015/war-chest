import Selector from "../state/Selector.js";

const Backpropagation = {};

Backpropagation.execute = (winningTeam, child) => {
  const isWinningTeamNil = R.isNil(winningTeam);
  const winningTeamKey = winningTeam ? winningTeam.key : undefined;
  let node = child;

  while (node) {
    if (isWinningTeamNil) {
      // Draw.
      node.winCount += 0.5;
    } else if (winningTeamKey === Selector.currentPlayer(node.state).teamKey) {
      // Win.
      node.winCount += 1;
    }

    node.playoutCount += 1;
    node = node.parent;
  }
};

Object.freeze(Backpropagation);

export default Backpropagation;
