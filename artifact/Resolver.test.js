import Resolver from "./Resolver.js";
import RoyalCoin from "./RoyalCoin.js";
import UnitCoin from "./UnitCoin.js";

QUnit.module("Resolver");

QUnit.test("coin()", assert => {
  // Run / Verify.
  assert.equal(Resolver.coin(UnitCoin.ARCHER), UnitCoin.properties[UnitCoin.ARCHER]);
  assert.equal(Resolver.coin(RoyalCoin.RAVEN), RoyalCoin.properties[RoyalCoin.RAVEN]);
});

QUnit.test("isRoyalCoin()", assert => {
  // Run / Verify.
  assert.equal(Resolver.isRoyalCoin(UnitCoin.ARCHER), false);
  assert.equal(Resolver.isRoyalCoin(RoyalCoin.RAVEN), true);
});

QUnit.test("isUnitCoin()", assert => {
  // Run / Verify.
  assert.equal(Resolver.isUnitCoin(UnitCoin.ARCHER), true);
  assert.equal(Resolver.isUnitCoin(RoyalCoin.RAVEN), false);
});

const ResolverTest = {};
export default ResolverTest;
