/* eslint no-underscore-dangle: ["error", { "allow": ["_count"] }] */

class CountVisitor {
  constructor() {
    this._count = 0;
  }

  get count() {
    return this._count;
  }

  visit() {
    this._count += 1;
  }
}

Object.freeze(CountVisitor);

export default CountVisitor;
