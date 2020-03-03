/* eslint no-console: ["error", { allow: ["warn"] }] */

import Move from "../artifact/Move.js";

import ActionCreator from "../state/ActionCreator.js";
import MoveState from "../state/MoveState.js";
import Selector from "../state/Selector.js";

import MCTS from "../mcts/MonteCarloTreeSearch.js";
import Node from "../mcts/Node.js";

import RandomPlayerStrategy from "./RandomPlayerStrategy.js";
import SimplePlayerStrategy from "./SimplePlayerStrategy.js";

const MCTSPlayerStrategy = {};

const DELAY = 1000;
const ROUND_LIMIT = 100;
const ALLOWED_TIME = 10000;

MCTSPlayerStrategy.chooseDamageTarget = (damageTargets, store, delay = DELAY) =>
  SimplePlayerStrategy.chooseDamageTarget(damageTargets, store, delay);

MCTSPlayerStrategy.chooseMove = (moveStates, store, delay = DELAY) =>
  new Promise(resolve => {
    if (moveStates.length <= 1) {
      RandomPlayerStrategy.delayedResolve(moveStates[0], resolve, delay);
    } else {
      const mctsRoot = Selector.mctsRoot(store.getState());
      const paymentCoinId = store.getState().currentPaymentCoinId;
      const filterFunction = child => child.state.currentPaymentCoinId === paymentCoinId;
      const paymentChildren = R.filter(filterFunction, mctsRoot.children);

      if (!paymentChildren || paymentChildren.length === 0) {
        console.warn(`paymentCoinId = ${paymentCoinId}`);
        console.warn(`mctsRoot.children = ${mctsRoot.children}`);
        console.warn(`paymentChildren = ${paymentChildren}`);
      }

      if (paymentChildren.length > 0) {
        const paymentChildNode = paymentChildren[0];

        if (!paymentChildNode.children) {
          console.warn(`paymentChildNode.children = ${paymentChildNode.children}`);
        }

        const bestChildNode = Node.best(R.prop("playoutCount"), paymentChildNode.children);
        const bestMove = Selector.currentMove(bestChildNode.state);
        resolve(bestMove);
      } else {
        // Pass
        const moveKey = Move.PASS;
        const playerId = store.getState().currentPlayerId;
        const moveState = MoveState.create({ moveKey, playerId, paymentCoinId });
        resolve(moveState);
      }
    }
  });

MCTSPlayerStrategy.choosePaymentCoin = (
  coinIds,
  store,
  delay,
  roundLimit = ROUND_LIMIT,
  allowedTime = ALLOWED_TIME
) =>
  new Promise(resolve => {
    setTimeout(() => {
      MCTS.execute(coinIds, store.getState(), roundLimit, allowedTime).then(
        ({ paymentCoinId, mctsRoot }) => {
          store.dispatch(ActionCreator.setMctsRoot(mctsRoot));
          resolve(paymentCoinId);
        }
      );
    }, 100);
  });

Object.freeze(MCTSPlayerStrategy);

export default MCTSPlayerStrategy;
