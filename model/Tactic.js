import Board from "../artifact/Board.js";
import Resolver from "../artifact/Resolver.js";
import UnitCoin from "../artifact/UnitCoin.js";

import Selector from "../state/Selector.js";

const Tactic = {
  archer: {
    isLegal: (player, paymentCoin, an1, an2, state) =>
      paymentCoin.coinKey === UnitCoin.ARCHER &&
      Selector.isUnitType(an1, UnitCoin.ARCHER, state) &&
      Selector.canBeAttacked(an1, an2, state) &&
      Board.distance(an1, an2) === 2 &&
      Selector.isEnemyUnitAt(player.id, an2, state),
    label: (moveState, state) => {
      const { moveKey, moveStates, paymentCoinId } = moveState;
      const { an1, an2, victimCoinId } = moveStates[0];
      const move = Resolver.move(moveKey);
      const paymentCoinState = state.coinInstances[paymentCoinId];
      const paymentCoin = Resolver.coin(paymentCoinState.coinKey);
      const victimCoinState = state.coinInstances[victimCoinId];
      const victimCoin = Resolver.coin(victimCoinState.coinKey);
      return `${move.name}: ${paymentCoin.name} at ${an1} attacks ${victimCoin.name} at ${an2}`;
    }
  },
  cavalry: {
    // isLegal: MoveFunction.isLegal() used instead.
    label: (moveState, state) => {
      const { moveKey, moveStates, paymentCoinId } = moveState;
      const { an1, an2 } = moveStates[0];
      const { an2: an3, victimCoinId } = moveStates[1];
      const move = Resolver.move(moveKey);
      const paymentCoinState = state.coinInstances[paymentCoinId];
      const paymentCoin = Resolver.coin(paymentCoinState.coinKey);
      const victimCoinState = state.coinInstances[victimCoinId];
      const victimCoin = Resolver.coin(victimCoinState.coinKey);
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
      Board.distance(an1, an2) === 2 &&
      Board.isStraightLine(an1, an2) &&
      Selector.isUnoccupied(Board.middleAN(an1, an2), state) &&
      Selector.isEnemyUnitAt(player.id, an2, state),
    label: (moveState, state) => {
      const { moveKey, moveStates, paymentCoinId } = moveState;
      const { an1, an2, victimCoinId } = moveStates[0];
      const move = Resolver.move(moveKey);
      const paymentCoinState = state.coinInstances[paymentCoinId];
      const paymentCoin = Resolver.coin(paymentCoinState.coinKey);
      const victimCoinState = state.coinInstances[victimCoinId];
      const victimCoin = Resolver.coin(victimCoinState.coinKey);
      return `${move.name}: ${paymentCoin.name} at ${an1} attacks ${victimCoin.name} at ${an2}`;
    }
  },
  ensign: {
    isLegal: () => false,
    label: (/* moveState, coinInstances */) => "Tactic: ensign"
  },
  footman: {
    isLegal: () => false,
    label: (/* moveState, coinInstances */) => "Tactic: footman"
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
      const { moveKey, moveStates, paymentCoinId } = moveState;
      const { an1, an2 } = moveStates[0];
      const { an2: an3, victimCoinId } = moveStates[1];
      const move = Resolver.move(moveKey);
      const paymentCoinState = state.coinInstances[paymentCoinId];
      const paymentCoin = Resolver.coin(paymentCoinState.coinKey);
      const victimCoinState = state.coinInstances[victimCoinId];
      const victimCoin = Resolver.coin(victimCoinState.coinKey);
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
      const { moveKey, moveStates, paymentCoinId } = moveState;
      const { an1, an2 } = moveStates[0];
      const move = Resolver.move(moveKey);
      const paymentCoinState = state.coinInstances[paymentCoinId];
      const paymentCoin = Resolver.coin(paymentCoinState.coinKey);
      return `${move.name}: ${paymentCoin.name} at ${an1} moves to ${an2}`;
    }
  },
  marshall: {
    isLegal: () => false,
    label: (/* moveState, coinInstances */) => "Tactic: marshall"
  },
  royalGuard: {
    isLegal: (player, paymentCoin, an1, an2, state) =>
      Resolver.isRoyalCoin(paymentCoin.coinKey) &&
      Selector.isUnitType(an1, UnitCoin.ROYAL_GUARD, state) &&
      Board.isNeighbor(an1, an2, Selector.isTwoPlayer(state)) &&
      Selector.isUnoccupied(an2, state),
    label: (moveState, state) => {
      const { moveKey, moveStates } = moveState;
      const { an1, an2 } = moveStates[0];
      const move = Resolver.move(moveKey);
      const movementCoinState = Selector.coinForUnit(an1, state);
      const movementCoin = Resolver.coin(movementCoinState.coinKey);
      return `${move.name}: ${movementCoin.name} at ${an1} moves to ${an2}`;
    }
  }
};

Tactic.isLegal = (moveState, state) => {
  const coin = Selector.coinForUnit(moveState.an1, state);
  const { coinKey } = coin;

  return Tactic[coinKey].isLegal(moveState, state);
};

Tactic.label = (moveState, state) => {
  const coin = Selector.coinForUnit(moveState.an1, state);

  if (coin) {
    return Tactic[coin.coinKey].label(moveState, state);
  }

  return `Error: No coin for unit at AN: ${moveState.an1}`;
};

Object.freeze(Tactic);

export default Tactic;
