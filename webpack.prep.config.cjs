"use strict";

const path = require("path");

module.exports = {
  entry: "./scripts/prep-entry.js",
  target: "node",
  mode: "production",
  output: {
    path: path.resolve(__dirname, "scripts/dist"),
    filename: "workspace.cjs",
    library: { type: "commonjs2" },
    chunkFormat: "commonjs",
  },
  resolve: {
    fullySpecified: false,
  },
  optimization: {
    minimize: true,
  },
  stats: { errors: true, warnings: true },
};
