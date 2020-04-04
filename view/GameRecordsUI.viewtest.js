/* eslint no-console: ["error", { allow: ["log"] }] */

import Move from "../artifact/Move.js";
import UnitCoin from "../artifact/UnitCoin.js";

import ActionCreator from "../state/ActionCreator.js";
import CoinState from "../state/CoinState.js";
import MoveState from "../state/MoveState.js";
import Selector from "../state/Selector.js";

import MoveFunction from "../model/MoveFunction.js";
import TestData from "../model/TestData.js";

import GameRecordsUI from "./GameRecordsUI.js";

const store = TestData.createStore();
store.dispatch(ActionCreator.addCoin(CoinState.create({ coinKey: UnitCoin.ENSIGN, store }))); // 39
store.dispatch(ActionCreator.addCoin(CoinState.create({ coinKey: UnitCoin.FOOTMAN, store }))); // 40
store.dispatch(ActionCreator.addCoin(CoinState.create({ coinKey: UnitCoin.FOOTMAN, store }))); // 41
store.dispatch(
  ActionCreator.addCoin(
    CoinState.create({
      coinKey: UnitCoin.MARSHALL,
      store
    })
  )
); // 42
store.dispatch(
  ActionCreator.addCoin(
    CoinState.create({
      coinKey: UnitCoin.ROYAL_GUARD,
      store
    })
  )
); // 43
store.dispatch(ActionCreator.setUnit("e3", 29)); // Cavalry
store.dispatch(ActionCreator.setUnit("h1", 43)); // Royal Guard
console.log(`coinInstances = ${JSON.stringify(store.getState().coinInstances, null, 2)}`);
console.log(`hand1 = ${Selector.hand(1, store.getState())}`);
console.log(`tableau1 = ${Selector.tableau(1, store.getState())}`);
console.log(`hand2 = ${Selector.hand(2, store.getState())}`);
console.log(`tableau2 = ${Selector.tableau(2, store.getState())}`);

// /////////////////////////////////////////////////////////////////////////////////////////////////
store.dispatch(ActionCreator.setRound(1));
store.dispatch(
  ActionCreator.addGameRecord(
    MoveFunction.createGameRecord(
      MoveState.create({
        moveKey: Move.CLAIM_INITIATIVE,
        playerId: 1,
        paymentCoinId: 21 // Wolf Royal Coin
      }),
      store.getState()
    )
  )
);
store.dispatch(
  ActionCreator.addGameRecord(
    MoveFunction.createGameRecord(
      MoveState.create({
        moveKey: Move.RECRUIT,
        playerId: 2,
        paymentCoinId: 25, // Archer
        recruitCoinId: 22 // Archer
      }),
      store.getState()
    )
  )
);
store.dispatch(
  ActionCreator.addGameRecord(
    MoveFunction.createGameRecord(
      MoveState.create({
        moveKey: Move.PASS,
        playerId: 1,
        paymentCoinId: 6 // Swordsman
      }),
      store.getState()
    )
  )
);
store.dispatch(
  ActionCreator.addGameRecord(
    MoveFunction.createGameRecord(
      MoveState.create({
        moveKey: Move.DEPLOY,
        playerId: 2,
        paymentCoinId: 6, // Swordsman
        an1: "e2"
      }),
      store.getState()
    )
  )
);
store.dispatch(
  ActionCreator.addGameRecord(
    MoveFunction.createGameRecord(
      MoveState.create({
        moveKey: Move.BOLSTER,
        playerId: 1,
        paymentCoinId: 6, // Swordsman
        an1: "e2"
      }),
      store.getState()
    )
  )
);
store.dispatch(
  ActionCreator.addGameRecord(
    MoveFunction.createGameRecord(
      MoveState.create({
        moveKey: Move.MOVE_A_UNIT,
        playerId: 2,
        paymentCoinId: 25, // Archer
        an1: "e2",
        an2: "e3"
      }),
      store.getState()
    )
  )
);

// /////////////////////////////////////////////////////////////////////////////////////////////////
store.dispatch(ActionCreator.setRound(2));
store.dispatch(
  ActionCreator.addGameRecord(
    MoveFunction.createGameRecord(
      MoveState.create({
        moveKey: Move.CONTROL,
        playerId: 1,
        paymentCoinId: 25, // Archer
        an1: "e2"
      }),
      store.getState()
    )
  )
);
store.dispatch(
  ActionCreator.addGameRecord(
    MoveFunction.createGameRecord(
      MoveState.create({
        moveKey: Move.ATTACK,
        playerId: 2,
        paymentCoinId: 25, // Archer
        an1: "d6",
        an2: "d7",
        victimCoinId: 5 // Swordsman
      }),
      store.getState()
    )
  )
);
store.dispatch(ActionCreator.setUnit("e2", 25)); // Archer
store.dispatch(
  ActionCreator.addGameRecord(
    MoveFunction.createGameRecord(
      MoveState.create({
        moveKey: Move.TACTIC,
        playerId: 1,
        paymentCoinId: 25, // Archer
        an1: "e2",
        moveStates: [
          MoveState.create({
            moveKey: Move.ATTACK,
            playerId: 1,
            paymentCoinId: 25, // Archer
            an1: "e2",
            an2: "e4",
            victimCoinId: 5 // Swordsman
          })
        ]
      }),
      store.getState()
    )
  )
);
store.dispatch(ActionCreator.setUnit("e2", 29)); // Cavalry
store.dispatch(
  ActionCreator.addGameRecord(
    MoveFunction.createGameRecord(
      MoveState.create({
        moveKey: Move.TACTIC,
        playerId: 2,
        paymentCoinId: 29, // Cavalry
        an1: "e2",
        moveStates: [
          MoveState.create({
            moveKey: Move.MOVE_A_UNIT,
            playerId: 2,
            paymentCoinId: 29, // Cavalry
            an1: "e2",
            an2: "e3"
          }),
          MoveState.create({
            moveKey: Move.ATTACK,
            playerId: 2,
            paymentCoinId: 29, // Cavalry
            an1: "e3",
            an2: "e4",
            victimCoinId: 5 // Swordsman
          })
        ]
      }),
      store.getState()
    )
  )
);
store.dispatch(ActionCreator.setUnit("e2", 15)); // Crossbowman
store.dispatch(
  ActionCreator.addGameRecord(
    MoveFunction.createGameRecord(
      MoveState.create({
        moveKey: Move.TACTIC,
        playerId: 1,
        paymentCoinId: 15, // Crossbowman
        an1: "e2",
        moveStates: [
          MoveState.create({
            moveKey: Move.ATTACK,
            playerId: 1,
            paymentCoinId: 15, // Crossbowman
            an1: "e2",
            an2: "e4",
            victimCoinId: 5 // Swordsman
          })
        ]
      }),
      store.getState()
    )
  )
);
store.dispatch(ActionCreator.setUnit("e2", 39)); // Ensign
store.dispatch(
  ActionCreator.addGameRecord(
    MoveFunction.createGameRecord(
      MoveState.create({
        moveKey: Move.TACTIC,
        playerId: 2,
        paymentCoinId: 39, // Ensign
        an1: "e2",
        moveStates: [
          MoveState.create({
            moveKey: Move.MOVE_A_UNIT,
            playerId: 2,
            paymentCoinId: 29, // Cavalry
            an1: "e3",
            an2: "e4"
          })
        ]
      }),
      store.getState()
    )
  )
);

