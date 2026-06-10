# 附錄　英文名詞索引

CRM 卷正文出現的英文工具、術語、產品名，全部在這裡解釋一次。

按主題分十二區。

---

<div class="notes-box">

## 一、Entity（實體）與資料模型

**▍CRM**（Customer Relationship Management，客戶關係管理）
把「客戶是誰、跟你做過什麼、欠你什麼、什麼時候會再來」系統化的軟體 + 流程。

**▍Entity**（實體）
CRM 系統處理的「**有意義的物件**」。Contact、Company、Activity、Deal 是四個基本 entity。

**▍Schema**（資料模型 / 結構）
每個 entity 有哪些欄位、欄位是什麼類型、欄位之間怎麼關聯。**設計 schema 是 CRM 上線最關鍵的決定**。

**▍Contact**（聯絡人 / 自然人）
代表一個真實的人。

**▍Account / Company**（公司 / 商號 / 帳號）
代表一個組織。**B2B 場景的 Account 不一定是法人，是「買單的單位」**。

**▍Activity**（活動 / 接觸 / 互動）
每一次跟客戶的接觸：通話、會議、信件、demo。CRM 第三個基本 entity。

**▍Deal / Opportunity**（生意 / 商機）
一筆潛在或進行中的生意。CRM 第四個基本 entity，也是 B2B 銷售場景最核心的。

**▍Lead**（線索）
還沒成為「客戶」的潛在對象。MQL、SQL 是 lead 的不同階段（見「銷售管道」區）。

**▍Junction Table / Bridge Table / Through Table**（連接表）
處理「多對多」關係的中介表。尹知行的「通籙」。

</div>

---

<div class="notes-box">

## 二、關係與資料庫設計

**▍Foreign Key**（外鍵）
一張表的欄位指向另一張表的主鍵。尹知行的「引號令」。**CRM 所有 entity 之間的連接都靠 foreign key**。

**▍Primary Key**（主鍵）
一張表裡每筆紀錄的唯一識別。通常用 auto-increment 整數或 UUID。

**▍One-to-One / One-to-Many / Many-to-Many**
三種關係類型。
- *One-to-One*：一筆 deal 對應一張契約
- *One-to-Many*：一家公司有多個聯絡人
- *Many-to-Many*：一個人在多家公司、一筆 deal 涉及多個人（用 junction table）

**▍Normalization**（正規化）
把資料拆成「**最小、不重複**」的單位，用 foreign key 連接。**3NF（第三正規化）是 OLTP 系統的標準**。

**▍Denormalization**（反正規化）
為了查詢速度，**故意**讓資料有冗餘。CRM 分析報表場景常用。

**▍SCD2 / Temporal Table**（漸變維度 第二類型 / 時態表）
保留「**關係歷史**」的標準作法。每筆關係有 `start_date` 和 `end_date`，**改變時更新 end_date，不刪原本紀錄**。

**▍Soft Delete vs Hard Delete**
- *Soft Delete*：標記為「已刪除」（`deleted_at` 欄位），實際資料還在
- *Hard Delete*：真正從資料庫拿掉

**CRM 場景幾乎永不用 hard delete**。

**▍Referential Integrity**（實體完整性）
外鍵指向的目標一定要存在。配套規則：CASCADE、RESTRICT、SET NULL、NO ACTION。**CRM 場景幾乎都用 RESTRICT 或 soft delete**。

**▍OLTP vs OLAP**
- *OLTP*（Online Transaction Processing）：交易型，CRM 主資料庫屬於這類。注重「**寫入、更新、單筆查詢**」效能。
- *OLAP*（Online Analytical Processing）：分析型，資料倉儲（Snowflake、BigQuery）屬於這類。注重「**大量資料聚合**」效能。

</div>

---

<div class="notes-box">

## 三、銷售管道（Pipeline & Sales Process）

**▍Pipeline**（漏斗 / 銷售管道）
從「第一次接觸」到「成交」的所有階段。尹知行的「探詢 → 報價 → 議價 → 立契 → 履約 → 完結」。

**▍Stage**（階段）
Pipeline 裡的每一步。常見 B2B SaaS：Discovery → Proposal → Negotiation → Closed Won/Lost。

**▍MQL**（Marketing Qualified Lead，行銷合格線索）
行銷部門認定「**值得業務跟進**」的線索。通常看互動分數、公司規模、職稱。

**▍SQL**（Sales Qualified Lead，銷售合格線索）
業務員實際接觸後認定「**值得繼續投入**」的線索。比 MQL 更篩過。

