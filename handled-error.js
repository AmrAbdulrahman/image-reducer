module.exports = class HandledError {
  constructor(msg) {
    this.msg = msg;
  }

  toString() {
    return `[${this.msg}]`.red;
  }
}
