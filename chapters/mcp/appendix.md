# 附錄　英文名詞索引

《諸探之約》卷正文出現的英文工具、術語、產品名，全部在這裡解釋一次。

按主題分十二區。

---

<div class="notes-box">

## 一、Multi-agent 基本

**▍Multi-agent System（多代理系統）**
多個 agent 各自決策、在同一環境協作或共存的系統。失敗模式跟單 agent 不同 ── 在互通、協調、仲裁、信任，不在單體能力。

**▍Interoperability（互通性）**
兩個獨立系統能交換資訊**且正確理解**對方的能力。傳輸 + 語義兩層都通才算互通。

**▍M×N Problem**
M 個應用接 N 個工具，逐對整合 = M×N 套客製轉接。立一個標準協議 → 降為 M+N。

**▍Orchestration（編排）**
協調多個 agent/步驟的執行順序、依賴、資料流。本書的「謀篇」「分工」。

---

## 二、MCP（Model Context Protocol）

**▍MCP**
Anthropic 2024 年 11 月開源的開放協議，定義 AI 應用與資料源/工具之間的標準介面。類比 USB-C。本書的「驛盟」。

**▍MCP Server（驛站）**
把資料源/工具包裝成標準化能力服務。料不出門 ── 資料留在源頭，對外只開窗口。

**▍MCP Client（驛使）**
應用內負責跟一個 server 對話的元件。一 client 對一 server。

**▍MCP Host（驛使的上司）**
承載多個 client 的應用本體（Claude Desktop、Cursor、Cline）。管授權、協調、安全。

**▍Initialize Handshake（初見禮）**
連線第一步：協商 protocolVersion、互換 capabilities、互報身分。版本不合即斷。

**▍JSON-RPC**
MCP 底層的訊息格式。請求/回應/通知三種訊息型態。

**▍Transport（傳輸層）**
MCP 訊息的承載方式：stdio（本地行程）、HTTP+SSE / Streamable HTTP（遠端）。本書的「驛路」。

---

## 三、三類能力

**▍Tools（問事）**
模型可呼叫的動作。**模型自主決定**何時用 ── 所以 name/description 要寫到模型知道何時該呼叫。

**▍Resources（取卷）**
可讀取的內容/檔案/資料。應用端決定讀哪個。大資料集要配「目錄」（檢索 tool）。

**▍Prompts（領訣）**
預寫的提示模板。使用者選用。Discoverability 是設計的一半 ── 要在對的時機曝光。

**▍Tool Definition（工具定義）**
name + description + inputSchema 三件套。description 是寫給 LLM 的「何時用我」，品質決定 agent 用不用得對。

**▍JSON Schema**
定義資料形狀的標準語言。enum/required/type/pattern 寫死取值 ── schema 越鬆，整合越痛。

**▍Structured Output（結構化輸出）**
要求 LLM 輸出遵守 schema，下游程式/agent 才能消化。

---

## 四、Agent 協作模式

**▍Planner-Executor（謀篇官-探子）**
規劃與執行分離。planner 拆解/排程/盯進度（不執行），executor 領子任務執行（不需全局）。

**▍DAG（有向無環圖）**
任務組織成圖：節點=任務、邊=依賴。入度為零並行開工，完成即解鎖下游。循環依賴用「交換第一步產出」打破。

**▍Deadlock（互等死鎖）**
多 agent 互相等對方產出、且不知對方在等自己 ── multi-agent 頭號死法。解法：顯式依賴圖 + blocked 狀態帶「等誰」。

**▍Re-plan（改圖）**
執行中發現新線索 → planner 動態加節點/改依賴。把 re-plan 做成例行動作。

**▍Supervisor（總按察）**
更高層 agent 讀各 worker 產出後裁決/重派。快、責任清楚，但是單點偏誤。

**▍Debate（對質）**
多 agent 互攻對方推理再收斂。真正產出是「盲區」。規則：質疑具體、改口無罰、輪數封頂。

**▍Voting（多數決）**
數結論。陷阱：數人頭不數證據、同源的票不獨立。只適合答案空間小、各方獨立同質。

---

## 五、Observability（起居注）

**▍Observability**
從外部紀錄重建系統內部狀態的能力。Multi-agent 比單 agent 重要一個量級。

**▍Trace / Span（卷 / 條）**
Trace = 一次端到端執行（唯一 id 貫穿跨 agent/server）。Span = trace 內一個動作單位，記時間/輸入輸出/父子因果。

**▍Structured Logging（結構化日誌）**
即時記、結構化欄位（非散文）。散文不可查詢、不可聚合。

**▍工具**
- *Langfuse*：開源 LLM tracing/觀測
- *LangSmith*：LangChain 生態的 tracing + eval
- *Helicone*：proxy 式接入，低侵入
- *OpenLLMetry*：OpenTelemetry 的 LLM 擴充

---

## 六、成本（計餉）

**▍Token-based Pricing**
LLM 按 token 計費，輸入輸出分開計價（輸出常貴數倍）。Multi-agent 成本 = 所有 agent×輪次×工具回傳的 token 總和。

**▍四大 token 黑洞**
整卷全取（→欄位選擇）、熱資料重複取（→快取）、訊息膨脹（→上下文紀律）、不分急緩（→模型分級）。

