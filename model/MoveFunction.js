/* eslint no-console: ["error", { allow: ["log", "warn"] }] */

import Move from "../artifact/Move.js";
import Resolver from "../artifact/Resolver.js";

import ActionCreator from "../state/ActionCreator.js";
import Selector from "../state/Selector.js";

const MoveFunction = {
  claimInitiative: {
    execute: (player, paymentCoin) => store => {
      console.log(`Player ${player.name} claims initiative.`);
      store.dispatch(
        ActionCreator.transferBetweenPlayerArrays(
          "playerToHand",
          "playerToDiscardFacedown",
          player.id,
          paymentCoin.key
        )
      );
      store.dispatch(ActionCreator.setInitiativePlayer(player.id));
      store.dispatch(ActionCreator.setInitiativeChangedThisRound(true));
    },
    isLegal: (player, paymentCoin, state) =>
      Selector.isInHand(player.id, paymentCoin.key, state) &&
      !Selector.isInitiativePlayer(player.id, state) &&
      !Selector.initiativeChangedThisRound(state),
    key: "claimInitiative"
  },
  recruit: {
    execute: (player, paymentCoin, recruitCoin) => store => {
      console.log(`Player ${player.name} recruits a ${recruitCoin.key}.`);
      store.dispatch(
        ActionCreator.transferBetweenPlayerArrays(
          "playerToHand",
          "playerToDiscardFacedown",
          player.id,
          paymentCoin.key
        )
      );
      store.dispatch(
        ActionCreator.transferBetweenPlayerArrays(
          "playerToSupply",
          "playerToDiscardFaceup",
          player.id,
          recruitCoin.key
        )
      );
    },
    isLegal: (player, paymentCoin, recruitCoin, state) =>
      Resolver.isUnitCoin(recruitCoin.key) &&
      Selector.isInHand(player.id, paymentCoin.key, state) &&
      Selector.isInSupply(player.id, recruitCoin.key, state),
    key: "recruit"
  },
  pass: {
    execute: (player, paymentCoin) => store => {
      console.log(`Player ${player.name} passes.`);
      store.dispatch(
        ActionCreator.transferBetweenPlayerArrays(
          "playerToHand",
          "playerToDiscardFacedown",
          player.id,
          paymentCoin.key
        )
      );
    },
    isLegal: (player, paymentCoin, state) => Selector.isInHand(player.id, paymentCoin.key, state),
    key: "pass"
  },
  deploy: {
    execute: (player, coin, an) => store => {
      console.log(`Player ${player.name} deploys a ${coin.key}.`);
      store.dispatch(ActionCreator.handToBoard(player.id, coin.key, an));
    },
    isLegal: (player, coin, an, state) =>
      Resolver.isUnitCoin(coin.key) &&
      Selector.isInHand(player.id, coin.key, state) &&
      Selector.isControlledBy(an, player.teamKey, state) &&
      Selector.isUnoccupied(an, state),
    key: "deploy"
  },
  bolster: {
    execute: (player, coin, an) => store => {
      console.log(`Player ${player.name} bolsters a ${coin.key}.`);
      store.dispatch(ActionCreator.handToBoard(player.id, coin.key, an));
    },
    isLegal: (player, coin, an, state) =>
      Resolver.isUnitCoin(coin.key) &&
      Selector.isInHand(player.id, coin.key, state) &&
      Selector.isUnitType(an, coin.key, state),
    key: "bolster"
  },
  moveAUnit: {
    execute: (player, paymentCoin, fromAN, toAN) => store => {
      console.log(`Player ${player.name} moves a ${paymentCoin.key}.`);
      store.dispatch(
        ActionCreator.transferBetweenPlayerArrays(
          "playerToHand",
          "playerToDiscardFaceup",
          player.id,
          paymentCoin.key
        )
      );
      store.dispatch(ActionCreator.moveAUnit(player.id, fromAN, toAN));
    },
    isLegal: (player, paymentCoin, fromAN, toAN, state) =>
      Selector.isInHand(player.id, paymentCoin.key, state) &&
      Selector.isUnitType(fromAN, paymentCoin.key, state) &&
      // && Board.isAdjacent(fromAN, toAN)
      Selector.isUnoccupied(toAN, state),
    key: "moveAUnit"
  },
  control: {
    execute: (player, paymentCoin, an) => store => {
      console.log(`Player ${player.name} controls ${an}.`);
      store.dispatch(
        ActionCreator.transferBetweenPlayerArrays(
          "playerToHand",
          "playerToDiscardFaceup",
          player.id,
          paymentCoin.key
        )
      );
      store.dispatch(ActionCreator.setControl(an, player.teamKey));
    },
    isLegal: (player, paymentCoin, an, state) =>
      Resolver.isUnitCoin(paymentCoin.key) &&
      Selector.isInHand(player.id, paymentCoin.key, state) &&
      Selector.isUnitType(an, paymentCoin.key, state) &&
      Selector.isControlLocation(an, state) &&
      !Selector.isControlledBy(an, player.teamKey, state),
    key: "control"
  },
  attack: {
    execute: (player, paymentCoin, fromAN, toAN) => store => {
      console.log(`Player ${player.name} uses his ${paymentCoin.key} to attack ${toAN}.`);
      store.dispatch(
        ActionCreator.transferBetweenPlayerArrays(
          "playerToHand",
          "playerToDiscardFaceup",
          player.id,
          paymentCoin.key
        )
      );
      store.dispatch(ActionCreator.boardToMorgue(player.id, toAN));
    },
    isLegal: (player, paymentCoin, fromAN, toAN, state) =>
      Resolver.isUnitCoin(paymentCoin.key) &&
      Selector.isInHand(player.id, paymentCoin.key, state) &&
      // && Board.isAdjacent(fromAN, toAN)
      // && Selector.isEnemyUnitType(toAN, state)
      Selector.isUnitType(fromAN, paymentCoin.key, state),
    key: "attack"
  },
  tactic: {
    execute: (/* player, paymentCoin, fromAN, toAN */) => (/* store */) => {},
    isLegal: (/* player, paymentCoin, fromAN, toAN, state */) => false,
    key: "tactic"
  }
};

