const UnitCoin = {
  ARCHER: "archer",
  BERSERKER: "berserker",
  CAVALRY: "cavalry",
  CROSSBOWMAN: "crossbowman",
  ENSIGN: "ensign",
  FOOTMAN: "footman",
  KNIGHT: "knight",
  LANCER: "lancer",
  LIGHT_CAVALRY: "lightCavalry",
  MARSHALL: "marshall",
  MERCENARY: "mercenary",
  PIKEMAN: "pikeman",
  ROYAL_GUARD: "royalGuard",
  SCOUT: "scout",
  SWORDSMAN: "swordsman",
  WARRIOR_PRIEST: "warriorPriest",

  properties: {
    archer: {
      name: "Archer",
      image: "resource/coin/Archer.png",
      key: "archer"
    },
    berserker: {
      name: "Berserker",
      image: "resource/coin/Berserker.png",
      key: "berserker"
    },
    cavalry: {
      name: "Cavalry",
      image: "resource/coin/Cavalry.png",
      key: "cavalry"
    },
    crossbowman: {
      name: "Crossbowman",
      image: "resource/coin/Crossbowman.png",
      key: "crossbowman"
    },
    ensign: {
      name: "Ensign",
      image: "resource/coin/Ensign.png",
      key: "ensign"
    },
    footman: {
      name: "Footman",
      image: "resource/coin/Footman.png",
      key: "footman"
    },
    knight: {
      name: "Knight",
      image: "resource/coin/Knight.png",
      key: "knight"
    },
    lancer: {
      name: "Lancer",
      image: "resource/coin/Lancer.png",
      key: "lancer"
    },
    lightCavalry: {
      name: "Light Cavalry",
      image: "resource/coin/LightCavalry.png",
      key: "lightCavalry"
    },
    marshall: {
      name: "Marshall",
      image: "resource/coin/Marshall.png",
      key: "marshall"
    },
    mercenary: {
      name: "Mercenary",
      image: "resource/coin/Mercenary.png",
      key: "mercenary"
    },
    pikeman: {
      name: "Pikeman",
      image: "resource/coin/Pikeman.png",
      key: "pikeman"
    },
    royalGuard: {
      name: "Royal Guard",
      image: "resource/coin/RoyalGuard.png",
      key: "royalGuard"
    },
    scout: {
      name: "Scout",
      image: "resource/coin/Scout.png",
      key: "scout"
    },
    swordsman: {
      name: "Swordsman",
      image: "resource/coin/Swordsman.png",
      key: "swordsman"
    },
    warriorPriest: {
      name: "Warrior Priest",
      image: "resource/coin/WarriorPriest.png",
      key: "warriorPriest"
    }
  }
};

UnitCoin.keys = () => Object.keys(UnitCoin.properties);

UnitCoin.values = () => Object.values(UnitCoin.properties);

Object.freeze(UnitCoin);

export default UnitCoin;
