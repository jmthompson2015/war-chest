import ActionCreator from "../state/ActionCreator.js";
import Selector from "../state/Selector.js";

import PlayerPanel from "../view/PlayerPanel.js";

function mapStateToProps(state, ownProps) {
  const { playerId } = ownProps;
  const player = Selector.player(playerId, state);

  let handOnClick;
  let inputCallback;
  let moveStates;
  let paymentCoinState;

  if (Selector.isCurrentPlayer(playerId, state) && Selector.isHumanPlayer(playerId, state)) {
    handOnClick = Selector.currentHandCallback(state);
    inputCallback = Selector.peekInputCallback(state);
    moveStates = Selector.currentMoves(state);
    paymentCoinState = Selector.currentPaymentCoin(state);
  }

  return {
    coinInstances: state.coinInstances,
    customKey: `playerPanel${player.id}`,
    player,

    discardFacedown: Selector.coins(Selector.discardFacedown(player.id, state), state),
    discardFaceup: Selector.coins(Selector.discardFaceup(player.id, state), state),
    hand: Selector.coins(Selector.hand(player.id, state), state),
    morgue: Selector.coins(Selector.morgue(player.id, state), state),
    supply: Selector.coins(Selector.supply(player.id, state), state),
    tableau: Selector.tableau(player.id, state),

    handOnClick,
    inputCallback,
    isInitiativePlayer: Selector.isInitiativePlayer(player.id, state),
    moveStates,
    paymentCoinState,
    resourceBase: ownProps.resourceBase
  };
}

const mapDispatchToProps = dispatch => ({
  handOnClickWithCallback: (coinId, currentHandCallback) => {
    currentHandCallback(coinId);
  },
  inputCallbackWithCallback: (moveState, currentInputCallback) => {
    dispatch(ActionCreator.popInputCallback());
    currentInputCallback(moveState);
  }
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    handOnClick: ({ coinId }) => {
      dispatchProps.handOnClickWithCallback(coinId, stateProps.handOnClick);
    },
    inputCallback: ({ moveState }) => {
      dispatchProps.inputCallbackWithCallback(moveState, stateProps.inputCallback);
    }
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps, mergeProps)(PlayerPanel);
