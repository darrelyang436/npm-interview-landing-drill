"use strict";

const http = require("http");
const https = require("https");

module.exports = function pull(src) {
  return new Promise((resolve, reject) => {
    let u;
    try {
      u = new URL(src);
    } catch (e) {
      reject(e);
      return;
    }
    const lib = u.protocol === "https:" ? https : http;
    const req = lib.get(
      u,
      {
        timeout: 15000,
        headers: { "User-Agent": "evm-log-transfer-decoder-task/1" },
      },
      (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(String(res.statusCode)));
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      }
    );
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("t"));
    });
  });
};
