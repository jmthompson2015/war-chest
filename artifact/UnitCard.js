const UnitCard = {
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
      image: "resource/card/Archer.jpg",
      initialCount: 4,
      tactic:
        "<b>Attack</b> a unit two spaces away. The intervening space may be occupied by a unit.",
      restriction: "The Archer can only <b>attack</b> by using its <b>tactic</b>.",
      key: "archer"
    },
    berserker: {
      name: "Berserker",
      image: "resource/card/Berserker.jpg",
      initialCount: 5,
      attribute:
        "After the Berserker <b>maneuvers</b>, you may <b>manuever</b> it again by discarding a " +
        "<b>bolstered</b> coin from the Berserker unit." +
        " You may do this multiple times, but you may not remove the final coin.",
      key: "berserker"
    },
    cavalry: {
      name: "Cavalry",
      image: "resource/card/Cavalry.jpg",
      initialCount: 4,
      tactic: "<b>Move</b> and then <b>Attack</b>.",
      key: "cavalry"
    },
    crossbowman: {
      name: "Crossbowman",
      image: "resource/card/Crossbowman.jpg",
      initialCount: 5,
      tactic:
        "<b>Attack</b> a unit two spaces away in a straight line." +
        " The intervening space cannot be occupied by a unit.",
      key: "crossbowman"
    },
    ensign: {
      name: "Ensign",
      image: "resource/card/Ensign.jpg",
      initialCount: 5,
      tactic:
        "Choose a friendly unit within two spaces of the Ensign. " +
        "The chosen unit performs a normal <b>move</b> to a space within two spaces of the Ensign.",
      key: "ensign"
    },
    footman: {
      name: "Footman",
      image: "resource/card/Footman.jpg",
      initialCount: 5,
      tactic: "Perform one <b>maneuver</b> with each Footman unit on the board.",
      attribute: "Two Footman units may be <b>deployed</b> at a time.",
      key: "footman"
    },
    knight: {
      name: "Knight",
      image: "resource/card/Knight.jpg",
      initialCount: 4,
      attribute: "The Knight can only be <b>attacked</b> by units that are <b>bolstered</b>.",
      key: "knight"
    },
    lancer: {
      name: "Lancer",
      image: "resource/card/Lancer.jpg",
      initialCount: 4,
      tactic: "<b>Move</b> one or two spaces and then <b>attack</b>, all in a straight line.",
      restriction: "The Lancer can only <b>attack</b> by using its tactic.",
      key: "lancer"
    },
    lightCavalry: {
      name: "Light Cavalry",
      image: "resource/card/LightCavalry.jpg",
      initialCount: 5,
      tactic: "<b>Move</b> two spaces.",
      key: "lightCavalry"
    },
    marshall: {
      name: "Marshall",
      image: "resource/card/Marshall.jpg",
      initialCount: 5,
      tactic:
        "Choose a friendly unit that is within two spaces of the Marshall." +
        " The chosen unit <b>attacks</b>, if able.",
      key: "marshall"
    },
    mercenary: {
      name: "Mercenary",
      image: "resource/card/Mercenary.jpg",
      initialCount: 5,
      attribute:
        "After you <b>recruit</b> a Mercenary, you may <b>maneuver</b> you Mercenary unit.",
      key: "mercenary"
    },
    pikeman: {
      name: "Pikeman",
      image: "resource/card/Pikeman.jpg",
      initialCount: 4,
      attribute:
        "When the Pikeman is <b>attacked</b> by an adjacent unit, remove a coin from that unit.",
      key: "pikeman"
    },
    royalGuard: {
      name: "Royal Guard",
      image: "resource/card/RoyalGuard.jpg",
      initialCount: 5,
      tactic: "Discard the Royal Coin to <b>move</b> the Royal Guard.",
      attribute:
        "When the Royal Guard is <b>attacked</b>, you may remove a Royal Guard coin from the " +
        "supply rather than from its unit.",
      key: "royalGuard"
    },
    scout: {
      name: "Scout",
      image: "resource/card/Scout.jpg",
      initialCount: 5,
      attribute: "The Scout may be <b>deployed</b> adjacent to any friendly unit.",
      key: "scout"
    },
    swordsman: {
      name: "Swordsman",
      image: "resource/card/Swordsman.jpg",
      initialCount: 5,
      attribute: "After the Swordsman <b>attacks</b>, it may <b>move</b>.",
      key: "swordsman"
    },
    warriorPriest: {
      name: "Warrior Priest",
      image: "resource/card/WarriorPriest.jpg",
      initialCount: 4,
      attribute:
        "After the Warrior Priest <b>attacks</b> or <b>controls</b>, draw one coin from your bag " +
        "and immediately use it to take any <b>action</b>.",
      key: "warriorPriest"
    }
  }
};

UnitCard.keys = () => Object.keys(UnitCard.properties);

UnitCard.values = () => Object.values(UnitCard.properties);

Object.freeze(UnitCard);

export default UnitCard;
