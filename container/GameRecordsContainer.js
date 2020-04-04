import Selector from "../state/Selector.js";

import GameRecordsUI from "../view/GameRecordsUI.js";

function mapStateToProps(state) {
  const gameRecords = Selector.gameRecords(state);
  const recordRows = R.map(R.prop("message"), gameRecords);

  return { recordRows };
}

export default ReactRedux.connect(mapStateToProps)(GameRecordsUI);
