/* eslint no-console: ["error", { allow: ["warn"] }] */

import Move from "../artifact/Move.js";
import Resolver from "../artifact/Resolver.js";

import MoveState from "../state/MoveState.js";
import Selector from "../state/Selector.js";

import MoveFunction from "./MoveFunction.js";

const MoveGenerator = {};

MoveGenerator.generateForCoin = (player, paymentCoin, state) => {
  const moves = Move.values();

  let controlANs;
  let possibleControlANs;
  let supply;
  let uniqueSupply;

  const reduceFunction = (accum, m) => {
    const newAccum = accum;
    const mm = MoveFunction[m.key];

    switch (m.key) {
      case Move.CLAIM_INITIATIVE:
      case Move.PASS:
        if (mm.isLegal(player, paymentCoin, state)) {
          newAccum.push(
            MoveState.create({
              moveKey: m.key,
              playerId: player.id,
              paymentCoinKey: paymentCoin.key
            })
          );
        }
        break;
      case Move.RECRUIT:
        supply = Selector.supply(player.id, state);
        uniqueSupply = R.uniq(supply);
        R.forEach(recruitCoinKey => {
          const recruitCoin = Resolver.coin(recruitCoinKey);
          if (mm.isLegal(player, paymentCoin, recruitCoin, state)) {
            newAccum.push(
              MoveState.create({
                moveKey: m.key,
                playerId: player.id,
                paymentCoinKey: paymentCoin.key,
                recruitCoinKey: recruitCoin.key
              })
            );
          }
        }, uniqueSupply);
        break;
      case Move.DEPLOY:
      case Move.BOLSTER:
        controlANs = Selector.controlANs(player.teamKey, state);
        R.forEach(an => {
          if (mm.isLegal(player, paymentCoin, an, state)) {
            newAccum.push(
              MoveState.create({
                moveKey: m.key,
                playerId: player.id,
                paymentCoinKey: paymentCoin.key,
                an
              })
            );
          }
        }, controlANs);
        break;
      case Move.MOVE_A_UNIT:
        // FIXME: need adjacent locations.
        break;
      case Move.CONTROL:
        possibleControlANs = Selector.possibleControlANs(player.id, state);
        R.forEach(an => {
          if (mm.isLegal(player, paymentCoin, an, state)) {
            newAccum.push(
              MoveState.create({
                moveKey: m.key,
                playerId: player.id,
                paymentCoinKey: paymentCoin.key,
                an
              })
            );
          }
        }, possibleControlANs);
        break;
      case Move.ATTACK:
        // FIXME: need adjacent locations.
        break;
      case Move.TACTIC:
        break;
      default:
        console.warn(`Unknown move.key: ${m.key}`);
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
