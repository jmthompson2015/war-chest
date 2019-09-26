/* eslint no-console: ["error", { allow: ["error"] }] */

import SimplePlayerStrategy from "./SimplePlayerStrategy.js";

const StrategyResolver = {};

StrategyResolver.resolve = strategyName =>
  R.cond([
    [R.equals("SimplePlayerStrategy"), R.always(SimplePlayerStrategy)],
    [R.T, name => console.error(`Unknown agent strategy ${name}`)]
  ])(strategyName);

Object.freeze(StrategyResolver);

export default StrategyResolver;
