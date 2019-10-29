const Move = {
  // Facedown actions.
  CLAIM_INITIATIVE: "claimInitiative",
  RECRUIT: "recruit",
  PASS: "pass",
  // Faceup actions.
  DEPLOY: "deploy",
  BOLSTER: "bolster",
  MOVE_A_UNIT: "moveAUnit",
  CONTROL: "control",
  ATTACK: "attack",
  TACTIC: "tactic",

  properties: {
    claimInitiative: {
      name: "Claim Initiative",
      isFaceup: false,
      isManeuver: false,
      key: "claimInitiative"
    },
    recruit: {
      name: "Recruit",
      isFaceup: false,
      isManeuver: false,
      key: "recruit"
    },
    pass: {
      name: "Pass",
      isFaceup: false,
      isManeuver: false,
      key: "pass"
    },
    deploy: {
      name: "Deploy",
      isFaceup: true,
      isManeuver: false,
      key: "deploy"
    },
    bolster: {
      name: "Bolster",
      isFaceup: true,
      isManeuver: false,
      key: "bolster"
    },
    moveAUnit: {
      name: "Move a Unit",
      isFaceup: true,
      isManeuver: true,
      key: "moveAUnit"
    },
    control: {
      name: "Control",
      isFaceup: true,
      isManeuver: true,
      key: "control"
    },
    attack: {
      name: "Attack",
      isFaceup: true,
      isManeuver: true,
      key: "attack"
    },
    tactic: {
      name: "Tactic",
      isFaceup: true,
      isManeuver: true,
      key: "tactic"
    }
  }
};

Move.keys = () => Object.keys(Move.properties);

Move.values = () => Object.values(Move.properties);

Move.facedowns = () => R.filter(m => !m.isFaceup, Move.values());

Move.faceups = () => R.filter(m => m.isFaceup, Move.values());

Move.maneuverKeys = () => R.map(m => m.key, Move.maneuvers());

Move.maneuvers = () => R.filter(m => m.isManeuver, Move.values());

Object.freeze(Move);

export default Move;
