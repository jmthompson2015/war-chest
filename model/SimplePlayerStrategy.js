import ArrayUtils from "../util/ArrayUtilities.js";

import DamageTarget from "../artifact/DamageTarget.js";
import Move from "../artifact/Move.js";
import Resolver from "../artifact/Resolver.js";

import Selector from "../state/Selector.js";

import RandomPlayerStrategy from "./RandomPlayerStrategy.js";

const SimplePlayerStrategy = {};

const DELAY = 1000;
const SUPPLY = Resolver.damageTarget(DamageTarget.SUPPLY);

SimplePlayerStrategy.chooseDamageTarget = (damageTargets, store, delay = DELAY) =>
  new Promise(resolve => {
    const answer = damageTargets.length <= 1 ? damageTargets[0] : SUPPLY;
    RandomPlayerStrategy.delayedResolve(answer, resolve, delay);
  });

SimplePlayerStrategy.chooseMove = (moveStates, store, delay = DELAY) =>
  new Promise(resolve => {
    const startTime = Date.now();
    let answer;

    if (moveStates.length <= 1) {
      [answer] = moveStates;
    } else {
      const priorityMoveKeys = [
        Move.CONTROL,
        Move.ATTACK,
        Move.DEPLOY,
        Move.TACTIC,
        Move.MOVE_A_UNIT
      ];
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

    const elapsedTime = Date.now() - startTime;
    const remainingTime = delay - elapsedTime;
    RandomPlayerStrategy.delayedResolve(answer, resolve, remainingTime);
  });

SimplePlayerStrategy.choosePaymentCoin = (coinIds, store, delay = DELAY) =>
  new Promise(resolve => {
    const startTime = Date.now();
    let answer;

    if (coinIds.length <= 1) {
      [answer] = coinIds;
    } else {
      const state = store.getState();
      const currentPlayer = Selector.currentPlayer(state);
      const tokenANs = Object.keys(Selector.anToTokens(state));

      // Choose a coin that has a match on the board.
      const boardCoinKeys = R.uniq(R.map(an1 => Selector.coinKeyForUnit(an1, state), tokenANs));
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

    const elapsedTime = Date.now() - startTime;
    const remainingTime = delay - elapsedTime;
    RandomPlayerStrategy.delayedResolve(answer, resolve, remainingTime);
  });

Object.freeze(SimplePlayerStrategy);

export default SimplePlayerStrategy;