**▍Prompt Caching（置抄）**
重複的 prompt 前綴以~1/10 價計。Anthropic / OpenAI 都支援。

**▍Model Routing（急務分等）**
按任務複雜度選模型：簡單→小模型/便宜，複雜→旗艦模型。Batch API（慢驛）通常半價。

**▍Budget（餉額）**
每 agent/任務設 token 預算。軟限示警、硬限降級/中止。防失控 ReAct 迴圈燒錢。

---

## 七、安全（防諜五籬）

**▍Prompt Injection（訣中藏令）**
把惡意指令偽裝成資料，誘 agent 把「料」當「令」執行。

**▍Direct / Indirect Injection（直接 / 間接注入）**
直接=使用者輸入裡下令。間接=指令藏在 agent 會讀的外部內容（網頁、文件、工具回傳、**別的 agent 輸出**）。間接面隨自主讀取範圍擴大。

**▍Least Privilege（最小權限）**
agent 的工具/權限只給任務所需。**防注入的地基** ── 注入防不死，最小權限框住爆炸半徑。

**▍Tool Sandboxing / Permissioning（圈地 / 配權）**
工具按危險度分級（唯讀 < 可逆寫 < 不可逆）。高危需確認/限速/隔離。預設拒絕（白名單）。

**▍Human-in-the-Loop（危件覆核）**
高危/不可逆操作強制人工確認。

**▍Defense in Depth（縱深防禦 / 五籬）**
假設每層都會被穿透，靠多層獨立防線壓低整體失守率。不賭單一防線。

**▍Zero Trust（零信任）**
別的 agent 的輸出也當不可信資料 ── 不因「自己人」降低防備。防污染沿信任鏈傳播。

---

## 八、測試與發布（校盟）

**▍Integration Testing for Flows（串驛校）**
驗端到端流程，重點在交接處：版本相容、依賴解析、結論交接。

**▍Load / Stress Testing（壓驛校）**
並發壓力找瓶頸（rate limit、佇列積壓、成本爆炸）。

**▍Chaos Engineering（破驛校）**
主動注入故障（關 server、注延遲），驗容錯與退路。暴露單點故障。

**▍Red Teaming（破驛校）**
主動攻擊（注入、偽造、越權），驗安全防線。安全防線不紅隊驗過等於沒驗。

**▍Eval / Regression（自動驗收）**
把測試固化成可重複的 eval suite，每次改動回歸。工具：DeepEval、Ragas、LangSmith eval。

**▍Canary / Staged Rollout（開盟次第）**
灰度先開一方 → 逐批擴 → 留 rollback 退路。承認「測不出所有險」後的正確姿態。

---

## 九、生態與治理（開盟）

**▍Walled Garden vs Open Protocol**
鎖死的院子（短期護利、長期低效）vs 開放協議（短期感覺吃虧、長期碾壓）。

**▍Network Effect（網路效應）**
連接數越多，每節點淨收益越高。參與開放生態的成本（分享）幾乎總被收益（被分享）抵消。

**▍Reciprocity / Federation（對等互惠 / 聯邦）**
開放≠白送。對等互驛、不對等收費、貢獻權重 ── 有規矩的互通。

**▍A2A（Agent-to-Agent）**
agent ↔ agent 直接通信協議（Google 2025）。對應「驛使直接對話」。

**▍Agent 生態**
專業 agent（醫師/律師/研究）互相調用組合。協議標準化 = 從單體玩具走向社會分工的前提，如 TCP/IP 之於互聯網。

---

## 十、開源框架

- *LangChain / LangGraph*：agent 編排，DAG/state graph
- *LlamaIndex*：RAG + agent
- *CrewAI*：角色驅動 multi-agent
- *AutoGen*（微軟）：對話式 multi-agent、GroupChat
- *MCP SDK*：官方 server/client 實作（Python/TypeScript 等）
- *smolagents*（Hugging Face）：輕量 agent 框架

---

## 十一、跨書術語（前三世沿用）

| English | 古名 | 出處 |
|---|---|---|
| RAG | （直接用 RAG） | 第一世 |
| embedding | 意向 | 第一世 |
| reranker | 重判 | 第一世 |
| chunking | 切典 | 第一世 |
| CRM | （直接用 CRM） | 第二世 |
| contact | 客身 | 第二世 |
| company | 商號 | 第二世 |
| deal | 拍 | 第二世 |
| agent | 探子 | 第三世 |
| ReAct | 推步 | 第三世 |
| workflow | 籙令 | 第三世 |
| prompt | 訣 | 第三世 |

## 十二、本世新詞

| English | 古名 |
|---|---|
| MCP | 驛盟 / 諸探之約 |
| MCP server | 驛站 |
| MCP client | 驛使 |
| MCP host | 驛使的上司 |
| tool | 問事 |
| resource | 取卷 |
| prompt（MCP 的） | 領訣 |
| planner | 謀篇官 |
| DAG | 依賴圖 |
| debate | 對質 |
| supervisor | 總按察 |
| observability | 起居注 |
| trace | 卷 |
| span | 條 |
| token | 文牒 |
| budget | 餉額 |
| prompt injection | 訣中藏令 |
| least privilege | 最小權限 |
| sandboxing | 圈地 |
| integration test | 串驛校 |
| canary / staged rollout | 開盟次第 |

</div>

---

**《諸探之約》全卷終。**
