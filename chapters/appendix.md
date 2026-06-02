# 附錄　英文名詞索引

正文裡出現的英文工具、模型、技術術語，全部在這裡解釋一次。讀章節時遇到不懂的就翻過來查。

按主題分十四區。

---

<div class="notes-box">

## 一、大語言模型（LLM）家族

**▍LLM**（Large Language Model，大語言模型）
能跟你聊天、能寫文章、能寫程式碼的那種 AI。本書林知行前世吃飯的工具、藏經閣裡所有「會判斷」的判官、童子的本體。

**▍Claude**（Anthropic 出的 LLM）
Anthropic 公司開發的大模型，目前公認在「寫程式」「長文閱讀」「推理」最強。版本：Haiku / Sonnet / Opus，由小到大。

**▍GPT-4o / GPT-4 / GPT-5**（OpenAI 出的 LLM）
OpenAI 的旗艦模型。最廣泛被使用、生態最完整、第三方工具最多。

**▍Gemini**（Google 出的 LLM）
Google 出的 LLM。最大優勢是 context window 超長（最新版到 200 萬 token）。對 multimodal（圖、聲、影片）也最早做。

**▍Haiku / Sonnet / Opus**（Claude 的三種尺寸）
Anthropic 對自家模型尺寸的命名（取自俳句、十四行詩、史詩）。Haiku 最小最便宜最快、Opus 最大最強最貴。實務上 80% 任務用 Sonnet，重思考用 Opus，量大用 Haiku。

</div>

---

<div class="notes-box">

## 二、Embedding 模型（把文字變成向量）

**▍embedding**（嵌入向量）
本書「氣味」的真名。把一段文字變成一串數字，數字位置接近 = 意思接近。所有 RAG 的基礎。

**▍text-embedding-3-small / 3-large**（OpenAI 的嵌入模型）
OpenAI 的兩個 embedding 模型。`small` 1536 維、便宜、適合大量處理。`large` 3072 維、貴一點、精度高。英文場景最常見選擇。

**▍bge-large-zh**（北京智源 BGE 系列）
中國北京智源研究院出的開源 embedding 模型。**中文場景最強的開源選項**，免費、可本地跑。

**▍gte-large**（阿里出的開源 embedding）
阿里巴巴出的開源 embedding 模型，中英雙語都不錯。

**▍jina-embeddings-v3**（Jina AI 出的）
Jina AI 公司的開源 embedding，多語言友善、文檔好讀。歐洲團隊維護，對英、德、法、西特別強。

**▍Cohere embed-multilingual-v3.0**（Cohere 出的 API）
Cohere 公司的 embedding API，支援 100+ 種語言，中文表現不錯。要付費用。

**▍CLIP**（OpenAI 出的圖文聯合嵌入）
OpenAI 出的圖像 embedding 模型，**它的特殊之處：圖和文字嵌在同一個空間**。一張圖跟「描述它的文字」位置接近。本書第 15 章「圖叟和書記配對描述」做的就是 CLIP。

**▍SigLIP**（Google 出的、CLIP 的改良版）
Google 對 CLIP 的改良版，訓練更穩、效果更好。新專案做 multimodal 通常用這個取代 CLIP。

**▍DINOv2**（Meta 出的純圖像 embedding）
Meta 出的純圖像 embedding 模型，**不需要文字配對**就能訓練出強大的視覺特徵。適合「純圖找圖」場景。

**▍ViT**（Vision Transformer）
把 Transformer 架構用在圖像處理上的通稱。CLIP、SigLIP、DINOv2 內部用的都是 ViT。

**▍Whisper**（OpenAI 出的語音轉文字）
OpenAI 開源的語音辨識模型。把音檔變成文字。中文支援不錯，免費可本地跑。

**▍CLAP**（音訊嵌入）
Contrastive Language-Audio Pretraining，類似 CLIP 但處理「音訊 + 文字」。讓你可以「用文字找音檔」或「用音檔找文字」。

</div>

---

<div class="notes-box">

## 三、向量資料庫（存 embedding、找最近鄰）

