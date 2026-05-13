"use strict";

/**
 * @param {unknown} h
 * @returns {string} hex without 0x prefix, may be empty if invalid type
 */
function strip0x(h) {
  if (typeof h !== "string") return "";
  const s = h.trim();
  return s.startsWith("0x") || s.startsWith("0X") ? s.slice(2) : s;
}

/**
 * @param {string} hexNo0x lowercased
 * @param {number} byteLen
 * @returns {boolean}
 */
function isHexBytes(hexNo0x, byteLen) {
  if (typeof hexNo0x !== "string") return false;
  if (hexNo0x.length !== byteLen * 2) return false;
  return /^[0-9a-f]*$/.test(hexNo0x);
}

module.exports = {
  strip0x,
  isHexBytes,
};
