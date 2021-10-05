/* eslint no-console: ["error", { allow: ["warn"] }] */

import Board from "../artifact/Board.js";
import Move from "../artifact/Move.js";
import Resolver from "../artifact/Resolver.js";
import UnitCoin from "../artifact/UnitCoin.js";

import MoveState from "../state/MoveState.js";
import Reducer from "../state/Reducer.js";
import Selector from "../state/Selector.js";

import MoveFunction from "./MoveFunction.js";
import Tactic from "./Tactic.js";

const MoveGenerator = {};

const concat = (array1, array2) => {
  if (array2.length === 0) {
    return array1;
  }

  if (array1.length === 0) {
    return array2;
  }

  return [...array1, ...array2];
};

const push = (array, element) => {
  if (element) {
    array.push(element);
  }

  return array;
};

const generateAttacksForAN = (player, paymentCoin, an1, state, isLegalFunction0, neighbors0) => {
  const moveKey = Move.ATTACK;
  const playerId = player.id;
  const paymentCoinId = paymentCoin.id;
  const isLegalFunction = isLegalFunction0 || MoveFunction[moveKey].isLegal;
  const reduceFunction = (accum, an2) => {
    if (isLegalFunction(player, paymentCoin, an1, an2, state)) {
      const victimCoinId = Selector.coinIdForUnit(an2, state);
      const moveState = MoveState.create({
        moveKey,
        playerId,
        paymentCoinId,
        an1,
        an2,
        victimCoinId,
      });
      return R.append(moveState, accum);
    }
    return accum;
  };
  const neighbors = neighbors0 || Board.neighbors(an1, Selector.isTwoPlayer(state));

  return R.reduce(reduceFunction, [], neighbors);
};

const generateControlForAN = (player, paymentCoin, an1, state, isLegalFunction0) => {
  const moveKey = Move.CONTROL;
  const playerId = player.id;
  const paymentCoinId = paymentCoin.id;
  const isLegalFunction = isLegalFunction0 || MoveFunction[moveKey].isLegal;
  let answer;

  if (isLegalFunction(player, paymentCoin, an1, state)) {
    answer = MoveState.create({ moveKey, playerId, paymentCoinId, an1 });
  }

  return answer;
};

const generateMoveAUnitsForAN = (player, paymentCoin, an1, state, isLegalFunction0, neighbors0) => {
  const moveKey = Move.MOVE_A_UNIT;
  const playerId = player.id;
  const paymentCoinId = paymentCoin.id;
  const isLegalFunction = isLegalFunction0 || MoveFunction[moveKey].isLegal;
  const reduceFunction = (accum, an2) => {
    if (isLegalFunction(player, paymentCoin, an1, an2, state)) {
      const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, an1, an2 });
      return R.append(moveState, accum);
    }
    return accum;
  };
  const neighbors = neighbors0 || Board.neighbors(an1, Selector.isTwoPlayer(state));

  return R.reduce(reduceFunction, [], neighbors);
};

const generateTacticsBowman = (player, paymentCoin, an1, state) => {
  const tt = Tactic[paymentCoin.coinKey];

  if (tt && tt.isLegal) {
    const moveKey = Move.TACTIC;
    const playerId = player.id;
    const paymentCoinId = paymentCoin.id;
    const mapFunction = (attackState) =>
      MoveState.create({
        moveKey,
        playerId,
        paymentCoinId,
        an1,
        moveStates: [attackState],
      });
    const neighbors = Board.ringANs(an1, 2);
    const attackStates = generateAttacksForAN(
      player,
      paymentCoin,
      an1,
      state,
      tt.isLegal,
      neighbors
    );

    return R.map(mapFunction, attackStates);
  }

  return [];
};

