import Selector from "../state/Selector.js";

import BoardUI from "../view/BoardUI.js";

function mapStateToProps(state, ownProps) {
  const anToTokens = Selector.anToTokens(state);
  const reduceFunction = (accum, an) => {
    const coinIds = anToTokens[an];
    const coinStates = Selector.coins(coinIds, state);
    const coinKeys = R.map(c => c.coinKey, coinStates);

    return R.assoc(an, coinKeys, accum);
  };
  const myANToTokens = R.reduce(reduceFunction, {}, Object.keys(anToTokens));

  return {
    anToControl: Selector.anToControl(state),
    anToTokens: myANToTokens,
    customKey: "warChestCanvas",
    isTwoPlayer: Selector.isTwoPlayer(state),
    resourceBase: ownProps.resourceBase
  };
}

export default ReactRedux.connect(mapStateToProps)(BoardUI);
