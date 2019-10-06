import Resolver from "../artifact/Resolver.js";

import ActionCreator from "../state/ActionCreator.js";
import Selector from "../state/Selector.js";

const executeClaimInitiative = (moveState, store) => {
  const { paymentCoinKey, playerId } = moveState;
  const player = Selector.player(playerId, store.getState());
  store.dispatch(ActionCreator.setUserMessage(`Player ${player.name} claims initiative.`));
  store.dispatch(
    ActionCreator.transferBetweenPlayerArrays(
      "playerToHand",
      "playerToDiscardFacedown",
      playerId,
      paymentCoinKey
    )
  );
  store.dispatch(ActionCreator.setInitiativePlayer(playerId));
  store.dispatch(ActionCreator.setInitiativeChangedThisRound(true));
};

const executeRecruit = (moveState, store) => {
  const { paymentCoinKey, playerId, recruitCoinKey } = moveState;
  const player = Selector.player(playerId, store.getState());
  store.dispatch(
    ActionCreator.setUserMessage(`Player ${player.name} recruits a ${recruitCoinKey}.`)
  );
  store.dispatch(
    ActionCreator.transferBetweenPlayerArrays(
      "playerToHand",
      "playerToDiscardFacedown",
      playerId,
      paymentCoinKey
    )
  );
  store.dispatch(
    ActionCreator.transferBetweenPlayerArrays(
      "playerToSupply",
      "playerToDiscardFaceup",
      playerId,
      recruitCoinKey
    )
  );
};

const executePass = (moveState, store) => {
  const { paymentCoinKey, playerId } = moveState;
  const player = Selector.player(playerId, store.getState());
  store.dispatch(ActionCreator.setUserMessage(`Player ${player.name} passes.`));
  store.dispatch(
    ActionCreator.transferBetweenPlayerArrays(
      "playerToHand",
      "playerToDiscardFacedown",
      playerId,
      paymentCoinKey
    )
  );
};

const executeDeploy = (moveState, store) => {
  const { an, paymentCoinKey, playerId } = moveState;
  const player = Selector.player(playerId, store.getState());
  store.dispatch(
    ActionCreator.setUserMessage(`Player ${player.name} deploys a ${paymentCoinKey}.`)
  );
  store.dispatch(ActionCreator.handToBoard(playerId, paymentCoinKey, an));
};

const executeBolster = (moveState, store) => {
  const { an, paymentCoinKey, playerId } = moveState;
  const player = Selector.player(playerId, store.getState());
  store.dispatch(
    ActionCreator.setUserMessage(`Player ${player.name} bolsters a ${paymentCoinKey}.`)
  );
  store.dispatch(ActionCreator.handToBoard(playerId, paymentCoinKey, an));
};

const executeMoveAUnit = (moveState, store) => {
  const { fromAN, paymentCoinKey, playerId, toAN } = moveState;
  const player = Selector.player(playerId, store.getState());
  store.dispatch(ActionCreator.setUserMessage(`Player ${player.name} moves a ${paymentCoinKey}.`));
  store.dispatch(
    ActionCreator.transferBetweenPlayerArrays(
      "playerToHand",
      "playerToDiscardFaceup",
      playerId,
      paymentCoinKey
    )
  );
  store.dispatch(ActionCreator.moveAUnit(playerId, fromAN, toAN));
};

const executeControl = (moveState, store) => {
  const { an, paymentCoinKey, playerId } = moveState;
  const player = Selector.player(playerId, store.getState());
  store.dispatch(ActionCreator.setUserMessage(`Player ${player.name} controls ${an}.`));
  store.dispatch(
    ActionCreator.transferBetweenPlayerArrays(
      "playerToHand",
      "playerToDiscardFaceup",
      playerId,
      paymentCoinKey
    )
  );
  store.dispatch(ActionCreator.setControl(an, player.teamKey));
};