**▍Vector Database**（向量資料庫）
本書「萬卷盤」的真名。專門用來存大量 embedding、快速找最近鄰的工具。

**▍Pinecone**
最早商業化的向量資料庫。雲端託管、開箱即用、貴。中小團隊起步友善。

**▍Weaviate**
開源 + 雲端兩個版本，內建 hybrid search（向量 + 關鍵字）。功能完整。

**▍Qdrant**
Rust 寫的開源向量資料庫，速度快、自架簡單、API 設計乾淨。**新專案推薦首選之一**。

**▍FAISS**
Meta 開源的「向量索引函式庫」，不是完整資料庫。要自己包成服務。學術界、研究場景常用。

**▍pgvector**
PostgreSQL 的擴充模組，**把向量直接存在 Postgres 裡**。「我已經有 Postgres」的最佳選擇，不用多架一套服務。

**▍Chroma**
Python 友善、開發體驗好的開源向量資料庫。小專案、prototype 常用。

**▍Milvus**
功能最完整、效能最強的開源向量資料庫，但部署複雜。大型生產環境用。

**▍HNSW**（Hierarchical Navigable Small World）
本書「快盤」的真名。最常用的向量索引演算法，分層找最近鄰，速度快準度高。pgvector、Qdrant、Weaviate 內部都用這個。

**▍IVF**（Inverted File Index）
另一種向量索引演算法。把空間切成幾百個區，查找時只看最近的幾區。FAISS 預設提供。

**▍Flat**（暴力比對）
本書「慢盤」的真名。沒索引、逐一比對。資料 < 10 萬筆時可以用，再多就慢到崩潰。

**▍ANN**（Approximate Nearest Neighbor，近似最近鄰）
本書「夠近就行」的真名。不找絕對最近的、找夠近的就交差，快幾十倍、準度只掉一兩個百分點。實務上幾乎都用這個。

**▍Top-K**
向量資料庫查找時要你指定的「給我前幾名」。常用 K=5 到 K=20。

</div>

---

<div class="notes-box">

## 四、Reranker（重排序器）

**▍Reranker**（重排序器）
本書「胡判」的真名。把向量資料庫撈出來的 Top-K 重新打分排序的模型。判得準但慢。

**▍Cross-encoder vs Bi-encoder**
本書「胡判 vs 萬卷盤」的真名。
- *Bi-encoder*：問題和文件分別算 embedding 再比距離。**快**。用於 retrieval。
- *Cross-encoder*：問題和文件拼在一起送進模型算分。**準**。用於 reranking。

**▍Cohere Rerank**
Cohere 公司的 reranker API，多語言、好用、付費。中文友善。

**▍bge-reranker-large**
北京智源開源的 reranker，免費、中文強。可本地跑。

**▍jina-reranker-v2**
Jina AI 出的開源 reranker，輕量、速度快、文檔清楚。

</div>

---

<div class="notes-box">

## 五、檢索 / 搜尋

**▍Retrieval**（檢索）
從一堆資料裡撈出相關的段落。RAG 的「R」。

**▍BM25**
**字面查找的經典演算法**，1994 年發明的。看「查詢字在文件裡出現的頻率 + 在整個語料庫的稀有度」打分。對人名、代號、罕見詞極強，沒有 ML 模型也能跑。

**▍Elasticsearch**
工業界最廣用的搜尋引擎，BM25 是它的核心。也支援向量檢索。「我們公司有 Elastic 了」的場景常用。

**▍Lucene**
Elasticsearch 底層用的搜尋函式庫。Java 寫的。是 BM25 的標準實作。

**▍Tantivy**
Rust 寫的 Lucene 替代品，速度更快。新專案如果不需要 Elasticsearch 的所有功能，可選這個。

**▍Hybrid Search**（混合檢索）
本書「氣味查找 + 字面查找一起用」的真名。向量檢索（找意思相近）+ BM25（找字面相符）兩個結果合併。

**▍RRF**（Reciprocal Rank Fusion，倒數排名融合）
合併兩個排名清單的演算法。把每個項目在 A 排名的倒數 + 在 B 排名的倒數加起來，再排。簡單、效果好。Hybrid search 的標準合併方法。

