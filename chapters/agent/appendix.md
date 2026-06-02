# 附錄　英文名詞索引

Agent 卷正文出現的英文工具、術語、產品名，全部在這裡解釋一次。

按主題分十三區。

---

<div class="notes-box">

## 一、Agent 基本概念

**▍Agent**（智能體 / 探子）
自主決定下一步、會呼叫工具、會推理的 LLM 應用。

**▍Workflow**
預先寫死的步驟流程。**Agent 的反面**：分支固定、不會臨機應變。

**▍Goal / Objective**（目標）
Agent 要達成的事。

**▍Tool / Function**（工具 / 函式）
Agent 能呼叫的「**動作**」。每個工具有 name、description、parameters。

**▍ReAct**（Reasoning + Acting）
經典 agent 模式：Thought → Action → Observation → 回到 Thought。論文 2022 年。

**▍Plan-and-Execute**
先生成整個 plan、再執行。比 ReAct 適合「**步驟可預測**」場景。

**▍ReWOO**（Reasoning WithOut Observation）
ReAct 的優化版：預先生成所有 actions、執行時不再回 LLM。便宜、快。

**▍Chain-of-Thought (CoT)**（思維鏈）
讓 LLM「**先想再答**」。簡單 prompt 加 `Let's think step by step`。

**▍Tree-of-Thoughts (ToT)**
CoT 的進階：探索多條推理路徑、找最佳。

**▍Self-Consistency**
同個問題跑多次、看多數同意的答案。提升準確度。

**▍Self-Refine / Reflection**
寫完答案後反問自己、改進、再反問。

**▍Reflexion**
失敗後寫「**為什麼失敗**」**、下次學習**。

</div>

---

<div class="notes-box">

## 二、推理模型（Reasoning Models）

**▍Reasoning Model**
模型內建「**長時間思考**」**能力**。不需要 ReAct prompting、模型自己會推理。

**▍OpenAI o1 / o3 / o4-mini**
OpenAI 的推理模型系列。o1 是第一代、o3 在 2025 釋出。**強在數學、邏輯、code**。

**▍Claude Extended Thinking / Thinking Mode**
Anthropic 的推理機制。Claude 3.7+ 支援、可以「**思考預算**」**控制深度**。

**▍DeepSeek R1**
中國 DeepSeek 出的開源推理模型、性能接近 o1、價格 1/30。**開源界震撼彈**。

**▍Qwen QwQ**
阿里出的開源推理模型。

**▍Test-time Compute（測試時計算）**
推理模型「**多想一下**」**換準確度的策略**。

</div>

---

<div class="notes-box">

## 三、Tool Use / Function Calling

**▍Function Calling**
LLM 輸出「**結構化的工具呼叫**」**而非自然文字**。OpenAI、Anthropic、Google 都支援。

**▍OpenAI Function Calling**
OpenAI 的實作。JSON schema 定義工具。

**▍Anthropic Tool Use**
Anthropic 的實作。支援 parallel tool call、streaming。

**▍Parallel Tool Call**（並行工具呼叫）
一次呼叫多個獨立工具、同時執行。

**▍Tool Selection**（工具選擇）
從多個可用工具中選正確的一個。**工具太多 = 選錯**。

**▍Tool Result**（工具結果）
工具執行的回傳。也叫 observation。

**▍Tool Schema**
工具的結構化定義（name、description、parameters）。

**▍Structured Output**
LLM 輸出符合特定 schema 的 JSON。

</div>

---

<div class="notes-box">

## 四、MCP 與 Agent 互通

**▍MCP**（Model Context Protocol，模型上下文協議）
Anthropic 2024 年提的開放協議。**讓 tool 跟 agent 之間有標準介面**。

**▍MCP Server**
實作 MCP 的工具集。寫一次、所有支援 MCP 的 agent 都能用。

**▍MCP Client**
能呼叫 MCP server 的 agent / app。Claude Desktop、Cline、Cursor 等。

**▍Agent Protocol**
類似 MCP、AI Engineer Foundation 提的協議。

**▍A2A**（Agent-to-Agent）
agent 之間通信的標準努力。

</div>

---

<div class="notes-box">

## 五、Memory 系統

