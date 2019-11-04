import Board from "../artifact/Board.js";
import DamageTarget from "../artifact/DamageTarget.js";
import Resolver from "../artifact/Resolver.js";
import UnitCoin from "../artifact/UnitCoin.js";

import ActionCreator from "../state/ActionCreator.js";
import Selector from "../state/Selector.js";

const executeAttack = (moveState, store) => {
  const { an, paymentCoinId, playerId, toAN } = moveState;
  const player = Selector.player(playerId, store.getState());
  const paymentCoinState = Selector.coin(paymentCoinId, store.getState());
  const paymentCoin = Resolver.coin(paymentCoinState.coinKey);
  const victimUnit = Selector.unit(toAN, store.getState());
  const victimCoinId = R.last(victimUnit);
  const victimCoinState = Selector.coin(victimCoinId, store.getState());
  const victimCoin = Resolver.coin(victimCoinState.coinKey);
  const victimPlayer = Selector.playerForCard(victimCoinState.coinKey, store.getState());
  store.dispatch(
    ActionCreator.setUserMessage(
      `Player ${player.name} uses his ${paymentCoin.name} at ${an}` +
        ` to attack ${victimCoin.name} at ${toAN}.`
    )
  );

  if (moveState.isBerserker) {
    store.dispatch(ActionCreator.boardToDiscardFaceup(playerId, an));
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
    store.dispatch(ActionCreator.boardToMorgue(victimPlayer.id, toAN));
  }

  // Pikeman attribute.
  if (victimCoin.key === UnitCoin.PIKEMAN) {
    store.dispatch(ActionCreator.boardToMorgue(playerId, an));
  }
};

const executeMoveAUnit = (moveState, store) => {
  const { an, paymentCoinId, playerId, toAN } = moveState;
  const player = Selector.player(playerId, store.getState());
  const paymentCoinState = Selector.coin(paymentCoinId, store.getState());
  const paymentCoin = Resolver.coin(paymentCoinState.coinKey);
  store.dispatch(
    ActionCreator.setUserMessage(`Player ${player.name} moves a ${paymentCoin.name} to ${toAN}.`)
  );

  if (moveState.isBerserker) {
    store.dispatch(ActionCreator.boardToDiscardFaceup(playerId, an));
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
  store.dispatch(ActionCreator.moveAUnit(playerId, an, toAN));
};

// /////////////////////////////////////////////////////////////////////////////////////////////////
const Tactic = {
  archer: {
    execute: executeAttack,
    isLegal: (player, paymentCoin, an, toAN, state) =>
      paymentCoin.coinKey === UnitCoin.ARCHER &&
      Selector.isUnitType(an, UnitCoin.ARCHER, state) &&
      Board.distance(an, toAN) === 2 &&
      Selector.isEnemyUnitAt(player.id, toAN, state),
    label: (moveState, state) => {
      const move = Resolver.move(moveState.moveKey);
      const paymentCoinState = state.coinInstances[moveState.paymentCoinId];
      const paymentCoin = Resolver.coin(paymentCoinState.coinKey);
      const victimCoinState = state.coinInstances[moveState.victimCoinId];
      const victimCoin = Resolver.coin(victimCoinState.coinKey);
      return (
        `${move.name}: ${paymentCoin.name} at ${moveState.an}` +
        ` attacks ${victimCoin.name} at ${moveState.toAN}`
      );
    }
  },
  cavalry: {
    execute: (/* moveState, store */) => {},
    isLegal: () => false,
    label: (/* moveState, coinInstances */) => "Tactic: cavalry"
  },
  crossbowman: {
    execute: (/* moveState, store */) => {},
    isLegal: () => false,
    label: (/* moveState, coinInstances */) => "Tactic: crossbowman"
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
    isLegal: (player, paymentCoin, an, toAN, state) =>
      paymentCoin.coinKey === UnitCoin.LIGHT_CAVALRY &&
      Selector.isUnitType(an, UnitCoin.LIGHT_CAVALRY, state) &&
      Board.distance(an, toAN) === 2 &&
      Selector.isUnoccupied(toAN, state),
    label: (moveState, state) => {
      const move = Resolver.move(moveState.moveKey);
      const paymentCoinState = state.coinInstances[moveState.paymentCoinId];
      const paymentCoin = Resolver.coin(paymentCoinState.coinKey);
      return `${move.name}: ${paymentCoin.name} at ${moveState.an} moves to ${moveState.toAN}`;
    }
  },
  marshall: {
    execute: (/* moveState, store */) => {},
    isLegal: () => false,
    label: (/* moveState, coinInstances */) => "Tactic: marshall"
  },
  royalGuard: {
    execute: (/* moveState, store */) => {},
    isLegal: () => false,
    label: (/* moveState, coinInstances */) => "Tactic: royalGuard"
  }
};

Tactic.execute = (moveState, store) => {
  const { paymentCoinId } = moveState;
  const paymentCoin = Selector.coin(paymentCoinId, store.getState());
  const { coinKey } = paymentCoin;
  Tactic[coinKey].execute(moveState, store);
};

Tactic.isLegal = (moveState, state) => {
  const coin = Selector.coinForUnit(moveState.an, state);
  const { coinKey } = coin;

  return Tactic[coinKey].isLegal(moveState, state);
};

Tactic.label = (moveState, state) => {
  const coin = Selector.coinForUnit(moveState.an, state);

  if (coin) {
    return Tactic[coin.coinKey].label(moveState, state);
  }

  return `Error: No coin for unit at AN: ${moveState.an}`;
};

Object.freeze(Tactic);

export default Tactic;
