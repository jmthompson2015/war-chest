import ControlMarker from "./ControlMarker.js";
import DamageTarget from "./DamageTarget.js";
import Move from "./Move.js";
import Phase from "./Phase.js";
import RoyalCoin from "./RoyalCoin.js";
import Team from "./Team.js";
import UnitCard from "./UnitCard.js";
import UnitCoin from "./UnitCoin.js";

const Resolver = {};

Resolver.card = cardKey => UnitCard.properties[cardKey];

Resolver.cards = cardKeys => R.map(c => Resolver.card(c), cardKeys);

Resolver.coin = coinKey => Resolver.unitCoin(coinKey) || Resolver.royalCoin(coinKey);

Resolver.coinImage = (coinKey, isFaceup) => {
  const coin = Resolver.coin(coinKey);

  return isFaceup ? coin.image : "resource/coin/CoinReverse.png";
};

Resolver.coins = coinKeys => R.map(c => Resolver.coin(c), coinKeys);

Resolver.control = controlKey => ControlMarker.properties[controlKey];

Resolver.damageTarget = damageTargetKey => DamageTarget.properties[damageTargetKey];

Resolver.isRoyalCoin = coinKey => !R.isNil(Resolver.royalCoin(coinKey));

Resolver.isUnitCoin = coinKey => !R.isNil(Resolver.unitCoin(coinKey));

Resolver.move = moveKey => Move.properties[moveKey];

Resolver.phase = phaseKey => Phase.properties[phaseKey];

Resolver.royalCoin = coinKey => RoyalCoin.properties[coinKey];

Resolver.team = teamKey => Team.properties[teamKey];

Resolver.unitCoin = coinKey => UnitCoin.properties[coinKey];

Object.freeze(Resolver);

export default Resolver;