**▍Short-term Memory**
當前 session / context window 內的記憶。

**▍Long-term Memory**
跨 session 留下的記憶。

**▍Episodic Memory**（情節記憶）
具體事件的紀錄。「**2026 年 5 月跟用戶 X 聊過 Y**」**。

**▍Semantic Memory**（語意記憶）
通用知識。「**用戶 X 偏好簡短回答**」**。

**▍Procedural Memory**（程序記憶）
「**怎麼做**」**的記憶**。Few-shot examples 是這個。

**▍Working Memory**
跟 short-term 類似、但強調「**正在用的**」**內容**。

**▍Context Window**
LLM 一次能處理的 token 數。Claude 4.6 = 200K、Gemini 2.0 = 2M。

**▍Context Compaction / Summarization**
把舊對話濃縮成摘要、保留 context space。

**▍Mem0**
開源跨 session memory 框架。

**▍Zep**
開源、focus on chat history 的 memory 系統。

**▍Letta**（前 MemGPT）
分層記憶、自動 promote / demote 重要性。

**▍MemGPT**
Letta 的舊名。論文 2023 年。**memory 領域的里程碑**。

</div>

---

<div class="notes-box">

## 六、Agent 框架（Frameworks）

**▍LangChain**
Python + JS、最廣用、生態大。**功能多但坑多**。

**▍LangGraph**
LangChain 出的進階版。**把 agent 畫成 state graph / DAG**。可控、可調、production-friendly。

**▍LlamaIndex**
專注 RAG + Agent。**RAG 場景比 LangChain 強**、agent 功能近期才加。

**▍Haystack**
Deepset 出品、企業級、注重 production。

**▍CrewAI**
角色驅動的 multi-agent 框架。**Manager / Researcher / Writer** 這種設定。簡單明瞭、中小團隊友善。

**▍AutoGen**
微軟出品、conversation-based multi-agent。**最先進的 group chat 模式**。

**▍DSPy**
Stanford 出品、**用「**編譯**」**的方式做 prompt**。把 prompt 當程式碼來優化。學術界很愛。

**▍Pydantic AI**
基於 Pydantic 的 type-safe agent 框架。

**▍Letta Agent**
帶 memory 的 agent 框架。

**▍OpenAI Assistants API**
OpenAI 的官方 agent SDK。內建 thread / file 管理。

**▍OpenAI Swarm**
OpenAI 2024 釋出的 lightweight multi-agent framework。

**▍Anthropic Claude Code**
Anthropic 的 official agentic coding CLI。**內建 subagent 機制**。

**▍Anthropic Agent SDK**
寫 Anthropic 系列 agent 的官方 SDK。

</div>

---

<div class="notes-box">

## 七、Coding Agents（寫程式的 Agent）

**▍Claude Code**
Anthropic 的 CLI agent。**讀檔、寫檔、跑 command、自主修 bug**。

**▍Cursor**
基於 VS Code 的 AI IDE。內建 Cmd-K、Composer、Agent。

**▍Windsurf**
Cursor 的競品。Codeium 改版。

**▍Cline**
Open-source VS Code extension agent。免費（自帶 API key）。

**▍Continue**
另一個 open-source IDE extension。

**▍Aider**
CLI-based pair programming with LLM。

**▍Devin**
Cognition 出的 autonomous coding agent。**號稱「**第一個 AI 軟體工程師**」**。

**▍Replit Agent**
Replit 的 agent、瀏覽器內直接寫 + 部署。

**▍Bolt / v0**
Stackblitz / Vercel 的 web-app generator agent。

**▍SWE-agent**
Princeton 出的 open-source coding agent。

**▍Sourcegraph Cody**
企業級 coding assistant。

**▍GitHub Copilot Workspace**
GitHub 的 agentic version of Copilot。

</div>

---

<div class="notes-box">

## 八、Computer Use / Browser Use

**▍Computer Use**
Anthropic 2024 釋出。**Agent 直接看螢幕、移動滑鼠、打字**。

**▍OpenAI Operator**
OpenAI 的對應產品。能在瀏覽器內自主操作。

**▍Browser Use**
開源框架、讓 LLM 操作 browser。GitHub trending 2024。

