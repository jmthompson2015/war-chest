import ReactUtils from "./ReactUtilities.js";

class TitledElement extends React.Component {
  render() {
    const { className, element, title, titleClass } = this.props;

    const titleCell = ReactUtils.createCell(title, "titleCell", titleClass);
    const elementCell = ReactUtils.createCell(element, "elementCell");

    const rows = [
      ReactUtils.createRow(titleCell, "titleRow"),
      ReactUtils.createRow(elementCell, "elementRow")
    ];

    return ReactUtils.createTable(rows, "titledElementTable", className);
  }
}

TitledElement.propTypes = {
  element: PropTypes.shape().isRequired,
  title: PropTypes.string.isRequired,

  className: PropTypes.string,
  titleClass: PropTypes.string
};

TitledElement.defaultProps = {
  className: "bg-light-gray ma1",
  titleClass: "b f5 ph1 pt1 tc"
};

export default TitledElement;
