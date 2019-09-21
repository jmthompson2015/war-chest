const Phase = {
  DRAW_THREE_COINS: "drawThreeCoins",
  PLAY_COINS: "playCoins",

  properties: {
    drawThreeCoins: {
      name: "Draw 3 Coins",
      key: "drawThreeCoins"
    },
    playCoins: {
      name: "Play Coins",
      key: "playCoins"
    }
  }
};

Phase.keys = () => Object.keys(Phase.properties);

Phase.values = () => Object.values(Phase.properties);

Object.freeze(Phase);

export default Phase;
