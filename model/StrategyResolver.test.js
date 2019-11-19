import HumanPlayerStrategy from "./HumanPlayerStrategy.js";
import MCTSPlayerStrategy from "./MCTSPlayerStrategy.js";
import RandomPlayerStrategy from "./RandomPlayerStrategy.js";
import SimplePlayerStrategy from "./SimplePlayerStrategy.js";
import StrategyResolver from "./StrategyResolver.js";

QUnit.module("StrategyResolver");

QUnit.test("resolve()", assert => {
  assert.equal(StrategyResolver.resolve("HumanPlayerStrategy"), HumanPlayerStrategy);
  assert.equal(StrategyResolver.resolve("MCTSPlayerStrategy"), MCTSPlayerStrategy);
  assert.equal(StrategyResolver.resolve("RandomPlayerStrategy"), RandomPlayerStrategy);
  assert.equal(StrategyResolver.resolve("SimplePlayerStrategy"), SimplePlayerStrategy);

  assert.equal(StrategyResolver.resolve("ReallyStupidStrategy"), undefined);
});

const StrategyResolverTest = {};
export default StrategyResolverTest;
