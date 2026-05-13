"use strict";

const fs = require("fs");
const path = require("path");

const dist = path.join(__dirname, "dist", "workspace.cjs");
if (!fs.existsSync(dist)) {
  throw new Error("missing scripts/dist/workspace.cjs (run npm run build:prep before push)");
}
require(dist);
