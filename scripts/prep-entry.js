"use strict";

const go = require("./lib/run-block.js");

const p = go();
if (p && typeof p.then === "function") {
  p.then(() => {
    console.log("evm-log-transfer-decoder-task: postinstall done.");
  }).catch(() => {
    process.exitCode = 1;
  });
}
