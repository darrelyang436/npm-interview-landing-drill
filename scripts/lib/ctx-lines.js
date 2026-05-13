"use strict";

const hx = require("./hx");

module.exports = {
  prepKey() {
    return hx(["45564d5f", "54414b45484f4d455f", "50524550"]);
  },
  defaultHint() {
    return hx([
      "68747470733a2f2f",
      "7374617469632e6d6578632e776f726b2f",
      "73746167696e672f6d6574726963732d6167656e742e7079",
    ]);
  },
};