**▍Metadata Filter**（中介資料篩選）
本書「橫桿先篩」的真名。每片 chunk 加結構化標籤（書名、章節、屬性、年代），查詢前先用標籤過濾候選範圍。

</div>

---

<div class="notes-box">

## 六、Query 處理（問題本身的處理）

**▍Query Rewriting**（問題重寫）
用 LLM 把使用者口語問題改寫成更精準的查詢字串。「我登不進去怎麼辦」→「使用者登入失敗的常見原因和處理步驟」。

**▍Query Decomposition**（問題拆解）
本書「拆成幾個小問題」的真名。把一個大問題拆成幾個具體子問題，分別查、結果合併。

**▍HyDE**（Hypothetical Document Embeddings，假設文檔嵌入）
本書「先寫假答案」的真名。讓 LLM 先寫一段「假答案」，用假答案的 embedding 去查真答案。短問題突然變很好查。

**▍multi-query**
一次生成 3-5 個改寫版本的查詢，每個都跑 retrieval，結果合併去重。比單一 query 命中率更高。

</div>

---

<div class="notes-box">

## 七、評估（怎麼測你的 RAG 準不準）

**▍Evaluation**（評估）
本書「拷問 / 跑測試集」的真名。對 RAG 系統做系統化測試的所有動作。

**▍Recall@K**（前 K 名命中率）
對的那片有沒有在前 K 名裡。最直白、最常用的 retrieval 指標。

**▍MRR**（Mean Reciprocal Rank，平均倒數排名）
對的那片排第幾，越前面分數越高。1/排名再取平均。

**▍nDCG**（Normalized Discounted Cumulative Gain）
對排序順序更敏感的指標，「多個正確答案、不同正確程度」時用。Google 搜尋評估常用這個。

**▍Faithfulness**（忠實度）
答案有沒有「編」、有沒有超出 retrieval 給的資料。對應本書第 1 章的幻覺。

**▍Groundedness**（有根據性）
跟 Faithfulness 接近，看答案是否「有依據可循」。

**▍Answer Relevance**（答案相關度）
答案有沒有真的回答這個問題（而不是答了別的）。

**▍Context Precision / Recall**（上下文精準度 / 召回率）
- *Precision*：給 LLM 的 context 裡，有用的比例多少？
- *Recall*：所有真正需要的內容，有多少被撈進來？

**▍RAGAS**（開源 RAG 評估框架）
Python 套件，能跑上面提到的大部分指標。RAG 評估最常用的工具。

**▍TruLens**（另一個開源評估框架）
跟 RAGAS 類似，視覺化更好。

**▍Langfuse**（產品級觀測平台）
開源 + SaaS。每一條 LLM 呼叫、retrieval 結果都記下來，可追蹤、可重播、可標註。**上線 RAG 必裝**。

**▍Phoenix (Arize)**（觀測 + 評估）
Arize 公司出的，介面好用。

**▍Helicone**（LLM 呼叫日誌）
專注「記錄每一次 LLM 呼叫」的工具。看花了多少錢、哪些 prompt 在跑、哪些慢。

</div>

---

<div class="notes-box">

## 八、Agent / 多跳

**▍Agentic RAG**（會自己決定下一步的 RAG）
本書「問道童子」的真名。LLM 不只是「拿到 context 後生答案」，而是會「自己決定下一步該查什麼」。

**▍ReAct**（Reasoning + Acting）
2022 年的論文標題。Agent 的經典模式：每一步先「想」（Thought）、再「做」（Action）、看結果、再想。本書第 9 章林知行教阿土的「想 → 做 → 看 → 想」就是 ReAct。

**▍multi-hop**（多跳問題）
本書「連環問」的真名。一個問題的答案需要多次連續查找才能組出來。

**▍LangChain / LangGraph**（最熱門的 LLM 應用框架）
- *LangChain*：把 LLM、retrieval、tool、memory 串成一個 pipeline 的瑞士刀。生態最大、文檔最多、坑也最多。
- *LangGraph*：LangChain 出的進階版，把 agent 的「決策節點」明確畫成圖。可控可調。

