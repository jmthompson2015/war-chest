import Board from "../artifact/Board.js";
import DamageTarget from "../artifact/DamageTarget.js";
import Resolver from "../artifact/Resolver.js";
import UnitCoin from "../artifact/UnitCoin.js";

const Selector = {};

Selector.anToControl = state => state.anToControl;

Selector.anToTokens = state => state.anToTokens;

Selector.ansByType = (coinKey, state) => {
  const filterFunction = an => Selector.isUnitType(an, coinKey, state);

  return R.filter(filterFunction, Object.keys(state.anToTokens));
};

Selector.canBeAttacked = (an1, an2, state) => {
  const isKnight = Selector.isUnitType(an2, UnitCoin.KNIGHT, state);

  return isKnight ? Selector.isBolstered(an1, state) : true;
};

Selector.canDeploy = (coinKey, state) => {
  const ans = Selector.ansByType(coinKey, state);

  // Not already deployed.
  return coinKey === UnitCoin.FOOTMAN ? ans.length < 2 : ans.length < 1;
};

Selector.coin = (coinId, state) => state.coinInstances[coinId];

Selector.coinForUnit = (an, state) => {
  const coinId = Selector.coinIdForUnit(an, state);

  return coinId ? Selector.coin(coinId, state) : undefined;
};

Selector.coinIdForUnit = (an, state) => {
  const unit = Selector.unit(an, state);

  return unit && unit.length > 0 ? unit[0] : undefined;
};

Selector.coinKeyForUnit = (an, state) => state.anToCoinKey[an];

Selector.coinType = (coinId, state) => {
  const coin = Selector.coin(coinId, state);

  return coin ? coin.coinType : undefined;
};

Selector.coinTypeForUnit = (an, state) => {
  const coin = Selector.coinForUnit(an, state);

  return coin ? coin.coinType : undefined;
};

Selector.coins = (coinIds, state) => {
  const mapFunction = id => state.coinInstances[id];

  return R.map(mapFunction, coinIds);
};

Selector.control = (an, state) => state.anToControl[an];

Selector.controlANs = (teamKey, state) => {
  const allControlANs = Object.keys(state.anToControl);
  const filterFunction = an => {
    const control = Selector.control(an, state);
    return !R.isNil(control) && control === teamKey;
  };

  return R.filter(filterFunction, allControlANs);
};

Selector.currentDamageCallback = state => state.currentDamageCallback;

Selector.currentDamageTarget = state => Resolver.damageTarget(state.currentDamageTargetKey);

Selector.currentHandCallback = state => state.currentHandCallback;

Selector.currentMove = state => state.currentMove;

Selector.currentMoves = state => state.currentMoves || [];

Selector.currentPaymentCoin = state => Selector.coin(state.currentPaymentCoinId, state);

Selector.currentPhase = state => Resolver.phase(state.currentPhaseKey);

Selector.currentPlayer = state => Selector.player(state.currentPlayerId, state);

Selector.currentPlayerOrder = state => state.currentPlayerOrder;

Selector.damageTargets = (playerId, state) => {
  const isTypeInSupply = Selector.isTypeInSupply(playerId, UnitCoin.ROYAL_GUARD, state);

  return isTypeInSupply ? DamageTarget.values() : [Resolver.damageTarget(DamageTarget.BOARD)];
};

Selector.delay = state => state.delay;

Selector.initiativeChangedThisRound = state => state.initiativeChangedThisRound;

Selector.initiativePlayer = state => {
  const id = state.initiativePlayerId;
  return state.playerInstances[id];
};

Selector.isBolstered = (an, state) => {
  const unit = Selector.unit(an, state);

  return unit && unit.length > 1;
};

Selector.isComputerPlayer = (playerId, state) => {
  const player = Selector.player(playerId, state);

  return player && player.isComputer;
};

Selector.isControlLocation = (an, state) => {
  const playerInstanceMap = state.playerInstances;
  const isTwoPlayer = Object.keys(playerInstanceMap).length === 2;
  const controlPoints = isTwoPlayer ? Board.CONTROL_POINTS_2P : Board.CONTROL_POINTS_4P;

  return controlPoints.includes(an);
};

Selector.isControlledBy = (an, teamKey, state) => {
  const controlKey = Selector.control(an, state);

  return !R.isNil(controlKey) && controlKey === teamKey;
};

Selector.isCurrentPlayer = (playerId, state) => playerId === state.currentPlayerId;

Selector.isEnemyUnit = (playerId, coinKey, state) => {
  const tableau = Selector.tableau(playerId, state);

  return tableau && tableau.length > 0 && !tableau.includes(coinKey);
};

Selector.isEnemyUnitAt = (playerId, an, state) => {
  const coinKey = state.anToCoinKey[an];

  return coinKey ? Selector.isEnemyUnit(playerId, coinKey, state) : false;
};

Selector.isFourPlayer = state => !state.isTwoPlayer;

Selector.isFriendlyUnit = (playerId, coinKey, state) => {
  const tableau = Selector.tableau(playerId, state);

  return tableau && tableau.length > 0 && tableau.includes(coinKey);
};

Selector.isFriendlyUnitAt = (playerId, an, state) => {
  const coinKey = state.anToCoinKey[an];

  return coinKey ? Selector.isFriendlyUnit(playerId, coinKey, state) : false;
};

Selector.isGameOver = state => state.isGameOver;

Selector.isHumanPlayer = (playerId, state) => {
  const player = Selector.player(playerId, state);

  return player && !player.isComputer;
};

Selector.isInHand = (playerId, coinId, state) => {
  const hand = Selector.hand(playerId, state);

  return R.contains(coinId, hand);
};

Selector.isInitiativePlayer = (playerId, state) => playerId === state.initiativePlayerId;

