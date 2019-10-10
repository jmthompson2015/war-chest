import ActionCreator from "../state/ActionCreator.js";

import GamePanel from "../view/GamePanel.js";

function mapStateToProps(state) {
  return {
    state,
    currentHandCallback: state.currentHandCallback,
    currentInputCallback: state.currentInputCallback
  };
}

const mapDispatchToProps = dispatch => ({
  handOnClickWithCallback: (coinId, currentHandCallback) => {
    dispatch(ActionCreator.setCurrentPaymentCoin(coinId));
    currentHandCallback(coinId);
  },
  inputCallbackWithCallback: (moveState, currentInputCallback) => {
    dispatch(ActionCreator.setCurrentMove(moveState));
    currentInputCallback(moveState);
  }
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    handOnClick: ({ coinId }) => {
      dispatchProps.handOnClickWithCallback(coinId, stateProps.currentHandCallback);
    },
    inputCallback: ({ moveState }) => {
      dispatchProps.inputCallbackWithCallback(moveState, stateProps.currentInputCallback);
    }
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps, mergeProps)(GamePanel);
