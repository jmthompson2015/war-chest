/* eslint no-console: ["error", { allow: ["log"] }] */

import ArrayUtils from "../util/ArrayUtilities.js";

import Move from "../artifact/Move.js";
import Phase from "../artifact/Phase.js";
import UnitCoin from "../artifact/UnitCoin.js";

import ActionCreator from "../state/ActionCreator.js";
import Selector from "../state/Selector.js";

import GameOver from "./GameOver.js";
import MoveFunction from "./MoveFunction.js";
import MoveGenerator from "./MoveGenerator.js";

const StepFunction = {};

// /////////////////////////////////////////////////////////////////////////////

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
  let handLen = Selector.hand(playerId, store.getState()).length;

  for (let i = 0; i < 3 && handLen < 3; i += 1) {
    drawCoin(playerId, store);
    handLen = Selector.hand(playerId, store.getState()).length;
  }
};

StepFunction.executePlayCoin = (resolve, store) => {
  const currentPlayer = Selector.currentPlayer(store.getState());
  const strategy = Selector.playerStrategy(currentPlayer.id, store.getState());
  const hand = Selector.hand(currentPlayer.id, store.getState());

  if (currentPlayer.isComputer) {
    if (hand.length > 0) {
      const moveStates = MoveGenerator.generateFull(currentPlayer, store.getState());
      const delay = Selector.delay(store.getState());
      strategy.chooseMove(moveStates, store, delay).then((moveState) => {
        const paymentCoin = Selector.coin(moveState.paymentCoinId, store.getState());
        StepFunction.finishChooseMove(moveState, moveStates, paymentCoin, resolve, store);
      });
    } else {
      resolve();
    }
  } else if (hand.length > 0) {
    const moveStates = MoveGenerator.generate(currentPlayer, store.getState());
    const delay = Selector.delay(store.getState());
    strategy.choosePaymentCoin(moveStates, store, delay).then((moveState) => {
      StepFunction.finishChoosePaymentCoin(moveState.coinId, resolve, store);
    });
  } else {
    resolve();
  }
};

StepFunction.finishChoosePaymentCoin = (paymentCoinId, resolve, store) => {
  if (!R.isNil(paymentCoinId)) {
    const currentPlayer = Selector.currentPlayer(store.getState());
    store.dispatch(ActionCreator.setCurrentPaymentCoin(paymentCoinId));
    const paymentCoin = Selector.coin(paymentCoinId, store.getState());
    const moveStates = MoveGenerator.generateForCoin(currentPlayer, paymentCoin, store.getState());
    store.dispatch(ActionCreator.setCurrentMoves(moveStates));

    StepFunction.chooseMove(moveStates, paymentCoin, resolve, store);
  } else {
    resolve();
  }
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
      StepFunction.executeRoyalGuardAttribute(store).then(() => {
        resolve();
      });
    } else {
      resolve();
    }
  });

const afterMoveExecute = (paymentCoin, resolve, store) => {
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
    StepFunction.executeBerserkerAttribute(resolve, store);
  } else if (
    recruitCoin &&
    recruitCoin.coinKey === UnitCoin.MERCENARY &&
    moveState.moveKey === Move.RECRUIT
  ) {
    store.dispatch(ActionCreator.setCurrentPaymentCoin(recruitCoin.id));
    StepFunction.executeMercenaryAttribute(resolve, store);
  } else if (paymentCoin.coinKey === UnitCoin.SWORDSMAN && moveState.moveKey === Move.ATTACK) {
    StepFunction.executeSwordsmanAttribute(resolve, store);
  } else if (
    paymentCoin.coinKey === UnitCoin.WARRIOR_PRIEST &&
    [Move.ATTACK, Move.CONTROL].includes(moveState.moveKey)
  ) {
    StepFunction.executeWarriorPriestAttribute(resolve, store);
  } else {
    resolve();
  }
};