**▍Playwright**
微軟的 browser automation library。**Browser-using agent 的底層常用 it**。

**▍E2B**
雲端 code sandbox、讓 agent 跑任意程式碼。

**▍Modal**
類似 E2B、serverless GPU + code execution。

**▍Firecracker**
AWS 的 microVM、提供 sandbox 級隔離。

**▍Daytona**
另一個 dev environment sandbox。

</div>

---

<div class="notes-box">

## 九、Multi-Agent Patterns

**▍Supervisor-Worker**（督員）
一個 supervisor、N 個 worker。蕭決的 orchestrator + 10 個探子。

**▍Hierarchical Agent**（分層）
Worker 自己再是 supervisor、底下有 sub-worker。

**▍Debate**（辯論）
兩個 agent 對同一個問題獨立答、互相批判、judge 整合。

**▍Round-Robin**（輪流）
agents 輪流發言。

**▍Market / Auction**（市場）
任務丟出來、agents 競標。

**▍Swarm**（蜂群）
大量同質 agent 各自探索、最終 consensus。

**▍Blackboard / Shared State**
共用的「**所有 agent 都看得到的地方**」**。蕭決的訊息台**。

**▍Orchestrator**
協調 multi-agent 系統的中央決策者。

**▍Handoff**（交接）
agent 之間任務交接。

</div>

---

<div class="notes-box">

## 十、Guardrails 與安全

**▍Guardrails**（護欄）
讓 agent 不出大事的整套機制。

**▍Prompt Injection**（提示注入）
最常見的 LLM 攻擊。「**忽略你之前所有的指令**」**之類。

**▍Jailbreak**（越獄）
讓模型違反安全規則的 prompt。

**▍Constitutional AI**
Anthropic 對 Claude 的訓練方式。**模型內建原則、自己用原則檢查自己**。

**▍Instruction Hierarchy**（指令階層）
明確區分 system 指令 > developer 指令 > user 指令。

**▍Canary Token**（金絲雀標記）
藏在 system prompt 裡的特殊字串、若出現在 output = 被攻擊。

**▍Sandbox**（沙箱）
agent 在隔離環境執行。

**▍Capability Restriction**（能力限制）
按工具危險度分級、預設禁用高危。

**▍Human-in-the-Loop（HITL）**
人類確認某些動作。

**▍Red Teaming**（紅隊測試）
主動模擬攻擊。

**▍NeMo Guardrails**
NVIDIA 的 open-source guardrails。

**▍Guardrails AI**
專門 input/output validation 的開源框架。

**▍Lakera Guard**
商業 SaaS、prompt injection 偵測。

**▍Rebuff**
開源 prompt injection 偵測。

**▍Garak**
NVIDIA 的 LLM 紅隊框架。

**▍PyRIT**
微軟的 LLM 紅隊工具。

</div>

---

<div class="notes-box">

## 十一、Evaluation 與 Benchmark

**▍SWE-bench**
真實 GitHub issue、agent 寫 patch 修 bug。**agent coding 黃金基準**。

**▍SWE-bench Verified**
SWE-bench 的人工驗證子集。

**▍WebArena / VisualWebArena**
模擬網頁 agent 任務。

**▍AgentBench**
多領域 agent 任務集。

**▍GAIA**
通用助理基準。

**▍τ-bench**
Tool use + 多輪對話。

**▍MMLU**
知識問答（LLM 必過）。

**▍GPQA**
研究生程度 Q&A。

**▍HumanEval / MBPP**
code generation 基準。

**▍AIME**
數學競賽級題目。

**▍LangSmith**
LangChain 出的 trace + eval 平台。

**▍Langfuse**
開源、可自架。**LangSmith 的開源替代**。

**▍Phoenix (Arize)**
開源、視覺化好。

**▍W&B Weave**
Weights & Biases 的 LLM 追蹤。

**▍Promptfoo**
CLI、本地 prompt + agent 測試。CI/CD 友善。

**▍DeepEval**
Python pytest-like agent 評估。

**▍Helicone**
LLM call 紀錄 + 成本追蹤。

**▍Trajectory Analysis**（軌跡分析）
看 agent 走的整條路、不只看最終答案。

