import Board from "../artifact/Board.js";
import Resolver from "../artifact/Resolver.js";

const Selector = {};

Selector.anToControl = state => state.anToControl;

Selector.anToTokens = state => state.anToTokens;

Selector.control = (an, state) => state.anToControl[an];

Selector.controlANs = (teamKey, state) => {
  const allControlANs = Object.keys(state.anToControl);
  const filterFunction = an => {
    const control = Selector.control(an, state);
    return !R.isNil(control) && control === teamKey;
  };

  return R.filter(filterFunction, allControlANs);
};

Selector.currentHandCallback = state => state.currentHandCallback;

Selector.currentInputCallback = state => state.currentInputCallback;

Selector.currentMove = state => state.currentMove;

Selector.currentMoves = state => state.currentMoves || [];

Selector.currentPaymentCoin = state => Resolver.coin(state.currentPaymentCoinKey);

Selector.currentPhase = state => Resolver.phase(state.currentPhaseKey);

Selector.currentPlayer = state => Selector.player(state.currentPlayerId, state);

Selector.delay = state => state.delay;

Selector.initiativeChangedThisRound = state => state.initiativeChangedThisRound;

Selector.initiativePlayer = state => {
  const id = state.initiativePlayerId;
  return state.playerInstances[id];
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

Selector.isFourPlayer = state => Object.keys(state.playerInstances).length === 4;

Selector.isInHand = (playerId, coinKey, state) => {
  const hand = Selector.hand(playerId, state);

  return R.contains(coinKey, hand);
};

Selector.isInitiativePlayer = (playerId, state) => playerId === state.initiativePlayerId;

Selector.isInSupply = (playerId, coinKey, state) => {
  const supply = Selector.supply(playerId, state);

  return R.contains(coinKey, supply);
};

Selector.isOccupied = (an, state) => {
  const unit = Selector.unit(an, state);

  return !R.isNil(unit) && unit.length > 0;
};

Selector.isTwoPlayer = state => Object.keys(state.playerInstances).length === 2;

Selector.isUnitType = (an, coinKey, state) => {
  const unit = Selector.unit(an, state);

  return !R.isNil(unit) && unit.length > 0 && unit[0] === coinKey;
};

Selector.isUnoccupied = (an, state) => {
  const unit = Selector.unit(an, state);

  return R.isNil(unit);
};

Selector.player = (playerId, state) => state.playerInstances[playerId];

Selector.playerCount = state => Object.keys(state.playerInstances).length;

Selector.players = state => Object.values(state.playerInstances);

Selector.playersInOrder = state => {
  const count = Selector.playerCount(state);
  const players0 = Object.values(state.playerInstances);
  const index0 = R.findIndex(R.propEq("id", state.initiativePlayerId))(players0);
  const first = R.slice(index0, count, players0);
  const second = R.slice(0, index0, players0);

  return R.concat(first, second);
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

Selector.unit = (an, state) => state.anToTokens[an];

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
