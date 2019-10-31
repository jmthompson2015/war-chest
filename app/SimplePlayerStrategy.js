import DamageTarget from "../artifact/DamageTarget.js";
import Move from "../artifact/Move.js";
import Resolver from "../artifact/Resolver.js";

import Selector from "../state/Selector.js";

import ArrayUtils from "../util/ArrayUtilities.js";

const SimplePlayerStrategy = {};

const DELAY = 1000;

SimplePlayerStrategy.chooseDamageTarget = (damageTargets, store, delay = DELAY) =>
  new Promise(resolve => {
    const supply = Resolver.damageTarget(DamageTarget.SUPPLY);
    const damageTarget = damageTargets.includes(supply)
      ? supply
      : ArrayUtils.randomElement(damageTargets);

    setTimeout(() => {
      resolve(damageTarget);
    }, delay);
  });

SimplePlayerStrategy.chooseMove = (moveStates, store, delay = DELAY) =>
  new Promise(resolve => {
    const priorityMoveKeys = [Move.CONTROL, Move.ATTACK, Move.DEPLOY, Move.MOVE_A_UNIT];
    let moveState;
    let i = 0;

    while (R.isNil(moveState) && i < priorityMoveKeys.length) {
      const priority = priorityMoveKeys[i];
      const matchingMoveStates = R.filter(m => m.moveKey === priority, moveStates);
      moveState = ArrayUtils.randomElement(matchingMoveStates);
      i += 1;
    }

    if (R.isNil(moveState)) {
      moveState = ArrayUtils.randomElement(moveStates);
    }

    setTimeout(() => {
      resolve(moveState);
    }, delay);
  });

SimplePlayerStrategy.choosePaymentCoin = (coinIds, store, delay = DELAY) =>
  new Promise(resolve => {
    const state = store.getState();
    const currentPlayer = Selector.currentPlayer(state);
    const tokenANs = Object.keys(Selector.anToTokens(state));

    // Choose a coin that has a match on the board.
    const boardCoins = R.map(an => Selector.coinForUnit(an, state), tokenANs);
    const boardCoinKeys = R.uniq(R.map(c => c.coinKey, boardCoins));
    const handCoins = Selector.coins(Selector.hand(currentPlayer.id, state), state);
    const handCoinKeys = R.uniq(R.map(c => c.coinKey, handCoins));
    const targetCoinKeys = R.intersection(boardCoinKeys, handCoinKeys);
    let coinId;

    if (targetCoinKeys.length > 0) {
      const coinKey = ArrayUtils.randomElement(targetCoinKeys);
      const matchingCoins = R.filter(c => c.coinKey === coinKey, handCoins);

      if (matchingCoins.length > 0) {
        const coin = ArrayUtils.randomElement(matchingCoins);
        coinId = coin ? coin.id : undefined;
      }
    }

    if (R.isNil(coinId)) {
      coinId = ArrayUtils.randomElement(coinIds);
    }

    setTimeout(() => {
      resolve(coinId);
    }, delay);
  });

Object.freeze(SimplePlayerStrategy);

export default SimplePlayerStrategy;
