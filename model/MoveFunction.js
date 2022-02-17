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
  store.dispatch(ActionCreator.transferHandToDiscardFacedown(playerId, paymentCoinId));
  store.dispatch(ActionCreator.setInitiativePlayer(playerId));
  store.dispatch(ActionCreator.setInitiativeChangedThisRound(true));
};

const executeRecruit = (moveState, store) => {
  const { paymentCoinId, playerId, recruitCoinId } = moveState;
  store.dispatch(ActionCreator.transferHandToDiscardFacedown(playerId, paymentCoinId));
  store.dispatch(ActionCreator.transferSupplyToDiscardFaceup(playerId, recruitCoinId));
};

const executePass = (moveState, store) => {
  const { paymentCoinId, playerId } = moveState;
  store.dispatch(ActionCreator.transferHandToDiscardFacedown(playerId, paymentCoinId));
};

const executeDeploy = (moveState, store) => {
  const { an1, paymentCoinId, playerId } = moveState;
  store.dispatch(ActionCreator.transferHandToBoard(playerId, paymentCoinId, an1));
};

const executeBolster = (moveState, store) => {
  const { an1, paymentCoinId, playerId } = moveState;
  store.dispatch(ActionCreator.transferHandToBoard(playerId, paymentCoinId, an1));
};

const executeMoveAUnit = (moveState, store) => {
  const { an1, paymentCoinId, playerId, an2 } = moveState;

  if (moveState.isBerserker) {
    store.dispatch(ActionCreator.transferBoardToDiscardFaceup(playerId, an1));
  } else {
    const discardFaceup = Selector.discardFaceup(playerId, store.getState());

    if (!discardFaceup.includes(paymentCoinId)) {
      store.dispatch(ActionCreator.transferHandToDiscardFaceup(playerId, paymentCoinId));
    }
  }
  store.dispatch(ActionCreator.moveAUnit(playerId, an1, an2));
};

const executeControl = (moveState, store) => {
  const { an1, paymentCoinId, playerId } = moveState;
  const player = Selector.player(playerId, store.getState());

  if (moveState.isBerserker) {
    store.dispatch(ActionCreator.transferBoardToDiscardFaceup(playerId, an1));
  } else {
    store.dispatch(ActionCreator.transferHandToDiscardFaceup(playerId, paymentCoinId));
  }
  store.dispatch(ActionCreator.setControl(an1, player.teamKey));
};

const executeAttack = (moveState, store) => {
  const { an1, an2, paymentCoinId, playerId, victimCoinId } = moveState;
  const victimCoinKey = Selector.coinType(victimCoinId, store.getState()).key;
  const victimPlayerId = Selector.playerForCard(victimCoinKey, store.getState()).id;

  if (moveState.isBerserker) {
    store.dispatch(ActionCreator.transferBoardToDiscardFaceup(playerId, an1));
  } else {
    const discardFaceup = Selector.discardFaceup(playerId, store.getState());

    if (!discardFaceup.includes(paymentCoinId)) {
      store.dispatch(ActionCreator.transferHandToDiscardFaceup(playerId, paymentCoinId));
    }
  }

  const damageTarget = Selector.currentDamageTarget(store.getState());

  if (damageTarget && damageTarget.key === DamageTarget.SUPPLY) {
    const supplyCoins = Selector.supplyCoinsByType(victimPlayerId, victimCoinKey, store.getState());

    if (supplyCoins.length > 0) {
      const supplyCoinId = supplyCoins[0].id;
      store.dispatch(ActionCreator.transferSupplyToMorgue(victimPlayerId, supplyCoinId));
    }
  } else {
    store.dispatch(ActionCreator.transferBoardToMorgue(victimPlayerId, an2));
  }

  // Pikeman attribute.
  if (
    victimCoinKey === UnitCoin.PIKEMAN &&
    Board.isNeighbor(an1, an2, Selector.isTwoPlayer(store.getState()))
  ) {
    store.dispatch(ActionCreator.transferBoardToMorgue(playerId, an1));
  }
};

// /////////////////////////////////////////////////////////////////////////////////////////////////
const labelClaimOrPass = moveState => moveState.moveType.name;

const labelDeployOrBolster = (moveState, state) => {
  const paymentCoin = Selector.coinType(moveState.paymentCoinId, state);
  return `${moveState.moveType.name}: ${paymentCoin.name} to ${moveState.an1}`;
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
      const recruitCoin = Selector.coinType(moveState.recruitCoinId, state);
      return `${moveState.moveType.name}: ${recruitCoin.name}`;
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
      const paymentCoin = Selector.coinType(moveState.paymentCoinId, state);
      return (
        `${moveState.moveType.name}: ` +
        `${paymentCoin.name} from ${moveState.an1} to ${moveState.an2}`
      );
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
    label: moveState => `${moveState.moveType.name}: ${moveState.an1}`,
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
      const paymentCoin = Selector.coinType(moveState.paymentCoinId, state);
      const victimCoin = Selector.coinType(moveState.victimCoinId, state);
      return (
        `${moveState.moveType.name}: ${paymentCoin.name} at ${moveState.an1}` +
        ` attacks ${victimCoin.name} at ${moveState.an2}`
      );
    },
    key: "attack"
  },
  tactic: {
    isLegal: Tactic.isLegal,
    label: Tactic.label,
    key: "tactic"
  }
};

MoveFunction.createGameRecord = (moveState, state) => {
  let answer;

  if (moveState) {
    const round = Selector.currentRound(state);
    const gameRecords = Selector.gameRecords(state);
    const roundRecords = R.filter(r => r.round === round, gameRecords);
    const turn = roundRecords.length + 1;
    const player = state.playerInstances[moveState.playerId];
    const playerName = player ? player.name : `Player ${moveState.playerId}`;
    const teamName = player && player.teamType ? player.teamType.name : undefined;
    const label = MoveFunction.label(moveState, state);

    answer = `${round}.${turn} ${playerName} ${teamName} ${label}`;
  }

  return answer;
};

MoveFunction.execute = (moveState, store) => {
  const { moveKey, moveStates } = moveState;

  if (moveStates && moveStates.length > 0) {
    const forEachFunction = m => {
      MoveFunction[m.moveKey].execute(m, store);
    };
    R.forEach(forEachFunction, moveStates);
  } else {
    MoveFunction[moveKey].execute(moveState, store);
  }
};

MoveFunction.label = (moveState, state) => {
  const { moveKey } = moveState;

  return MoveFunction[moveKey].label(moveState, state);
};

Object.freeze(MoveFunction);

export default MoveFunction;
