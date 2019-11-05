import Board from "../artifact/Board.js";
import DamageTarget from "../artifact/DamageTarget.js";
import Resolver from "../artifact/Resolver.js";
import UnitCard from "../artifact/UnitCard.js";
import UnitCoin from "../artifact/UnitCoin.js";

import ActionCreator from "../state/ActionCreator.js";
import Selector from "../state/Selector.js";

import Tactic from "./Tactic.js";

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
  const { an1, paymentCoinId, playerId } = moveState;
  const player = Selector.player(playerId, store.getState());
  const paymentCoinState = Selector.coin(paymentCoinId, store.getState());
  const paymentCoin = Resolver.coin(paymentCoinState.coinKey);
  store.dispatch(
    ActionCreator.setUserMessage(`Player ${player.name} deploys a ${paymentCoin.name}.`)
  );
  store.dispatch(ActionCreator.handToBoard(playerId, paymentCoinId, an1));
};

const executeBolster = (moveState, store) => {
  const { an1, paymentCoinId, playerId } = moveState;
  const player = Selector.player(playerId, store.getState());
  const paymentCoinState = Selector.coin(paymentCoinId, store.getState());
  const paymentCoin = Resolver.coin(paymentCoinState.coinKey);
  store.dispatch(
    ActionCreator.setUserMessage(`Player ${player.name} bolsters a ${paymentCoin.name}.`)
  );
  store.dispatch(ActionCreator.handToBoard(playerId, paymentCoinId, an1));
};

const executeMoveAUnit = (moveState, store) => {
  const { an1, paymentCoinId, playerId, an2 } = moveState;
  const player = Selector.player(playerId, store.getState());
  const paymentCoinState = Selector.coin(paymentCoinId, store.getState());
  const paymentCoin = Resolver.coin(paymentCoinState.coinKey);
  store.dispatch(
    ActionCreator.setUserMessage(`Player ${player.name} moves a ${paymentCoin.name} to ${an2}.`)
  );

  if (moveState.isBerserker) {
    store.dispatch(ActionCreator.boardToDiscardFaceup(playerId, an1));
  } else {
    store.dispatch(
      ActionCreator.transferBetweenPlayerArrays(
        "playerToHand",
        "playerToDiscardFaceup",
        playerId,
        paymentCoinId
      )
    );
  }
  store.dispatch(ActionCreator.moveAUnit(playerId, an1, an2));
};

const executeControl = (moveState, store) => {
  const { an1, paymentCoinId, playerId } = moveState;
  const player = Selector.player(playerId, store.getState());
  store.dispatch(ActionCreator.setUserMessage(`Player ${player.name} controls ${an1}.`));

  if (moveState.isBerserker) {
    store.dispatch(ActionCreator.boardToDiscardFaceup(playerId, an1));
  } else {
    store.dispatch(
      ActionCreator.transferBetweenPlayerArrays(
        "playerToHand",
        "playerToDiscardFaceup",
        playerId,
        paymentCoinId
      )
    );
  }
  store.dispatch(ActionCreator.setControl(an1, player.teamKey));
};

const executeAttack = (moveState, store) => {
  const { an1, paymentCoinId, playerId, an2 } = moveState;
  const player = Selector.player(playerId, store.getState());
  const paymentCoinState = Selector.coin(paymentCoinId, store.getState());
  const paymentCoin = Resolver.coin(paymentCoinState.coinKey);
  const victimUnit = Selector.unit(an2, store.getState());
  const victimCoinId = R.last(victimUnit);
  const victimCoinState = Selector.coin(victimCoinId, store.getState());
  const victimCoin = Resolver.coin(victimCoinState.coinKey);
  const victimPlayer = Selector.playerForCard(victimCoinState.coinKey, store.getState());
  store.dispatch(
    ActionCreator.setUserMessage(
      `Player ${player.name} uses his ${paymentCoin.name} at ${an1}` +
        ` to attack ${victimCoin.name} at ${an2}.`
    )
  );

  if (moveState.isBerserker) {
    store.dispatch(ActionCreator.boardToDiscardFaceup(playerId, an1));
  } else {
    store.dispatch(
      ActionCreator.transferBetweenPlayerArrays(
        "playerToHand",
        "playerToDiscardFaceup",
        playerId,
        paymentCoinId
      )
    );
  }

  const damageTarget = Selector.currentDamageTarget(store.getState());

  if (damageTarget && damageTarget.key === DamageTarget.SUPPLY) {
    const supplyCoinIds = Selector.supplyCoinsByType(
      victimPlayer.id,
      victimCoinState.coinKey,
      store.getState()
    );
    const supplyCoinId = R.last(supplyCoinIds).id;
    store.dispatch(
      ActionCreator.transferBetweenPlayerArrays(
        "playerToSupply",
        "playerToMorgue",
        victimPlayer.id,
        supplyCoinId
      )
    );
  } else {
    store.dispatch(ActionCreator.boardToMorgue(victimPlayer.id, an2));
  }

  // Pikeman attribute.
  if (victimCoin.key === UnitCoin.PIKEMAN) {
    store.dispatch(ActionCreator.boardToMorgue(playerId, an1));
  }
};

