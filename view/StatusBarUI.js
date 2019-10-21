const { ReactUtilities: RU } = ReactComponent;

class StatusBarUI extends React.PureComponent {
  render() {
    const {
      helpBase,
      phaseName,
      playerName,
      ravenScore,
      round,
      userMessage,
      wolfScore
    } = this.props;
    const helpLinkUI = ReactDOMFactories.a(
      { href: `${helpBase}Help.html`, target: "_blank" },
      "Help"
    );
    const cellClassName = "ba";

    const ravenScoreCell = RU.createCell(["Raven: ", ravenScore], 0, cellClassName, {
      title: "Score"
    });
    const wolfScoreCell = RU.createCell(["Wolf: ", wolfScore], 1, cellClassName, {
      title: "Score"
    });
    const roundCell = RU.createCell(["Round: ", round], 2, cellClassName, { title: "Round" });
    const phaseCell = RU.createCell(["Phase: ", phaseName], 3, cellClassName, { title: "Phase" });
    const playerCell = RU.createCell(["Player: ", playerName], 4, cellClassName, {
      title: "Player"
    });
    const userMessageCell = RU.createCell(userMessage, 5, cellClassName, { title: "User Message" });
    const helpCell = RU.createCell(helpLinkUI, 6, cellClassName);

    const cells = [
      ravenScoreCell,
      wolfScoreCell,
      roundCell,
      phaseCell,
      playerCell,
      userMessageCell,
      helpCell
    ];
    const row = RU.createRow(cells);

    return RU.createTable(row, "statusBarUITable", "bg-light-yellow ma0 tc v-mid w-100");
  }
}

StatusBarUI.propTypes = {
  ravenScore: PropTypes.number.isRequired,
  wolfScore: PropTypes.number.isRequired,
  round: PropTypes.number.isRequired,

  helpBase: PropTypes.string,
  phaseName: PropTypes.string,
  playerName: PropTypes.string,
  userMessage: PropTypes.string
};

StatusBarUI.defaultProps = {
  helpBase: "./",
  phaseName: undefined,
  playerName: undefined,
  userMessage: undefined
};

export default StatusBarUI;
