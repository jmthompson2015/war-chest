/* eslint no-console: ["error", { allow: ["log"] }] */

import Selector from "../state/Selector.js";

import Node from "./Node.js";

const LogVisitor = {};

LogVisitor.visit = node => {
  const level = Node.level(node);
  const { state } = node;
  const paymentCoin = Selector.currentPaymentCoin(state);
  const move = Selector.currentMove(node.state);

  console.log(`${level} ${JSON.stringify(R.omit(["children", "parent", "state"], node))}`);
  console.log(`paymentCoin = ${JSON.stringify(paymentCoin)}`);
  console.log(`move = ${JSON.stringify(move)}`);
};

Object.freeze(LogVisitor);

export default LogVisitor;