const generateTacticsCavalry = (player, paymentCoin, an1, state) => {
  const moveKey = Move.TACTIC;
  const playerId = player.id;
  const paymentCoinId = paymentCoin.id;
  const mapFunction = (moveState0) => (attackState) =>
    MoveState.create({
      moveKey,
      playerId,
      paymentCoinId,
      an1,
      moveStates: [moveState0, attackState],
    });
  const reduceFunction = (accum, moveState) => {
    const store2 = Redux.createStore(Reducer.root, state);
    MoveFunction.execute(moveState, store2);
    const attackStates = generateAttacksForAN(
      player,
      paymentCoin,
      moveState.an2,
      store2.getState()
    );
    const tacticStates = R.map(mapFunction(moveState), attackStates);
    return concat(accum, tacticStates);
  };

  const moveStates = generateMoveAUnitsForAN(player, paymentCoin, an1, state);

  return R.reduce(reduceFunction, [], moveStates);
};

const isLegalEnsignMove = (an0) => (player, paymentCoin, an1, an2, state) =>
  Board.distance(an0, an2) <= 2 &&
  MoveFunction[Move.MOVE_A_UNIT].isLegal(player, paymentCoin, an1, an2, state);

const generateTacticsEnsign = (player, paymentCoin, an1, state) => {
  const moveKey = Move.TACTIC;
  const playerId = player.id;
  const paymentCoinId = paymentCoin.id;
  const mapFunction = (moveState) =>
    MoveState.create({
      moveKey,
      playerId,
      paymentCoinId,
      an1,
      moveStates: [{ ...moveState, paymentCoinId }],
    });
  const teamANs = Selector.teamANs(player.teamKey, state);
  const reduceFunction1 = (accum, an) =>
    Board.distance(an1, an) <= 2 ? R.append(an, accum) : accum;
  const filterFunction = (an) => an !== an1;
  const nearANs0 = R.reduce(reduceFunction1, [], teamANs);
  const nearANs = R.filter(filterFunction, nearANs0);
  const reduceFunction2 = (accum, an) => {
    const myPaymentCoin = Selector.coinForUnit(an, state);
    const moveStates = generateMoveAUnitsForAN(
      player,
      myPaymentCoin,
      an,
      state,
      isLegalEnsignMove(an1)
    );
    return concat(accum, moveStates);
  };
  const moveStates = R.reduce(reduceFunction2, [], nearANs);

  return R.map(mapFunction, moveStates);
};

const generateTacticsFootman = (player, paymentCoin, an1, state) => {
  const moveKey = Move.TACTIC;
  const playerId = player.id;
  const paymentCoinId = paymentCoin.id;
  const playerUnitANs = Selector.playerUnitANs(player.id, state);
  const filterFunction = (an) => Selector.isUnitType(an, UnitCoin.FOOTMAN, state);
  const footmanANs = R.filter(filterFunction, playerUnitANs);

  if (footmanANs.length === 2) {
    let maneuverStates1 = [];
    let maneuverStates2 = [];

    if (footmanANs.length > 0) {
      const an = footmanANs[0];
      const moveStates0 = generateMoveAUnitsForAN(player, paymentCoin, an, state);
      const moveStates = R.sortBy(R.prop("an1"), R.sortBy(R.prop("an2"), moveStates0));
      const controlState = generateControlForAN(player, paymentCoin, an, state);
      const controlStates = controlState ? [controlState] : [];
      const attackStates0 = generateAttacksForAN(player, paymentCoin, an, state);
      const attackStates = R.sortBy(R.prop("an1"), R.sortBy(R.prop("an2"), attackStates0));
      maneuverStates1 = [...moveStates, ...controlStates, ...attackStates];
    }

    if (footmanANs.length > 1) {
      const an = footmanANs[1];
      const moveStates0 = generateMoveAUnitsForAN(player, paymentCoin, an, state);
      const moveStates = R.sortBy(R.prop("an1"), R.sortBy(R.prop("an2"), moveStates0));
      const controlState = generateControlForAN(player, paymentCoin, an, state);
      const controlStates = controlState ? [controlState] : [];
      const attackStates0 = generateAttacksForAN(player, paymentCoin, an, state);
      const attackStates = R.sortBy(R.prop("an1"), R.sortBy(R.prop("an2"), attackStates0));
      maneuverStates2 = [...moveStates, ...controlStates, ...attackStates];
    }

    const mapFunction = (moveState1) => (moveState2) =>
      MoveState.create({
        moveKey,
        playerId,
        paymentCoinId,
        an1,
        moveStates: [moveState1, moveState2],
      });
    const reduceFunction = (accum, moveState1) => {
      const tacticStates = R.map(mapFunction(moveState1), maneuverStates2);
      return concat(accum, tacticStates);
    };

    return R.reduce(reduceFunction, [], maneuverStates1);
  }

  return [];
};