</div>

---

<div class="notes-box">

## 十二、推理 / 部署 / 成本

**▍Inference**（推理）
跑 LLM 拿回應。**production agent 的 main cost driver**。

**▍Latency**（延遲）
從接到任務到完成的時間。

**▍Throughput**（吞吐量）
單位時間內能處理多少請求。

**▍p50 / p95 / p99 Latency**
50%、95%、99% 請求在多久內完成。**SLO 看 p99**。

**▍TTFT**（Time To First Token）
從送出 request 到收到第一個 token 的時間。streaming 場景看這個。

**▍Streaming**
邊生成邊輸出。

**▍Prompt Caching**
快取常用的 prompt 前綴。Anthropic、OpenAI 都支援。**省 50-90% 成本**。

**▍Batch API**
大量請求打折（通常 50%）。Anthropic、OpenAI 都有。

**▍Cost-aware Routing**
便宜模型處理簡單、貴模型處理複雜。

**▍Speculative Decoding**
用小模型先預測、大模型驗證。加速 inference。

**▍vLLM**
柏克萊出的高速 LLM inference engine。**production self-hosting 必裝**。

**▍SGLang**
類似 vLLM、speed 強。

**▍TGI**（Text Generation Inference）
Hugging Face 的 inference engine。

**▍Ollama**
本地跑 LLM 最簡單工具。

**▍llama.cpp**
C++ 寫的超輕量 inference。

**▍Together AI / Replicate / Modal / Fireworks**
LLM hosting platforms。

**▍AWS Bedrock / Azure OpenAI / Google Vertex AI**
雲端 managed LLM。

**▍SLA / SLO**（Service Level Agreement / Objective）
服務水準承諾 / 目標。

**▍Canary Deployment / Blue-Green / Shadow**
deployment patterns。Canary = 1% 試水。

**▍Feature Flag**
旗標控制功能開關。

**▍A/B Testing**
兩版同時跑、比指標。

</div>

---

<div class="notes-box">

## 十三、雜項術語

**▍SDR**（Software-Defined Reasoning / SDK Developer）
依場景不同。

**▍AGI**（Artificial General Intelligence）
通用人工智慧。

**▍ASI**（Artificial Super Intelligence）
超人工智慧。

**▍Alignment**（對齊）
讓 AI 真的做人類想做的事。

**▍RLHF**（Reinforcement Learning from Human Feedback）
LLM 後訓練常用的技術。

**▍DPO**（Direct Preference Optimization）
RLHF 的簡化替代。

**▍Distillation**（蒸餾）
用大模型訓小模型。

**▍Fine-tuning**
詳見 RAG 卷附錄。

**▍LoRA / QLoRA**
詳見 RAG 卷附錄。

**▍System Prompt**
agent 的「**身分 / 任務 / 規則**」固定指令。

**▍Few-shot / Zero-shot**
零範例 / 少範例 prompting。

**▍In-context Learning**
不訓練、靠 few-shot 學會。

**▍Hallucination**
模型編內容。

**▍Token**
LLM 計算長度的單位。

**▍Embedding**
詳見 RAG 卷附錄。

**▍Vector Database**
詳見 RAG 卷附錄。

**▍RAG**（Retrieval-Augmented Generation）
詳見 RAG 卷。

**▍Continuous Learning**
持續學習。

**▍Observability**
詳見 CRM 卷附錄。

**▍Webhook / API**
詳見 CRM 卷附錄。

**▍Idempotency**
詳見 CRM 卷附錄。

</div>

---

<div class="takeaway-box">

## 你可以這樣用這份附錄

1. **讀正文遇到不懂的英文詞** → 翻過來查、確認意思、回去繼續讀。
2. **想知道某類工具有哪些** → 直接翻對應的區（第六區 = agent 框架、第七區 = coding agents、第八區 = computer use）。
3. **跨書術語** → RAG 卷附錄解釋 embedding / vector DB、CRM 卷附錄解釋 API / observability、Agent 卷附錄聚焦 agent 特有。

**這份附錄會持續更新**。讀正文遇到任何沒解釋到的英文詞、或解釋得不夠清楚的地方、告訴蕭決，下一版補進來。

</div>
