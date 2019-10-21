import Board from "../artifact/Board.js";
import Resolver from "../artifact/Resolver.js";
import UnitCard from "../artifact/UnitCard.js";
import UnitCoin from "../artifact/UnitCoin.js";

import ActionCreator from "../state/ActionCreator.js";
import Selector from "../state/Selector.js";

const executeClaimInitiative = (moveState, store) => {
  const { paymentCoinId, playerId } = moveState;
  const player = Selector.player(playerId, store.getState());
  store.dispatch(ActionCreator.setUserMessage(`Player ${player.name} claims initiative.`));
  store.dispatch(
    ActionCreator.transferBetweenPlayerArrays(
      "playerToHand",
      "playerToDiscardFacedown",
      playerId,
      paymentCoinId
    )
  );
  store.dispatch(ActionCreator.setInitiativePlayer(playerId));
  store.dispatch(ActionCreator.setInitiativeChangedThisRound(true));
};

const executeRecruit = (moveState, store) => {
  const { paymentCoinId, playerId, recruitCoinId } = moveState;
  const player = Selector.player(playerId, store.getState());
  const recruitCoinState = Selector.coin(recruitCoinId, store.getState());
  const recruitCoin = Resolver.coin(recruitCoinState.coinKey);
  store.dispatch(
    ActionCreator.setUserMessage(`Player ${player.name} recruits a ${recruitCoin.name}.`)
  );
  store.dispatch(
    ActionCreator.transferBetweenPlayerArrays(
      "playerToHand",
      "playerToDiscardFacedown",
      playerId,
      paymentCoinId
    )
  );
  store.dispatch(
    ActionCreator.transferBetweenPlayerArrays(
      "playerToSupply",
      "playerToDiscardFaceup",
      playerId,
      recruitCoinId
    )
  );
};

const executePass = (moveState, store) => {
  const { paymentCoinId, playerId } = moveState;
  const player = Selector.player(playerId, store.getState());
  store.dispatch(ActionCreator.setUserMessage(`Player ${player.name} passes.`));
  store.dispatch(
    ActionCreator.transferBetweenPlayerArrays(
      "playerToHand",
      "playerToDiscardFacedown",
      playerId,
      paymentCoinId
    )
  );
};

const executeDeploy = (moveState, store) => {
  const { an, paymentCoinId, playerId } = moveState;
  const player = Selector.player(playerId, store.getState());
  const paymentCoinState = Selector.coin(paymentCoinId, store.getState());
  const paymentCoin = Resolver.coin(paymentCoinState.coinKey);
  store.dispatch(
    ActionCreator.setUserMessage(`Player ${player.name} deploys a ${paymentCoin.name}.`)
  );
  store.dispatch(ActionCreator.handToBoard(playerId, paymentCoinId, an));
};

const executeBolster = (moveState, store) => {
  const { an, paymentCoinId, playerId } = moveState;
  const player = Selector.player(playerId, store.getState());
  const paymentCoinState = Selector.coin(paymentCoinId, store.getState());
  const paymentCoin = Resolver.coin(paymentCoinState.coinKey);
  store.dispatch(
    ActionCreator.setUserMessage(`Player ${player.name} bolsters a ${paymentCoin.name}.`)
  );
  store.dispatch(ActionCreator.handToBoard(playerId, paymentCoinId, an));
};

const executeMoveAUnit = (moveState, store) => {
  const { fromAN, paymentCoinId, playerId, toAN } = moveState;
  const player = Selector.player(playerId, store.getState());
  const paymentCoinState = Selector.coin(paymentCoinId, store.getState());
  const paymentCoin = Resolver.coin(paymentCoinState.coinKey);
  store.dispatch(
    ActionCreator.setUserMessage(`Player ${player.name} moves a ${paymentCoin.name}.`)
  );
  store.dispatch(
    ActionCreator.transferBetweenPlayerArrays(
      "playerToHand",
      "playerToDiscardFaceup",
      playerId,
      paymentCoinId
    )
  );
  store.dispatch(ActionCreator.moveAUnit(playerId, fromAN, toAN));
};

const executeControl = (moveState, store) => {
  const { an, paymentCoinId, playerId } = moveState;
  const player = Selector.player(playerId, store.getState());
  store.dispatch(ActionCreator.setUserMessage(`Player ${player.name} controls ${an}.`));
  store.dispatch(
    ActionCreator.transferBetweenPlayerArrays(
      "playerToHand",
      "playerToDiscardFaceup",
      playerId,
      paymentCoinId
    )
  );
  store.dispatch(ActionCreator.setControl(an, player.teamKey));
};

const executeAttack = (moveState, store) => {
  const { fromAN, paymentCoinId, playerId, toAN } = moveState;
  const player = Selector.player(playerId, store.getState());
  const paymentCoinState = Selector.coin(paymentCoinId, store.getState());
  const paymentCoin = Resolver.coin(paymentCoinState.coinKey);
  const victimUnit = Selector.unit(toAN, store.getState());
  const victimCoinId = victimUnit[0];
  const victimCoinState = Selector.coin(victimCoinId, store.getState());
  const victimCoin = Resolver.coin(victimCoinState.coinKey);
  const victimPlayer = Selector.playerForCard(victimCoinState.coinKey, store.getState());
  store.dispatch(
    ActionCreator.setUserMessage(
      `Player ${player.name} uses his ${paymentCoin.name}` +
        ` to attack ${victimCoin.name} at ${toAN}.`
    )
  );
  store.dispatch(
    ActionCreator.transferBetweenPlayerArrays(
      "playerToHand",
      "playerToDiscardFaceup",
      playerId,
      paymentCoinId,
      victimCoinId
    )
  );
  store.dispatch(ActionCreator.boardToMorgue(victimPlayer.id, toAN));

  // Pikeman attribute.
  if (victimCoin.key === UnitCoin.PIKEMAN) {
    store.dispatch(ActionCreator.boardToMorgue(playerId, fromAN));
  }
};