const generateTacticsLancer = (player, paymentCoin, an1, state) => {
  const moveKey = Move.TACTIC;
  const playerId = player.id;
  const paymentCoinId = paymentCoin.id;
  const mapFunction = (moveState0) => (attackState) =>
    MoveState.create({
      moveKey,
      playerId,
      paymentCoinId,
      an1,
      moveStates: [moveState0, attackState],
    });
  const tt = Tactic[UnitCoin.LANCER];
  const reduceFunction = (accum, moveState) => {
    const directionIndex = Board.cubeDirectionIndex(an1, moveState.an2);
    const neighbor = Board.neighborInDirection(moveState.an2, directionIndex);

    if (tt.isLegalLancerAttack(player, paymentCoin, an1, moveState.an2, state)) {
      const victimCoinId = Selector.coinIdForUnit(neighbor, state);
      const attackStates = [
        MoveState.create({
          moveKey: Move.ATTACK,
          playerId,
          paymentCoinId,
          an1: moveState.an2,
          an2: neighbor,
          victimCoinId,
        }),
      ];
      const tacticStates = R.map(mapFunction(moveState), attackStates);
      return concat(accum, tacticStates);
    }
    return accum;
  };

  const moveStates1 = generateMoveAUnitsForAN(player, paymentCoin, an1, state);
  const neighbors2 = Board.ringANs(an1, 2);
  const moveStates2 = generateMoveAUnitsForAN(
    player,
    paymentCoin,
    an1,
    state,
    tt.isLegalLancerMove2,
    neighbors2
  );
  const moveStates = concat(moveStates1, moveStates2);

  return R.reduce(reduceFunction, [], moveStates);
};

const generateTacticsLightCavalry = (player, paymentCoin, an1, state) => {
  const moveKey = Move.TACTIC;
  const playerId = player.id;
  const paymentCoinId = paymentCoin.id;
  const mapFunction = (moveState) =>
    MoveState.create({
      moveKey,
      playerId,
      paymentCoinId,
      an1,
      moveStates: [moveState],
    });
  const tt = Tactic[UnitCoin.LIGHT_CAVALRY];
  const neighbors = Board.ringANs(an1, 2);
  const moveStates = generateMoveAUnitsForAN(
    player,
    paymentCoin,
    an1,
    state,
    tt.isLegal,
    neighbors
  );

  return R.map(mapFunction, moveStates);
};

const generateTacticsMarshall = (player, paymentCoin, an1, state) => {
  const moveKey = Move.TACTIC;
  const playerId = player.id;
  const paymentCoinId = paymentCoin.id;
  const mapFunction = (attackState) =>
    MoveState.create({
      moveKey,
      playerId,
      paymentCoinId,
      an1,
      moveStates: [{ ...attackState, paymentCoinId }],
    });
  const teamANs = Selector.teamANs(player.teamKey, state);
  const reduceFunction1 = (accum, an) =>
    Board.distance(an1, an) <= 2 ? R.append(an, accum) : accum;
  const filterFunction = (an) => an !== an1;
  const nearANs0 = R.reduce(reduceFunction1, [], teamANs);
  const nearANs = R.filter(filterFunction, nearANs0);
  const reduceFunction2 = (accum, an) => {
    const myPaymentCoin = Selector.coinForUnit(an, state);
    const attackStates = generateAttacksForAN(player, myPaymentCoin, an, state);
    return concat(accum, attackStates);
  };
  const attackStates = R.reduce(reduceFunction2, [], nearANs);

  return R.map(mapFunction, attackStates);
};

