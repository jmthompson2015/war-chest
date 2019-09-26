import SimplePlayerStrategy from "./SimplePlayerStrategy.js";
import StrategyResolver from "./StrategyResolver.js";

QUnit.module("StrategyResolver");

QUnit.test("resolve()", assert => {
  assert.equal(StrategyResolver.resolve("SimplePlayerStrategy"), SimplePlayerStrategy);

  assert.equal(StrategyResolver.resolve("ReallyStupidStrategy"), undefined);
});

const StrategyResolverTest = {};
export default StrategyResolverTest;
