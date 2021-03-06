/* eslint no-console: ["error", { allow: ["warn"] }] */

const RU = ReactComponent.ReactUtilities;

const createButtons = (cancelOnClick, okOnClick) => {
  const cancelButton = ReactDOMFactories.button(
    { key: "cancelButton", onClick: cancelOnClick },
    "Cancel"
  );
  const okButton = ReactDOMFactories.button({ key: "okButton", onClick: okOnClick }, "OK");

  return ReactDOMFactories.span({}, cancelButton, " ", okButton);
};

const mapIndexed = R.addIndex(R.map);

const createInitialInput = (
  coinInstances,
  customKey,
  clientProps,
  labelFunction,
  moveStates,
  onChange
) => {
  const inputProps = R.merge(
    {
      name: `chooseMove${customKey}`, // needed for radio
      onChange,
      type: "radio"
    },
    clientProps
  );
  const mapFunction = (moveState, i) => {
    const customKey2 = `${customKey}-${moveState.playerId}-${moveState.moveKey}-${i}`;
    const input = ReactDOMFactories.input(
      R.merge(inputProps, { key: customKey2, id: i, "data-index": i })
    );
    const label = labelFunction(moveState);
    const cells = [];
    cells.push(RU.createCell(input, cells.length, "pa1 v-mid"));
    cells.push(RU.createCell(label, cells.length, "pa1 v-mid"));

    return RU.createRow(cells, `row${moveState.playerId}-${moveState.moveKey}-${i}`);
  };
  const rows = mapIndexed(mapFunction, moveStates);
  const customKey3 = R.map(m => m.moveKey, moveStates);

  return RU.createTable(rows, `initialInput-${customKey3}`, "f6 tl");
};

// /////////////////////////////////////////////////////////////////////////////////////////////////
class MoveOptionDialog extends React.Component {
  constructor(props) {
    super(props);

    const { initialMove } = props;
    this.state = { selectedMove: initialMove };

    this.cancel = this.cancelFunction.bind(this);
    this.ok = this.okFunction.bind(this);
    this.selectionChanged = this.selectionChangedFunction.bind(this);
  }

  cancelFunction() {
    const { callback, player } = this.props;

    callback({ playerId: player.id });
  }

  okFunction() {
    const { callback, player } = this.props;
    const { selectedMove } = this.state;

    callback({ playerId: player.id, moveState: selectedMove });
  }

  selectionChangedFunction(event) {
    const { moveStates } = this.props;
    const { index } = event.currentTarget.dataset;
    const selectedMove = moveStates[index];

    this.setState({ selectedMove });
  }

  render() {
    const {
      clientProps,
      coinInstances,
      customKey,
      labelFunction,
      moveStates,
      paymentCoin
    } = this.props;
    const message = ReactDOMFactories.div({}, `Select an action for ${paymentCoin.name}`);
    const initialInput = createInitialInput(
      coinInstances,
      customKey,
      clientProps,
      labelFunction,
      moveStates,
      this.selectionChanged
    );
    const buttons = createButtons(this.cancel, this.ok);
    const customKey2 = R.map(m => m.moveKey, moveStates);
    const panelClass = "bg-wc-medium f6";

    return React.createElement(ReactComponent.OptionPane, {
      key: `${customKey}-${customKey2}`,
      panelClass,
      title: "Select Action",
      message,
      initialInput,
      buttons,
      titleClass: "b bg-wc-dark f6 tc wc-light"
    });
  }
}

MoveOptionDialog.propTypes = {
  callback: PropTypes.func.isRequired,
  coinInstances: PropTypes.shape().isRequired,
  labelFunction: PropTypes.func.isRequired,
  moveStates: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  paymentCoin: PropTypes.shape().isRequired,
  player: PropTypes.shape().isRequired,

  clientProps: PropTypes.shape(),
  customKey: PropTypes.string,
  initialMove: PropTypes.shape()
};

MoveOptionDialog.defaultProps = {
  clientProps: {},
  customKey: "MoveOptionDialog",
  initialMove: undefined
};

export default MoveOptionDialog;
