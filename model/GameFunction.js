import Phase from "../artifact/Phase.js";

import GameOver from "./GameOver.js";
import StepFunction from "./StepFunction.js";

const GameFunction = {};

GameFunction.isGameOver = (store) => GameOver.isGameOver(store.getState());

GameFunction.phaseKeys = () => Phase.keys();

GameFunction.stepFunction = StepFunction.execute;

Object.freeze(GameFunction);

export default GameFunction;
