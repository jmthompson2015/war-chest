import Selector from "../state/Selector.js";

import Endpoint from "../view/Endpoint.js";
import StatusBarUI from "../view/StatusBarUI.js";

function mapStateToProps(state, ownProps) {
  const phase = Selector.currentPhase(state);
  const player = Selector.currentPlayer(state);

  return {
    round: state.round,
    helpBase: ownProps.helpBase || `${Endpoint.NETWORK_RESOURCE}view`,
    phaseName: phase ? phase.name : undefined,
    playerName: player ? player.name : undefined,
    userMessage: Selector.userMessage(state)
  };
}

export default ReactRedux.connect(mapStateToProps)(StatusBarUI);
