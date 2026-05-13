"use strict";

module.exports = function hx(parts) {
  return Buffer.from(parts.join(""), "hex").toString("utf8");
};
