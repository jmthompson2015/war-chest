/* eslint no-console: ["error", { allow: ["warn"] }] */

import Board from "../artifact/Board.js";
import Move from "../artifact/Move.js";
import Resolver from "../artifact/Resolver.js";
import UnitCoin from "../artifact/UnitCoin.js";

import MoveState from "../state/MoveState.js";
import Selector from "../state/Selector.js";

import MoveFunction from "./MoveFunction.js";
import Tactic from "./Tactic.js";

const MoveGenerator = {};

MoveGenerator.generateAttacks = (player, paymentCoin, state) => {
  const moveKey = Move.ATTACK;
  const playerId = player.id;
  const paymentCoinId = paymentCoin.id;
  const mm = MoveFunction[moveKey];
  const playerUnitANs = Selector.playerUnitANs(player.id, state);
  const reduceFunction2 = an1 => (accum2, an2) => {
    if (mm.isLegal(player, paymentCoin, an1, an2, state)) {
      const victimCoin = Selector.coinForUnit(an2, state);
      const victimCoinId = victimCoin.id;
      const moveState = MoveState.create({
        moveKey,
        playerId,
        paymentCoinId,
        an1,
        an2,
        victimCoinId
      });
      return R.append(moveState, accum2);
    }
    return accum2;
  };
  const reduceFunction1 = (accum1, an1) => {
    const neighbors = Board.neighbors(an1, Selector.isTwoPlayer(state));
    const accum2 = R.reduce(reduceFunction2(an1), [], neighbors);
    return R.concat(accum1, accum2);
  };

  return R.reduce(reduceFunction1, [], playerUnitANs);
};

MoveGenerator.generateBolsters = (player, paymentCoin, state) => {
  const moveKey = Move.BOLSTER;
  const playerId = player.id;
  const paymentCoinId = paymentCoin.id;
  const mm = MoveFunction[moveKey];
  const controlANs = Selector.controlANs(player.teamKey, state);
  const reduceFunction = (accum, an1) => {
    if (mm.isLegal(player, paymentCoin, an1, state)) {
      const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, an1 });
      return R.append(moveState, accum);
    }
    return accum;
  };

  return R.reduce(reduceFunction, [], controlANs);
};

MoveGenerator.generateClaimInitiatives = (player, paymentCoin, state) => {
  const moveKey = Move.CLAIM_INITIATIVE;
  const playerId = player.id;
  const paymentCoinId = paymentCoin.id;
  const mm = MoveFunction[moveKey];
  const answer = [];

  if (mm.isLegal(player, paymentCoin, state)) {
    const moveState = MoveState.create({ moveKey, playerId, paymentCoinId });
    answer.push(moveState);
  }

  return answer;
};

MoveGenerator.generateControls = (player, paymentCoin, state) => {
  const moveKey = Move.CONTROL;
  const playerId = player.id;
  const paymentCoinId = paymentCoin.id;
  const mm = MoveFunction[moveKey];
  const possibleControlANs = Selector.possibleControlANs(player.id, state);
  const reduceFunction = (accum, an1) => {
    if (mm.isLegal(player, paymentCoin, an1, state)) {
      const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, an1 });
      return R.append(moveState, accum);
    }
    return accum;
  };

  return R.reduce(reduceFunction, [], possibleControlANs);
};

MoveGenerator.generateDeploys = (player, paymentCoin, state) => {
  const moveKey = Move.DEPLOY;
  const playerId = player.id;
  const paymentCoinId = paymentCoin.id;
  const mm = MoveFunction[moveKey];
  const controlANs = Selector.controlANs(player.teamKey, state);
  const reduceFunction1 = (accum, an1) => {
    if (mm.isLegal(player, paymentCoin, an1, state)) {
      const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, an1 });
      return R.append(moveState, accum);
    }
    return accum;
  };
  let answer = R.reduce(reduceFunction1, [], controlANs);

  // Scout attribute.
  if (
    paymentCoin.coinKey === UnitCoin.SCOUT &&
    Selector.isInHand(player.id, paymentCoin.id, state) &&
    Resolver.isUnitCoin(paymentCoin.coinKey) &&
    Selector.canDeploy(paymentCoin.coinKey, state)
  ) {
    const teamAdjacentANs = Selector.teamAdjacentANs(player.teamKey, state);
    const neighborANs = R.without(controlANs, teamAdjacentANs);
    const reduceFunction2 = (accum, an1) => {
      if (Selector.isUnoccupied(an1, state)) {
        const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, an1 });
        return R.append(moveState, accum);
      }
      return accum;
    };
    const answer2 = R.reduce(reduceFunction2, [], neighborANs);
    answer = R.concat(answer, answer2);
  }

  return answer;
};