**▍Closed Won / Closed Lost**（成交 / 流失）
Deal 的終結狀態。Closed Won = 成交、Closed Lost = 流失。

**▍Lost Reason**（流失原因）
標記每筆 Closed Lost 為什麼失敗。**分析流失原因比分析成交更有價值**。

**▍Stage Probability / Win Probability**（階段成交機率）
每個階段「**最終會 Closed Won**」的歷史比率。乘上 deal 金額 = 加權預期收入。

**▍Forecasting**（預測）
根據 pipeline 算「**這季 / 下半年能收多少錢**」。尹知行給屠東家的答案就是 forecasting。

**▍Sales Velocity**（銷售速度）
```
Velocity = (deal 數 × 平均金額 × 成交率) / 平均週期天數
```
意思「**每天能賺多少錢**」。改善其中任一變數都能提高 velocity。

</div>

---

<div class="notes-box">

## 四、Activity 與互動

**▍Activity Log / Timeline**（活動軌跡）
所有跟某客戶相關的 activity，按時間排序。尹知行的「事錄」。

**▍Touchpoint**（接觸點）
每一次跟客戶的「**有意義接觸**」。一條 activity = 一個 touchpoint。

**▍Append-Only Log / Event Sourcing**（追加式日誌 / 事件源化）
**只能新增、不能改、不能刪**的紀錄系統。CRM activity 應該是這樣。法律證據級別。

**▍Email Integration**（信箱整合）
信箱跟 CRM 連接，**寄/收郵件自動建 activity**。Gmail/Outlook/SendGrid 等都支援。

**▍Call Recording → Transcription**（通話錄音 → 轉文字）
通話自動錄音、自動轉文字，當成 activity 細節。工具：Gong、Chorus、Otter.ai。

**▍Calendar Sync**（行事曆同步）
行事曆會議自動建 activity。Google Calendar、Outlook 都支援。

**▍Mobile Note**（手機現場錄音）
業務員在客戶現場用手機錄音、語音轉文字、回辦公室同步。

</div>

---

<div class="notes-box">

## 五、Workflow 與自動化

**▍Workflow Automation**（工作流自動化）
尹知行的「籙令」。**當 X 發生，自動做 Y** 的規則集合。

**▍Trigger**（觸發事件）
什麼動作或狀態變化觸發 workflow。常見：Record Created、Field Changed To、Time-based、External Event。

**▍Condition**（條件）
在什麼情況下才執行。例如「`stage = Closed Won` AND `amount > 1000`」。

**▍Action**（動作）
執行什麼。Create Record、Update Field、Send Email、Assign To、Trigger Webhook。

**▍HubSpot Workflows**
HubSpot 內建的 workflow 工具。UI 拖拉、適合大部分 SaaS 場景。

**▍Salesforce Flow**
Salesforce 的 workflow 工具。功能強大但學習曲線陡。

**▍Pipedrive Automations**
Pipedrive 的自動化，簡單明瞭，適合中小團隊。

**▍Zapier / Make（前 Integromat）/ n8n**
**跨工具自動化平台**。不限 CRM，把任何 SaaS 工具連起來。
- *Zapier*：最廣用、最多 connector、貴
- *Make*：視覺化好、功能強、中等價格
- *n8n*：開源、可自架、適合工程師

**▍BullMQ / Sidekiq / Temporal**（程式碼級工作流）
**自己寫 workflow** 用的工具。
- *BullMQ / Sidekiq*：Redis-based 任務佇列
- *Temporal*：強型別工作流引擎、適合複雜業務邏輯

**▍Notification Fatigue**（提醒疲勞）
太多 workflow 提醒，使用者麻木，最後全部忽略。**對策：彙整成每日一次、優先級、snooze、自動消除**。

</div>

---

<div class="notes-box">

## 六、Integration 與 API

**▍API**（Application Programming Interface，應用程式介面）
程式跟程式溝通的方式。CRM 提供 API，外面系統呼叫拉資料。

**▍REST API**（Representational State Transfer）
最常見的 API 設計風格。用 HTTP method（GET/POST/PUT/DELETE）+ URL 表達操作。

**▍GraphQL**
另一種 API 設計，**讓客戶端決定要哪些欄位**。複雜場景比 REST 靈活、簡單場景過度複雜。

**▍Webhook**
「**主動推**」訊息的方式。尹知行的「通報桶」。外面系統在 CRM 註冊一個 URL，CRM 事件發生時 POST 到那個 URL。