const executeAttack = (moveState, store) => {
  const { paymentCoinKey, playerId, toAN } = moveState;
  const player = Selector.player(playerId, store.getState());
  store.dispatch(
    ActionCreator.setUserMessage(
      `Player ${player.name} uses his ${paymentCoinKey} to attack ${toAN}.`
    )
  );
  store.dispatch(
    ActionCreator.transferBetweenPlayerArrays(
      "playerToHand",
      "playerToDiscardFaceup",
      playerId,
      paymentCoinKey
    )
  );
  store.dispatch(ActionCreator.boardToMorgue(playerId, toAN));
};

const executeTactic = (/* player, paymentCoin, fromAN, toAN, store */) => {};

// /////////////////////////////////////////////////////////////////////////////////////////////////
const MoveFunction = {
  claimInitiative: {
    execute: executeClaimInitiative,
    isLegal: (player, paymentCoin, state) =>
      Selector.isInHand(player.id, paymentCoin.key, state) &&
      !Selector.isInitiativePlayer(player.id, state) &&
      !Selector.initiativeChangedThisRound(state),
    key: "claimInitiative"
  },
  recruit: {
    execute: executeRecruit,
    isLegal: (player, paymentCoin, recruitCoin, state) =>
      Resolver.isUnitCoin(recruitCoin.key) &&
      Selector.isInHand(player.id, paymentCoin.key, state) &&
      Selector.isInSupply(player.id, recruitCoin.key, state),
    key: "recruit"
  },
  pass: {
    execute: executePass,
    isLegal: (player, paymentCoin, state) => Selector.isInHand(player.id, paymentCoin.key, state),
    key: "pass"
  },
  deploy: {
    execute: executeDeploy,
    isLegal: (player, coin, an, state) =>
      Resolver.isUnitCoin(coin.key) &&
      Selector.isInHand(player.id, coin.key, state) &&
      Selector.isControlledBy(an, player.teamKey, state) &&
      Selector.isUnoccupied(an, state),
    key: "deploy"
  },
  bolster: {
    execute: executeBolster,
    isLegal: (player, coin, an, state) =>
      Resolver.isUnitCoin(coin.key) &&
      Selector.isInHand(player.id, coin.key, state) &&
      Selector.isUnitType(an, coin.key, state),
    key: "bolster"
  },
  moveAUnit: {
    execute: executeMoveAUnit,
    isLegal: (player, paymentCoin, fromAN, toAN, state) =>
      Selector.isInHand(player.id, paymentCoin.key, state) &&
      Selector.isUnitType(fromAN, paymentCoin.key, state) &&
      // && Board.isAdjacent(fromAN, toAN)
      Selector.isUnoccupied(toAN, state),
    key: "moveAUnit"
  },
  control: {
    execute: executeControl,
    isLegal: (player, paymentCoin, an, state) =>
      Resolver.isUnitCoin(paymentCoin.key) &&
      Selector.isInHand(player.id, paymentCoin.key, state) &&
      Selector.isUnitType(an, paymentCoin.key, state) &&
      Selector.isControlLocation(an, state) &&
      !Selector.isControlledBy(an, player.teamKey, state),
    key: "control"
  },
  attack: {
    execute: executeAttack,
    isLegal: (player, paymentCoin, fromAN, toAN, state) =>
      Resolver.isUnitCoin(paymentCoin.key) &&
      Selector.isInHand(player.id, paymentCoin.key, state) &&
      // && Board.isAdjacent(fromAN, toAN)
      // && Selector.isEnemyUnitType(toAN, state)
      Selector.isUnitType(fromAN, paymentCoin.key, state),
    key: "attack"
  },
  tactic: {
    execute: executeTactic,
    isLegal: (/* player, paymentCoin, fromAN, toAN, state */) => false,
    key: "tactic"
  }
};

MoveFunction.execute = (moveState, store) => {
  const { moveKey } = moveState;
  MoveFunction[moveKey].execute(moveState, store);
};

Object.freeze(MoveFunction);

export default MoveFunction;
