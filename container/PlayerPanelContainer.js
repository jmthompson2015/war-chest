import DamageTarget from "../artifact/DamageTarget.js";

import ActionCreator from "../state/ActionCreator.js";
import Selector from "../state/Selector.js";

import MoveFunction from "../model/MoveFunction.js";

import PlayerPanel from "../view/PlayerPanel.js";

function mapStateToProps(state, ownProps) {
  const { playerId } = ownProps;
  const player = Selector.player(playerId, state);

  let damageCallback;
  let damageTargets;
  let handOnClick;
  let inputCallback;
  let moveStates;
  let paymentCoinState;

  if (Selector.isCurrentPlayer(playerId, state) && Selector.isHumanPlayer(playerId, state)) {
    damageCallback = Selector.currentDamageCallback(state);
    if (damageCallback) {
      damageTargets = DamageTarget.values();
    }
    handOnClick = Selector.currentHandCallback(state);
    inputCallback = Selector.peekInputCallback(state);
    moveStates = Selector.currentMoves(state);
    paymentCoinState = Selector.currentPaymentCoin(state);
  }

  const labelFunction = moveState => MoveFunction.label(moveState, state);

  return {
    coinInstances: state.coinInstances,
    customKey: `playerPanel${player.id}`,
    labelFunction,
    player,

    discardFacedown: Selector.coins(Selector.discardFacedown(player.id, state), state),
    discardFaceup: Selector.coins(Selector.discardFaceup(player.id, state), state),
    hand: Selector.coins(Selector.hand(player.id, state), state),
    morgue: Selector.coins(Selector.morgue(player.id, state), state),
    supply: Selector.coins(Selector.supply(player.id, state), state),
    tableau: Selector.tableau(player.id, state),

    damageCallback,
    damageTargets,
    handOnClick,
    inputCallback,
    isInitiativePlayer: Selector.isInitiativePlayer(player.id, state),
    moveStates,
    paymentCoinState,
    resourceBase: ownProps.resourceBase
  };
}

const mapDispatchToProps = dispatch => ({
  damageCallbackWithCallback: (playerId, damageTarget, currentDamageCallback) => {
    dispatch(ActionCreator.setCurrentDamageCallback());
    if (currentDamageCallback) {
      currentDamageCallback(damageTarget.key);
    }
  },
  handOnClickWithCallback: (playerId, coinId, currentHandCallback) => {
    dispatch(ActionCreator.setCurrentHandCallback());
    if (currentHandCallback) {
      currentHandCallback(coinId);
    }
  },
  inputCallbackWithCallback: (playerId, moveState, currentInputCallback) => {
    dispatch(ActionCreator.popInputCallback());
    if (currentInputCallback) {
      currentInputCallback(moveState);
    }
  }
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    damageCallback: ({ playerId, damageTarget }) => {
      dispatchProps.damageCallbackWithCallback(playerId, damageTarget, stateProps.damageCallback);
    },
    handOnClick: ({ playerId, coinId }) => {
      dispatchProps.handOnClickWithCallback(playerId, coinId, stateProps.handOnClick);
    },
    inputCallback: ({ playerId, moveState }) => {
      dispatchProps.inputCallbackWithCallback(playerId, moveState, stateProps.inputCallback);
    }
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps, mergeProps)(PlayerPanel);