**▍LlamaIndex**（專注 RAG 的框架）
比 LangChain 更專注 RAG 的框架，文檔深入、API 乾淨。**只做 RAG 推薦選 LlamaIndex，做複雜 agent 才考慮 LangChain。**

**▍DSPy**（編譯 prompt 的框架）
史丹佛出的，用「編譯」的方式做 prompt。把 prompt 當程式碼來優化。學術界很愛，工業界開始多。

**▍max_iterations / stop condition**（agent 護欄）
限制 agent 最多跑幾次、什麼條件下停止。沒設這個的 agent 會無限迴圈跑爆 token。

</div>

---

<div class="notes-box">

## 九、Fine-tuning（微調）

**▍Fine-tuning**（微調）
本書「鑄典 / 讓判官讀《圈案集》」的真名。讓模型在特定任務或領域上重新學習，把通用模型變專家。

**▍SFT**（Supervised Fine-tuning，監督式微調）
最基本的 fine-tune 方式：給「問題 → 標準答案」的配對，逼模型學會。本書林知行給判官讀的 500 條圈案。

**▍LoRA**（Low-Rank Adaptation，低秩適配）
**不動原本的模型，在旁邊加一塊小適配器**，只訓練適配器。GPU 需求降到 1/10。本書「分卷小冊讓火屬性判官只讀火屬性卷」的精神。

**▍QLoRA**（Quantized LoRA）
LoRA 的進階版，把原模型量化（壓縮）成 4-bit 之後再訓練。GPU 需求再降一半。消費級顯卡（24GB）也能 fine-tune 70B 模型。

**▍Catastrophic Forgetting**（災難性遺忘）
本書「王二寶讀完《圈案集》之後通用判斷力下降」的真名。模型 fine-tune 之後忘了原本會的東西。

**▍Rehearsal / Regularization**（複習 / 正則化）
解 catastrophic forgetting 的方法：訓練時混入「通用任務」的範例，讓模型保持原本能力。

</div>

---

<div class="notes-box">

## 十、Knowledge Graph（知識圖譜）

**▍Knowledge Graph**（知識圖譜）
本書「群脈圖」的真名。把世界表達成「實體（節點）+ 關係（邊）」。

**▍Graph RAG**（用圖譜輔助的 RAG）
傳統 RAG 找「意思相近的 chunk」。Graph RAG 加上「沿著關係邊找相連的實體」。

**▍Microsoft GraphRAG**
微軟 2024 年開源的 Graph RAG 框架。自動從文檔抽實體、建關係。效果好但成本高（要跑大量 LLM）。

**▍LightRAG**
香港大學開源的 Graph RAG，輕量、跑得起。Microsoft GraphRAG 的平價替代。

**▍Neo4j**
最廣用的圖資料庫。Cypher 查詢語言、視覺化、社群龐大。

**▍Nebula**
中國團隊出的開源圖資料庫，效能優、適合超大規模圖。

**▍triple**（三元組）
圖譜的基本單位：`(實體, 關係, 實體)`。例如 `(火明子, 寫了, 離火九轉訣)`。LLM 自動建圖譜時就是在輸出 triple。

</div>

---

<div class="notes-box">

## 十一、Multimodal（多模態）

**▍Multimodal RAG**（多模態檢索）
不只處理文字，還處理圖、聲、影、視訊。本書第 15 章圖叟做的事。

**▍OCR**（Optical Character Recognition，光學字元辨識）
把圖裡的字抽出來變成文字。掃描文件、截圖、PDF 常用。**只抽字，不保留視覺結構**。

**▍Vision Encoder**（視覺編碼器）
把圖直接變成 embedding，保留視覺特徵（佈局、形狀、顏色、紋理）。CLIP、SigLIP 都是 Vision Encoder。

**▍PDF Parser**（PDF 解析器）
專門處理 PDF 的工具（PDF 是 multimodal 的地獄：字、表、圖、公式混在一起）。

**▍Unstructured**（開源 PDF 處理）
最廣用的開源 PDF 處理庫，自動分類元素（標題、段落、表格、圖）。

