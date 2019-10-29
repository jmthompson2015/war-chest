const DamageTarget = {
  SUPPLY: "supply",
  BOARD: "board",

  properties: {
    supply: {
      name: "Supply",
      key: "supply"
    },
    board: {
      name: "Board",
      key: "board"
    }
  }
};

DamageTarget.keys = () => Object.keys(DamageTarget.properties);

DamageTarget.values = () => Object.values(DamageTarget.properties);

Object.freeze(DamageTarget);

export default DamageTarget;
