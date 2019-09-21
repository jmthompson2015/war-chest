const RoyalCoin = {
  RAVEN: "raven",
  WOLF: "wolf",

  properties: {
    raven: {
      name: "Raven Royal Coin",
      image: "resource/coin/RavenRoyalCoin.png",
      key: "raven"
    },
    wolf: {
      name: "Wolf Royal Coin",
      image: "resource/coin/WolfRoyalCoin.png",
      key: "wolf"
    }
  }
};

RoyalCoin.keys = () => Object.keys(RoyalCoin.properties);

RoyalCoin.values = () => Object.values(RoyalCoin.properties);

Object.freeze(RoyalCoin);

export default RoyalCoin;
