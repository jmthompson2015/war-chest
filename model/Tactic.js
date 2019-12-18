/* eslint no-console: ["error", { allow: ["warn"] }] */

import Board from "../artifact/Board.js";
import Move from "../artifact/Move.js";
import Resolver from "../artifact/Resolver.js";
import UnitCoin from "../artifact/UnitCoin.js";

import Selector from "../state/Selector.js";

const labelFootman = (moveState, state) => {
  const { moveStates, moveType: move, paymentCoinId } = moveState;
  const paymentCoin = Selector.coinType(paymentCoinId, state);
  const mapFunction = m => {
    let answer = "";
    const victimCoin = Selector.coinType(m.victimCoinId, state);
    const victimCoinName = victimCoin ? victimCoin.name : undefined;
    switch (m.moveKey) {
      case Move.MOVE_A_UNIT:
        answer = `Move ${paymentCoin.name} from ${m.an1} to ${m.an2}`;
        break;
      case Move.CONTROL:
        answer = `Control ${m.an1}`;
        break;
      case Move.ATTACK:
        answer = `${paymentCoin.name} at ${m.an1} attacks ${victimCoinName} at ${m.an2}`;
        break;
      default:
        console.warn(`Unknown label moveKey: ${m.moveKey}`);
    }
    return answer;
  };
  const suffix = R.map(mapFunction, moveStates);

  return `${move.name}: ${suffix.join("; ")}`;
};

