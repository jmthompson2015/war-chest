import ControlMarker from "./ControlMarker.js";
import Move from "./Move.js";
import Phase from "./Phase.js";
import RoyalCoin from "./RoyalCoin.js";
import Team from "./Team.js";
import UnitCard from "./UnitCard.js";
import UnitCoin from "./UnitCoin.js";

const Resolver = {};

Resolver.card = cardKey => UnitCard.properties[cardKey];

Resolver.cards = cardKeys => R.map(c => Resolver.card(c), cardKeys);

Resolver.coin = coinKey => {
  let answer = UnitCoin.properties[coinKey];

  if (R.isNil(answer)) {
    answer = RoyalCoin.properties[coinKey];
  }

  return answer;
};

Resolver.coinImage = (coinKey, isFaceup) => {
  const coin = Resolver.coin(coinKey);

  return isFaceup ? coin.image : "resource/coin/CoinReverse.png";
};

Resolver.coins = coinKeys => R.map(c => Resolver.coin(c), coinKeys);

Resolver.control = controlKey => ControlMarker.properties[controlKey];

Resolver.isRoyalCoin = coinKey => !R.isNil(RoyalCoin.properties[coinKey]);

Resolver.isUnitCoin = coinKey => !R.isNil(UnitCoin.properties[coinKey]);

Resolver.move = moveKey => Move.properties[moveKey];

Resolver.phase = phaseKey => Phase.properties[phaseKey];

Resolver.team = teamKey => Team.properties[teamKey];

Object.freeze(Resolver);

export default Resolver;