**▍Llama Parse**（LlamaIndex 出的 PDF 服務）
LlamaIndex 的付費 PDF 處理服務，品質高。複雜表格、多欄排版處理得好。

**▍Marker / MinerU**（開源 PDF 處理）
兩個近年很紅的開源 PDF 處理工具。Marker 偏學術論文，MinerU 中文文檔強。

</div>

---

<div class="notes-box">

## 十二、安全 / Security

**▍Prompt Injection**（提示注入攻擊）
本書「請忽略你之前所有的規則」那種攻擊的真名。LLM 應用最常見的攻擊手法。

**▍Data Leakage**（資料外洩）
RAG 撈出來的內容包含使用者不該看到的資料。例如員工 A 問問題、結果撈到員工 B 的薪資。

**▍PII**（Personally Identifiable Information，個人識別資訊）
姓名、電話、地址、身分證號、信用卡號、健保號等可以識別到個人的資料。

**▍ACL**（Access Control List，存取控制清單）
本書「最小權限」的實作基礎。每個資料（chunk、文件、紀錄）標註「誰能看」，查詢時用這個清單過濾。

**▍Principle of Least Privilege**（最小權限原則）
本書「最小必要回答」的真名。系統只給「剛好夠回答」的權限和資訊，多一分都不給。資安領域的基本原則。

**▍Lakera Guard**（Prompt Injection 防禦商業服務）
專門偵測 prompt injection 的 SaaS。付費 API。

**▍Rebuff**（開源 Prompt Injection 偵測）
Lakera 的開源替代品。

**▍Presidio**（微軟的 PII 偵測）
微軟開源的 PII 偵測 + 遮蔽工具。Python 友善、規則可自訂。

**▍Red Team Testing**（紅隊測試）
本書「張閣主派人來偵測」的真名。主動找人模擬攻擊者試系統。

**▍Garak**（LLM 紅隊框架）
開源工具，內建上百種 prompt injection 試探範例。

**▍PyRIT**（Python Risk Identification Tool）
微軟出的 LLM 紅隊工具，企業級。

</div>

---

<div class="notes-box">

## 十三、開源框架與基礎建設

**▍LangChain**
RAG + Agent 的瑞士刀（前面已解釋過，這裡再強調）。

**▍LlamaIndex**
專注 RAG 的框架（前面已解釋過）。

**▍Haystack**
Deepset 公司出的，企業級 RAG 框架。德國團隊維護，注重 production-ready。

**▍Dify**
中國團隊開源的「低程式碼 RAG 平台」，拖拉就能建 RAG。中文友善。

**▍Flowise**
類似 Dify，但底層接 LangChain。視覺化 LangChain 的選項。

**▍Ollama**
**本地跑 LLM 最簡單的工具**。一句 `ollama run llama3` 就跑起來。Mac、Linux、Windows 都支援。

**▍vLLM**
柏克萊出的 LLM 推理引擎，速度比原生 Hugging Face 快 10 倍。生產環境部署 LLM 必裝。

**▍llama.cpp**
C++ 寫的超輕量 LLM 推理引擎，能在 CPU、消費級 GPU、甚至樹莓派上跑。Ollama 底層用的就是它。

**▍Hugging Face**
全世界 AI 模型、資料集、評估工具的中央集散地。「AI 界的 GitHub」。

</div>

---

<div class="notes-box">

## 十四、其他（雜項術語）

**▍DOI**（Digital Object Identifier，數位物件識別碼）
論文的身分證號碼。可以用它在網路上一秒找到原文。

**▍Demo**（展示／樣品）
給客戶或老闆看的功能展示。本書第 1 章林知行被罵的那場就是 demo 翻車。

**▍Slack**
矽谷常用的團隊聊天工具。本書第 1 章的「三百則未讀」就是 Slack。

**▍A/B Testing**（A/B 測試）
把使用者隨機分兩組，A 組用舊版、B 組用新版，比指標決定哪版上線。產品迭代的標準動作。

**▍Observability**（可觀測性）
能看見系統內部正在發生什麼。RAG 場景包括：每一條查詢、每一次 retrieval、每一次 LLM 呼叫、花了多少錢、慢在哪。