const executeTactic = (/* player, paymentCoin, fromAN, toAN, store */) => {};

// /////////////////////////////////////////////////////////////////////////////////////////////////
const labelClaimOrPass = moveState => {
  const move = Resolver.move(moveState.moveKey);
  return `${move.name}`;
};

const labelDeployOrBolster = (moveState, coinInstances) => {
  const move = Resolver.move(moveState.moveKey);
  const paymentCoinState = coinInstances[moveState.paymentCoinId];
  const paymentCoin = Resolver.coin(paymentCoinState.coinKey);
  return `${move.name}: ${paymentCoin.name} to ${moveState.an}`;
};

// /////////////////////////////////////////////////////////////////////////////////////////////////
const MoveFunction = {
  claimInitiative: {
    execute: executeClaimInitiative,
    isLegal: (player, paymentCoin, state) =>
      Selector.isInHand(player.id, paymentCoin.id, state) &&
      !Selector.isInitiativePlayer(player.id, state) &&
      !Selector.initiativeChangedThisRound(state),
    label: labelClaimOrPass,
    key: "claimInitiative"
  },
  recruit: {
    execute: executeRecruit,
    isLegal: (player, paymentCoin, recruitCoin, state) =>
      Selector.isInHand(player.id, paymentCoin.id, state) &&
      Resolver.isUnitCoin(recruitCoin.coinKey) &&
      Selector.isInSupply(player.id, recruitCoin.id, state),
    label: (moveState, coinInstances) => {
      const move = Resolver.move(moveState.moveKey);
      const recruitCoinState = coinInstances[moveState.recruitCoinId];
      const recruitCoin = Resolver.coin(recruitCoinState.coinKey);
      return `${move.name}: ${recruitCoin.name}`;
    },
    key: "recruit"
  },
  pass: {
    execute: executePass,
    isLegal: (player, paymentCoin, state) => Selector.isInHand(player.id, paymentCoin.id, state),
    label: labelClaimOrPass,
    key: "pass"
  },
  deploy: {
    execute: executeDeploy,
    isLegal: (player, paymentCoin, an, state) =>
      Selector.isInHand(player.id, paymentCoin.id, state) &&
      Resolver.isUnitCoin(paymentCoin.coinKey) &&
      Selector.canDeploy(paymentCoin.coinKey, state) &&
      Selector.isControlledBy(an, player.teamKey, state) &&
      Selector.isUnoccupied(an, state),
    label: labelDeployOrBolster,
    key: "deploy"
  },
  bolster: {
    execute: executeBolster,
    isLegal: (player, paymentCoin, an, state) =>
      Selector.isInHand(player.id, paymentCoin.id, state) &&
      Resolver.isUnitCoin(paymentCoin.coinKey) &&
      Selector.isUnitType(an, paymentCoin.coinKey, state),
    label: labelDeployOrBolster,
    key: "bolster"
  },
  moveAUnit: {
    execute: executeMoveAUnit,
    isLegal: (player, paymentCoin, fromAN, toAN, state) =>
      Selector.isInHand(player.id, paymentCoin.id, state) &&
      Selector.isUnitType(fromAN, paymentCoin.coinKey, state) &&
      Board.isNeighbor(fromAN, toAN) &&
      Selector.isUnoccupied(toAN, state),
    label: (moveState, coinInstances) => {
      const move = Resolver.move(moveState.moveKey);
      const paymentCoinState = coinInstances[moveState.paymentCoinId];
      const paymentCoin = Resolver.coin(paymentCoinState.coinKey);
      return `${move.name}: ${paymentCoin.name} from ${moveState.fromAN} to ${moveState.toAN}`;
    },
    key: "moveAUnit"
  },
  control: {
    execute: executeControl,
    isLegal: (player, paymentCoin, an, state) =>
      Selector.isInHand(player.id, paymentCoin.id, state) &&
      Resolver.isUnitCoin(paymentCoin.coinKey) &&
      Selector.isUnitType(an, paymentCoin.coinKey, state) &&
      Selector.isControlLocation(an, state) &&
      !Selector.isControlledBy(an, player.teamKey, state),
    label: moveState => {
      const move = Resolver.move(moveState.moveKey);
      return `${move.name}: ${moveState.an}`;
    },
    key: "control"
  },
  attack: {
    execute: executeAttack,
    isLegal: (player, paymentCoin, fromAN, toAN, state) =>
      Selector.isInHand(player.id, paymentCoin.id, state) &&
      UnitCard.canAttack(paymentCoin.coinKey) &&
      Selector.canBeAttacked(fromAN, toAN, state) &&
      Selector.isUnitType(fromAN, paymentCoin.coinKey, state) &&
      Board.isNeighbor(fromAN, toAN) &&
      Selector.isEnemyUnitAt(player.id, toAN, state),
    label: (moveState, coinInstances) => {
      const move = Resolver.move(moveState.moveKey);
      const paymentCoinState = coinInstances[moveState.paymentCoinId];
      const paymentCoin = Resolver.coin(paymentCoinState.coinKey);
      const victimCoinState = coinInstances[moveState.victimCoinId];
      const victimCoin = Resolver.coin(victimCoinState.coinKey);
      return (
        `${move.name}: ${paymentCoin.name} at ${moveState.fromAN}` +
        ` attack ${victimCoin.name} at ${moveState.toAN}`
      );
    },
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

MoveFunction.label = (moveState, coinInstances) => {
  const { moveKey } = moveState;

  return MoveFunction[moveKey].label(moveState, coinInstances);
};

Object.freeze(MoveFunction);

export default MoveFunction;