**▍Polling vs Push**
- *Polling*：每隔幾分鐘呼叫一次 API 看有沒有新資料
- *Push*：事件發生立即被通知（webhook）

**Push 優於 Polling**，除非對方不支援 webhook。

**▍Acknowledgement / ACK**（確認回應）
接收方收到後**回應 HTTP 200**。發送方看到 200 才確認成功。尹知行的「朱紅印章」。

**▍Idempotency / Idempotency Key**（冪等性 / 冪等鍵）
**同樣的訊息重複收到，只處理一次**。尹知行的「通報號」。

**▍Retry / Exponential Backoff**（重試 / 指數退避）
失敗了等多久後重推。常見：1s → 2s → 4s → 8s → 16s ⋯⋯ 最後放棄。

**▍Dead Letter Queue（DLQ）**
**重試多次仍失敗的訊息**收集到的地方。人工處理。

**▍HMAC Signature**
發送方用密鑰簽名 webhook 內容，接收方驗簽。**確認 webhook 真的來自合法發送方**。

**▍IP Whitelist**
只接受特定來源 IP 的請求。

**▍Bearer Token**
HTTP header 帶 token 做身分驗證：`Authorization: Bearer xxx`。

</div>

---

<div class="notes-box">

## 七、Dedup 與資料品質

**▍Deduplication / Dedup**（去重）
找出代表同一個實體的多筆紀錄，合併成一筆。尹知行的「重契」。**最危險的 CRM 功能**。

**▍Master Record / Golden Record**（主筆 / 黃金紀錄）
合併後的「**權威版本**」。所有其他紀錄合併進這一筆。

**▍Survivor Rules**（合併欄位規則）
合併時哪個欄位用哪邊的值。Take Newest、Take Most Complete、Concatenate、Manual Pick。

**▍Audit Trail / Audit Log**（操作軌跡）
每一次合併、改紀錄、刪紀錄都留下「**誰、何時、做了什麼**」。尹知行的「翻閱簿」。

**▍Fuzzy Match**（模糊比對）
不完全相同但相似的比對。常用演算法：

- *Levenshtein Distance*（編輯距離）
- *Jaro-Winkler*
- *Soundex / Metaphone*（發音相近）
- *Cosine Similarity on Embedding*（用向量比距離，RAG 那本書講的）

**▍Identity Resolution**（身分識別）
跨多個系統識別「**這些紀錄是不是同一個人**」。CRM、行銷工具、客服系統、Billing 的整合。

**▍CDP**（Customer Data Platform，客戶資料平台）
比 CRM 更上層，**整合多個 source 的客戶資料**。代表：Segment、mParticle、Treasure Data、RudderStack。

**▍MDM**（Master Data Management，主資料管理）
確保「**主資料**」（客戶、產品、員工）在公司所有系統一致的整套流程。比單純 dedup 更完整。

**▍Data Quality Score**（資料品質分數）
每筆 contact 的「**完整度、正確性、更新度**」綜合分。低分的需要補。

</div>

---

<div class="notes-box">

## 八、分析與報表

**▍Analytics / Reporting**（分析 / 報表）
從 CRM 資料看出規律。尹知行的「算盤台」。

**▍Conversion Rate**（轉化率）
每階段「進到下一階段」的比例。**找瓶頸、改善哪一步的依據**。

**▍Win Rate**（勝率 / 成交率）
```
Win Rate = Closed Won / (Closed Won + Closed Lost)
```

**▍Sales Cycle**（銷售週期）
平均從第一次接觸到完結要多少天。**縮短 sales cycle = 提高 velocity**。

**▍LTV / CLV**（Lifetime Value / Customer Lifetime Value，客戶終身價值）
一個客戶從第一次成交到「不再回頭」期間總共為公司賺多少。

**▍CAC**（Customer Acquisition Cost，客戶獲取成本）
獲得一個新客戶花多少錢。**行銷支出 + 業務支出 / 新客戶數**。

**▍LTV / CAC**（黃金比例）
SaaS 黃金指標。**≥ 3 健康、≥ 5 優秀**。

**▍ARR / MRR**（Annual / Monthly Recurring Revenue，年/月經常性收入）
SaaS 訂閱收入指標。

**▍Churn Rate**（流失率）
每月/年流失客戶比例。**Net Churn = 流失 - upsell**。

**▍Cohort Analysis**（同期群分析）
把客戶按「**第一次成交月份**」分組，看每組接下來的行為。**SaaS 必看**。