// /////////////////////////////////////////////////////////////////////////////////////////////////
store.dispatch(ActionCreator.setRound(3));
store.dispatch(ActionCreator.setUnit("e2", 40)); // Footman
store.dispatch(
  ActionCreator.addGameRecord(
    MoveFunction.createGameRecord(
      MoveState.create({
        moveKey: Move.TACTIC,
        playerId: 1,
        paymentCoinId: 40, // Footman
        an1: "e2",
        moveStates: [
          MoveState.create({
            moveKey: Move.MOVE_A_UNIT,
            playerId: 1,
            paymentCoinId: 40, // Footman
            an1: "e2",
            an2: "e3"
          }),
          MoveState.create({
            moveKey: Move.MOVE_A_UNIT,
            playerId: 1,
            paymentCoinId: 41, // Footman
            an1: "h1",
            an2: "h2"
          })
        ]
      }),
      store.getState()
    )
  )
);
store.dispatch(ActionCreator.setUnit("e2", 33)); // Lancer
store.dispatch(
  ActionCreator.addGameRecord(
    MoveFunction.createGameRecord(
      MoveState.create({
        moveKey: Move.TACTIC,
        playerId: 2,
        paymentCoinId: 33, // Lancer
        an1: "e2",
        moveStates: [
          MoveState.create({
            moveKey: Move.MOVE_A_UNIT,
            playerId: 2,
            paymentCoinId: 33, // Lancer
            an1: "e2",
            an2: "e4"
          }),
          MoveState.create({
            moveKey: Move.ATTACK,
            playerId: 2,
            paymentCoinId: 33, // Lancer
            an1: "e4",
            an2: "e5",
            victimCoinId: 5 // Swordsman
          })
        ]
      }),
      store.getState()
    )
  )
);
store.dispatch(ActionCreator.setUnit("e2", 20)); // Light Cavalry
store.dispatch(
  ActionCreator.addGameRecord(
    MoveFunction.createGameRecord(
      MoveState.create({
        moveKey: Move.TACTIC,
        playerId: 1,
        paymentCoinId: 20, // Light Cavalry
        an1: "e2",
        moveStates: [
          MoveState.create({
            moveKey: Move.MOVE_A_UNIT,
            playerId: 1,
            paymentCoinId: 20, // Light Cavalry
            an1: "e2",
            an2: "e4"
          })
        ]
      }),
      store.getState()
    )
  )
);
store.dispatch(ActionCreator.setUnit("e2", 42)); // Marshall
store.dispatch(
  ActionCreator.addGameRecord(
    MoveFunction.createGameRecord(
      MoveState.create({
        moveKey: Move.TACTIC,
        playerId: 2,
        paymentCoinId: 42, // Marshall
        an1: "e2",
        moveStates: [
          MoveState.create({
            moveKey: Move.ATTACK,
            playerId: 2,
            paymentCoinId: 29, // Cavalry
            an1: "e3",
            an2: "e4",
            victimCoinId: 5 // Swordsman
          })
        ]
      }),
      store.getState()
    )
  )
);
store.dispatch(ActionCreator.clearUnit("e2"));
store.dispatch(ActionCreator.setUnit("e2", 43)); // Royal Guard
store.dispatch(
  ActionCreator.addGameRecord(
    MoveFunction.createGameRecord(
      MoveState.create({
        moveKey: Move.TACTIC,
        playerId: 1,
        paymentCoinId: 1, // Raven Royal Coin
        an1: "e2",
        moveStates: [
          MoveState.create({
            moveKey: Move.MOVE_A_UNIT,
            playerId: 1,
            paymentCoinId: 1, // Raven Royal Coin
            an1: "e2",
            an2: "e4"
          })
        ]
      }),
      store.getState()
    )
  )
);

const state = store.getState();
const gameRecords = Selector.gameRecords(state);
const recordRows = R.map(R.prop("message"), gameRecords);

const element = React.createElement(GameRecordsUI, { recordRows });
ReactDOM.render(element, document.getElementById("panel"));