Selector.isInSupply = (playerId, coinId, state) => {
  const supply = Selector.supply(playerId, state);

  return R.contains(coinId, supply);
};

Selector.isOccupied = (an, state) => {
  const unit = Selector.unit(an, state);

  return !R.isNil(unit) && unit.length > 0;
};

Selector.isTwoPlayer = state => state.isTwoPlayer;

Selector.isTypeInSupply = (playerId, coinKey, state) => {
  const coins = Selector.supplyCoinsByType(playerId, coinKey, state);

  return coins.length > 0;
};

Selector.isUnitType = (an, coinKey, state) => {
  const coinKey0 = state.anToCoinKey[an];

  return coinKey0 && coinKey0 === coinKey;
};

Selector.isUnoccupied = (an, state) => {
  const unit = Selector.unit(an, state);

  return R.isNil(unit);
};

Selector.isVerbose = state => state.isVerbose;

Selector.mctsRoot = state => state.mctsRoot;

Selector.peekInputCallback = state => state.inputCallbackStack[state.inputCallbackStack.length - 1];

Selector.player = (playerId, state) => state.playerInstances[playerId];

Selector.playerCount = state => Object.keys(state.playerInstances).length;

Selector.playerForCard = (cardKey, state) => {
  const filterFunction = player => {
    const tableau = Selector.tableau(player.id, state);
    return tableau.includes(cardKey);
  };
  const players = R.filter(filterFunction, Selector.players(state));

  return players.length > 0 ? players[0] : undefined;
};

Selector.playerStrategy = (playerId, state) => state.playerToStrategy[playerId];

Selector.playerUnitANs = (playerId, state) => {
  const tableau = Selector.tableau(playerId, state);
  const ans = Object.keys(state.anToTokens);
  const filterFunction = an => {
    const coinKey = state.anToCoinKey[an];

    return tableau.includes(coinKey);
  };

  return R.filter(filterFunction, ans);
};

Selector.players = state => Object.values(state.playerInstances);

Selector.playersInOrder = state => {
  const count = Selector.playerCount(state);
  const players0 = Object.values(state.playerInstances);
  const index0 = R.findIndex(R.propEq("id", state.initiativePlayerId))(players0);
  const first = R.slice(index0, count, players0);
  const second = R.slice(0, index0, players0);

  return [...first, ...second];
};

Selector.possibleControlANs = (teamKey, state) => {
  const allControlANs = Object.keys(state.anToControl);
  const filterFunction = an => {
    const control = Selector.control(an, state);
    return !R.isNil(control) && control !== teamKey;
  };

  return R.filter(filterFunction, allControlANs);
};

Selector.round = state => state.round;

Selector.supplyCoinsByType = (playerId, coinKey, state) => {
  const coinIds = Selector.supply(playerId, state);
  const coins = Selector.coins(coinIds, state);
  const filterFunction = coin => coin.coinKey === coinKey;

  return R.filter(filterFunction, coins);
};

Selector.teamAdjacentANs = (teamKey, state) => {
  const teamANs = Selector.teamANs(teamKey, state);
  const isTwoPlayer = Selector.isTwoPlayer(state);
  const reduceFunction = (accum, teamAN) => {
    const neighbors = Board.neighbors(teamAN, isTwoPlayer);
    return R.uniq([...accum, ...neighbors]);
  };

  return R.reduce(reduceFunction, [], teamANs);
};

Selector.teamANs = (teamKey, state) => {
  const teamTableau = Selector.teamTableau(teamKey, state);
  const ans = Object.keys(state.anToTokens);
  const filterFunction = an => {
    const coinKey = state.anToCoinKey[an];

    return teamTableau.includes(coinKey);
  };

  return R.filter(filterFunction, ans);
};

Selector.teamPlayerIds = (teamKey, state) => {
  const playerIds = Object.keys(state.playerInstances);
  const filterFunction = playerId => {
    const player = Selector.player(playerId, state);
    return player.teamKey === teamKey;
  };

  return R.filter(filterFunction, playerIds);
};

Selector.teamTableau = (teamKey, state) => {
  const teamPlayerIds = Selector.teamPlayerIds(teamKey, state);
  const reduceFunction = (accum, playerId) => {
    const tableau = Selector.tableau(playerId, state);
    return [...accum, ...tableau];
  };

  return R.reduce(reduceFunction, [], teamPlayerIds);
};

Selector.unit = (an, state) => state.anToTokens[an];

Selector.userMessage = state => state.userMessage;

Selector.winner = state => (state.winnerTeamKey ? Resolver.team(state.winnerTeamKey) : undefined);

// /////////////////////////////////////////////////////////////////////////////////////////////////
const nextId = instanceMap => {
  const reduceFunction = (accum, key) => Math.max(accum, key);
  const maxId = R.reduce(reduceFunction, 0, Object.keys(instanceMap));

  return (maxId !== undefined ? maxId : 0) + 1;
};

Selector.nextCoinId = state => nextId(state.coinInstances);

Selector.nextPlayerId = state => nextId(state.playerInstances);

// /////////////////////////////////////////////////////////////////////////////////////////////////
// Player collections.
Selector.bag = (playerId, state) => state.playerToBag[playerId] || [];

Selector.discardFacedown = (playerId, state) => state.playerToDiscardFacedown[playerId] || [];

Selector.discardFaceup = (playerId, state) => state.playerToDiscardFaceup[playerId] || [];

Selector.hand = (playerId, state) => state.playerToHand[playerId] || [];

Selector.morgue = (playerId, state) => state.playerToMorgue[playerId] || [];

Selector.supply = (playerId, state) => state.playerToSupply[playerId] || [];

Selector.tableau = (playerId, state) => state.playerToTableau[playerId] || [];

Object.freeze(Selector);

export default Selector;
