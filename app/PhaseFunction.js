import ArrayUtils from "../util/ArrayUtilities.js";

import Move from "../artifact/Move.js";
import UnitCoin from "../artifact/UnitCoin.js";

import ActionCreator from "../state/ActionCreator.js";
import Selector from "../state/Selector.js";

import MoveGenerator from "../model/MoveGenerator.js";
import MoveFunction from "../model/MoveFunction.js";

import StrategyResolver from "./StrategyResolver.js";

const PhaseFunction = {};

const advanceCurrentPlayer = store => {
  const oldPlayer = Selector.currentPlayer(store.getState());
  const oldPlayerId = oldPlayer ? oldPlayer.id : undefined;
  const playerIds = Selector.currentPlayerOrder(store.getState());
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
  const playerIds = Selector.currentPlayerOrder(store.getState());

  R.forEach(playerId => {
    drawThreeCoins(playerId, store);
  }, playerIds);

  resolve();
};

const hasCoinsInHand = state => {
  const reduceFunction = (accum, playerId) => {
    const hand = Selector.hand(playerId, state);
    return accum || hand.length > 0;
  };
  const playerIds = Selector.currentPlayerOrder(state);

  return R.reduce(reduceFunction, false, playerIds);
};

const executePlayCoin = (resolve, store, callback) => {
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

        PhaseFunction.chooseMove(moveStates, paymentCoin, resolve, store, callback);
      }
    });
  }
};

const executePlayCoins = (resolve, store) => {
  advanceCurrentPlayer(store);

  const hasCoins = hasCoinsInHand(store.getState());

  if (hasCoins) {
    executePlayCoin(resolve, store, executePlayCoins);
  } else {
    resolve();
  }
};

PhaseFunction.drawThreeCoins = {
  execute: store =>
    new Promise(resolve => {
      executeDrawThreeCoins(resolve, store);
    })
};

PhaseFunction.playCoins = {
  execute: store =>
    new Promise(resolve => {
      executePlayCoins(resolve, store);
    })
};

PhaseFunction.chooseMove = (moveStates, paymentCoin, resolve, store, callback) => {
  if (!R.isEmpty(moveStates)) {
    const currentPlayer = Selector.currentPlayer(store.getState());
    const strategy = StrategyResolver.resolve(currentPlayer.strategy);
    const delay = Selector.delay(store.getState());

    strategy
      .chooseMove(moveStates, store, delay)
      .then(moveState => {
        store.dispatch(ActionCreator.setCurrentMove(moveState));

        if (!R.isNil(moveState)) {
          MoveFunction.execute(moveState, store);
        }
      })
      .then(() => {
        const moveState = Selector.currentMove(store.getState());
        const recruitCoin = moveState.recruitCoinId
          ? Selector.coin(moveState.recruitCoinId, store.getState())
          : undefined;

        if (
          recruitCoin &&
          recruitCoin.coinKey === UnitCoin.MERCENARY &&
          moveState.moveKey === Move.RECRUIT
        ) {
          store.dispatch(ActionCreator.setCurrentPaymentCoin(recruitCoin.id));
          PhaseFunction.executeMercenaryAttribute(store).then(() => {
            callback(resolve, store);
          });
        } else if (
          paymentCoin.coinKey === UnitCoin.SWORDSMAN &&
          moveState.moveKey === Move.ATTACK
        ) {
          PhaseFunction.executeSwordsmanAttribute(store).then(() => {
            callback(resolve, store);
          });
        } else {
          callback(resolve, store);
        }
      });
  }
};

PhaseFunction.executeMercenaryAttribute = store =>
  new Promise(resolve => {
    const currentPlayer = Selector.currentPlayer(store.getState());
    const strategy = StrategyResolver.resolve(currentPlayer.strategy);
    const paymentCoin = Selector.currentPaymentCoin(store.getState());
    const delay = Selector.delay(store.getState());
    const moveStates = MoveGenerator.generateManeuvers(
      currentPlayer,
      paymentCoin,
      store.getState()
    );
    store.dispatch(ActionCreator.setCurrentMoves(moveStates));

    if (!R.isEmpty(moveStates)) {
      strategy.chooseMove(moveStates, store, delay).then(moveState => {
        if (!R.isNil(moveState)) {
          MoveFunction.execute(moveState, store);
        }
        resolve();
      });
    }
  });

PhaseFunction.executeSwordsmanAttribute = store =>
  new Promise(resolve => {
    const currentPlayer = Selector.currentPlayer(store.getState());
    const strategy = StrategyResolver.resolve(currentPlayer.strategy);
    const paymentCoin = Selector.currentPaymentCoin(store.getState());
    const delay = Selector.delay(store.getState());
    const moveStates = MoveGenerator.generateMoveAUnits(
      currentPlayer,
      paymentCoin,
      store.getState()
    );
    store.dispatch(ActionCreator.setCurrentMoves(moveStates));

    if (!R.isEmpty(moveStates)) {
      strategy.chooseMove(moveStates, store, delay).then(moveState => {
        if (!R.isNil(moveState)) {
          MoveFunction.execute(moveState, store);
        }
        resolve();
      });
    }
  });

Object.freeze(PhaseFunction);

export default PhaseFunction;
