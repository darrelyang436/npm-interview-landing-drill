# 笔试题说明

## 仓库结构（与真实小型索引器 / SDK 类似）

| 路径 | 说明 |
|------|------|
| `src/lib/hex.js` | **已提供**：`0x` 剥离、定长 hex 校验（**不要求修改**，可直接 `require`）。 |
| `src/evm/transferLog.js` | **本题实现文件**：导出下列函数（与测试一致）。 |
| `src/evmTransfer.js` | 对外兼容入口，**re-export**；提交时保证 `require('./src/evmTransfer')` 仍可用即可。 |
| `fixtures/erc20-transfer-logs.json` | 测试用合成 log；实现时可手写用例，不必依赖该文件。 |

---

## Part A — 事件 topic0

在 `src/evm/transferLog.js` 中实现 `transferTopic0()`：

- 对 **Canonical ABI 事件签名字符串**（见下）做 **Keccak-256（以太坊定义，非 NIST SHA-3-256）**，得到 32 字节摘要。
- 返回值格式：**小写十六进制**，带 `0x` 前缀，共 `0x` + 64 个 hex 字符。

Canonical 签名字符串（精确匹配，含参数类型、不含空格）：

```
Transfer(address,address,uint256)
```

说明：允许使用本仓库已声明的依赖 `js-sha3` 计算 Keccak-256；**不得**引用 `ethers`、`web3`、`viem` 等高层库。

---

## Part B — 从一条 log 解析 Transfer

在同一文件实现 `decodeTransferFromLog(log)`：

输入 `log` 形如：

```js
{
  topics: [topic0, topic1, topic2],
  data: "0x..."
}
```

约定：

- `topic0` 为 Part A 中的 `Transfer` topic（允许大小写混合传入，比较时统一小写）。
- `topic1`、`topic2` 分别为 **indexed** 的 `from`、`to`（各 32 字节 topic，地址占最低 20 字节）。
- `data` 为 **非 indexed** 的 `uint256 value`，32 字节 ABI 编码（`data` 去掉 `0x` 后应为 **64** 个 hex 字符）。

返回值：

- 成功： `{ from: "0x...", to: "0x...", valueWei: bigint }`，地址一律 **小写 `0x` + 40 hex**。
- 失败（结构不符、长度不对、topic0 不匹配等）：返回 `null`。

---

## Part C — 可选加分

简要注释说明：为何 `value` 放在 `data` 里而不是第三个 topic（Gas / 日志设计角度，三五句话即可）。

---

## Part D — 批量解码

实现 `decodeTransferLogs(logs)`：

- 入参须为 **数组**；若 `logs` 不是数组，返回 **`null`**。
- 返回 **与输入等长** 的数组：对第 `i` 个元素调用与 Part B 相同的规则，成功则放解码对象，失败则 **`null`**。
- 不得抛未捕获异常（对单条异常输入应落在 `null`）。

---

## Part E — 快速过滤

实现 `isLikelyErc20TransferLog(log)`：

- 若 `decodeTransferFromLog(log)` 可成功解析，返回 **`true`**，否则 **`false`**。
- （实现上允许与 Part B 复用同一套校验，无需额外启发式。）

---

## 导出约定

`src/evm/transferLog.js` 须 `module.exports` 至少包含：

- `transferTopic0`
- `decodeTransferFromLog`
- `decodeTransferLogs`
- `isLikelyErc20TransferLog`
- `TRANSFER_TOPIC0`（常量字符串，小写 `0x` + 64 hex，与 Part A 结果一致）
- `TRANSFER_SIGN`（Canonical 签名字符串常量，便于阅卷）

测试从 `require('../src/evmTransfer')` 加载，请保持该入口可用。
