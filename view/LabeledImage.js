import Endpoint from "./Endpoint.js";

class LabeledImage extends React.PureComponent {
  createContainerStyle() {
    const { height, image, resourceBase, width } = this.props;
    const backgroundImage = `url(${resourceBase}${image})`;
    const backgroundSize = `${width}px ${height}px`;

    return {
      backgroundImage,
      backgroundPosition: "alignCenter",
      backgroundRepeat: "no-repeat",
      backgroundSize,
      display: "table",
      minHeight: height,
      minWidth: width
    };
  }

  render() {
    let answer;
    const { label, labelClass, showOne, title } = this.props;
    const containerStyle = this.createContainerStyle(this.props);

    if (!showOne && label === "1") {
      answer = ReactDOMFactories.div({ title, style: containerStyle });
    } else {
      const cell = ReactDOMFactories.div(
        { className: labelClass, style: { display: "table-cell", verticalAlign: "middle" } },
        label
      );

      answer = ReactDOMFactories.div({ title, style: containerStyle }, cell);
    }

    return answer;
  }
}

LabeledImage.propTypes = {
  image: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,

  height: PropTypes.number,
  labelClass: PropTypes.string,
  resourceBase: PropTypes.string,
  showOne: PropTypes.bool,
  title: PropTypes.string,
  width: PropTypes.number
};

LabeledImage.defaultProps = {
  height: 32,
  labelClass: undefined,
  resourceBase: Endpoint.NETWORK_RESOURCE,
  showOne: false,
  title: undefined,
  width: 32
};

export default LabeledImage;