MoveFunction.execute = (moveState, store) => {
  const { an, fromAN, moveKey, paymentCoinKey, playerId, recruitCoinKey, toAN } = moveState;
  const player = Selector.player(playerId, store.getState());
  const paymentCoin = Resolver.coin(paymentCoinKey);
  let recruitCoin;

  switch (moveKey) {
    case Move.CLAIM_INITIATIVE:
      MoveFunction[moveKey].execute(player, paymentCoin)(store);
      break;
    case Move.RECRUIT:
      recruitCoin = Resolver.coin(recruitCoinKey);
      MoveFunction[moveKey].execute(player, paymentCoin, recruitCoin)(store);
      break;
    case Move.PASS:
      MoveFunction[moveKey].execute(player, paymentCoin)(store);
      break;
    case Move.DEPLOY:
      MoveFunction[moveKey].execute(player, paymentCoin, an)(store);
      break;
    case Move.BOLSTER:
      MoveFunction[moveKey].execute(player, paymentCoin, an)(store);
      break;
    case Move.MOVE_A_UNIT:
      MoveFunction[moveKey].execute(player, paymentCoin, fromAN, toAN)(store);
      break;
    case Move.CONTROL:
      MoveFunction[moveKey].execute(player, paymentCoin, an)(store);
      break;
    case Move.ATTACK:
      MoveFunction[moveKey].execute(player, paymentCoin, fromAN, toAN)(store);
      break;
    case Move.TACTIC:
      MoveFunction[moveKey].execute(player, paymentCoin, fromAN, toAN)(store);
      break;
    default:
      console.warn(`Unknown moveKey: ${moveKey}`);
  }
};

Object.freeze(MoveFunction);

export default MoveFunction;
