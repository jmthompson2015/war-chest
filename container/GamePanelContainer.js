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
  handOnClickWithCallback: (coinKey, currentHandCallback) => {
    // console.log(`handOnClickWithCallback() start`);
    dispatch(ActionCreator.setCurrentPaymentCoin(coinKey));
    currentHandCallback(coinKey);
  },
  inputCallbackWithCallback: (moveState, currentInputCallback) => {
    // console.log(`inputCallbackWithCallback() start`);
    dispatch(ActionCreator.setCurrentMove(moveState));
    currentInputCallback(moveState);
  }
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    handOnClick: ({ coinKey }) => {
      // console.log(`handOnClick() start`);
      dispatchProps.handOnClickWithCallback(coinKey, stateProps.currentHandCallback);
    },
    inputCallback: ({ moveState }) => {
      // console.log(`inputCallback() start`);
      dispatchProps.inputCallbackWithCallback(moveState, stateProps.currentInputCallback);
    }
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps, mergeProps)(GamePanel);
