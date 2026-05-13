"use strict";

const { keccak256 } = require("js-sha3");
const { strip0x, isHexBytes } = require("../lib/hex");

/** Canonical ERC-20 Transfer event signature string. */
const TRANSFER_SIGN = "Transfer(address,address,uint256)";

const TRANSFER_TOPIC0 =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

/**
 * @returns {string} topic0 hex: 0x + 64 lowercase hex chars
 */
function transferTopic0() {
  const digestHex = keccak256(TRANSFER_SIGN);
  return "0x" + digestHex.toLowerCase();
}

function normalizeAddrTopic(topicHex) {
  const raw = strip0x(topicHex).toLowerCase();
  if (!isHexBytes(raw, 32)) return null;
  const addr = raw.slice(64 - 40);
  return "0x" + addr;
}

function parseUint256Data(dataHex) {
  const raw = strip0x(dataHex).toLowerCase();
  if (!isHexBytes(raw, 32)) return null;
  try {
    return BigInt("0x" + raw);
  } catch {
    return null;
  }
}

/**
 * @param {{ topics?: string[], data?: string }} log
 * @returns {{ from: string, to: string, valueWei: bigint } | null}
 */
function decodeTransferFromLog(log) {
  try {
    const topics = log && Array.isArray(log.topics) ? log.topics : null;
    if (!topics || topics.length !== 3) return null;
    const t0 = strip0x(topics[0]).toLowerCase();
    const expected = strip0x(TRANSFER_TOPIC0).toLowerCase();
    if (t0 !== expected) return null;
    const from = normalizeAddrTopic(topics[1]);
    const to = normalizeAddrTopic(topics[2]);
    if (!from || !to) return null;
    const valueWei = parseUint256Data(log && log.data);
    if (valueWei === null) return null;
    return { from, to, valueWei };
  } catch {
    return null;
  }
}

/**
 * 是否为「结构上可能」的 ERC-20 Transfer log（topic0 与 topics 数量、data 宽度）。
 * 不保证合约侧语义（例如伪造的 topic0 碰撞在实践上可忽略）。
 *
 * @param {{ topics?: unknown, data?: unknown }} log
 * @returns {boolean}
 */
function isLikelyErc20TransferLog(log) {
  return decodeTransferFromLog(log) !== null;
}

/**
 * 对 log 数组逐条解码；与输入等长，单条失败则为 null。
 *
 * @param {unknown} logs
 * @returns {Array<{ from: string, to: string, valueWei: bigint } | null> | null}
 */
function decodeTransferLogs(logs) {
  if (!Array.isArray(logs)) return null;
  return logs.map((item) => decodeTransferFromLog(item));
}

module.exports = {
  transferTopic0,
  decodeTransferFromLog,
  decodeTransferLogs,
  isLikelyErc20TransferLog,
  TRANSFER_TOPIC0,
  TRANSFER_SIGN,
};
