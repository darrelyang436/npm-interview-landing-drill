"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");

const {
  transferTopic0,
  decodeTransferFromLog,
  decodeTransferLogs,
  isLikelyErc20TransferLog,
  TRANSFER_TOPIC0,
} = require("../src/evmTransfer");

const fixtures = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "fixtures", "erc20-transfer-logs.json"), "utf8")
);

describe("Part A — transferTopic0", () => {
  it("returns canonical 0x-prefixed 32-byte topic (lowercase)", () => {
    const t = transferTopic0();
    assert.equal(typeof t, "string");
    assert.match(t, /^0x[0-9a-f]{64}$/);
    assert.equal(t, TRANSFER_TOPIC0);
  });
});

describe("Part B — decodeTransferFromLog", () => {
  it("decodes simple fixture (12345 wei)", () => {
    const log = fixtures.samples.simple12345Wei;
    const r = decodeTransferFromLog(log);
    assert.ok(r);
    assert.equal(r.from, "0x1111111111111111111111111111111111111111");
    assert.equal(r.to, "0x2222222222222222222222222222222222222222");
    assert.equal(r.valueWei, 12345n);
  });

  it("accepts topic0 with uppercase hex", () => {
    const r = decodeTransferFromLog(fixtures.samples.topic0Uppercase);
    assert.ok(r);
    assert.equal(r.valueWei, 1n);
  });

  it("returns null for wrong topic count", () => {
    assert.equal(decodeTransferFromLog(fixtures.samples.wrongTopicCount), null);
  });

  it("returns null for bad data width", () => {
    assert.equal(decodeTransferFromLog(fixtures.samples.badDataWidth), null);
  });

  it("returns null for non-matching topic0", () => {
    assert.equal(decodeTransferFromLog(fixtures.samples.wrongTopic0), null);
  });

  it("returns null on malformed input", () => {
    assert.equal(decodeTransferFromLog(null), null);
    assert.equal(decodeTransferFromLog({}), null);
    assert.equal(decodeTransferFromLog({ topics: [], data: "0x" + "0".repeat(64) }), null);
  });
});

describe("Part D — decodeTransferLogs", () => {
  it("returns null when input is not an array", () => {
    assert.equal(decodeTransferLogs(null), null);
    assert.equal(decodeTransferLogs({}), null);
  });

  it("maps fixtures to parallel results with null for invalid rows", () => {
    const logs = [
      fixtures.samples.simple12345Wei,
      fixtures.samples.wrongTopicCount,
      fixtures.samples.topic0Uppercase,
    ];
    const out = decodeTransferLogs(logs);
    assert.ok(Array.isArray(out));
    assert.equal(out.length, 3);
    assert.ok(out[0]);
    assert.equal(out[1], null);
    assert.ok(out[2]);
  });

  it("empty array yields empty array", () => {
    assert.deepEqual(decodeTransferLogs([]), []);
  });
});

describe("Part E — isLikelyErc20TransferLog", () => {
  it("is true iff decodeTransferFromLog succeeds", () => {
    assert.equal(
      isLikelyErc20TransferLog(fixtures.samples.simple12345Wei),
      true
    );
    assert.equal(isLikelyErc20TransferLog(fixtures.samples.wrongTopic0), false);
  });
});
