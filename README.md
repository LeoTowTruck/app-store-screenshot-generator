# 📱 App Store & Google Play 宣傳卡片 / 截圖生成器 (Promo Card Generator)

一款專為行動應用程式開發者與行銷人員打造的高解析度宣傳圖與應用程式商店截圖（App Store & Google Play Mockup）製作工具。**純前端瀏覽器運作，完全免安裝，打開連結即可直接使用！**

🔗 **線上直接使用網址 (Live Demo)**：  
👉 https://leotowtruck.github.io/app-store-screenshot-generator/
---

## ✨ 核心特色 (Features)

- 🌐 **免安裝即開即用**：全客戶端 JavaScript 運作，無須安裝任何軟體或環境，任何瀏覽器皆可使用。
- 🎨 **即時預覽與高解析度匯出**：標準 **1242 × 2688 px**（414×896 3倍超高解析度）無損輸出，完美符合 App Store 與 Google Play 規格。
- 📱 **真實 iPhone 擬真外框**：內建精緻手機邊框、動態島（Dynamic Island）、微光反光質感與陰影效果。
- ✍️ **自訂字型與排版控制**：
  - 支援多款精選英中字體（Cabinet Grotesk、Satoshi、Inter、Noto Sans TC、GenWanMin 等）
  - 字體大小微調步進器、字重、字距、對齊方式與標題位置切換（置頂 / 置底）。
- 🌈 **豐富配色庫與漸層主題**：內建多組現代科技感漸層背景，支援純色、自訂漸層與上傳背景圖片。
- ⚡ **Excel / 多語系批次生成**：
  - 支援複製貼上 Excel 表格資料（包含各國語言、主標題、副標題、截圖檔名等）
  - 一鍵批次多圖生成，並自動打包分類為 **ZIP 壓縮檔** 下載。
- 🌐 **雙語介面**：支援繁體中文（繁中）與英文（English）一鍵即時切換。
- 📱 **跨裝置響應式支援**：支援電腦桌機、平板與手機瀏覽器操作與即時自動縮放畫布。

---

## 🛠️ 本地端開發（選用 / Optional）

若您需要在本地端進行開發或測試，可依照以下步驟啟動：

```bash
# 1. 安裝依賴套件
npm install

# 2. 啟動本機伺服器
npm run dev

# 3. 在瀏覽器開啟
# http://localhost:3000
```

---

## 💻 技術架構 (Tech Stack)

- **前端核心**：純原生 JavaScript (Vanilla ES6+), HTML5, CSS3
- **圖形與打包技術**：
  - [html2canvas](https://html2canvas.hertzen.com/)：DOM 元素 3 倍解析度 Canvas 渲染
  - [JSZip](https://stuk.github.io/jszip/)：多圖批次打包壓縮處理
- **部署支援**：GitHub Pages 靜態網站代管 / 任何靜態 Web 伺服器


