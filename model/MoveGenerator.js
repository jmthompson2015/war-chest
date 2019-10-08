/* eslint no-console: ["error", { allow: ["warn"] }] */

import Board from "../artifact/Board.js";
import Move from "../artifact/Move.js";
import Resolver from "../artifact/Resolver.js";

import MoveState from "../state/MoveState.js";
import Selector from "../state/Selector.js";

import MoveFunction from "./MoveFunction.js";

const MoveGenerator = {};

MoveGenerator.generateForCoin = (player, paymentCoin, state) => {
  const moves = Move.values();

  const playerId = player.id;
  const paymentCoinKey = paymentCoin.key;

  let controlANs;
  let neighbors;
  let playerUnitANs;
  let possibleControlANs;
  let supply;
  let uniqueSupply;

  const reduceFunction = (accum, m) => {
    const newAccum = accum;
    const moveKey = m.key;
    const mm = MoveFunction[moveKey];

    switch (moveKey) {
      case Move.CLAIM_INITIATIVE:
      case Move.PASS:
        if (mm.isLegal(player, paymentCoin, state)) {
          newAccum.push(MoveState.create({ moveKey, playerId, paymentCoinKey }));
        }
        break;
      case Move.RECRUIT:
        supply = Selector.supply(player.id, state);
        uniqueSupply = R.uniq(supply);
        R.forEach(recruitCoinKey => {
          const recruitCoin = Resolver.coin(recruitCoinKey);
          if (mm.isLegal(player, paymentCoin, recruitCoin, state)) {
            newAccum.push(MoveState.create({ moveKey, playerId, paymentCoinKey, recruitCoinKey }));
          }
        }, uniqueSupply);
        break;
      case Move.DEPLOY:
      case Move.BOLSTER:
        controlANs = Selector.controlANs(player.teamKey, state);
        R.forEach(an => {
          if (mm.isLegal(player, paymentCoin, an, state)) {
            newAccum.push(MoveState.create({ moveKey, playerId, paymentCoinKey, an }));
          }
        }, controlANs);
        break;
      case Move.MOVE_A_UNIT:
        playerUnitANs = Selector.playerUnitANs(player.id, state);
        R.forEach(fromAN => {
          neighbors = Board.neighbors(fromAN, Selector.isTwoPlayer(state));
          R.forEach(toAN => {
            if (mm.isLegal(player, paymentCoin, fromAN, toAN, state)) {
              newAccum.push(MoveState.create({ moveKey, playerId, paymentCoinKey, fromAN, toAN }));
            }
          }, neighbors);
        }, playerUnitANs);
        break;
      case Move.CONTROL:
        possibleControlANs = Selector.possibleControlANs(player.id, state);
        R.forEach(an => {
          if (mm.isLegal(player, paymentCoin, an, state)) {
            newAccum.push(MoveState.create({ moveKey, playerId, paymentCoinKey, an }));
          }
        }, possibleControlANs);
        break;
      case Move.ATTACK:
        playerUnitANs = Selector.playerUnitANs(player.id, state);
        R.forEach(fromAN => {
          neighbors = Board.neighbors(fromAN, Selector.isTwoPlayer(state));
          R.forEach(toAN => {
            if (mm.isLegal(player, paymentCoin, fromAN, toAN, state)) {
              newAccum.push(MoveState.create({ moveKey, playerId, paymentCoinKey, fromAN, toAN }));
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
  const reduceFunction = (accum, paymentCoinKey) => {
    const paymentCoin = Resolver.coin(paymentCoinKey);
    return R.concat(MoveGenerator.generateForCoin(player, paymentCoin, state), accum);
  };

  return R.reduce(reduceFunction, [], hand);
};

Object.freeze(MoveGenerator);

export default MoveGenerator;