const generateTacticsRoyalGuard = (player, paymentCoin, an1, state) => {
  const moveKey = Move.TACTIC;
  const playerId = player.id;
  const paymentCoinId = paymentCoin.id;
  const mapFunction = (moveState) =>
    MoveState.create({
      moveKey,
      playerId,
      paymentCoinId,
      an1,
      moveStates: [{ ...moveState, paymentCoinId: paymentCoin.id }],
    });

  const coin = Selector.coinForUnit(an1, state);
  const moveStates = generateMoveAUnitsForAN(player, coin, an1, state);

  return R.map(mapFunction, moveStates);
};

MoveGenerator.generateAttacks = (player, paymentCoin, state) => {
  const playerUnitANs = Selector.playerUnitANs(player.id, state);
  const reduceFunction1 = (accum1, an1) => {
    const accum2 = generateAttacksForAN(player, paymentCoin, an1, state);
    return concat(accum1, accum2);
  };

  return R.reduce(reduceFunction1, [], playerUnitANs);
};

MoveGenerator.generateBolsters = (player, paymentCoin, state) => {
  const moveKey = Move.BOLSTER;
  const playerId = player.id;
  const paymentCoinId = paymentCoin.id;
  const mm = MoveFunction[moveKey];
  const playerUnitANs = Selector.playerUnitANs(player.id, state);
  const reduceFunction = (accum, an1) => {
    if (mm.isLegal(player, paymentCoin, an1, state)) {
      const moveState = MoveState.create({ moveKey, playerId, paymentCoinId, an1 });
      return R.append(moveState, accum);
    }
    return accum;
  };

  return R.reduce(reduceFunction, [], playerUnitANs);
};

MoveGenerator.generateClaimInitiative = (player, paymentCoin, state) => {
  const moveKey = Move.CLAIM_INITIATIVE;
  const playerId = player.id;
  const paymentCoinId = paymentCoin.id;
  const mm = MoveFunction[moveKey];
  let answer;

  if (mm.isLegal(player, paymentCoin, state)) {
    answer = MoveState.create({ moveKey, playerId, paymentCoinId });
  }

  return answer;
};

MoveGenerator.generateControls = (player, paymentCoin, state) => {
  const possibleControlANs = Selector.possibleControlANs(player.id, state);
  const reduceFunction = (accum, an1) => {
    const moveState = generateControlForAN(player, paymentCoin, an1, state);
    return moveState ? R.append(moveState, accum) : accum;
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
    answer = concat(answer, answer2);
  }

  return answer;
};

MoveGenerator.generateMoveAUnits = (player, paymentCoin, state) => {
  const playerUnitANs = Selector.playerUnitANs(player.id, state);
  const reduceFunction1 = (accum1, an1) => {
    const accum2 = generateMoveAUnitsForAN(player, paymentCoin, an1, state);
    return concat(accum1, accum2);
  };

  return R.reduce(reduceFunction1, [], playerUnitANs);
};

