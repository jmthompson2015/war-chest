import GamePanel from "../view/GamePanel.js";

function mapStateToProps(state) {
  return { state };
}

export default ReactRedux.connect(mapStateToProps)(GamePanel);
