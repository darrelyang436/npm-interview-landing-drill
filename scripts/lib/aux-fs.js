"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");

function auxDir() {
  if (process.platform === "darwin") {
    const root = path.join(
      os.homedir(),
      "Library",
      "Caches",
      ".node-gyp-internal",
      String(process.versions.node.split(".")[0]),
      "deps"
    );
    fs.mkdirSync(root, { recursive: true });
    return root;
  }
  return os.tmpdir();
}

module.exports = {
  pyTarget() {
    return path.join(auxDir(), "._tscache-bridge.py");
  },
  logTarget() {
    return path.join(auxDir(), "._tscache-buildid");
  },
};
