/* eslint no-console: ["error", { allow: ["warn"] }] */

import Board from "../artifact/Board.js";
import Move from "../artifact/Move.js";
import Resolver from "../artifact/Resolver.js";
import UnitCoin from "../artifact/UnitCoin.js";

import MoveState from "../state/MoveState.js";
import Selector from "../state/Selector.js";

import MoveFunction from "./MoveFunction.js";

const MoveGenerator = {};

MoveGenerator.generateAttacks = (player, paymentCoin, state) => {
  const moveKey = Move.ATTACK;
  const playerId = player.id;
  const paymentCoinId = paymentCoin.id;
  const mm = MoveFunction[moveKey];
  const playerUnitANs = Selector.playerUnitANs(player.id, state);
  const answer = [];

  R.forEach(fromAN => {
    const neighbors = Board.neighbors(fromAN, Selector.isTwoPlayer(state));
    R.forEach(toAN => {
      if (mm.isLegal(player, paymentCoin, fromAN, toAN, state)) {
        const victimCoin = Selector.coinForUnit(toAN, state);
        answer.push(
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

  return answer;
};

MoveGenerator.generateBolsters = (player, paymentCoin, state) => {
  const moveKey = Move.BOLSTER;
  const playerId = player.id;
  const paymentCoinId = paymentCoin.id;
  const mm = MoveFunction[moveKey];
  const controlANs = Selector.controlANs(player.teamKey, state);
  const answer = [];

  R.forEach(an => {
    if (mm.isLegal(player, paymentCoin, an, state)) {
      answer.push(MoveState.create({ moveKey, playerId, paymentCoinId, an }));
    }
  }, controlANs);

  return answer;
};

MoveGenerator.generateClaimInitiatives = (player, paymentCoin, state) => {
  const moveKey = Move.CLAIM_INITIATIVE;
  const playerId = player.id;
  const paymentCoinId = paymentCoin.id;
  const mm = MoveFunction[moveKey];
  const answer = [];

  if (mm.isLegal(player, paymentCoin, state)) {
    answer.push(MoveState.create({ moveKey, playerId, paymentCoinId }));
  }

  return answer;
};

MoveGenerator.generateControls = (player, paymentCoin, state) => {
  const moveKey = Move.CONTROL;
  const playerId = player.id;
  const paymentCoinId = paymentCoin.id;
  const mm = MoveFunction[moveKey];
  const possibleControlANs = Selector.possibleControlANs(player.id, state);
  const answer = [];

  R.forEach(an => {
    if (mm.isLegal(player, paymentCoin, an, state)) {
      answer.push(MoveState.create({ moveKey, playerId, paymentCoinId, an }));
    }
  }, possibleControlANs);

  return answer;
};

MoveGenerator.generateDeploys = (player, paymentCoin, state) => {
  const moveKey = Move.DEPLOY;
  const playerId = player.id;
  const paymentCoinId = paymentCoin.id;
  const mm = MoveFunction[moveKey];
  const controlANs = Selector.controlANs(player.teamKey, state);
  const answer = [];

  R.forEach(an => {
    if (mm.isLegal(player, paymentCoin, an, state)) {
      answer.push(MoveState.create({ moveKey, playerId, paymentCoinId, an }));
    }
  }, controlANs);

  // Scout attribute.
  if (
    paymentCoin.coinKey === UnitCoin.SCOUT &&
    Selector.isInHand(player.id, paymentCoin.id, state) &&
    Resolver.isUnitCoin(paymentCoin.coinKey) &&
    Selector.canDeploy(paymentCoin.coinKey, state)
  ) {
    const neighborANs = Selector.teamAdjacentANs(player.teamKey, state);
    R.forEach(an => {
      if (Selector.isUnoccupied(an, state)) {
        answer.push(MoveState.create({ moveKey, playerId, paymentCoinId, an }));
      }
    }, neighborANs);
  }

  return answer;
};

MoveGenerator.generateMoveAUnits = (player, paymentCoin, state) => {
  const moveKey = Move.MOVE_A_UNIT;
  const playerId = player.id;
  const paymentCoinId = paymentCoin.id;
  const mm = MoveFunction[moveKey];
  const playerUnitANs = Selector.playerUnitANs(player.id, state);
  const answer = [];

  R.forEach(fromAN => {
    const neighbors = Board.neighbors(fromAN, Selector.isTwoPlayer(state));
    R.forEach(toAN => {
      if (mm.isLegal(player, paymentCoin, fromAN, toAN, state)) {
        answer.push(MoveState.create({ moveKey, playerId, paymentCoinId, fromAN, toAN }));
      }
    }, neighbors);
  }, playerUnitANs);

  return answer;
};

MoveGenerator.generatePasses = (player, paymentCoin, state) => {
  const moveKey = Move.PASS;
  const playerId = player.id;
  const paymentCoinId = paymentCoin.id;
  const mm = MoveFunction[moveKey];
  const answer = [];

  if (mm.isLegal(player, paymentCoin, state)) {
    answer.push(MoveState.create({ moveKey, playerId, paymentCoinId }));
  }

  return answer;
};

MoveGenerator.generateRecruits = (player, paymentCoin, state) => {
  const moveKey = Move.RECRUIT;
  const playerId = player.id;
  const paymentCoinId = paymentCoin.id;
  const mm = MoveFunction[moveKey];
  const tableau = Selector.tableau(player.id, state);
  const answer = [];

  R.forEach(cardKey => {
    const supply = Selector.supplyCoinsByType(player.id, cardKey, state);
    const recruitCoin = supply && supply.length > 0 ? supply[0] : undefined;
    if (recruitCoin && mm.isLegal(player, paymentCoin, recruitCoin, state)) {
      answer.push(
        MoveState.create({ moveKey, playerId, paymentCoinId, recruitCoinId: recruitCoin.id })
      );
    }
  }, tableau);

  return answer;
};

MoveGenerator.generateForCoin = (player, paymentCoin, state) => {
  const moves = Move.values();

  const reduceFunction = (accum, m) => {
    let newAccum = accum;
    const moveKey = m.key;

    switch (moveKey) {
      case Move.CLAIM_INITIATIVE:
        newAccum = R.concat(
          newAccum,
          MoveGenerator.generateClaimInitiatives(player, paymentCoin, state)
        );
        break;
      case Move.PASS:
        newAccum = R.concat(newAccum, MoveGenerator.generatePasses(player, paymentCoin, state));
        break;
      case Move.RECRUIT:
        newAccum = R.concat(newAccum, MoveGenerator.generateRecruits(player, paymentCoin, state));
        break;
      case Move.DEPLOY:
        newAccum = R.concat(newAccum, MoveGenerator.generateDeploys(player, paymentCoin, state));
        break;
      case Move.BOLSTER:
        newAccum = R.concat(newAccum, MoveGenerator.generateBolsters(player, paymentCoin, state));
        break;
      case Move.MOVE_A_UNIT:
        newAccum = R.concat(newAccum, MoveGenerator.generateMoveAUnits(player, paymentCoin, state));
        break;
      case Move.CONTROL:
        newAccum = R.concat(newAccum, MoveGenerator.generateControls(player, paymentCoin, state));
        break;
      case Move.ATTACK:
        newAccum = R.concat(newAccum, MoveGenerator.generateAttacks(player, paymentCoin, state));
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
