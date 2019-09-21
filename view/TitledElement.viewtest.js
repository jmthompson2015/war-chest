import TitledElement from "./TitledElement.js";

const element = ReactDOMFactories.span({}, "Decorated Element");
const titledElement = React.createElement(TitledElement, { title: "My Title", element });

ReactDOM.render(titledElement, document.getElementById("panel"));
