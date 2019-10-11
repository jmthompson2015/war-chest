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

const labelFunction = (moveState, coinInstances) => {
  const move = Resolver.move(moveState.moveKey);
  const paymentCoinState = coinInstances[moveState.paymentCoinId];
  const paymentCoin = Resolver.coin(paymentCoinState.coinKey);

  let recruitCoin;
  let recruitCoinState;
  let victimCoin;
  let victimCoinState;
  let answer;

  switch (moveState.moveKey) {
    case Move.CLAIM_INITIATIVE:
    case Move.PASS:
      answer = `${move.name}`;
      break;
    case Move.RECRUIT:
      recruitCoinState = coinInstances[moveState.recruitCoinId];
      recruitCoin = Resolver.coin(recruitCoinState.coinKey);
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
      victimCoinState = coinInstances[moveState.victimCoinId];
      victimCoin = Resolver.coin(victimCoinState.coinKey);
      answer = `${move.name}: ${paymentCoin.name} at ${moveState.fromAN}'+
        ' attack ${victimCoin.name} at ${moveState.toAN}`;
      break;
    default:
      console.warn(`Unknown moveState.moveKey: ${moveState.moveKey}`);
  }

  return answer;
};

const mapIndexed = R.addIndex(R.map);

const createInitialInput = (coinInstances, customKey, clientProps, moveStates, onChange) => {
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
    const label = labelFunction(moveState, coinInstances);
    const cells = [];
    cells.push(RU.createCell(input, cells.length, "pa1 v-mid"));
    cells.push(RU.createCell(label, cells.length, "pa1 v-mid"));

    return RU.createRow(cells, `row${moveState.playerId}-${moveState.moveKey}-${i}`);
  };
  const rows = mapIndexed(mapFunction, moveStates);

  return RU.createTable(rows, undefined, "f6 tl");
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
    const { clientProps, coinInstances, customKey, moveStates, paymentCoin } = this.props;
    const message = ReactDOMFactories.div({}, `Select an action for ${paymentCoin.name}`);
    const initialInput = createInitialInput(
      coinInstances,
      customKey,
      clientProps,
      moveStates,
      this.selectionChanged
    );
    const buttons = createButtons(this.cancel, this.ok);
    const panelClass = "bg-wc-medium f6";

    return React.createElement(ReactComponent.OptionPane, {
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