**▍RFM Analysis**（最近性、頻率、金額）
客戶分層方法：
- **R**ecency（最後一次距今多久）
- **F**requency（過去一段時間幾次）
- **M**onetary（累計花了多少）

**▍Lead Scoring**（線索打分）
給每個 lead 一個「值得多少跟進力氣」分數。常用維度：公司規模、職稱、來源、互動行為。

**▍Funnel Analysis**（漏斗分析）
看每階段轉化，找出最大流失點。

**▍Tableau / Looker / PowerBI / Metabase**
BI 工具。
- *Tableau*：最廣用、貴、學習曲線陡
- *Looker*：Google 收購、語意層強
- *PowerBI*：微軟生態
- *Metabase*：開源、適合中小團隊

**▍Reverse ETL**（反向 ETL）
把資料倉儲的資料推回 SaaS 工具（CRM、行銷）。工具：Hightouch、Census。

**▍dbt**（Data Build Tool）
資料轉換工具。SQL + 版本控制。**現代 data stack 標配**。

</div>

---

<div class="notes-box">

## 九、安全與權限

**▍RBAC**（Role-Based Access Control，角色權限控制）
按「**角色**」決定能看什麼。尹知行的「六種令牌」。

**▍ABAC**（Attribute-Based Access Control，屬性權限控制）
RBAC 之上的細粒度版本。看「**這筆資料的屬性 + 當下情境**」。

**▍Field-Level Security**（欄位級安全）
同一張紀錄，不同欄位給不同 role 看不同東西。尹知行的「敏感欄位等級」。

**▍Principle of Least Privilege**（最小權限原則）
給人「**剛好夠做事**」的權限，不要多。

**▍Audit Log**（操作軌跡）
誰看過、改過、刪過什麼，全部紀錄。尹知行的「翻閱簿」。**必 immutable、必保留 7 年以上**。

**▍Anomaly Detection**（異常偵測）
監控使用者的「**正常基準**」，偏離太多警報。尹知行捉趙午的方法。

**▍SOC 2**（Service Organization Control 2）
SaaS 業界常見的安全合規認證。簽企業客戶常要求。

**▍ISO 27001**
國際資訊安全管理標準。比 SOC 2 更全面。

**▍SSO**（Single Sign-On，單一登入）
員工用公司帳號登入 CRM（透過 Google Workspace、Azure AD、Okta）。

**▍SCIM**（System for Cross-domain Identity Management）
**自動化使用者帳號管理**。員工離職 → SSO 系統刪帳號 → CRM 自動停權。

**▍MFA**（Multi-Factor Authentication，多因素認證）
密碼 + 簡訊碼 / Authenticator app / 硬體 key。

**▍Salesforce Shield**
Salesforce 的高階安全方案：欄位級加密、event monitoring、audit trail。

**▍Varonis**
專注「**資料安全**」的第三方平台。監控誰看了哪些資料。

</div>

---

<div class="notes-box">

## 十、隱私與合規

**▍PII**（Personally Identifiable Information，個人識別資訊）
姓名、Email、電話、地址、身分證號、生日。**處理要極小心**。

**▍GDPR**（General Data Protection Regulation，歐盟個資保護規定）
2018 起生效。**Right to be Forgotten**、Data Portability、Consent Management。**違反罰款最高全球營收 4%**。

**▍CCPA**（California Consumer Privacy Act，加州消費者隱私法）
類似 GDPR 但範圍小一些。

**▍個資法 / 個人資料保護法**（台灣）
2010 起生效。商業收集、使用、保存個資要告知 + 取得同意。

**▍Right to be Forgotten**（被遺忘權）
客戶可要求「**從你系統刪除我的個資**」。CRM 場景的標準解：脫敏 + 商業紀錄保留。

**▍Data Portability**（資料可攜權）
客戶可要求「**把我的資料給我，方便我帶到別處**」。

**▍Consent Management**（同意管理）
記錄每個客戶「**對什麼用途同意了**」。GDPR 必備。工具：OneTrust、TrustArc。

**▍Data Retention Policy**（資料保留政策）
規定每類資料**保留多久**就要刪。合規 + 省成本。

**▍De-identification / Anonymization**（去識別化 / 匿名化）
拿掉「**可識別個人**」的資訊。分析報表用 hashed ID。

**▍Encryption at Rest / in Transit**（儲存加密 / 傳輸加密）
- *At Rest*：資料在硬碟上是加密的
- *In Transit*：傳輸過程加密（TLS 1.2+）