// /////////////////////////////////////////////////////////////////////////////////////////////////
const labelClaimOrPass = moveState => {
  const move = Resolver.move(moveState.moveKey);
  return `${move.name}`;
};

const labelDeployOrBolster = (moveState, state) => {
  const move = Resolver.move(moveState.moveKey);
  const paymentCoinState = state.coinInstances[moveState.paymentCoinId];
  const paymentCoin = Resolver.coin(paymentCoinState.coinKey);
  return `${move.name}: ${paymentCoin.name} to ${moveState.an1}`;
};

// /////////////////////////////////////////////////////////////////////////////////////////////////
const MoveFunction = {
  claimInitiative: {
    execute: executeClaimInitiative,
    isLegal: (player, paymentCoin, state) =>
      !Selector.isInitiativePlayer(player.id, state) && !Selector.initiativeChangedThisRound(state),
    label: labelClaimOrPass,
    key: "claimInitiative"
  },
  recruit: {
    execute: executeRecruit,
    isLegal: (player, paymentCoin, recruitCoin, state) =>
      Resolver.isUnitCoin(recruitCoin.coinKey) &&
      Selector.isInSupply(player.id, recruitCoin.id, state),
    label: (moveState, state) => {
      const move = Resolver.move(moveState.moveKey);
      const recruitCoinState = state.coinInstances[moveState.recruitCoinId];
      const recruitCoin = Resolver.coin(recruitCoinState.coinKey);
      return `${move.name}: ${recruitCoin.name}`;
    },
    key: "recruit"
  },
  pass: {
    execute: executePass,
    isLegal: () => true,
    label: labelClaimOrPass,
    key: "pass"
  },
  deploy: {
    execute: executeDeploy,
    isLegal: (player, paymentCoin, an1, state) =>
      Resolver.isUnitCoin(paymentCoin.coinKey) &&
      Selector.canDeploy(paymentCoin.coinKey, state) &&
      Selector.isControlledBy(an1, player.teamKey, state) &&
      Selector.isUnoccupied(an1, state),
    label: labelDeployOrBolster,
    key: "deploy"
  },
  bolster: {
    execute: executeBolster,
    isLegal: (player, paymentCoin, an1, state) =>
      Resolver.isUnitCoin(paymentCoin.coinKey) &&
      Selector.isUnitType(an1, paymentCoin.coinKey, state),
    label: labelDeployOrBolster,
    key: "bolster"
  },
  moveAUnit: {
    execute: executeMoveAUnit,
    isLegal: (player, paymentCoin, an1, an2, state) =>
      Selector.isUnitType(an1, paymentCoin.coinKey, state) &&
      Board.isNeighbor(an1, an2, Selector.isTwoPlayer(state)) &&
      Selector.isUnoccupied(an2, state),
    label: (moveState, state) => {
      const move = Resolver.move(moveState.moveKey);
      const paymentCoinState = state.coinInstances[moveState.paymentCoinId];
      const paymentCoin = Resolver.coin(paymentCoinState.coinKey);
      return `${move.name}: ${paymentCoin.name} from ${moveState.an1} to ${moveState.an2}`;
    },
    key: "moveAUnit"
  },
  control: {
    execute: executeControl,
    isLegal: (player, paymentCoin, an1, state) =>
      Resolver.isUnitCoin(paymentCoin.coinKey) &&
      Selector.isUnitType(an1, paymentCoin.coinKey, state) &&
      Selector.isControlLocation(an1, state) &&
      !Selector.isControlledBy(an1, player.teamKey, state),
    label: moveState => {
      const move = Resolver.move(moveState.moveKey);
      return `${move.name}: ${moveState.an1}`;
    },
    key: "control"
  },
  attack: {
    execute: executeAttack,
    isLegal: (player, paymentCoin, an1, an2, state) =>
      UnitCard.canAttack(paymentCoin.coinKey) &&
      Selector.canBeAttacked(an1, an2, state) &&
      Selector.isUnitType(an1, paymentCoin.coinKey, state) &&
      Board.isNeighbor(an1, an2, Selector.isTwoPlayer(state)) &&
      Selector.isEnemyUnitAt(player.id, an2, state),
    label: (moveState, state) => {
      const move = Resolver.move(moveState.moveKey);
      const paymentCoinState = state.coinInstances[moveState.paymentCoinId];
      const paymentCoin = Resolver.coin(paymentCoinState.coinKey);
      const victimCoinState = state.coinInstances[moveState.victimCoinId];
      const victimCoin = Resolver.coin(victimCoinState.coinKey);
      return (
        `${move.name}: ${paymentCoin.name} at ${moveState.an1}` +
        ` attacks ${victimCoin.name} at ${moveState.an2}`
      );
    },
    key: "attack"
  },
  tactic: {
    execute: Tactic.execute,
    isLegal: Tactic.isLegal,
    label: Tactic.label,
    key: "tactic"
  }
};

MoveFunction.execute = (moveState, store) => {
  const { moveKey } = moveState;
  MoveFunction[moveKey].execute(moveState, store);
};

MoveFunction.label = (moveState, state) => {
  const { moveKey } = moveState;

  return MoveFunction[moveKey].label(moveState, state);
};

Object.freeze(MoveFunction);

export default MoveFunction;
