import ActionCreator from "./ActionCreator.js";
import Selector from "./Selector.js";

const CoinState = {};

CoinState.create = ({ id, coinKey, count = 1, isFaceup = true, isHighlighted = false, store }) => {
  const myId = R.isNil(id) && store ? Selector.nextCoinId(store.getState()) : id;

  const coin = Immutable({
    // Required.
    id: myId,
    coinKey,
    // Situational.
    count,
    isFaceup,
    isHighlighted
  });

  if (store) {
    store.dispatch(ActionCreator.addCoin(coin));
  }

  return coin;
};

Object.freeze(CoinState);

export default CoinState;