StepFunction.chooseMove = (moveStates, paymentCoin, resolve, store) => {
  if (!R.isEmpty(moveStates)) {
    const currentPlayer = Selector.currentPlayer(store.getState());
    const strategy = Selector.playerStrategy(currentPlayer.id, store.getState());
    const delay = Selector.delay(store.getState());

    strategy.chooseMove(moveStates, store, delay).then((moveState) => {
      StepFunction.finishChooseMove(moveState, moveStates, paymentCoin, resolve, store);
    });
  } else {
    resolve();
  }
};

StepFunction.finishChooseMove = (moveState, moveStates, paymentCoin, resolve, store) => {
  store.dispatch(ActionCreator.setCurrentMove(moveState));

  if (R.isNil(moveState)) {
    store.dispatch(ActionCreator.setCurrentMoves([]));
    store.dispatch(ActionCreator.setCurrentPaymentCoin(null));
    StepFunction.executePlayCoin(resolve, store);
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
          afterMoveExecute(paymentCoin, resolve, store);
        }
      });
  }
};

StepFunction.execute = (store) => {
  return new Promise((resolve) => {
    const phaseKey = Selector.currentPhaseKey(store.getState());
    const playerId = Selector.currentPlayerId(store.getState());
    let answer = Promise.resolve();

    switch (phaseKey) {
      case Phase.DRAW_THREE_COINS:
        drawThreeCoins(playerId, store);
        resolve();
        break;
      case Phase.PLAY_COIN_1:
      case Phase.PLAY_COIN_2:
      case Phase.PLAY_COIN_3:
        answer = StepFunction.executePlayCoin(resolve, store);
        break;
      default:
        throw new Error(`Unknown phaseKey = ${phaseKey}`);
    }

    return answer;
  });
};

StepFunction.executeBerserkerAttribute = (resolve, store) => {
  const currentPlayer = Selector.currentPlayer(store.getState());
  const paymentCoin = Selector.currentPaymentCoin(store.getState());
  const moveStates0 = MoveGenerator.generateManeuvers(currentPlayer, paymentCoin, store.getState());
  const moveStates = R.map((m) => ({ ...m, isBerserker: true }), moveStates0);
  store.dispatch(ActionCreator.setCurrentMoves(moveStates));

  StepFunction.chooseMove(moveStates, paymentCoin, resolve, store);
};

StepFunction.executeMercenaryAttribute = (resolve, store) => {
  const currentPlayer = Selector.currentPlayer(store.getState());
  const paymentCoin = Selector.currentPaymentCoin(store.getState());
  const moveStates = MoveGenerator.generateManeuvers(currentPlayer, paymentCoin, store.getState());
  store.dispatch(ActionCreator.setCurrentMoves(moveStates));

  StepFunction.chooseMove(moveStates, paymentCoin, resolve, store);
};

StepFunction.executeRoyalGuardAttribute = (store) =>
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

StepFunction.executeSwordsmanAttribute = (resolve, store) => {
  const currentPlayer = Selector.currentPlayer(store.getState());
  const paymentCoin = Selector.currentPaymentCoin(store.getState());
  const moveStates = MoveGenerator.generateMoveAUnits(currentPlayer, paymentCoin, store.getState());
  store.dispatch(ActionCreator.setCurrentMoves(moveStates));

  StepFunction.chooseMove(moveStates, paymentCoin, resolve, store);
};

StepFunction.executeWarriorPriestAttribute = (resolve, store) => {
  const currentPlayer = Selector.currentPlayer(store.getState());
  drawCoin(currentPlayer.id, store);
  const hand = Selector.hand(currentPlayer.id, store.getState());
  const paymentCoin = Selector.coin(R.last(hand), store.getState());
  store.dispatch(ActionCreator.setCurrentPaymentCoin(paymentCoin.id));
  const moveStates = MoveGenerator.generateForCoin(currentPlayer, paymentCoin, store.getState());
  store.dispatch(ActionCreator.setCurrentMoves(moveStates));

  StepFunction.chooseMove(moveStates, paymentCoin, resolve, store);
};

Object.freeze(StepFunction);

export default StepFunction;
