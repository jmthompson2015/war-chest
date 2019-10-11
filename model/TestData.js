import ArrayUtils from "../util/ArrayUtilities.js";

import Board from "../artifact/Board.js";
import ControlMarker from "../artifact/ControlMarker.js";
import Resolver from "../artifact/Resolver.js";
import RoyalCoin from "../artifact/RoyalCoin.js";
import Team from "../artifact/Team.js";
import UnitCard from "../artifact/UnitCard.js";

import ActionCreator from "../state/ActionCreator.js";
import CoinState from "../state/CoinState.js";
import PlayerState from "../state/PlayerState.js";
import Reducer from "../state/Reducer.js";
import Selector from "../state/Selector.js";

const TestData = {};

const createPlayers = isTwoPlayer => {
  const player1 = PlayerState.create({
    id: 1,
    name: "Alfred",
    teamKey: Team.RAVEN
  });
  const player2 = PlayerState.create({
    id: 2,
    name: "Bruce",
    teamKey: Team.WOLF
  });

  const answer = [player1, player2];

  if (!isTwoPlayer) {
    const player3 = PlayerState.create({
      id: 3,
      name: "Clark",
      teamKey: Team.RAVEN
    });
    const player4 = PlayerState.create({
      id: 4,
      name: "Diana",
      teamKey: Team.WOLF
    });

    answer.push([player3, player4]);
  }

  return answer;
};

const drawThreeCoins = (playerId, store) => {
  for (let i = 0; i < 3; i += 1) {
    const bag = Selector.bag(playerId, store.getState());
    const coinKey = bag[i];
    store.dispatch(
      ActionCreator.transferBetweenPlayerArrays("playerToBag", "playerToHand", playerId, coinKey)
    );
  }
};

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

TestData.createStore = (isTwoPlayer = true, drawCoins = true) => {
  const store = Redux.createStore(Reducer.root);
  const players = createPlayers(isTwoPlayer);
  store.dispatch(ActionCreator.setPlayers(players));

  // Place control markers.
  initializeControlMarkers(store, isTwoPlayer);

  // Flip for initiative.
  const initiativePlayer = players[0];
  store.dispatch(ActionCreator.setInitiativePlayer(initiativePlayer.id));
  const maxCards = 4;
  const unitCardKeys1 = [
    UnitCard.SWORDSMAN,
    UnitCard.PIKEMAN,
    UnitCard.CROSSBOWMAN,
    UnitCard.LIGHT_CAVALRY
  ];
  const unitCards1 = R.map(c => Resolver.card(c), unitCardKeys1);
  const unitCardKeys2 = [UnitCard.ARCHER, UnitCard.CAVALRY, UnitCard.LANCER, UnitCard.SCOUT];
  const unitCards2 = R.map(c => Resolver.card(c), unitCardKeys2);

  R.forEach(p => {
    // Place Royal Coin in bag.
    const royalCoinKey = p.teamKey === "raven" ? RoyalCoin.RAVEN : RoyalCoin.WOLF;
    const royalCoin = CoinState.create({ coinKey: royalCoinKey, store });
    store.dispatch(ActionCreator.addToPlayerArray("playerToBag", p.id, royalCoin.id));
    let unitCards = p.id === 1 ? unitCards1 : unitCards2;

    // Randomly deal or draft four (2 player) or three (4 player) unit cards.
    for (let i = 0; i < maxCards; i += 1) {
      const card = unitCards[0];
      unitCards = ArrayUtils.remove(card, unitCards);
      store.dispatch(ActionCreator.addToPlayerArray("playerToTableau", p.id, card.key));
    }

    // Randomly deal or draft four (2 player) or three (4 player) unit cards.
    const cardKeys = Selector.tableau(p.id, store.getState());
    const cards = R.map(c => Resolver.card(c), cardKeys);

    R.forEach(card => {
      // Fill supply with unit coins.
      for (let j = 0; j < card.initialCount - 2; j += 1) {
        const coin = CoinState.create({ coinKey: card.key, store });
        store.dispatch(ActionCreator.addToPlayerArray("playerToSupply", p.id, coin.id));
      }

      // Move two of each unit coin type into bag.
      for (let j = 0; j < 2; j += 1) {
        const coin = CoinState.create({ coinKey: card.key, store });
        store.dispatch(ActionCreator.addToPlayerArray("playerToBag", p.id, coin.id));
      }
    }, cards);
  }, players);

  if (drawCoins) {
    // Draw three coins.
    for (let playerId = 1; playerId <= 2; playerId += 1) {
      drawThreeCoins(playerId, store);
    }
  }

  return store;
};

Object.freeze(TestData);

export default TestData;
