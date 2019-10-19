/* eslint no-console: ["error", { allow: ["warn"] }] */

import Board from "../artifact/Board.js";
import Move from "../artifact/Move.js";
import Resolver from "../artifact/Resolver.js";
import UnitCoin from "../artifact/UnitCoin.js";

import MoveState from "../state/MoveState.js";
import Selector from "../state/Selector.js";

import MoveFunction from "./MoveFunction.js";

const MoveGenerator = {};

MoveGenerator.generateForCoin = (player, paymentCoin, state) => {
  const moves = Move.values();

  const playerId = player.id;
  const paymentCoinId = paymentCoin.id;

  let controlANs;
  let neighbors;
  let playerUnitANs;
  let possibleControlANs;
  let supply;
  let tableau;

  const reduceFunction = (accum, m) => {
    const newAccum = accum;
    const moveKey = m.key;
    const mm = MoveFunction[moveKey];

    switch (moveKey) {
      case Move.CLAIM_INITIATIVE:
      case Move.PASS:
        if (mm.isLegal(player, paymentCoin, state)) {
          newAccum.push(MoveState.create({ moveKey, playerId, paymentCoinId }));
        }
        break;
      case Move.RECRUIT:
        tableau = Selector.tableau(player.id, state);
        R.forEach(cardKey => {
          supply = Selector.supplyCoinsByType(player.id, cardKey, state);
          const recruitCoin = supply && supply.length > 0 ? supply[0] : undefined;
          if (recruitCoin && mm.isLegal(player, paymentCoin, recruitCoin, state)) {
            newAccum.push(
              MoveState.create({ moveKey, playerId, paymentCoinId, recruitCoinId: recruitCoin.id })
            );
          }
        }, tableau);
        break;
      case Move.DEPLOY:
        controlANs = Selector.controlANs(player.teamKey, state);
        R.forEach(an => {
          if (mm.isLegal(player, paymentCoin, an, state)) {
            newAccum.push(MoveState.create({ moveKey, playerId, paymentCoinId, an }));
          }
        }, controlANs);
        if (
          paymentCoin.coinKey === UnitCoin.SCOUT &&
          Selector.isInHand(player.id, paymentCoin.id, state) &&
          Resolver.isUnitCoin(paymentCoin.coinKey) &&
          Selector.canDeploy(paymentCoin.coinKey, state)
        ) {
          // Scout attribute.
          const neighborANs = Selector.teamAdjacentANs(player.teamKey, state);
          R.forEach(an => {
            if (Selector.isUnoccupied(an, state)) {
              newAccum.push(MoveState.create({ moveKey, playerId, paymentCoinId, an }));
            }
          }, neighborANs);
        }
        break;
      case Move.BOLSTER:
        controlANs = Selector.controlANs(player.teamKey, state);
        R.forEach(an => {
          if (mm.isLegal(player, paymentCoin, an, state)) {
            newAccum.push(MoveState.create({ moveKey, playerId, paymentCoinId, an }));
          }
        }, controlANs);
        break;
      case Move.MOVE_A_UNIT:
        playerUnitANs = Selector.playerUnitANs(player.id, state);
        R.forEach(fromAN => {
          neighbors = Board.neighbors(fromAN, Selector.isTwoPlayer(state));
          R.forEach(toAN => {
            if (mm.isLegal(player, paymentCoin, fromAN, toAN, state)) {
              newAccum.push(MoveState.create({ moveKey, playerId, paymentCoinId, fromAN, toAN }));
            }
          }, neighbors);
        }, playerUnitANs);
        break;
      case Move.CONTROL:
        possibleControlANs = Selector.possibleControlANs(player.id, state);
        R.forEach(an => {
          if (mm.isLegal(player, paymentCoin, an, state)) {
            newAccum.push(MoveState.create({ moveKey, playerId, paymentCoinId, an }));
          }
        }, possibleControlANs);
        break;
      case Move.ATTACK:
        playerUnitANs = Selector.playerUnitANs(player.id, state);
        R.forEach(fromAN => {
          neighbors = Board.neighbors(fromAN, Selector.isTwoPlayer(state));
          R.forEach(toAN => {
            if (mm.isLegal(player, paymentCoin, fromAN, toAN, state)) {
              const victimCoin = Selector.coinForUnit(toAN, state);
              newAccum.push(
                MoveState.create({
                  moveKey,
                  playerId,
                  paymentCoinId,
                  fromAN,
                  toAN,
                  victimCoinId: victimCoin.id
                })
              );
            }
          }, neighbors);
        }, playerUnitANs);
        break;
      case Move.TACTIC:
        break;
      default:
        console.warn(`Unknown move.key: ${moveKey}`);
    }

    return newAccum;
  };

  return R.reduce(reduceFunction, [], moves);
};

MoveGenerator.generate = (player, state) => {
  const hand = Selector.hand(player.id, state);
  const reduceFunction = (accum, paymentCoinId) => {
    const paymentCoin = Selector.coin(paymentCoinId, state);
    return R.concat(MoveGenerator.generateForCoin(player, paymentCoin, state), accum);
  };

  return R.reduce(reduceFunction, [], hand);
};

Object.freeze(MoveGenerator);

export default MoveGenerator;
