import Endpoint from "./Endpoint.js";

class CardImage extends React.PureComponent {
  render() {
    const { card, resourceBase, width } = this.props;
    const canvasId = `CardImageCanvas${card.key}${width}`;
    const src = resourceBase + card.image;

    return ReactDOMFactories.img({
      key: canvasId,
      className: "br3",
      src,
      title: card.name,
      width
    });
  }
}

CardImage.propTypes = {
  card: PropTypes.shape().isRequired,

  resourceBase: PropTypes.string,
  width: PropTypes.number
};

CardImage.defaultProps = {
  resourceBase: Endpoint.NETWORK_RESOURCE,
  width: 250
};

export default CardImage;
