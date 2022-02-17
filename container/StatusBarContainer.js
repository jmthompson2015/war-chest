import Team from "../artifact/Team.js";

import Selector from "../state/Selector.js";

import Endpoint from "../view/Endpoint.js";
import StatusBarUI from "../view/StatusBarUI.js";

function mapStateToProps(state, ownProps) {
  const ravenScore = Selector.controlANs(Team.RAVEN, state).length;
  const wolfScore = Selector.controlANs(Team.WOLF, state).length;
  const phase = Selector.currentPhase(state);
  const player = Selector.currentPlayer(state);

  return {
    ravenScore,
    wolfScore,
    round: state.currentRound,
    helpBase: ownProps.helpBase || `${Endpoint.NETWORK_RESOURCE}view/`,
    phaseName: phase ? phase.name : undefined,
    playerName: player ? player.name : undefined,
    userMessage: Selector.userMessage(state),
  };
}

export default ReactRedux.connect(mapStateToProps)(StatusBarUI);
