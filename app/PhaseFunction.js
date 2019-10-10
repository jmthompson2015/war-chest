import ArrayUtils from "../util/ArrayUtilities.js";

import ActionCreator from "../state/ActionCreator.js";
import Selector from "../state/Selector.js";

import MoveGenerator from "../model/MoveGenerator.js";
import MoveFunction from "../model/MoveFunction.js";

import StrategyResolver from "./StrategyResolver.js";

const advanceCurrentPlayer = store => {
  const oldPlayer = Selector.currentPlayer(store.getState());
  const oldPlayerId = oldPlayer ? oldPlayer.id : undefined;
  const players = Selector.playersInOrder(store.getState());
  const playerIds = R.map(R.prop("id"), players);
  let newPlayerId;

  if (R.isNil(oldPlayerId)) {
    [newPlayerId] = playerIds; // first element
  } else {
    const index = playerIds.indexOf(oldPlayerId);

    if (index === playerIds.length - 1) {
      [newPlayerId] = playerIds; // first element
    } else {
      newPlayerId = playerIds[index + 1];
    }
  }

  store.dispatch(ActionCreator.setCurrentPlayer(newPlayerId));
  store.dispatch(ActionCreator.setCurrentPaymentCoin(null));
  store.dispatch(ActionCreator.setCurrentHandCallback(null));
  store.dispatch(ActionCreator.setCurrentMoves([]));
  store.dispatch(ActionCreator.setCurrentMove(null));
  store.dispatch(ActionCreator.setCurrentInputCallback(null));
  store.dispatch(ActionCreator.setUserMessage(null));
};

const drawThreeCoins = (playerId, store) => {
  for (let i = 0; i < 3; i += 1) {
    let bag = Selector.bag(playerId, store.getState());

    if (R.isEmpty(bag)) {
      store.dispatch(ActionCreator.refillBag(playerId));
      bag = Selector.bag(playerId, store.getState());
    }

    const coinKey = ArrayUtils.randomElement(bag);
    store.dispatch(
      ActionCreator.transferBetweenPlayerArrays("playerToBag", "playerToHand", playerId, coinKey)
    );
  }
};

const executeDrawThreeCoins = (resolve, store) => {
  const players = Selector.playersInOrder(store.getState());

  R.forEach(p => {
    drawThreeCoins(p.id, store);
  }, players);

  resolve();
};

const hasCoinsInHand = state => {
  const reduceFunction = (accum, player) => {
    const hand = Selector.hand(player.id, state);
    return accum || hand.length > 0;
  };
  const players = Selector.playersInOrder(state);

  return R.reduce(reduceFunction, false, players);
};

const executePlayCoins = (resolve, store) => {
  advanceCurrentPlayer(store);

  const hasCoins = hasCoinsInHand(store.getState());

  if (!hasCoins) {
    resolve();
  } else {
    const currentPlayer = Selector.currentPlayer(store.getState());
    const strategy = StrategyResolver.resolve(currentPlayer.strategy);
    const hand = Selector.hand(currentPlayer.id, store.getState());

    if (hand.length > 0) {
      const delay = Selector.delay(store.getState());
      strategy.choosePaymentCoin(hand, store, delay).then(paymentCoinId => {
        if (!R.isNil(paymentCoinId)) {
          store.dispatch(ActionCreator.setCurrentPaymentCoin(paymentCoinId));
          const paymentCoin = Selector.coin(paymentCoinId, store.getState());
          const moveStates = MoveGenerator.generateForCoin(
            currentPlayer,
            paymentCoin,
            store.getState()
          );
          store.dispatch(ActionCreator.setCurrentMoves(moveStates));

          if (!R.isEmpty(moveStates)) {
            strategy
              .chooseMove(moveStates, store, delay)
              .then(moveState => {
                store.dispatch(ActionCreator.setCurrentMove(moveState));
                if (!R.isNil(moveState)) {
                  MoveFunction.execute(moveState, store);
                }
              })
              .then(() => {
                executePlayCoins(resolve, store);
              });
          }
        }
      });
    }
  }
};

const PhaseFunction = {
  drawThreeCoins: {
    execute: store =>
      new Promise(resolve => {
        executeDrawThreeCoins(resolve, store);
      }),
    key: "drawThreeCoins"
  },
  playCoins: {
    execute: store =>
      new Promise(resolve => {
        executePlayCoins(resolve, store);
      }),
    key: "playCoins"
  }
};

Object.freeze(PhaseFunction);

export default PhaseFunction;