**兩個都要做**。

**▍OneTrust / TrustArc / Privacera**
專業隱私 / 合規平台。大企業必裝。

</div>

---

<div class="notes-box">

## 十一、主流 CRM 產品

**▍Salesforce**
全球最大、生態最完整、最貴。**B2B SaaS、企業客戶幾乎必跑這個**。內建 Sales Cloud / Service Cloud / Marketing Cloud。客製化能力強但學習曲線最陡。

**▍HubSpot**
中小企業最受歡迎。**免費版功能就夠用**。Marketing + Sales + Service 整合好。比 Salesforce 易上手。

**▍Pipedrive**
專注「**銷售管理**」。簡單明瞭、UI 好、適合 5-50 人銷售團隊。功能比前兩個少但精。

**▍Zoho CRM**
平價 CRM，印度公司出，東南亞與印度市場大。

**▍Microsoft Dynamics 365**
微軟生態的 CRM + ERP。「**我們公司用 Office 365**」場景。

**▍SugarCRM**
開源出身、現在閉源。早期是 Salesforce 的開源替代品。

**▍Close**
專注「**inside sales**」（內勤業務 / 電話銷售）。

**▍Copper**（前身 ProsperWorks）
深度整合 Google Workspace。Gmail 中直接操作 CRM。

**▍Attio**
近年新秀，主打「**現代 UI + 高度客製化 schema**」。新創界很愛。

**▍Folk**
個人/小團隊向、跟 LinkedIn 整合好。

**▍Apollo / Outreach / Salesloft**
不是 CRM，是 **Sales Engagement Platform**（銷售互動平台）。配合 CRM 使用、做 outbound 流程。

**▍Customer.io / Iterable / Braze**
Marketing Automation 工具。CRM 跟它們整合做 lifecycle 行銷。

</div>

---

<div class="notes-box">

## 十二、Adoption 與變革管理

**▍Adoption Rate**（採用率）
系統上線後「**實際被使用**」的比例。Industry 平均 CRM adoption < 40%。

**▍ADKAR Model**（ADKAR 變革模型）
Prosci 公司的五階段：Awareness、Desire、Knowledge、Ability、Reinforcement。

**▍Change Management**（變革管理）
讓「**舊習慣變新習慣**」的整套方法。

**▍Champion / Power User**（推手 / 高階使用者）
公司裡「**真心相信新系統會幫到他**」、願意推廣的人。**比強制令有效十倍**。

**▍Phased Rollout / Pilot**（分階段推行 / 試點）
不要 big bang。Pilot → Wave 1 → Wave 2 → Full rollout。

**▍Train the Trainer**（培訓培訓員）
教 10 個第一線指導員，讓他們各帶 30 人。

**▍Onboarding**（新人引導）
新使用者第一週、第一月該做什麼的引導流程。

**▍User-Centered Design**（以使用者為中心的設計）
從業務員真實工作流出發設計 CRM，不從「**設計者想當然耳**」出發。

**▍Persona**（角色）
「**誰會用這個系統**」的代表性畫像。常見：SDR、AE、CSM、Manager、Marketing。

**▍Job-to-be-Done**（待完成的工作）
**他來這個系統，要完成什麼任務**？不是「他用什麼功能」，是「他要解決什麼問題」。

**▍Show Value**（展示價值）
給每個使用者每月一張「**這個月 CRM 幫你做到了 X**」的個人化報告。

**▍Sunset Old Tool**（關掉舊工具）
舊 Excel/系統的「**關掉時間**」要設清楚。否則永遠有人雙寫。

**▍Big Bang Launch**（一次全推）
全公司同一天切換新系統。**幾乎都會出事，不推薦**。

**▍Dual Write**（雙寫）
新舊系統同時寫資料。**長期 = 災難。要設明確的 cutover 時間**。

</div>

---

<div class="takeaway-box">

## 你可以這樣用這份附錄

1. **讀正文遇到不懂的英文詞** → 翻過來查、確認意思、回去繼續讀。
2. **想知道某類工具有哪些** → 直接翻對應的區（第十一區 = CRM 產品、第八區 = 分析工具）。
3. **要跟人介紹 CRM** → 把這份附錄當成「CRM 領域的最小單字本」。

**這份附錄會持續更新**。讀正文遇到任何沒解釋到的英文詞、或解釋得不夠清楚的地方，告訴尹知行（其實是叫我），下一版補進來。

</div>
