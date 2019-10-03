/* eslint no-console: ["error", { allow: ["warn"] }] */

import Move from "../artifact/Move.js";
import Resolver from "../artifact/Resolver.js";

const RU = ReactComponent.ReactUtilities;

const createButtons = (cancelOnClick, okOnClick) => {
  const cancelButton = ReactDOMFactories.button(
    { key: "cancelButton", onClick: cancelOnClick },
    "Cancel"
  );
  const okButton = ReactDOMFactories.button({ key: "okButton", onClick: okOnClick }, "OK");

  return ReactDOMFactories.span({}, cancelButton, " ", okButton);
};

const labelFunction = moveState => {
  const move = Resolver.move(moveState.moveKey);
  const paymentCoin = Resolver.coin(moveState.paymentCoinKey);

  let recruitCoin;
  let answer;

  switch (moveState.moveKey) {
    case Move.CLAIM_INITIATIVE:
    case Move.PASS:
      answer = `${move.name}`;
      break;
    case Move.RECRUIT:
      recruitCoin = Resolver.coin(moveState.recruitCoinKey);
      answer = `${move.name}: ${recruitCoin.name}`;
      break;
    case Move.DEPLOY:
    case Move.BOLSTER:
      answer = `${move.name}: ${paymentCoin.name} to ${moveState.an}`;
      break;
    case Move.MOVE_A_UNIT:
      answer = `${move.name}: ${paymentCoin.name} from ${moveState.fromAN} to ${moveState.toAN}`;
      break;
    case Move.CONTROL:
      answer = `${move.name}: ${moveState.an}`;
      break;
    case Move.ATTACK:
      answer = `${move.name}: ${paymentCoin.name} at ${moveState.fromAN} attack ${moveState.toAN}`;
      break;
    default:
      console.warn(`Unknown moveState.moveKey: ${moveState.moveKey}`);
  }

  return answer;
};

const mapIndexed = R.addIndex(R.map);

const createInitialInput = (customKey, clientProps, moveStates, onChange) => {
  const inputProps = R.merge(
    {
      name: `chooseMove${customKey}`, // needed for radio
      onChange,
      type: "radio"
    },
    clientProps
  );
  const mapFunction = (moveState, i) => {
    const customKey2 = `${customKey}${moveState.playerId}-${moveState.moveKey}-${i}`;
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

  return RU.createTable(rows, undefined, "f6");
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
    const { clientProps, customKey, moveStates, paymentCoin } = this.props;
    const message = ReactDOMFactories.div({}, `Select an action for ${paymentCoin.name}`);
    const initialInput = createInitialInput(
      customKey,
      clientProps,
      moveStates,
      this.selectionChanged
    );
    const buttons = createButtons(this.cancel, this.ok);
    const panelClass = "bg-light-yellow f6";

    return React.createElement(ReactComponent.OptionPane, {
      panelClass,
      title: "Select Action",
      message,
      initialInput,
      buttons
    });
  }
}

MoveOptionDialog.propTypes = {
  callback: PropTypes.func.isRequired,
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