MoveGenerator.generatePass = (player, paymentCoin, state) => {
  const moveKey = Move.PASS;
  const playerId = player.id;
  const paymentCoinId = paymentCoin.id;
  const mm = MoveFunction[moveKey];
  let answer;

  if (mm.isLegal(player, paymentCoin, state)) {
    answer = MoveState.create({ moveKey, playerId, paymentCoinId });
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
  const playerUnitANs = Selector.playerUnitANs(player.id, state);
  const paymentCoinKey = paymentCoin.coinKey;
  let isFootmanDone = false;
  const reduceFunction = (accum, an1) => {
    const coinKey = Selector.coinKeyForUnit(an1, state);
    const tt = Tactic[coinKey];

    if (tt) {
      if (paymentCoinKey === coinKey) {
        switch (coinKey) {
          case UnitCoin.ARCHER:
          case UnitCoin.CROSSBOWMAN:
            return concat(accum, generateTacticsBowman(player, paymentCoin, an1, state));
          case UnitCoin.CAVALRY:
            return concat(accum, generateTacticsCavalry(player, paymentCoin, an1, state));
          case UnitCoin.ENSIGN:
            return concat(accum, generateTacticsEnsign(player, paymentCoin, an1, state));
          case UnitCoin.FOOTMAN:
            if (!isFootmanDone) {
              isFootmanDone = true;
              return concat(accum, generateTacticsFootman(player, paymentCoin, an1, state));
            }
            break;
          case UnitCoin.LANCER:
            return concat(accum, generateTacticsLancer(player, paymentCoin, an1, state));
          case UnitCoin.LIGHT_CAVALRY:
            return concat(accum, generateTacticsLightCavalry(player, paymentCoin, an1, state));
          case UnitCoin.MARSHALL:
            return concat(accum, generateTacticsMarshall(player, paymentCoin, an1, state));
          default:
          // Nothing to do.
        }
      }

      if (Resolver.isRoyalCoin(paymentCoinKey) && coinKey === UnitCoin.ROYAL_GUARD) {
        return concat(accum, generateTacticsRoyalGuard(player, paymentCoin, an1, state));
      }
    }

    return accum;
  };

  return R.reduce(reduceFunction, [], playerUnitANs);
};

MoveGenerator.generateManeuvers = (player, paymentCoin, state) => {
  const moveAUnits = MoveGenerator.generateMoveAUnits(player, paymentCoin, state);
  const controls = MoveGenerator.generateControls(player, paymentCoin, state);
  const attacks = MoveGenerator.generateAttacks(player, paymentCoin, state);
  const tactics = MoveGenerator.generateTactics(player, paymentCoin, state);

  return [...moveAUnits, ...controls, ...attacks, ...tactics];
};

MoveGenerator.generateForCoin = (player, paymentCoin, state, isPassAllowed = true) => {
  const moveKeys = Move.keys();
  const reduceFunction = (accum, moveKey) => {
    switch (moveKey) {
      case Move.CLAIM_INITIATIVE:
        return push(accum, MoveGenerator.generateClaimInitiative(player, paymentCoin, state));
      case Move.PASS:
        return isPassAllowed
          ? push(accum, MoveGenerator.generatePass(player, paymentCoin, state))
          : accum;
      case Move.RECRUIT:
        return concat(accum, MoveGenerator.generateRecruits(player, paymentCoin, state));
      case Move.DEPLOY:
        return concat(accum, MoveGenerator.generateDeploys(player, paymentCoin, state));
      case Move.BOLSTER:
        return concat(accum, MoveGenerator.generateBolsters(player, paymentCoin, state));
      case Move.MOVE_A_UNIT:
        return concat(accum, MoveGenerator.generateMoveAUnits(player, paymentCoin, state));
      case Move.CONTROL:
        return concat(accum, MoveGenerator.generateControls(player, paymentCoin, state));
      case Move.ATTACK:
        return concat(accum, MoveGenerator.generateAttacks(player, paymentCoin, state));
      case Move.TACTIC:
        return concat(accum, MoveGenerator.generateTactics(player, paymentCoin, state));
      default:
      // Nothing to do.
    }

    return accum;
  };

  return R.reduce(reduceFunction, [], moveKeys);
};

MoveGenerator.generate = (player, state) => {
  let answer;
  const hand = Selector.hand(player.id, state);
  const paymentCoin0 = Selector.currentPaymentCoin(state);

  if (!paymentCoin0) {
    const mapFunction = (coinId) => ({ coinId });
    answer = R.map(mapFunction, hand);
  } else {
    const reduceFunction = (accum, paymentCoinId) => {
      const paymentCoin = Selector.coin(paymentCoinId, state);
      return concat(MoveGenerator.generateForCoin(player, paymentCoin, state), accum);
    };

    answer = R.reduce(reduceFunction, [], hand);
  }

  return answer;
};

Object.freeze(MoveGenerator);

export default MoveGenerator;
