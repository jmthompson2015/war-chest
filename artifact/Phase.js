const Phase = {
  DRAW_THREE_COINS: "drawThreeCoins",
  PLAY_COIN_1: "playCoin1",
  PLAY_COIN_2: "playCoin2",
  PLAY_COIN_3: "playCoin3",

  properties: {
    drawThreeCoins: {
      name: "Draw 3 Coins",
      key: "drawThreeCoins",
    },
    playCoin1: {
      name: "Play Coin 1",
      key: "playCoin1",
    },
    playCoin2: {
      name: "Play Coin 2",
      key: "playCoin2",
    },
    playCoin3: {
      name: "Play Coin 3",
      key: "playCoin3",
    },
  },
};

Phase.keys = () => Object.keys(Phase.properties);

Phase.values = () => Object.values(Phase.properties);

Object.freeze(Phase);

export default Phase;
