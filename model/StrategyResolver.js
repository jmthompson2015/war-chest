/* eslint no-console: ["error", { allow: ["error"] }] */

import HumanPlayerStrategy from "./HumanPlayerStrategy.js";
import MCTSPlayerStrategy from "./MCTSPlayerStrategy.js";
import RandomPlayerStrategy from "./RandomPlayerStrategy.js";
import SimplePlayerStrategy from "./SimplePlayerStrategy.js";

const StrategyResolver = {};

StrategyResolver.resolve = strategyName =>
  R.cond([
    [R.equals("HumanPlayerStrategy"), R.always(HumanPlayerStrategy)],
    [R.equals("MCTSPlayerStrategy"), R.always(MCTSPlayerStrategy)],
    [R.equals("RandomPlayerStrategy"), R.always(RandomPlayerStrategy)],
    [R.equals("SimplePlayerStrategy"), R.always(SimplePlayerStrategy)],
    [R.T, name => console.error(`Unknown agent strategy ${name}`)]
  ])(strategyName);

Object.freeze(StrategyResolver);

export default StrategyResolver;
