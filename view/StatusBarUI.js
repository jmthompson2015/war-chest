const { ReactUtilities: RU } = ReactComponent;

class StatusBarUI extends React.PureComponent {
  render() {
    const { helpBase, phaseName, playerName, round, userMessage } = this.props;
    const helpLinkUI = ReactDOMFactories.a(
      { href: `${helpBase}Help.html`, target: "_blank" },
      "Help"
    );
    const cellClassName = "ba";

    const roundCell = RU.createCell(["Round: ", round], 0, cellClassName, { title: "Round" });
    const phaseCell = RU.createCell(["Phase: ", phaseName], 1, cellClassName, { title: "Phase" });
    const playerCell = RU.createCell(["Player: ", playerName], 2, cellClassName, {
      title: "Player"
    });
    const userMessageCell = RU.createCell(userMessage, 3, cellClassName, { title: "User Message" });
    const helpCell = RU.createCell(helpLinkUI, 4, cellClassName);

    const cells = [roundCell, phaseCell, playerCell, userMessageCell, helpCell];
    const row = RU.createRow(cells);

    return RU.createTable(row, "statusBarUITable", "bg-light-yellow ma0 tc v-mid w-100");
  }
}

StatusBarUI.propTypes = {
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