const Tactic = {
  archer: {
    isLegal: (player, paymentCoin, an1, an2, state) =>
      paymentCoin.coinKey === UnitCoin.ARCHER &&
      Selector.isUnitType(an1, UnitCoin.ARCHER, state) &&
      Selector.canBeAttacked(an1, an2, state) &&
      Board.distance(an1, an2) === 2 &&
      Selector.isEnemyUnitAt(player.id, an2, state),
    label: (moveState, state) => {
      const { moveStates, moveType: move, paymentCoinId } = moveState;
      const { an1, an2, victimCoinId } = moveStates[0];
      const paymentCoin = Selector.coinType(paymentCoinId, state);
      const victimCoin = Selector.coinType(victimCoinId, state);
      return `${move.name}: ${paymentCoin.name} at ${an1} attacks ${victimCoin.name} at ${an2}`;
    }
  },
  cavalry: {
    // isLegal: MoveFunction.isLegal() used instead.
    label: (moveState, state) => {
      const { moveStates, moveType: move, paymentCoinId } = moveState;
      const { an1, an2 } = moveStates[0];
      const { an2: an3, victimCoinId } = moveStates[1];
      const paymentCoin = Selector.coinType(paymentCoinId, state);
      const victimCoin = Selector.coinType(victimCoinId, state);
      return (
        `${move.name}: ${paymentCoin.name} at ${an1}` +
        ` moves to ${an2} and` +
        ` attacks ${victimCoin.name} at ${an3}`
      );
    }
  },
  crossbowman: {
    isLegal: (player, paymentCoin, an1, an2, state) =>
      paymentCoin.coinKey === UnitCoin.CROSSBOWMAN &&
      Selector.isUnitType(an1, UnitCoin.CROSSBOWMAN, state) &&
      Selector.canBeAttacked(an1, an2, state) &&
      Board.distance(an1, an2) === 2 &&
      Board.isStraightLine(an1, an2) &&
      Selector.isUnoccupied(Board.middleAN(an1, an2), state) &&
      Selector.isEnemyUnitAt(player.id, an2, state),
    label: (moveState, state) => {
      const { moveStates, moveType: move, paymentCoinId } = moveState;
      const { an1, an2, victimCoinId } = moveStates[0];
      const paymentCoin = Selector.coinType(paymentCoinId, state);
      const victimCoin = Selector.coinType(victimCoinId, state);
      return `${move.name}: ${paymentCoin.name} at ${an1} attacks ${victimCoin.name} at ${an2}`;
    }
  },
  ensign: {
    label: (moveState, state) => {
      const { an1, moveStates, moveType: move, paymentCoinId } = moveState;
      const { an1: an2, an2: an3 } = moveStates[0];
      const paymentCoin = Selector.coinType(paymentCoinId, state);
      const moveCoin = Selector.coinTypeForUnit(an2, state);
      return (
        `${move.name}: ${paymentCoin.name} at ${an1} orders ${moveCoin.name} at ${an2}` +
        ` to move to ${an3}`
      );
    }
  },
  footman: {
    label: labelFootman
  },
  lancer: {
    isLegalLancerAttack: (player, paymentCoin, an1, an2, state) => {
      const directionIndex = Board.cubeDirectionIndex(an1, an2);
      const neighbor = Board.neighborInDirection(an2, directionIndex);
      return Selector.isEnemyUnitAt(player.id, neighbor, state);
    },
    isLegalLancerMove2: (player, paymentCoin, an1, an2, state) =>
      Selector.isUnitType(an1, UnitCoin.LANCER, state) &&
      Board.distance(an1, an2) === 2 &&
      Board.isStraightLine(an1, an2) &&
      Selector.isUnoccupied(Board.middleAN(an1, an2), state) &&
      Selector.isUnoccupied(an2, state),
    label: (moveState, state) => {
      const { moveStates, moveType: move, paymentCoinId } = moveState;
      const { an1, an2 } = moveStates[0];
      const { an2: an3, victimCoinId } = moveStates[1];
      const paymentCoin = Selector.coinType(paymentCoinId, state);
      const victimCoin = Selector.coinType(victimCoinId, state);
      return (
        `${move.name}: ${paymentCoin.name} at ${an1}` +
        ` moves to ${an2} and` +
        ` attacks ${victimCoin.name} at ${an3}`
      );
    }
  },
  lightCavalry: {
    isLegal: (player, paymentCoin, an1, an2, state) =>
      paymentCoin.coinKey === UnitCoin.LIGHT_CAVALRY &&
      Selector.isUnitType(an1, UnitCoin.LIGHT_CAVALRY, state) &&
      Board.distance(an1, an2) === 2 &&
      Selector.isUnoccupied(an2, state),
    label: (moveState, state) => {
      const { moveStates, moveType: move, paymentCoinId } = moveState;
      const { an1, an2 } = moveStates[0];
      const paymentCoin = Selector.coinType(paymentCoinId, state);
      return `${move.name}: ${paymentCoin.name} at ${an1} moves to ${an2}`;
    }
  },
  marshall: {
    // isLegal: MoveFunction.isLegal() used instead.
    label: (moveState, state) => {
      const { an1, moveStates, moveType: move, paymentCoinId } = moveState;
      const { an1: an2, an2: an3, victimCoinId } = moveStates[0];
      const paymentCoin = Selector.coinType(paymentCoinId, state);
      const attackCoin = Selector.coinTypeForUnit(an2, state);
      const victimCoin = Selector.coinType(victimCoinId, state);
      return (
        `${move.name}: ${paymentCoin.name} at ${an1} orders ${attackCoin.name} at ${an2}` +
        ` to attack ${victimCoin.name} at ${an3}`
      );
    }
  },
  royalGuard: {
    isLegal: (player, paymentCoin, an1, an2, state) =>
      Resolver.isRoyalCoin(paymentCoin.coinKey) &&
      Selector.isUnitType(an1, UnitCoin.ROYAL_GUARD, state) &&
      Board.isNeighbor(an1, an2, Selector.isTwoPlayer(state)) &&
      Selector.isUnoccupied(an2, state),
    label: (moveState, state) => {
      const { moveStates, moveType: move } = moveState;
      const { an1, an2 } = moveStates[0];
      const moveCoin = Selector.coinTypeForUnit(an1, state);
      return `${move.name}: ${moveCoin.name} at ${an1} moves to ${an2}`;
    }
  }
};

Tactic.isLegal = (moveState, state) => {
  const coinKey = Selector.coinKeyForUnit(moveState.an1, state);

  if (coinKey) {
    return Tactic[coinKey].isLegal(moveState, state);
  }

  return false;
};

Tactic.label = (moveState, state) => {
  const coinKey = Selector.coinKeyForUnit(moveState.an1, state);

  if (coinKey) {
    return Tactic[coinKey].label(moveState, state);
  }

  return `Error: No coin for unit at AN: ${moveState.an1}`;
};

Object.freeze(Tactic);

export default Tactic;
