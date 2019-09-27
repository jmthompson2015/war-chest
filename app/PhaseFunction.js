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
  // console.log(
  //   `drawThreeCoins() playerId = ${playerId} hand = ${JSON.stringify(
  //     Selector.hand(playerId, store.getState())
  //   )}`
  // );
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
  // console.log(`executePlayCoins() hasCoins ? ${hasCoins}`);

  if (!hasCoins) {
    resolve();
  } else {
    const currentPlayer = Selector.currentPlayer(store.getState());
    const strategy = StrategyResolver.resolve(currentPlayer.strategy);
    // console.log(`currentPlayer.id = ${currentPlayer.id}`);
    const hand = Selector.hand(currentPlayer.id, store.getState());

    // console.log(`hand.length = ${hand.length}`);
    if (hand.length > 0) {
      const delay = Selector.delay(store.getState());
      strategy.choosePaymentCoin(hand, delay).then(paymentCoinKey => {
        // console.log(`currentPlayer ID = ${currentPlayer.id} paymentCoinKey = ${paymentCoinKey}`);
        if (!R.isNil(paymentCoinKey)) {
          store.dispatch(ActionCreator.setCurrentPaymentCoin(paymentCoinKey));
          const paymentCoin = Resolver.coin(paymentCoinKey);
          const moveStates = MoveGenerator.generateForCoin(
            currentPlayer,
            paymentCoin,
            store.getState()
          );

          if (!R.isEmpty(moveStates)) {
            strategy
              .chooseMove(moveStates, delay)
              .then(moveState => {
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
