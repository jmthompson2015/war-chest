import ArrayUtils from "../util/ArrayUtilities.js";

import Board from "../artifact/Board.js";
import ControlMarker from "../artifact/ControlMarker.js";
import Resolver from "../artifact/Resolver.js";
import RoyalCoin from "../artifact/RoyalCoin.js";
import UnitCard from "../artifact/UnitCard.js";

import ActionCreator from "../state/ActionCreator.js";
import Selector from "../state/Selector.js";

const Setup = {};

const initializePlayerControlMarkers = (isTwoPlayer, isRaven, store) => {
  // Place control marker in two (2 player) or three (4 player) starting locations.
  const controlKey = isRaven ? ControlMarker.RAVEN : ControlMarker.WOLF;
  let controlANs;

  if (isTwoPlayer) {
    controlANs = isRaven
      ? Board.RAVEN_STARTER_CONTROL_POINTS_2P
      : Board.WOLF_STARTER_CONTROL_POINTS_2P;
  } else {
    controlANs = isRaven
      ? Board.RAVEN_STARTER_CONTROL_POINTS_4P
      : Board.WOLF_STARTER_CONTROL_POINTS_4P;
  }

  R.forEach(an => {
    store.dispatch(ActionCreator.setControl(an, controlKey));
  }, controlANs);
};

const initializeControlMarkers = (store, isTwoPlayer) => {
  // Place neutral control marker on locations.
  const controlPoints = isTwoPlayer ? Board.CONTROL_POINTS_2P : Board.CONTROL_POINTS_4P;
  R.forEach(an => {
    store.dispatch(ActionCreator.setControl(an, ControlMarker.NEUTRAL));
  }, controlPoints);

  initializePlayerControlMarkers(isTwoPlayer, true, store);
  initializePlayerControlMarkers(isTwoPlayer, false, store);
};

Setup.execute = store => {
  const players0 = Selector.players(store.getState());
  const isTwoPlayer = players0.length === 2;

  // Place control markers.
  initializeControlMarkers(store, isTwoPlayer);

  // Flip for initiative.
  const initiativePlayer = ArrayUtils.randomElement(players0);
  store.dispatch(ActionCreator.setInitiativePlayer(initiativePlayer.id));

  let unitCards = [].concat(UnitCard.values());
  const maxCards = isTwoPlayer ? 4 : 3;

  // For each player,
  const players = Selector.playersInOrder(store.getState());

  R.forEach(p => {
    // Place Royal Coin in bag.
    const royalCoinKey = p.teamKey === "raven" ? RoyalCoin.RAVEN : RoyalCoin.WOLF;
    store.dispatch(ActionCreator.addToPlayerArray("playerToBag", p.id, royalCoinKey));

    // Randomly deal or draft four (2 player) or three (4 player) unit cards.
    for (let i = 0; i < maxCards; i += 1) {
      const card = ArrayUtils.randomElement(unitCards);
      unitCards = ArrayUtils.remove(card, unitCards);
      store.dispatch(ActionCreator.addToPlayerArray("playerToTableau", p.id, card.key));
    }

    // Randomly deal or draft four (2 player) or three (4 player) unit cards.
    const cardKeys = Selector.tableau(p.id, store.getState());
    const cards = R.map(c => Resolver.card(c), cardKeys);

    R.forEach(card => {
      // Fill supply with unit coins.
      for (let j = 0; j < card.initialCount - 2; j += 1) {
        store.dispatch(ActionCreator.addToPlayerArray("playerToSupply", p.id, card.key));
      }

      // Move two of each unit coin type into bag.
      for (let j = 0; j < 2; j += 1) {
        store.dispatch(ActionCreator.addToPlayerArray("playerToBag", p.id, card.key));
      }
    }, cards);
  }, players);

  // Toggle initiative if draft used.
};

Object.freeze(Setup);

export default Setup;
