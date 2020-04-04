const scrollToBottom = element0 => {
  const element = element0;
  element.scrollTop = element.scrollHeight;
};

class GameRecordsUI extends React.Component {
  constructor(props) {
    super(props);

    this.textLog = React.createRef();
  }

  componentDidMount() {
    scrollToBottom(this.textLog.current);
  }

  componentDidUpdate() {
    scrollToBottom(this.textLog.current);
  }

  render() {
    const { recordRows } = this.props;
    const value = recordRows.join("\n").trim();

    return ReactDOMFactories.textarea({
      key: `gameRecordsUI${recordRows.length}`,
      className: "f6",
      ref: this.textLog,
      cols: 90,
      readOnly: true,
      rows: 7, // 2 players * 3 turns + 1
      value
    });
  }
}

GameRecordsUI.propTypes = {
  recordRows: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default GameRecordsUI;
