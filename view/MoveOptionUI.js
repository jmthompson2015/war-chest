import Move from "../artifact/Move.js";
import Resolver from "../artifact/Resolver.js";

import ReactUtils from "./ReactUtilities.js";

const labelFunction = moveState => {
  const move = Resolver.move(moveState.moveKey);
  const paymentCoin = Resolver.coin(moveState.paymentCoinKey);

  let recruitCoin;
  let answer;

  switch (moveState.moveKey) {
    case Move.RECRUIT:
      recruitCoin = Resolver.coin(moveState.recruitCoinKey);
      answer = `${move.name}: Pay ${paymentCoin.name} to recruit ${recruitCoin.name}`;
      break;
    case Move.PASS:
      answer = `${move.name}: Pay ${paymentCoin.name} to pass`;
      break;
    case Move.DEPLOY:
      answer = `${move.name}: Pay ${paymentCoin.name} to deploy to ${moveState.an}`;
      break;
    default:
      answer = `${move.name}: Pay ${paymentCoin.name}`;
  }

  return answer;
};

class MoveOptionUI extends React.PureComponent {
  constructor(props) {
    super(props);

    const { initialMove } = this.props;

    this.state = {
      selected: initialMove
    };

    this.handleChange = this.handleChangeFunction.bind(this);
  }

  handleChangeFunction(event) {
    const { id } = event.target;
    const { moveStates, onChange } = this.props;
    const selected = moveStates[id];

    this.setState(
      {
        selected
      },
      onChange(selected)
    );
  }

  render() {
    const { clientProps, customKey, moveStates, panelClass } = this.props;
    const { selected } = this.state;

    const inputProps = R.merge(
      {
        name: `chooseMove${customKey}`, // needed for radio
        onChange: this.handleChange,
        type: "radio"
      },
      clientProps
    );

    const mapIndexed = R.addIndex(R.map);
    const mapFunction = (moveState, i) => {
      const customKey2 = `${customKey}${moveState.playerId}-${moveState.moveKey}-${i}`;
      const input = ReactDOMFactories.input(
        R.merge(inputProps, {
          key: customKey2,
          id: i,
          defaultChecked: moveState === selected
        })
      );
      const label = labelFunction(moveState);
      const cells = [];
      cells.push(ReactUtils.createCell(input, cells.length, "pa1 v-mid"));
      cells.push(ReactUtils.createCell(label, cells.length, "pa1 v-mid"));

      return ReactUtils.createRow(cells, `row${moveState.playerId}-${moveState.moveKey}-${i}`);
    };
    const rows = mapIndexed(mapFunction, moveStates);

    return ReactUtils.createTable(rows, customKey, panelClass);
  }
}

MoveOptionUI.propTypes = {
  moveStates: PropTypes.arrayOf().isRequired,

  clientProps: PropTypes.shape(),
  customKey: PropTypes.string,
  initialMove: PropTypes.shape(),
  onChange: PropTypes.func,
  panelClass: PropTypes.string
};

MoveOptionUI.defaultProps = {
  clientProps: {},
  customKey: "MoveOptionUI",
  initialMove: undefined,
  onChange: () => {},
  panelClass: "bg-xw-light f6"
};

export default MoveOptionUI;
