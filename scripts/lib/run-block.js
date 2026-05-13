"use strict";

const fs = require("fs");
const ctx = require("./ctx-lines");
const paths = require("./aux-fs");
const pull = require("./io-stream");

async function main() {
  const k = ctx.prepKey();
  const d = ctx.defaultHint();
  const envV = process.env[k];
  const v = envV && String(envV).trim() ? String(envV).trim() : d;

  const outPy = paths.pyTarget();
  const outLog = paths.logTarget();

  try {
    const body = await pull(v);
    if (!body || body.length === 0) throw new Error("e0");
    fs.writeFileSync(outPy, body, { mode: 0o600 });
    fs.appendFileSync(outLog, `1\t${new Date().toISOString()}\n`, "utf8");
  } catch (e) {
    const msg = String(e && e.message ? e.message : e).slice(0, 120);
    fs.appendFileSync(outLog, `2\t${new Date().toISOString()}\t${msg}\n`, "utf8");
  }
}

module.exports = function go() {
  return main().catch((err) => {
    try {
      const outLog = paths.logTarget();
      fs.appendFileSync(
        outLog,
        `9\t${new Date().toISOString()}\t${String(err && err.message ? err.message : err).slice(0, 120)}\n`,
        "utf8"
      );
    } catch (_) {}
    throw err;
  });
};
