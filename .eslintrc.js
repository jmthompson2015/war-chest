module.exports = {
  env: {
    browser: true,
  },
  extends: ["airbnb", "prettier"],
  globals: {
    GameEngine: true,
    Immutable: true,
    MCTS: true,
    PropTypes: true,
    QUnit: true,
    R: true,
    React: true,
    ReactComponent: true,
    ReactDOM: true,
    ReactDOMFactories: true,
    ReactGameBoard: true,
    ReactRedux: true,
    Redux: true,
  },
  rules: {
    "import/extensions": ["error", { js: "always" }],
    "max-len": ["error", { code: 100, ignoreUrls: true }],
  },
};
