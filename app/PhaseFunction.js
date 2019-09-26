import ArrayUtils from "../util/ArrayUtilities.js";

import Resolver from "../artifact/Resolver.js";

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
};

const drawThreeCoins = (playerId, store) => {
  for (let i = 0; i < 3; i += 1) {
    const bag = Selector.bag(playerId, store.getState());
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

const hasCoinsInHand = store => {
  const reduceFunction = (accum, player) => {
    const hand = Selector.hand(player.id, store.getState());
    return accum || hand.length > 0;
  };
  const players = Selector.playersInOrder(store.getState());

  return R.reduce(reduceFunction, false, players);
};

const executePlayCoins = (resolve, store) => {
  advanceCurrentPlayer(store);

  const hasCoins = hasCoinsInHand(store);
  const currentPlayer = Selector.currentPlayer(store.getState());

  if (!hasCoins) {
    resolve();
  } else {
    const strategy = StrategyResolver.resolve(currentPlayer.strategy);
    const hand = Selector.hand(currentPlayer.id, store.getState());

    if (hand.length > 0) {
      strategy.choosePaymentCoin(hand).then(paymentCoinKey => {
        if (!R.isNil(paymentCoinKey)) {
          const paymentCoin = Resolver.coin(paymentCoinKey);
          store.dispatch(ActionCreator.setCurrentPaymentCoin(paymentCoinKey));
          const moveStates = MoveGenerator.generateForCoin(
            currentPlayer,
            paymentCoin,
            store.getState()
          );

          strategy
            .chooseMove(moveStates)
            .then(moveState => {
              if (!R.isNil(moveState)) {
                MoveFunction.execute(moveState, store);
              } else {
                executePlayCoins(resolve, store);
              }
            })
            .then(executePlayCoins(resolve, store));
        } else {
          executePlayCoins(resolve, store);
        }
      });
    } else {
      executePlayCoins(resolve, store);
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