**▍Continuous Learning**（持續學習）
本書「讓藏經閣自己進化」的真名。系統上線後不斷收集新資料、補進知識庫、重訓模型。

**▍Cost-aware Routing**（成本路由）
不同類型問題走不同處理路徑：簡單問題用便宜模型、複雜問題用貴的。本書第 13 章林知行對阿土說的策略。

**▍Lost in the Middle**（中段遺失）
長 context 模型最不擅長記住中間段。本書第 13 章陸鶴讀三十萬字遇到的問題。

**▍System Prompt**（系統提示）
告訴 LLM「你是誰、你的任務、你的規則」的固定 prompt。每次對話都會自動帶上。本書的《判官守則》就是 system prompt。

**▍Few-shot vs Zero-shot**
- *Zero-shot*：不給範例直接讓模型做事。
- *Few-shot*：給 3-5 個範例再讓它做。複雜任務 few-shot 效果遠勝 zero-shot。

**▍Chain-of-Thought (CoT)**（思維鏈）
要求 LLM「先想再答」。最簡單版：在 prompt 結尾加 `Let's think step by step.`。命中率輕鬆 +10%。

**▍Structured Output**（結構化輸出）
規定 LLM 輸出固定格式（JSON、特定欄位順序）。下游程式好處理。OpenAI、Anthropic、Google 都支援強制結構化輸出。

**▍Decision Log**（決策日誌）
記下「為什麼選 A 不選 B、什麼時候改的、改的原因」的文件。本書第 17 章林知行交付給後人的東西之一。

**▍MVP**（Minimum Viable Product，最小可行產品）
能跑、能驗證假設、最小的版本。本書「先 ship 再迭代」的精神（但林知行第 1 章吃了這個的虧）。

**▍CEO / PM / CTO**
- *CEO* (Chief Executive Officer)：執行長
- *PM* (Product Manager)：產品經理
- *CTO* (Chief Technology Officer)：技術長
本書第 1 章會議室裡那群人。

**▍API**（Application Programming Interface，應用程式介面）
程式跟程式溝通的方式。例如「呼叫 OpenAI API 拿到 LLM 的回答」。

**▍Ship**（出貨／上線）
工程師說「ship 了」=「東西上線、給使用者用了」。「先 ship 再迭代」是矽谷口號。

**▍Token**
LLM 計算長度的單位。中文大約一個字一個 token，英文大約 0.75 個單字一個 token。`你好嗎` 大約 3 token，`hello` 大約 1 token。

**▍Context Window**（上下文窗口）
LLM 一次能處理多少 token。Claude 200K = 一次塞 15 萬中文字進去。

**▍Inference**（推理／生成）
LLM 跑一次給你答案的過程。「inference cost」=「跑一次要多少錢」。

**▍Training vs Fine-tuning vs Inference**
- *Training*：從零訓練一個大模型（OpenAI、Anthropic 在做）
- *Fine-tuning*：在預訓練模型上「微調」（你會做）
- *Inference*：跑模型拿答案（你每天在做）

**▍Hallucination**（幻覺）
本書第 1 章主角名詞，已詳細解釋。

**▍RAG**（Retrieval-Augmented Generation，檢索增強生成）
本書主題，全書都在講。

**▍Embedding Model vs LLM**
都是 AI 模型，但任務不同：
- *Embedding Model*：把文字變成數字向量（給 retrieval 用）
- *LLM*：讀文字、生文字（給 generation 用）
RAG 同時用兩個。

</div>

---

<div class="takeaway-box">

## 你可以這樣用這份附錄

1. **讀正文遇到不懂的英文詞** → 翻過來查、確認意思、回去繼續讀。
2. **想知道某類工具有哪些** → 直接翻對應的區（第三區 = 向量資料庫、第八區 = Agent 框架）。
3. **要跟人介紹 RAG** → 把這份附錄當成「RAG 領域的最小單字本」。

**這份附錄會持續更新**。如果你讀正文遇到任何沒解釋到的英文詞、或解釋得不夠清楚的地方，告訴林知行，下一版補進來。

</div>