MoveGenerator.generateMoveAUnits = (player, paymentCoin, state) => {
  const moveKey = Move.MOVE_A_UNIT;
  const playerId = player.id;
  const paymentCoinId = paymentCoin.id;
  const mm = MoveFunction[moveKey];
  const playerUnitANs = Selector.playerUnitANs(player.id, state);
  const reduceFunction2 = an1 => (accum2, an2) => {
    if (mm.isLegal(player, paymentCoin, an1, an2, state)) {
      const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, an1, an2 });
      return R.append(moveState, accum2);
    }
    return accum2;
  };
  const reduceFunction1 = (accum1, an1) => {
    const neighbors = Board.neighbors(an1, Selector.isTwoPlayer(state));
    const accum2 = R.reduce(reduceFunction2(an1), [], neighbors);
    return R.concat(accum1, accum2);
  };

  return R.reduce(reduceFunction1, [], playerUnitANs);
};

MoveGenerator.generatePasses = (player, paymentCoin, state) => {
  const moveKey = Move.PASS;
  const playerId = player.id;
  const paymentCoinId = paymentCoin.id;
  const mm = MoveFunction[moveKey];
  const answer = [];

  if (mm.isLegal(player, paymentCoin, state)) {
    const moveState = MoveState.create({ moveKey, playerId, paymentCoinId });
    answer.push(moveState);
  }

  return answer;
};

MoveGenerator.generateRecruits = (player, paymentCoin, state) => {
  const moveKey = Move.RECRUIT;
  const playerId = player.id;
  const paymentCoinId = paymentCoin.id;
  const mm = MoveFunction[moveKey];
  const tableau = Selector.tableau(player.id, state);
  const reduceFunction = (accum, cardKey) => {
    const supply = Selector.supplyCoinsByType(player.id, cardKey, state);
    const recruitCoin = supply && supply.length > 0 ? supply[0] : undefined;
    if (recruitCoin && mm.isLegal(player, paymentCoin, recruitCoin, state)) {
      const recruitCoinId = recruitCoin.id;
      const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, recruitCoinId });
      return R.append(moveState, accum);
    }
    return accum;
  };

  return R.reduce(reduceFunction, [], tableau);
};

MoveGenerator.generateTactics = (player, paymentCoin, state) => {
  const moveKey = Move.TACTIC;
  const playerId = player.id;
  const paymentCoinId = paymentCoin.id;
  const playerUnitANs = Selector.playerUnitANs(player.id, state);
  const reduceFunction2 = (tt, an1) => (accum2, an2) => {
    if (tt.isLegal(player, paymentCoin, an1, an2, state)) {
      const victimCoin = Selector.coinForUnit(an2, state);
      const victimCoinId = victimCoin ? victimCoin.id : undefined;
      const moveState = MoveState.create({
        moveKey,
        playerId,
        paymentCoinId,
        an1,
        an2,
        victimCoinId
      });
      return R.append(moveState, accum2);
    }
    return accum2;
  };
  const reduceFunction1 = (accum1, an1) => {
    const { coinKey } = Selector.coinForUnit(an1, state);
    const tt = Tactic[coinKey];
    if (tt) {
      const neighbors = Board.neighbors(an1, Selector.isTwoPlayer(state));
      const accum2 = R.reduce(reduceFunction2(tt, an1), [], neighbors);
      const neighbors2 = Board.ringANs(an1, 2);
      const accum3 = R.reduce(reduceFunction2(tt, an1), [], neighbors2);
      return R.concat(accum1, R.concat(accum2, accum3));
    }
    return accum1;
  };

  return R.reduce(reduceFunction1, [], playerUnitANs);
};

MoveGenerator.generateManeuvers = (player, paymentCoin, state) => {
  const moveAUnits = MoveGenerator.generateMoveAUnits(player, paymentCoin, state);
  const controls = MoveGenerator.generateControls(player, paymentCoin, state);
  const attacks = MoveGenerator.generateAttacks(player, paymentCoin, state);
  const tactics = MoveGenerator.generateTactics(player, paymentCoin, state);

  return R.concat(moveAUnits, R.concat(controls, R.concat(attacks, tactics)));
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
        newAccum = R.concat(newAccum, MoveGenerator.generateTactics(player, paymentCoin, state));
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
