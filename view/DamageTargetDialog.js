const RU = ReactComponent.ReactUtilities;

const createButtons = (cancelOnClick, okOnClick) => {
  const okButton = ReactDOMFactories.button({ key: "okButton", onClick: okOnClick }, "OK");

  return ReactDOMFactories.span({}, okButton);
};

const mapIndexed = R.addIndex(R.map);

const createInitialInput = (damageTargets, customKey, onChange) => {
  const inputProps = {
    name: `chooseDamageTarget${customKey}`, // needed for radio
    onChange,
    type: "radio"
  };
  const mapFunction = (damageTarget, i) => {
    const input = ReactDOMFactories.input(
      R.merge(inputProps, { key: damageTarget, id: i, "data-index": i })
    );
    const label = damageTarget.name;
    const cells = [];
    cells.push(RU.createCell(input, cells.length, "pa1 v-mid"));
    cells.push(RU.createCell(label, cells.length, "pa1 v-mid"));

    return RU.createRow(cells, `row-${damageTarget.key}`);
  };
  const rows = mapIndexed(mapFunction, damageTargets);

  return RU.createTable(rows, "initialInput", "f6 tl");
};

// /////////////////////////////////////////////////////////////////////////////////////////////////
class DamageTargetDialog extends React.Component {
  constructor(props) {
    super(props);

    const { damageTargets } = props;
    this.state = { selectedDamage: damageTargets[0] };

    this.ok = this.okFunction.bind(this);
    this.selectionChanged = this.selectionChangedFunction.bind(this);
  }

  okFunction() {
    const { callback, player } = this.props;
    const { selectedDamage } = this.state;

    callback({ playerId: player.id, damageTarget: selectedDamage });
  }

  selectionChangedFunction(event) {
    const { damageTargets } = this.props;
    const { index } = event.currentTarget.dataset;
    const selectedDamage = damageTargets[index];

    this.setState({ selectedDamage });
  }

  render() {
    const { customKey, damageTargets } = this.props;
    const message = ReactDOMFactories.div({}, `Select a damage target for Royal Guard`);
    const initialInput = createInitialInput(damageTargets, customKey, this.selectionChanged);
    const buttons = createButtons(this.cancel, this.ok);
    const panelClass = "bg-wc-medium f6";

    return React.createElement(ReactComponent.OptionPane, {
      key: customKey,
      panelClass,
      title: "Select Action",
      message,
      initialInput,
      buttons,
      titleClass: "b bg-wc-dark f6 tc wc-light"
    });
  }
}

DamageTargetDialog.propTypes = {
  callback: PropTypes.func.isRequired,
  damageTargets: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  player: PropTypes.shape().isRequired,

  customKey: PropTypes.string
};

DamageTargetDialog.defaultProps = {
  customKey: "DamageTargetDialog"
};

export default DamageTargetDialog;
