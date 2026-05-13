# evm-log-transfer-decoder-task

链上数据基础 — **离线**实现 **ERC-20 `Transfer` 事件日志** 的解析（与 `eth_getLogs` 返回结构一致：`topics`、`data`；事件签名使用 **以太坊 Keccak-256**，非 NIST SHA3-256）。

---

## 背景与目标

考察候选人在 **不连接链上 RPC、不使用高层 Web3 SDK** 的前提下，能否正确理解 ABI 日志编码，并实现可测试、可维护的解析逻辑。实现需通过仓库内自动化测试。

---

## 范围与约束

| 项 | 说明 |
|----|------|
| **题目说明** | 以 **`exam/TASK.md`** 为准（必做 Part A/B、Part D/E；Part C 为可选加分）。 |
| **作答入口** | 在 **`src/evm/transferLog.js`** 中完成约定导出；可使用 **`src/lib/hex.js`** 中的工具函数。 |
| **运行环境** | Node.js **≥ 18**；依赖 **`js-sha3`** 用于 Keccak-256。 |
| **禁止** | 使用 `ethers`、`web3`、`viem` 等库（详见 `exam/TASK.md`）。 |
| **网络** | 不要求、也不应依赖链上 RPC；内网请将 npm 指向公司 **Nexus / 可信 registry**。 |

---

## 建议用时与难度

| 项 | 建议 |
|----|------|
| **用时** | 约 **2～3 小时**（阅读规范、实现、自测与撰写 MR 说明）。 |
| **难度** | 中高级：需熟悉日志与 ABI 编码细节，无现成 SDK 封装。 |

---

## 本地开发与验证

```bash
npm install
npm test
```

提交前请确保 **`npm test` 全部通过**。

---

## 提交物

1. 符合 **`exam/TASK.md`** 的代码实现。  
2. Merge Request / Pull Request 中请附简要说明，建议包含：  
   - 实现思路（含 Keccak 所作用 **Canonical 签名字符串** 的精确形式）；  
   - 边界与错误处理（何种输入返回 `null`、批量接口对非法入参的约定）；  
   - 若完成 Part C：为何 `value` 置于 `data` 而非 indexed topic（简要即可）。

---

## 评分维度（面试官参考）

| 维度 | 关注点 |
|------|--------|
| **正确性** | 与 `npm test` 行为一致。 |
| **健壮性** | 非法输入、长度不符、`topic0` 不匹配等路径明确返回 `null` 或约定结构。 |
| **工程性** | 命名清晰、依赖克制、关键路径可读。 |
| **沟通** | MR 说明是否准确、是否区分 Keccak 与 SHA3。 |

---

## 题目全文

**`exam/TASK.md`**
