import ArrayUtils from "../util/ArrayUtilities.js";

import Move from "../artifact/Move.js";
import UnitCoin from "../artifact/UnitCoin.js";

import ActionCreator from "../state/ActionCreator.js";
import Selector from "../state/Selector.js";

import GameOver from "./GameOver.js";
import MoveGenerator from "./MoveGenerator.js";
import MoveFunction from "./MoveFunction.js";

const PhaseFunction = {};

const advanceCurrentPlayer = (store) => {
  const oldPlayer = Selector.currentPlayer(store.getState());
  const oldPlayerId = oldPlayer ? oldPlayer.id : undefined;
  const playerIds = Selector.currentPlayerOrder(store.getState());
  let newPlayerId;

  if (R.isNil(oldPlayerId)) {
    newPlayerId = Selector.initiativePlayer(store.getState()).id;
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

const drawCoin = (playerId, store) => {
  let bag = Selector.bag(playerId, store.getState());

  if (R.isEmpty(bag)) {
    store.dispatch(ActionCreator.refillBag(playerId));
    bag = Selector.bag(playerId, store.getState());
  }

  // Bag may still be empty.
  if (!R.isEmpty(bag)) {
    const coinId = ArrayUtils.randomElement(bag);
    store.dispatch(ActionCreator.transferBagToHand(playerId, coinId));
  }
};

const drawThreeCoins = (playerId, store) => {
  for (let i = 0; i < 3; i += 1) {
    drawCoin(playerId, store);
  }
};

const executeDrawThreeCoins = (resolve, store) => {
  const playerIds = Selector.currentPlayerOrder(store.getState());

  R.forEach((playerId) => {
    drawThreeCoins(playerId, store);
  }, playerIds);

  resolve();
};

const hasCoinsInHand = (state) => {
  const reduceFunction = (accum, playerId) => {
    const hand = Selector.hand(playerId, state);
    return accum || hand.length > 0;
  };
  const playerIds = Selector.currentPlayerOrder(state);

  return R.reduce(reduceFunction, false, playerIds);
};

PhaseFunction.executePlayCoin = (resolve, store, callback) => {
  const currentPlayer = Selector.currentPlayer(store.getState());
  const strategy = Selector.playerStrategy(currentPlayer.id, store.getState());
  const hand = Selector.hand(currentPlayer.id, store.getState());

  if (hand.length > 0) {
    const moveStates = MoveGenerator.generate(currentPlayer, store.getState());
    const delay = Selector.delay(store.getState());
    strategy.choosePaymentCoin(moveStates, store, delay).then((moveState) => {
      PhaseFunction.finishChoosePaymentCoin(moveState.coinId, resolve, store, callback);
    });
  } else {
    resolve();
  }
};

PhaseFunction.finishChoosePaymentCoin = (paymentCoinId, resolve, store, callback) => {
  if (!R.isNil(paymentCoinId)) {
    const currentPlayer = Selector.currentPlayer(store.getState());
    store.dispatch(ActionCreator.setCurrentPaymentCoin(paymentCoinId));
    const paymentCoin = Selector.coin(paymentCoinId, store.getState());
    const moveStates = MoveGenerator.generateForCoin(currentPlayer, paymentCoin, store.getState());
    store.dispatch(ActionCreator.setCurrentMoves(moveStates));

    PhaseFunction.chooseMove(moveStates, paymentCoin, resolve, store, callback);
  }
};

PhaseFunction.executePlayCoins = (resolve, store) => {
  advanceCurrentPlayer(store);

  const hasCoins = hasCoinsInHand(store.getState());

  if (hasCoins) {
    PhaseFunction.executePlayCoin(resolve, store, PhaseFunction.executePlayCoins);
  } else {
    resolve();
  }
};

PhaseFunction.drawThreeCoins = {
  execute: (store) =>
    new Promise((resolve) => {
      if (GameOver.isGameOver(store.getState())) {
        resolve();
      } else {
        executeDrawThreeCoins(resolve, store);
      }
    }),
};

PhaseFunction.playCoins = {
  execute: (store) =>
    new Promise((resolve) => {
      if (GameOver.isGameOver(store.getState())) {
        resolve();
      } else {
        PhaseFunction.executePlayCoins(resolve, store);
      }
    }),
};

const beforeMoveExecute = (store) =>
  new Promise((resolve) => {
    const moveState = Selector.currentMove(store.getState());
    const victimCoin = moveState.victimCoinId
      ? Selector.coin(moveState.victimCoinId, store.getState())
      : undefined;

    if (
      victimCoin &&
      victimCoin.coinKey === UnitCoin.ROYAL_GUARD &&
      moveState.moveKey === Move.ATTACK
    ) {
      PhaseFunction.executeRoyalGuardAttribute(store).then(() => {
        resolve();
      });
    } else {
      resolve();
    }
  });

const afterMoveExecute = (paymentCoin, resolve, store, callback) => {
  const moveState = Selector.currentMove(store.getState());
  const move = moveState.moveType;
  const an = moveState.moveKey === Move.MOVE_A_UNIT ? moveState.an2 : moveState.an1;
  const unit = Selector.unit(an, store.getState());
  const recruitCoin = moveState.recruitCoinId
    ? Selector.coin(moveState.recruitCoinId, store.getState())
    : undefined;

  if (
    paymentCoin.coinKey === UnitCoin.BERSERKER &&
    move &&
    move.isManeuver &&
    unit &&
    unit.length > 1
  ) {
    PhaseFunction.executeBerserkerAttribute(resolve, store, callback);
  } else if (
    recruitCoin &&
    recruitCoin.coinKey === UnitCoin.MERCENARY &&
    moveState.moveKey === Move.RECRUIT
  ) {
    store.dispatch(ActionCreator.setCurrentPaymentCoin(recruitCoin.id));
    PhaseFunction.executeMercenaryAttribute(resolve, store, callback);
  } else if (paymentCoin.coinKey === UnitCoin.SWORDSMAN && moveState.moveKey === Move.ATTACK) {
    PhaseFunction.executeSwordsmanAttribute(resolve, store, callback);
  } else if (
    paymentCoin.coinKey === UnitCoin.WARRIOR_PRIEST &&
    [Move.ATTACK, Move.CONTROL].includes(moveState.moveKey)
  ) {
    PhaseFunction.executeWarriorPriestAttribute(resolve, store, callback);
  } else {
    callback(resolve, store);
  }
};

PhaseFunction.chooseMove = (moveStates, paymentCoin, resolve, store, callback) => {
  if (!R.isEmpty(moveStates)) {
    const currentPlayer = Selector.currentPlayer(store.getState());
    const strategy = Selector.playerStrategy(currentPlayer.id, store.getState());
    const delay = Selector.delay(store.getState());

    strategy.chooseMove(moveStates, store, delay).then((moveState) => {
      PhaseFunction.finishChooseMove(moveState, moveStates, paymentCoin, resolve, store, callback);
    });
  } else {
    callback(resolve, store);
  }
};

PhaseFunction.finishChooseMove = (moveState, moveStates, paymentCoin, resolve, store, callback) => {
  store.dispatch(ActionCreator.setCurrentMove(moveState));

  if (R.isNil(moveState)) {
    store.dispatch(ActionCreator.setCurrentMoves([]));
    store.dispatch(ActionCreator.setCurrentPaymentCoin(null));
    PhaseFunction.executePlayCoin(resolve, store, callback);
  } else {
    const gameRecord = MoveFunction.createGameRecord(moveState, store.getState());
    store.dispatch(ActionCreator.addGameRecord(gameRecord));
    beforeMoveExecute(store)
      .then(() => {
        MoveFunction.execute(moveState, store);
      })
      .then(() => {
        if (GameOver.isGameOver(store.getState())) {
          resolve();
        } else {
          afterMoveExecute(paymentCoin, resolve, store, callback);
        }
      });
  }
};

PhaseFunction.executeBerserkerAttribute = (resolve, store, callback) => {
  const currentPlayer = Selector.currentPlayer(store.getState());
  const paymentCoin = Selector.currentPaymentCoin(store.getState());
  const moveStates0 = MoveGenerator.generateManeuvers(currentPlayer, paymentCoin, store.getState());
  const moveStates = R.map((m) => ({ ...m, isBerserker: true }), moveStates0);
  store.dispatch(ActionCreator.setCurrentMoves(moveStates));

  PhaseFunction.chooseMove(moveStates, paymentCoin, resolve, store, callback);
};

PhaseFunction.executeMercenaryAttribute = (resolve, store, callback) => {
  const currentPlayer = Selector.currentPlayer(store.getState());
  const paymentCoin = Selector.currentPaymentCoin(store.getState());
  const moveStates = MoveGenerator.generateManeuvers(currentPlayer, paymentCoin, store.getState());
  store.dispatch(ActionCreator.setCurrentMoves(moveStates));

  PhaseFunction.chooseMove(moveStates, paymentCoin, resolve, store, callback);
};

PhaseFunction.executeRoyalGuardAttribute = (store) =>
  new Promise((resolve) => {
    const moveState = Selector.currentMove(store.getState());
    const victimCoin = Selector.coin(moveState.victimCoinId, store.getState());
    const victimPlayer = Selector.playerForCard(victimCoin.coinKey, store.getState());
    const strategy = Selector.playerStrategy(victimPlayer.id, store.getState());
    const delay = Selector.delay(store.getState());
    const damageTargets = Selector.damageTargets(victimPlayer.id, store.getState());
    strategy.chooseDamageTarget(damageTargets, store, delay).then((damageTarget) => {
      store.dispatch(ActionCreator.setCurrentDamageTarget(damageTarget.key));
      resolve();
    });
  });

PhaseFunction.executeSwordsmanAttribute = (resolve, store, callback) => {
  const currentPlayer = Selector.currentPlayer(store.getState());
  const paymentCoin = Selector.currentPaymentCoin(store.getState());
  const moveStates = MoveGenerator.generateMoveAUnits(currentPlayer, paymentCoin, store.getState());
  store.dispatch(ActionCreator.setCurrentMoves(moveStates));

  PhaseFunction.chooseMove(moveStates, paymentCoin, resolve, store, callback);
};

PhaseFunction.executeWarriorPriestAttribute = (resolve, store, callback) => {
  const currentPlayer = Selector.currentPlayer(store.getState());
  drawCoin(currentPlayer.id, store);
  const hand = Selector.hand(currentPlayer.id, store.getState());
  const paymentCoin = Selector.coin(R.last(hand), store.getState());
  store.dispatch(ActionCreator.setCurrentPaymentCoin(paymentCoin.id));
  const moveStates = MoveGenerator.generateForCoin(currentPlayer, paymentCoin, store.getState());
  store.dispatch(ActionCreator.setCurrentMoves(moveStates));

  PhaseFunction.chooseMove(moveStates, paymentCoin, resolve, store, callback);
};

Object.freeze(PhaseFunction);

export default PhaseFunction;
