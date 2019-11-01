import ArrayUtils from "../util/ArrayUtilities.js";

import DamageTarget from "../artifact/DamageTarget.js";
import Move from "../artifact/Move.js";
import Resolver from "../artifact/Resolver.js";

import Selector from "../state/Selector.js";

const SimplePlayerStrategy = {};

const DELAY = 1000;

SimplePlayerStrategy.chooseDamageTarget = (damageTargets, store, delay = DELAY) =>
  new Promise(resolve => {
    let answer;

    if (damageTargets.length === 1) {
      [answer] = damageTargets;
    } else {
      const supply = Resolver.damageTarget(DamageTarget.SUPPLY);
      answer = damageTargets.includes(supply) ? supply : undefined;
    }

    if (R.isNil(answer)) {
      answer = ArrayUtils.randomElement(damageTargets);
    }

    setTimeout(() => {
      resolve(answer);
    }, delay);
  });

SimplePlayerStrategy.chooseMove = (moveStates, store, delay = DELAY) =>
  new Promise(resolve => {
    let answer;

    if (moveStates.length === 1) {
      [answer] = moveStates;
    } else {
      const priorityMoveKeys = [Move.CONTROL, Move.ATTACK, Move.DEPLOY, Move.MOVE_A_UNIT];
      let i = 0;

      while (R.isNil(answer) && i < priorityMoveKeys.length) {
        const priority = priorityMoveKeys[i];
        const matchingMoveStates = R.filter(m => m.moveKey === priority, moveStates);
        answer = ArrayUtils.randomElement(matchingMoveStates);
        i += 1;
      }
    }

    if (R.isNil(answer)) {
      answer = ArrayUtils.randomElement(moveStates);
    }

    setTimeout(() => {
      resolve(answer);
    }, delay);
  });

SimplePlayerStrategy.choosePaymentCoin = (coinIds, store, delay = DELAY) =>
  new Promise(resolve => {
    let answer;

    if (coinIds.length === 1) {
      [answer] = coinIds;
    } else {
      const state = store.getState();
      const currentPlayer = Selector.currentPlayer(state);
      const tokenANs = Object.keys(Selector.anToTokens(state));

      // Choose a coin that has a match on the board.
      const boardCoins = R.map(an => Selector.coinForUnit(an, state), tokenANs);
      const boardCoinKeys = R.uniq(R.map(c => c.coinKey, boardCoins));
      const handCoins = Selector.coins(Selector.hand(currentPlayer.id, state), state);
      const handCoinKeys = R.uniq(R.map(c => c.coinKey, handCoins));
      const targetCoinKeys = R.intersection(boardCoinKeys, handCoinKeys);

      if (targetCoinKeys.length > 0) {
        const coinKey = ArrayUtils.randomElement(targetCoinKeys);
        const matchingCoins = R.filter(c => c.coinKey === coinKey, handCoins);

        if (matchingCoins.length > 0) {
          const coin = ArrayUtils.randomElement(matchingCoins);
          answer = coin ? coin.id : undefined;
        }
      }
    }

    if (R.isNil(answer)) {
      answer = ArrayUtils.randomElement(coinIds);
    }

    setTimeout(() => {
      resolve(answer);
    }, delay);
  });

Object.freeze(SimplePlayerStrategy);

export default SimplePlayerStrategy;
