/* eslint no-console: ["error", { allow: ["warn"] }] */
/* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */

import ArrayUtils from "../util/ArrayUtilities.js";

import Board from "../artifact/Board.js";
import ControlMarker from "../artifact/ControlMarker.js";
import Resolver from "../artifact/Resolver.js";
import RoyalCoin from "../artifact/RoyalCoin.js";
import UnitCard from "../artifact/UnitCard.js";

import ActionCreator from "../state/ActionCreator.js";
import CoinState from "../state/CoinState.js";
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

  R.forEach((an1) => {
    store.dispatch(ActionCreator.setControl(an1, controlKey));
  }, controlANs);
};

const initializeControlMarkers = (store, isTwoPlayer) => {
  // Place neutral control marker on locations.
  const controlPoints = isTwoPlayer ? Board.CONTROL_POINTS_2P : Board.CONTROL_POINTS_4P;
  R.forEach((an1) => {
    store.dispatch(ActionCreator.setControl(an1, ControlMarker.NEUTRAL));
  }, controlPoints);

  initializePlayerControlMarkers(isTwoPlayer, true, store);
  initializePlayerControlMarkers(isTwoPlayer, false, store);
};

Setup.createInitialPlayerToTableau = () => {
  const answer = {};
  let unitCards = [].concat(UnitCard.values());

  for (let playerId = 1; playerId <= 4; playerId += 1) {
    // Randomly deal four (2 player) or three (4 player) unit cards.
    const maxCards = playerId < 3 ? 4 : 3;
    const tableau = [];

    for (let i = 0; i < maxCards; i += 1) {
      const card = ArrayUtils.randomElement(unitCards);
      unitCards = ArrayUtils.remove(card, unitCards);
      tableau.push(card.key);
    }

    answer[playerId] = tableau.sort();
  }

  return answer;
};

Setup.determinePlayerToTableau = (playerCount, initialPlayerToTableau) => {
  const answer = {};

  if (playerCount === 2) {
    answer[1] = initialPlayerToTableau[1];
    answer[2] = initialPlayerToTableau[2];
  } else if (playerCount === 4) {
    answer[1] = initialPlayerToTableau[1].slice(0, 3);
    answer[2] = initialPlayerToTableau[2].slice(0, 3);
    answer[3] = initialPlayerToTableau[3];
    answer[4] = initialPlayerToTableau[4];
  } else {
    console.warn(`Unknown playerCount: ${playerCount}`);
  }

  return answer;
};

Setup.execute = (store) => {
  const players0 = Selector.players(store.getState());
  const isTwoPlayer = players0.length === 2;

  // Place control markers.
  initializeControlMarkers(store, isTwoPlayer);

  // Flip for initiative.
  const initiativePlayer = ArrayUtils.randomElement(players0);
  store.dispatch(ActionCreator.setInitiativePlayer(initiativePlayer.id));

  // For each player,
  const players = Selector.playersInOrder(store.getState());

  R.forEach((p) => {
    // Place Royal Coin in bag.
    const royalCoinKey = p.teamKey === "raven" ? RoyalCoin.RAVEN : RoyalCoin.WOLF;
    const royalCoin = CoinState.create({ coinKey: royalCoinKey, store });
    store.dispatch(ActionCreator.addToPlayerArray("playerToBag", p.id, royalCoin.id));

    // Fill supply with unit coins.
    const cardKeys = Selector.tableau(p.id, store.getState());
    const cards = R.map((c) => Resolver.card(c), cardKeys);

    R.forEach((card) => {
      for (let j = 0; j < card.initialCount - 2; j += 1) {
        const coin = CoinState.create({ coinKey: card.key, store });
        store.dispatch(ActionCreator.addToPlayerArray("playerToSupply", p.id, coin.id));
      }

      // Put two of each unit coin type into bag.
      for (let j = 0; j < 2; j += 1) {
        const coin = CoinState.create({ coinKey: card.key, store });
        store.dispatch(ActionCreator.addToPlayerArray("playerToBag", p.id, coin.id));
      }
    }, cards);
  }, players);

  const playerIds = R.map(R.prop("id"), players);
  store.dispatch(ActionCreator.setCurrentPlayerOrder(playerIds));
};

Object.freeze(Setup);

export default Setup;
