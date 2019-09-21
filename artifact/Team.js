const Team = {
  RAVEN: "raven",
  WOLF: "wolf",

  properties: {
    raven: {
      name: "Raven",
      key: "raven"
    },
    wolf: {
      name: "Wolf",
      key: "wolf"
    }
  }
};

Team.keys = () => Object.keys(Team.properties);

Team.values = () => Object.values(Team.properties);

Object.freeze(Team);

export default Team;
