import Board from "../artifact/Board.js";
import DamageTarget from "../artifact/DamageTarget.js";
import Resolver from "../artifact/Resolver.js";
import UnitCoin from "../artifact/UnitCoin.js";

import ActionCreator from "../state/ActionCreator.js";
import Selector from "../state/Selector.js";

const executeAttack = (moveState, store) => {
  const { an1, an2, paymentCoinId, playerId } = moveState;
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

const executeMoveAUnit = (moveState, store) => {
  const { an1, an2, paymentCoinId, playerId } = moveState;
  const player = Selector.player(playerId, store.getState());
  const movementCoinState = Selector.coinForUnit(an1, store.getState());
  const movementCoin = Resolver.coin(movementCoinState.coinKey);
  store.dispatch(
    ActionCreator.setUserMessage(`Player ${player.name} moves a ${movementCoin.name} to ${an2}.`)
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

// /////////////////////////////////////////////////////////////////////////////////////////////////
const Tactic = {
  archer: {
    execute: executeAttack,
    isLegal: (player, paymentCoin, an1, an2, state) =>
      paymentCoin.coinKey === UnitCoin.ARCHER &&
      Selector.isUnitType(an1, UnitCoin.ARCHER, state) &&
      Board.distance(an1, an2) === 2 &&
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
    }
  },
  cavalry: {
    execute: (/* moveState, store */) => {},
    isLegal: () => false,
    label: (/* moveState, coinInstances */) => "Tactic: cavalry"
  },
  crossbowman: {
    execute: executeAttack,
    isLegal: (player, paymentCoin, an1, an2, state) =>
      paymentCoin.coinKey === UnitCoin.CROSSBOWMAN &&
      Selector.isUnitType(an1, UnitCoin.CROSSBOWMAN, state) &&
      Board.distance(an1, an2) === 2 &&
      Board.isStraightLine(an1, an2) &&
      Selector.isUnoccupied(Board.middleAN(an1, an2), state) &&
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
    }
  },
  ensign: {
    execute: (/* moveState, store */) => {},
    isLegal: () => false,
    label: (/* moveState, coinInstances */) => "Tactic: ensign"
  },
  footman: {
    execute: (/* moveState, store */) => {},
    isLegal: () => false,
    label: (/* moveState, coinInstances */) => "Tactic: footman"
  },
  lancer: {
    execute: (/* moveState, store */) => {},
    isLegal: () => false,
    label: (/* moveState, coinInstances */) => "Tactic: lancer"
  },
  lightCavalry: {
    execute: executeMoveAUnit,
    isLegal: (player, paymentCoin, an1, an2, state) =>
      paymentCoin.coinKey === UnitCoin.LIGHT_CAVALRY &&
      Selector.isUnitType(an1, UnitCoin.LIGHT_CAVALRY, state) &&
      Board.distance(an1, an2) === 2 &&
      Selector.isUnoccupied(an2, state),
    label: (moveState, state) => {
      const move = Resolver.move(moveState.moveKey);
      const paymentCoinState = state.coinInstances[moveState.paymentCoinId];
      const paymentCoin = Resolver.coin(paymentCoinState.coinKey);
      return `${move.name}: ${paymentCoin.name} at ${moveState.an1} moves to ${moveState.an2}`;
    }
  },
  marshall: {
    execute: (/* moveState, store */) => {},
    isLegal: () => false,
    label: (/* moveState, coinInstances */) => "Tactic: marshall"
  },
  royalGuard: {
    execute: executeMoveAUnit,
    isLegal: (player, paymentCoin, an1, an2, state) =>
      Resolver.isRoyalCoin(paymentCoin.coinKey) &&
      Selector.isUnitType(an1, UnitCoin.ROYAL_GUARD, state) &&
      Board.isNeighbor(an1, an2, Selector.isTwoPlayer(state)) &&
      Selector.isUnoccupied(an2, state),
    label: (moveState, state) => {
      const { an1, moveKey } = moveState;
      const move = Resolver.move(moveKey);
      const movementCoinState = Selector.coinForUnit(an1, state);
      const movementCoin = Resolver.coin(movementCoinState.coinKey);
      return `${move.name}: ${movementCoin.name} at ${moveState.an1} moves to ${moveState.an2}`;
    }
  }
};

Tactic.execute = (moveState, store) => {
  const coin = Selector.coinForUnit(moveState.an1, store.getState());
  const { coinKey } = coin;
  Tactic[coinKey].execute(moveState, store);
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
