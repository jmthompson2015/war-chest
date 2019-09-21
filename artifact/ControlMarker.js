const ControlMarker = {
  NEUTRAL: "neutral",
  RAVEN: "raven",
  WOLF: "wolf",

  properties: {
    neutral: {
      name: "Neutral Control Marker",
      image: "resource/control/NeutralControlMarker.png",
      key: "neutral"
    },
    raven: {
      name: "Raven Control Marker",
      image: "resource/control/RavenControlMarker.png",
      key: "raven"
    },
    wolf: {
      name: "Wolf Control Marker",
      image: "resource/control/WolfControlMarker.png",
      key: "wolf"
    }
  }
};

ControlMarker.keys = () => Object.keys(ControlMarker.properties);

ControlMarker.values = () => Object.values(ControlMarker.properties);

Object.freeze(ControlMarker);

export default ControlMarker;
