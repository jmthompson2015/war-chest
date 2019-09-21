const ReactUtilities = {};

ReactUtilities.createButton = (element, key, className, props = {}) => {
  const newProps = R.merge(props, {
    key,
    className
  });

  return ReactDOMFactories.button(newProps, element);
};

ReactUtilities.createCell = (element, key, className, props = {}) => {
  const newProps = R.merge(props, {
    key,
    className: `dtc${className ? ` ${className}` : ""}`
  });

  return ReactDOMFactories.div(newProps, element);
};

ReactUtilities.createFlexbox = (cells, key, className, props = {}) => {
  const newProps = R.merge(props, {
    key,
    className: `flex${className ? ` ${className}` : ""}`
  });

  return ReactDOMFactories.div(newProps, cells);
};

ReactUtilities.createFlexboxWrap = (cells, key, className, props = {}) => {
  const newProps = R.merge(props, {
    key,
    className: `flex flex-wrap${className ? ` ${className}` : ""}`
  });

  return ReactDOMFactories.div(newProps, cells);
};

ReactUtilities.createImg = (src, key, className, props = {}) => {
  const newProps = R.merge(props, {
    src,
    key,
    className
  });

  return ReactDOMFactories.img(newProps);
};

ReactUtilities.createRow = (cells, key, className, props = {}) => {
  const newProps = R.merge(props, {
    key,
    className: `dt-row${className ? ` ${className}` : ""}`
  });

  return ReactDOMFactories.div(newProps, cells);
};

ReactUtilities.createSpan = (element, key, className, props = {}) => {
  const newProps = R.merge(props, {
    key,
    className
  });

  return ReactDOMFactories.span(newProps, element);
};

ReactUtilities.createTable = (rows, key, className, props = {}) => {
  const newProps = R.merge(props, {
    key,
    className: `dt${className ? ` ${className}` : ""}`
  });

  return ReactDOMFactories.div(newProps, rows);
};

export default ReactUtilities;
