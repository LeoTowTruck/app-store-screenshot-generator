// ==========================================
// 1. 響應式手機 Tab 切換 (Mobile Navigation)
// ==========================================
function switchMobileTab(tab) {
    const controlPanel = document.getElementById('control-panel');
    const previewWrapper = document.getElementById('preview-wrapper');
    const tabBtnEditor = document.getElementById('tab-btn-editor');
    const tabBtnPreview = document.getElementById('tab-btn-preview');

    if (tab === 'editor') {
        controlPanel.classList.add('active-tab-view');
        previewWrapper.classList.remove('active-tab-view');
        tabBtnEditor.classList.add('active');
        tabBtnPreview.classList.remove('active');
    } else {
        controlPanel.classList.remove('active-tab-view');
        previewWrapper.classList.add('active-tab-view');
        tabBtnEditor.classList.remove('active');
        tabBtnPreview.classList.add('active');
        // 切換到預覽時立即重新計算自動縮放
        setTimeout(updateAutoFitScale, 50);
    }
}

// ==========================================
// 2. 預覽自動縮放適應機制 (Auto-Fit & Zoom)
// ==========================================
let currentZoomMode = 'fit'; // 'fit' or 'fixed'
let currentScale = 1.0;

function setZoomMode(mode) {
    currentZoomMode = mode;
    document.querySelectorAll('.zoom-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('btn-zoom-fit').classList.add('active');
    updateAutoFitScale();
}

function setZoomScale(scale) {
    currentZoomMode = 'fixed';
    currentScale = scale;
    document.querySelectorAll('.zoom-btn').forEach(btn => btn.classList.remove('active'));
    if (scale === 0.5) document.getElementById('btn-zoom-50')?.classList.add('active');
    if (scale === 0.75) document.getElementById('btn-zoom-75')?.classList.add('active');
    if (scale === 1.0) document.getElementById('btn-zoom-100')?.classList.add('active');
    applyScale(scale);
}

function applyScale(scale) {
    const scaler = document.getElementById('promo-card-scaler');
    if (scaler) {
        scaler.style.transform = `scale(${scale})`;
    }
}

function updateAutoFitScale() {
    if (currentZoomMode !== 'fit') return;
    const stage = document.getElementById('preview-stage');
    if (!stage || stage.clientWidth === 0 || stage.clientHeight === 0) return;

    // 卡片尺寸: 寬 414px, 高 896px
    const paddingX = window.innerWidth <= 860 ? 16 : 48;
    const paddingY = window.innerWidth <= 860 ? 24 : 48;
    const availableWidth = stage.clientWidth - paddingX;
    const availableHeight = stage.clientHeight - paddingY;

    const scaleX = availableWidth / 414;
    const scaleY = availableHeight / 896;
    
    // 計算最佳適應比例 (最大不超過 1.0，最小不低於 0.3)
    let fitScale = Math.min(scaleX, scaleY);
    fitScale = Math.max(0.3, Math.min(1.0, fitScale));

    currentScale = fitScale;
    applyScale(fitScale);
}

// 監聽視窗大小改變與螢幕翻轉
window.addEventListener('resize', () => {
    if (currentZoomMode === 'fit') {
        updateAutoFitScale();
    }
});

// ==========================================
// 3. 折疊面板控制 (Accordion & Quick Actions)
// ==========================================
function toggleAccordion(id) {
    const item = document.getElementById(id);
    if (item) {
        item.classList.toggle('active');
        if (item.classList.contains('active') && id === 'acc-batch') {
            setTimeout(() => {
                if (window.luckysheet && !isModalOpen) {
                    initLuckysheet('luckysheet-inline');
                }
            }, 100);
        }
    }
}

function expandAllAccordions(expand) {
    document.querySelectorAll('.accordion-item').forEach(item => {
        if (expand) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    document.querySelectorAll('details.form-accordion').forEach(details => {
        details.open = expand;
    });
    if (expand) {
        setTimeout(() => {
            if (window.luckysheet && !isModalOpen) {
                initLuckysheet('luckysheet-inline');
            }
        }, 100);
    }
}

// ==========================================
// 4. 文字即時雙向綁定 (Two-way Text Sync)
// ==========================================
const inputTitle = document.getElementById('input-title');
const inputSubtitle = document.getElementById('input-subtitle');
const displayTitle = document.getElementById('display-title');
const displaySubtitle = document.getElementById('display-subtitle');

// 左側面板輸入 -> 更新畫布文字
inputTitle.addEventListener('input', () => {
    displayTitle.innerText = inputTitle.value;
});
inputSubtitle.addEventListener('input', () => {
    displaySubtitle.innerText = inputSubtitle.value;
});

// 畫布 contenteditable 直接編輯 -> 同步更新左側 input
displayTitle.addEventListener('input', () => {
    inputTitle.value = displayTitle.innerText;
});
displaySubtitle.addEventListener('input', () => {
    inputSubtitle.value = displaySubtitle.innerText;
});

// 避免在畫布上編輯文字時誤觸卡片點擊更換背景
displayTitle.addEventListener('click', (e) => e.stopPropagation());
displaySubtitle.addEventListener('click', (e) => e.stopPropagation());

// ==========================================
// 5. 字體大小控制 (Stepper)
// ==========================================
let titleSize = 36;
let subtitleSize = 18;

function changeSize(target, delta) {
    if (target === 'title') {
        titleSize = Math.max(16, Math.min(72, titleSize + delta));
        displayTitle.style.fontSize = titleSize + 'px';
        document.getElementById('title-size-val').innerText = titleSize + ' px';
    } else {
        subtitleSize = Math.max(10, Math.min(36, subtitleSize + delta));
        displaySubtitle.style.fontSize = subtitleSize + 'px';
        document.getElementById('subtitle-size-val').innerText = subtitleSize + ' px';
    }
}

displayTitle.style.fontSize = titleSize + 'px';
displaySubtitle.style.fontSize = subtitleSize + 'px';

// ==========================================
// 6. 顏色選擇設定 (Color Presets)
// ==========================================
function setupColorPresets(containerId, callback) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const buttons = container.querySelectorAll('.color-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            const color = btn.getAttribute('data-color');
            callback(color);
        });
    });
}

setupColorPresets('title-colors', (color) => {
    displayTitle.style.color = color;
});
setupColorPresets('subtitle-colors', (color) => {
    displaySubtitle.style.color = color;
});

const phoneMockup = document.getElementById('phone-mockup');
setupColorPresets('phone-border-colors', (color) => {
    phoneMockup.style.boxShadow = `0 20px 40px rgba(0, 0, 0, 0.35), 0 0 0 2px ${color}`;
});

// 背景漸層與色彩預設切換 (Background Presets)
const bgPresetContainer = document.getElementById('bg-presets');
if (bgPresetContainer) {
    const bgButtons = bgPresetContainer.querySelectorAll('.color-btn');
    bgButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            bgButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            const bg = btn.getAttribute('data-bg');
            if (bg.startsWith('linear-gradient')) {
                promoCard.style.backgroundImage = bg;
                promoCard.style.backgroundColor = '';
            } else {
                promoCard.style.backgroundImage = 'none';
                promoCard.style.backgroundColor = bg;
            }
            if (bgFileName) {
                bgFileName.innerText = t('bg_upload_text');
                bgFileName.style.color = '';
            }
            const bgInput = document.getElementById('upload-bg');
            if (bgInput) bgInput.value = '';
        });
    });
}

// ==========================================
// 7. 字體樣式切換 (Font Family)
// ==========================================
document.getElementById('title-font').addEventListener('change', (e) => {
    displayTitle.style.fontFamily = e.target.value;
});
document.getElementById('subtitle-font').addEventListener('change', (e) => {
    displaySubtitle.style.fontFamily = e.target.value;
});

// ==========================================
// 8. 圖片素材上傳與拖曳處理 (Image Upload & Drag & Drop)
// ==========================================
const promoCard = document.getElementById('promo-card');
const bgFileName = document.getElementById('bg-file-name');
const displayScreen = document.getElementById('display-screen');
const placeholder = document.getElementById('placeholder');
const screenFileName = document.getElementById('screen-file-name');
const uploadBgInput = document.getElementById('upload-bg');
const uploadScreenInput = document.getElementById('upload-screen');

function setBackgroundImage(file) {
    if (file && file.type.startsWith('image/')) {
        bgFileName.innerText = '已選擇: ' + file.name;
        bgFileName.style.color = '#34d399';
        const reader = new FileReader();
        reader.onload = (e) => promoCard.style.backgroundImage = `url('${e.target.result}')`;
        reader.readAsDataURL(file);
    }
}

function setScreenImage(file) {
    if (file && file.type.startsWith('image/')) {
        screenFileName.innerText = '已選擇: ' + file.name;
        screenFileName.style.color = '#34d399';
        const reader = new FileReader();
        reader.onload = (e) => {
            displayScreen.src = e.target.result;
            displayScreen.style.display = 'block';
            placeholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
}

uploadBgInput.addEventListener('change', (e) => setBackgroundImage(e.target.files[0]));
uploadScreenInput.addEventListener('change', (e) => setScreenImage(e.target.files[0]));

// 點擊預覽卡片或手機觸發上傳
phoneMockup.addEventListener('click', (e) => {
    e.stopPropagation();
    uploadScreenInput.click();
});

promoCard.addEventListener('click', () => {
    uploadBgInput.click();
});

// 防止瀏覽器預設拖曳開圖行為
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    document.body.addEventListener(eventName, (e) => e.preventDefault());
});

function setupDragDropBox(boxId, handleFile) {
    const box = document.getElementById(boxId);
    if (!box) return;
    box.addEventListener('dragover', (e) => { e.preventDefault(); box.classList.add('dragover'); });
    box.addEventListener('dragleave', () => box.classList.remove('dragover'));
    box.addEventListener('drop', (e) => {
        e.preventDefault();
        box.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
    });
}

setupDragDropBox('bg-upload-box', setBackgroundImage);
setupDragDropBox('screen-upload-box', setScreenImage);

// 手機畫面區塊拖曳
phoneMockup.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    phoneMockup.classList.add('dragover');
    promoCard.classList.remove('dragover');
});
phoneMockup.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    phoneMockup.classList.remove('dragover');
});
phoneMockup.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    phoneMockup.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
        setScreenImage(e.dataTransfer.files[0]);
    }
});

// 全卡片背景拖曳
promoCard.addEventListener('dragover', (e) => {
    e.preventDefault();
    promoCard.classList.add('dragover');
});
promoCard.addEventListener('dragleave', (e) => {
    e.preventDefault();
    promoCard.classList.remove('dragover');
});
promoCard.addEventListener('drop', (e) => {
    e.preventDefault();
    promoCard.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
        setBackgroundImage(e.dataTransfer.files[0]);
    }
});

// ==========================================
// 9. 圖片匯出下載 (Single & Batch Export Helper)
// ==========================================

// 單張截圖：使用目前畫面上既有的元素，保持單張既有邏輯
async function capturePromoCardCanvas() {
    const scaler = document.getElementById('promo-card-scaler');
    const previewWrapper = document.getElementById('preview-wrapper');
    const promoCardEl = document.getElementById('promo-card');
    if (!promoCardEl) throw new Error("Promo card element not found");

    const originalTransform = scaler ? scaler.style.transform : '';
    const originalTransition = scaler ? scaler.style.transition : '';
    
    // 檢查預覽區塊是否因為行動版 Tab 切換被設為 display: none
    const isHidden = previewWrapper && window.getComputedStyle(previewWrapper).display === 'none';
    const origDisplay = previewWrapper ? previewWrapper.style.display : '';
    const origPos = previewWrapper ? previewWrapper.style.position : '';
    const origLeft = previewWrapper ? previewWrapper.style.left : '';
    const origTop = previewWrapper ? previewWrapper.style.top : '';
    const origZIndex = previewWrapper ? previewWrapper.style.zIndex : '';

    try {
        // 暫時將縮放解除，恢復 1:1 原生 414x896 解析度給 html2canvas 擷取
        if (scaler) {
            scaler.style.transition = 'none';
            scaler.style.transform = 'none';
        }
        if (isHidden && previewWrapper) {
            previewWrapper.style.display = 'flex';
            previewWrapper.style.position = 'fixed';
            previewWrapper.style.left = '-99999px';
            previewWrapper.style.top = '0';
            previewWrapper.style.zIndex = '-9999';
        }

        // 強制瀏覽器重算 layout
        void promoCardEl.offsetHeight;

        // 等待 200 毫秒，讓瀏覽器把圖片跟排版都確實渲染繪製完成再截圖
        await new Promise(resolve => setTimeout(resolve, 200));

        const canvas = await html2canvas(promoCardEl, {
            scale: 3, // 414x896 放大 3 倍輸出為標準 1242x2688
            useCORS: true,
            backgroundColor: null,
            logging: false
        });

        return canvas;
    } finally {
        // 恢復原本的縮放與佈局
        if (scaler) {
            scaler.style.transform = originalTransform;
            scaler.style.transition = originalTransition;
        }
        if (isHidden && previewWrapper) {
            previewWrapper.style.display = origDisplay;
            previewWrapper.style.position = origPos;
            previewWrapper.style.left = origLeft;
            previewWrapper.style.top = origTop;
            previewWrapper.style.zIndex = origZIndex;
        }
    }
}

// 批量專用：在背景建立 1:1 的 Off-screen 隱藏卡片進行截圖，完全不干擾前台畫面與縮放
async function captureOffscreenPromoCard(title, subtitle, screenImgSrc) {
    const promoCardEl = document.getElementById('promo-card');
    if (!promoCardEl) throw new Error("Promo card element not found");

    // 複製現有卡片的所有樣式與架構
    const clone = promoCardEl.cloneNode(true);
    clone.id = 'offscreen-promo-card-clone';
    
    // 設定到背景看不到的區域，並固定為標準 414x896 尺寸
    clone.style.position = 'fixed';
    clone.style.left = '-99999px';
    clone.style.top = '0';
    clone.style.zIndex = '-99999';
    clone.style.transform = 'none';
    clone.style.transition = 'none';
    clone.style.width = '414px';
    clone.style.height = '896px';
    clone.style.visibility = 'visible';
    clone.style.display = 'flex';

    // 替換克隆卡片上的文字與截圖 (注意對應 index.html 中的真實 id: display-title, display-subtitle, display-screen, placeholder)
    const cloneTitle = clone.querySelector('#display-title');
    const cloneSubtitle = clone.querySelector('#display-subtitle');
    const cloneScreenImg = clone.querySelector('#display-screen');
    const clonePlaceholder = clone.querySelector('#placeholder');

    if (cloneTitle && title !== undefined) cloneTitle.innerText = title;
    if (cloneSubtitle && subtitle !== undefined) cloneSubtitle.innerText = subtitle;
    if (cloneScreenImg && screenImgSrc) {
        cloneScreenImg.src = screenImgSrc;
        cloneScreenImg.style.display = 'block';
        if (clonePlaceholder) clonePlaceholder.style.display = 'none';
    }

    document.body.appendChild(clone);

    try {
        // 強制重算 layout
        void clone.offsetHeight;

        // 等待 200 毫秒確保瀏覽器與圖片完整渲染
        await new Promise(r => setTimeout(r, 200));

        const canvas = await html2canvas(clone, {
            scale: 3, // 414x896 放大 3 倍輸出為標準 1242x2688
            useCORS: true,
            backgroundColor: null,
            logging: false
        });

        return canvas;
    } finally {
        // 截圖完畢後清除背景隱藏元素
        if (clone && clone.parentNode) {
            clone.parentNode.removeChild(clone);
        }
    }
}

async function downloadPromoCard() {
    const btnSingle = document.getElementById('btn-export-single');
    const originalText = btnSingle ? btnSingle.innerHTML : '';
    if (btnSingle) {
        btnSingle.innerHTML = t('alert_exporting');
        btnSingle.style.opacity = '0.7';
        btnSingle.disabled = true;
    }

    try {
        const canvas = await capturePromoCardCanvas();
        const link = document.createElement('a');
        const cleanTitle = (inputTitle.value || 'promo').trim().replace(/[/\\?%*:|"<>]/g, '_');
        link.download = `${cleanTitle}_1242x2688.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (err) {
        console.error("產圖失敗:", err);
        alert(t('alert_export_error'));
    } finally {
        if (btnSingle) {
            btnSingle.innerHTML = originalText;
            btnSingle.style.opacity = '1';
            btnSingle.disabled = false;
        }
    }
}

// ==========================================
// 10. Google 試算表模式與批次產圖 (Google Sheets Mode & Batch Processing)
// ==========================================
let imageFilesMap = {};
let isModalOpen = false;
let activeCell = { row: 0, col: 0 };
const COL_LETTERS = ['A', 'B', 'C', 'D'];

// 預設 4 欄範本資料 (A: 語言代碼, B: 主標題, C: 說明副標題, D: 截圖檔名)
let sheetData = [
    ['en', 'Precise Location Tracking', 'Quickly plan and track your trips in real time.', 'a1'],
    ['en', 'Global Driver Matching', 'View nearby drivers and live route progress.', 'a2'],
    ['zh-TW', '精準即時定位導航', '隨時規劃行程並即時追蹤路線進度。', 'a1'],
    ['zh-TW', '全球駕駛即時媒合', '查看周邊駕駛即時動態與行程預估。', 'a2']
];

document.getElementById('folder-input').addEventListener('change', (e) => {
    imageFilesMap = {};
    for (let file of e.target.files) {
        imageFilesMap[file.name] = file;
    }
    alert(t('alert_loaded_images', { n: Object.keys(imageFilesMap).length }));
});

function setScreenImageFromFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            displayScreen.src = e.target.result;
            displayScreen.style.display = 'block';
            placeholder.style.display = 'none';
            resolve();
        };
        reader.readAsDataURL(file);
    });
}

// 渲染試算表 DOM (同時支援內嵌版與全螢幕大視窗)
function renderSpreadsheetTable(tbodyId, countId, isModal) {
    const tbody = document.getElementById(tbodyId);
    const countEl = document.getElementById(countId);
    if (!tbody) return;

    tbody.innerHTML = '';
    
    sheetData.forEach((row, rIdx) => {
        const tr = document.createElement('tr');
        if (activeCell.row === rIdx) {
            tr.classList.add('active-row');
        }

        // 行號
        const tdNum = document.createElement('td');
        tdNum.className = 'td-row-num';
        tdNum.innerText = (rIdx + 1);
        tdNum.addEventListener('click', () => {
            selectRowPreview(rIdx);
            focusCell(rIdx, 0, isModal);
        });
        tr.appendChild(tdNum);

        // 4 個欄位 (A: 輸出檔名, B: 主標題, C: 說明副標題, D: 截圖檔名)
        for (let cIdx = 0; cIdx < 4; cIdx++) {
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'sheet-cell-input';
            input.value = row[cIdx] !== undefined ? row[cIdx] : '';
            input.dataset.row = rIdx;
            input.dataset.col = cIdx;
            input.dataset.modal = isModal ? '1' : '0';

            // 聚焦事件
            input.addEventListener('focus', () => {
                activeCell = { row: rIdx, col: cIdx };
                updateFormulaBar(rIdx, cIdx, input.value);
                highlightActiveRow();
                selectRowPreview(rIdx);
            });

            // 輸入事件
            input.addEventListener('input', (e) => {
                sheetData[rIdx][cIdx] = e.target.value;
                updateFormulaBar(rIdx, cIdx, e.target.value);
                syncOtherSpreadsheetView(rIdx, cIdx, e.target.value, isModal);
                // 同步更新右側預覽
                if (cIdx === 1) {
                    inputTitle.value = e.target.value;
                    displayTitle.innerText = e.target.value;
                } else if (cIdx === 2) {
                    inputSubtitle.value = e.target.value;
                    displaySubtitle.innerText = e.target.value;
                }
            });

            // 鍵盤導航 (方向鍵、Tab、Enter)
            input.addEventListener('keydown', (e) => {
                handleCellKeyNavigation(e, rIdx, cIdx, isModal);
            });

            // 貼上事件 (支援從 Excel / Google Sheets 複製的 TSV 資料)
            input.addEventListener('paste', (e) => {
                handleSpreadsheetPaste(e, rIdx, cIdx);
            });

            td.appendChild(input);
            tr.appendChild(td);
        }

        // 刪除列操作
        const tdAction = document.createElement('td');
        tdAction.className = 'td-delete-cell';
        const btnDel = document.createElement('button');
        btnDel.type = 'button';
        btnDel.className = 'btn-del-row';
        btnDel.innerText = '✕';
        btnDel.title = '刪除此列';
        btnDel.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteSheetRow(rIdx);
        });
        tdAction.appendChild(btnDel);
        tr.appendChild(tdAction);

        tbody.appendChild(tr);
    });

    if (countEl) {
        countEl.innerText = (currentLang === 'zh-TW') 
            ? `共 ${sheetData.length} 列資料` 
            : `Total ${sheetData.length} rows`;
    }
}

function renderAllSpreadsheets() {
    renderSpreadsheetTable('sheet-tbody-inline', 'sheet-row-count-inline', false);
    if (isModalOpen) {
        renderSpreadsheetTable('sheet-tbody-modal', 'sheet-row-count-modal', true);
    }
}

// 點擊某列時即時連動右側預覽
function selectRowPreview(rIdx) {
    if (!sheetData[rIdx]) return;
    const row = sheetData[rIdx];
    const title = row[1];
    const subtitle = row[2];
    const imgPath = row[3];

    if (title) {
        inputTitle.value = title;
        displayTitle.innerText = title;
    }
    if (subtitle) {
        inputSubtitle.value = subtitle;
        displaySubtitle.innerText = subtitle;
    }
    if (imgPath) {
        const fileNameOnly = String(imgPath).trim().split('/').pop().split('\\').pop();
        let targetFile = imageFilesMap[fileNameOnly] || 
                        imageFilesMap[fileNameOnly + '.png'] || 
                        imageFilesMap[fileNameOnly + '.jpg'] ||
                        imageFilesMap[fileNameOnly + '.jpeg'];
        if (targetFile) {
            setScreenImageFromFile(targetFile);
        }
    }
}

// 高亮當前活動列
function highlightActiveRow() {
    const updateRows = (tbodyId) => {
        const tbody = document.getElementById(tbodyId);
        if (!tbody) return;
        tbody.querySelectorAll('tr').forEach((tr, idx) => {
            if (idx === activeCell.row) {
                tr.classList.add('active-row');
            } else {
                tr.classList.remove('active-row');
            }
        });
    };
    updateRows('sheet-tbody-inline');
    updateRows('sheet-tbody-modal');
}

// 更新公式列 (fx bar)
function updateFormulaBar(rIdx, cIdx, val) {
    const cellRef = `${COL_LETTERS[cIdx]}${rIdx + 1}`;
    
    const inlineRef = document.getElementById('sheet-cell-ref-inline');
    const inlineInput = document.getElementById('sheet-fx-input-inline');
    if (inlineRef) inlineRef.innerText = cellRef;
    if (inlineInput && document.activeElement !== inlineInput) inlineInput.value = val || '';

    const modalRef = document.getElementById('sheet-cell-ref-modal');
    const modalInput = document.getElementById('sheet-fx-input-modal');
    if (modalRef) modalRef.innerText = cellRef;
    if (modalInput && document.activeElement !== modalInput) modalInput.value = val || '';
}

// 同步另一個視圖 (內嵌與彈窗)
function syncOtherSpreadsheetView(rIdx, cIdx, val, fromModal) {
    const targetTbodyId = fromModal ? 'sheet-tbody-inline' : 'sheet-tbody-modal';
    const tbody = document.getElementById(targetTbodyId);
    if (!tbody) return;
    const input = tbody.querySelector(`input[data-row="${rIdx}"][data-col="${cIdx}"]`);
    if (input && input.value !== val) {
        input.value = val;
    }
}

// 聚焦指定儲存格
function focusCell(rIdx, cIdx, isModal) {
    const targetTbodyId = isModal ? 'sheet-tbody-modal' : 'sheet-tbody-inline';
    const tbody = document.getElementById(targetTbodyId);
    if (!tbody) return;
    const input = tbody.querySelector(`input[data-row="${rIdx}"][data-col="${cIdx}"]`);
    if (input) {
        input.focus();
        input.select();
    }
}

// 鍵盤導航 (方向鍵、Tab、Enter)
function handleCellKeyNavigation(e, rIdx, cIdx, isModal) {
    if (e.key === 'ArrowUp') {
        if (rIdx > 0) {
            e.preventDefault();
            focusCell(rIdx - 1, cIdx, isModal);
        }
    } else if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault();
        if (rIdx < sheetData.length - 1) {
            focusCell(rIdx + 1, cIdx, isModal);
        } else if (e.key === 'Enter' || e.key === 'Tab') {
            addSheetRow();
            setTimeout(() => focusCell(sheetData.length - 1, cIdx, isModal), 50);
        }
    } else if (e.key === 'ArrowLeft' && e.target.selectionStart === 0) {
        if (cIdx > 0) {
            e.preventDefault();
            focusCell(rIdx, cIdx - 1, isModal);
        }
    } else if (e.key === 'ArrowRight' && e.target.selectionEnd === e.target.value.length) {
        if (cIdx < 3) {
            e.preventDefault();
            focusCell(rIdx, cIdx + 1, isModal);
        }
    } else if (e.key === 'Tab') {
        if (!e.shiftKey) {
            if (cIdx === 3 && rIdx === sheetData.length - 1) {
                e.preventDefault();
                addSheetRow();
                setTimeout(() => focusCell(sheetData.length - 1, 0, isModal), 50);
            }
        }
    }
}

// 處理 Excel / Google 試算表整片貼上
function handleSpreadsheetPaste(e, startRow, startCol) {
    const clipboardData = e.clipboardData || window.clipboardData;
    if (!clipboardData) return;
    const pastedText = clipboardData.getData('Text');
    if (!pastedText) return;

    // 若貼上內容包含換行或定位字元 (Tab)，代表是從試算表格複製的多格資料
    if (pastedText.includes('\n') || pastedText.includes('\t')) {
        e.preventDefault();
        const lines = pastedText.split(/\r?\n/).filter(line => line.trim().length > 0);
        
        lines.forEach((line, lIdx) => {
            const targetRow = startRow + lIdx;
            if (!sheetData[targetRow]) {
                sheetData[targetRow] = ['', '', '', ''];
            }
            const cols = line.split('\t');
            cols.forEach((cellVal, cIdx) => {
                const targetCol = startCol + cIdx;
                if (targetCol < 4) {
                    sheetData[targetRow][targetCol] = cellVal.trim();
                }
            });
        });

        renderAllSpreadsheets();
        selectRowPreview(startRow);
    }
}

// 公式列即時連動
['sheet-fx-input-inline', 'sheet-fx-input-modal'].forEach(id => {
    const fxInput = document.getElementById(id);
    if (fxInput) {
        fxInput.addEventListener('input', (e) => {
            const { row, col } = activeCell;
            if (sheetData[row]) {
                sheetData[row][col] = e.target.value;
                syncOtherSpreadsheetView(row, col, e.target.value, false);
                syncOtherSpreadsheetView(row, col, e.target.value, true);
                if (col === 1) {
                    inputTitle.value = e.target.value;
                    displayTitle.innerText = e.target.value;
                } else if (col === 2) {
                    inputSubtitle.value = e.target.value;
                    displaySubtitle.innerText = e.target.value;
                }
            }
        });
    }
});

// 新增列
function addSheetRow() {
    const nextIdx = sheetData.length + 1;
    sheetData.push(['', '', '', '']);
    renderAllSpreadsheets();
}

// 刪除列
function deleteSheetRow(rIdx) {
    if (sheetData.length <= 1) {
        sheetData = [['', '', '', '']];
    } else {
        sheetData.splice(rIdx, 1);
    }
    renderAllSpreadsheets();
}

// 載入範本
function resetSheetTemplate() {
    sheetData = [
        ['en', 'Precise Location Tracking', 'Quickly plan and track your trips in real time.', 'a1'],
        ['en', 'Global Driver Matching', 'View nearby drivers and live route progress.', 'a2'],
        ['zh-TW', '精準即時定位導航', '隨時規劃行程並即時追蹤路線進度。', 'a1'],
        ['zh-TW', '全球駕駛即時媒合', '查看周邊駕駛即時動態與行程預估。', 'a2']
    ];
    activeCell = { row: 0, col: 0 };
    renderAllSpreadsheets();
    selectRowPreview(0);
}

// 清空表格
function clearSheetData() {
    sheetData = [
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', '']
    ];
    activeCell = { row: 0, col: 0 };
    renderAllSpreadsheets();
}

// 打開或關閉全螢幕大視窗
function openSpreadsheetModal(open) {
    const modal = document.getElementById('spreadsheet-modal');
    if (!modal) return;

    isModalOpen = open;
    if (open) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        renderSpreadsheetTable('sheet-tbody-modal', 'sheet-row-count-modal', true);
        setTimeout(() => {
            focusCell(activeCell.row, activeCell.col, true);
        }, 80);
    } else {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        renderSpreadsheetTable('sheet-tbody-inline', 'sheet-row-count-inline', false);
    }
}

// 批次生成並打包 ZIP
async function processBatch() {
    // 過濾空列或標頭字樣
    const validRows = sheetData.filter(row => {
        if (!row || !Array.isArray(row)) return false;
        const [lang, title, subtitle, imgPath] = row.map(v => (v !== null && v !== undefined ? String(v).trim() : ''));
        if (!lang && !title && !subtitle && !imgPath) return false;
        if (lang === '語言' || lang === 'Language' || lang === '儲存名稱.png' || title === '標題' || title === 'Main Title' || title === t('col_title')) return false;
        return true;
    });

    if (validRows.length === 0) {
        return alert(t('alert_paste_first'));
    }

    const btnBatch = document.getElementById('btn-batch-run');
    const originalBtnText = btnBatch ? btnBatch.innerHTML : '';
    if (btnBatch) {
        btnBatch.disabled = true;
        btnBatch.style.opacity = '0.7';
    }

    const zip = new JSZip();
    let generatedCount = 0;

    try {
        for (let i = 0; i < validRows.length; i++) {
            const row = validRows[i];
            const lang = row[0] ? String(row[0]).trim() : '';
            const title = row[1] ? String(row[1]).trim() : '';
            const subtitle = row[2] ? String(row[2]).trim() : '';
            const imgPath = row[3] ? String(row[3]).trim() : '';

            if (btnBatch) {
                btnBatch.innerHTML = t('alert_generating_progress', { current: i + 1, total: validRows.length });
            }

            // 更新文字與預覽
            if (title) {
                inputTitle.value = title;
                displayTitle.innerText = title;
            }
            if (subtitle) {
                inputSubtitle.value = subtitle;
                displaySubtitle.innerText = subtitle;
            }

            // 搜尋匹配檔案
            let fileDataUrl = '';
            if (imgPath) {
                const fileNameOnly = imgPath.split('/').pop().split('\\').pop();
                let targetFile = imageFilesMap[fileNameOnly] || 
                                imageFilesMap[fileNameOnly + '.png'] || 
                                imageFilesMap[fileNameOnly + '.jpg'] ||
                                imageFilesMap[fileNameOnly + '.jpeg'];

                if (targetFile) {
                    fileDataUrl = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = (e) => resolve(e.target.result);
                        reader.onerror = () => resolve('');
                        reader.readAsDataURL(targetFile);
                    });
                    if (fileDataUrl) {
                        displayScreen.src = fileDataUrl;
                        displayScreen.style.display = 'block';
                        if (placeholder) placeholder.style.display = 'none';
                    }
                }
            }

            // 使用背景 Off-screen 克隆方式產圖，畫面完全不跳動
            const currentImgSrc = fileDataUrl || displayScreen.src;
            const canvas = await captureOffscreenPromoCard(title, subtitle, currentImgSrc);
            const imgData = canvas.toDataURL('image/png').split(',')[1];
            
            // 檔名與路徑規劃：/語言/語言+截圖檔名.png
            let cleanImgName = '';
            if (imgPath) {
                cleanImgName = imgPath.split('/').pop().split('\\').pop().replace(/\.(png|jpg|jpeg|webp)$/i, '');
            } else {
                cleanImgName = `${i + 1}`;
            }

            const cleanLang = lang.replace(/[/\\?%*:|"<>]/g, '_').trim();
            let outputFilePath = '';

            if (cleanLang) {
                outputFilePath = `${cleanLang}/${cleanLang}-${cleanImgName}.png`;
            } else {
                outputFilePath = `${cleanImgName}.png`;
            }

            zip.file(outputFilePath, imgData, { base64: true });
            generatedCount++;
        }

        if (generatedCount === 0) {
            return alert(t('alert_no_valid_data'));
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(zipBlob);
        a.download = "batch_promo_cards.zip";
        a.click();
    } catch (err) {
        console.error("批次產圖失敗:", err);
        alert(t('alert_export_error'));
    } finally {
        if (btnBatch) {
            btnBatch.innerHTML = originalBtnText;
            btnBatch.disabled = false;
            btnBatch.style.opacity = '1';
        }
    }
}

function fallbackCopyText(text) {
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = text;
    tempTextArea.style.position = "fixed";
    tempTextArea.style.left = "-9999px";
    tempTextArea.style.top = "0";
    document.body.appendChild(tempTextArea);
    tempTextArea.focus();
    tempTextArea.select();
    try {
        document.execCommand('copy');
        alert("已複製範例文字！您可以直接貼到表格內測試批次生成。");
    } catch (err) {
        alert("複製失敗，請手動複製範例。");
    }
    document.body.removeChild(tempTextArea);
}

// ==========================================
// 11. 多國語言字典與處理 (i18n Localization handled via i18n.js)
// ==========================================
function detectUserLanguage() {
    // 1. 若使用者曾手動切換過語言並記錄於 localStorage，優先採用
    try {
        const savedLang = localStorage.getItem('app_promo_lang');
        if (savedLang && i18n[savedLang]) {
            return savedLang;
        }
    } catch (e) {
        console.warn('localStorage access failed:', e);
    }

    // 2. 自動偵測瀏覽器語系 (依順序檢查 navigator.languages 與 navigator.language)
    const browserLangs = (navigator.languages && navigator.languages.length > 0) 
        ? navigator.languages 
        : [navigator.language || navigator.userLanguage || ''];

    for (const rawLang of browserLangs) {
        if (!rawLang || typeof rawLang !== 'string') continue;
        const normalized = rawLang.trim().toLowerCase();

        // 精準完全比對 (例如 'zh-TW', 'en')
        for (const key of Object.keys(i18n)) {
            if (key.toLowerCase() === normalized) {
                return key;
            }
        }

        // 中文系語言標籤處理 (zh, zh-TW, zh-HK, zh-MO, zh-CN, zh-Hant, zh-Hans)
        if (normalized.startsWith('zh')) {
            // 若為繁體相關或通用中文，優先對應 zh-TW
            if (i18n['zh-TW']) return 'zh-TW';
        }

        // 英文系語言標籤處理 (en, en-US, en-GB, en-AU 等)
        if (normalized.startsWith('en')) {
            if (i18n['en']) return 'en';
        }

        // 前綴比對 (例如 'ja-JP' 找 'ja')
        const primaryCode = normalized.split('-')[0];
        for (const key of Object.keys(i18n)) {
            if (key.toLowerCase() === primaryCode || key.toLowerCase().startsWith(primaryCode)) {
                return key;
            }
        }
    }

    // 3. 找不到或不支援時，預設使用英文 ('en')
    return 'en';
}

let currentLang = detectUserLanguage();

function t(key, params = {}) {
    let str = (i18n[currentLang] && i18n[currentLang][key]) || (i18n['en'] && i18n['en'][key]) || key;
    for (let p in params) {
        str = str.replace(new RegExp(`\\{${p}\\}`, 'g'), params[p]);
    }
    return str;
}

function changeLanguage(lang) {
    if (!i18n[lang]) return;
    
    // 檢查是否需同步更新預設文案
    const oldLang = currentLang;
    const isDefaultTitle = !inputTitle.value || 
                          inputTitle.value === i18n[oldLang]?.default_title || 
                          inputTitle.value === "主標題設定" || 
                          inputTitle.value === "Promo Mockup Title";
    const isDefaultSubtitle = !inputSubtitle.value || 
                             inputSubtitle.value === i18n[oldLang]?.default_subtitle || 
                             inputSubtitle.value === "說明文字設定" || 
                             inputSubtitle.value === "Create stunning App Store & Google Play promo mockups in seconds.";

    currentLang = lang;
    localStorage.setItem('app_promo_lang', lang);

    // 更新兩個下拉選單的值
    const deskSelect = document.getElementById('lang-select-desktop');
    const mobSelect = document.getElementById('lang-select-mobile');
    if (deskSelect) deskSelect.value = lang;
    if (mobSelect) mobSelect.value = lang;

    // 替換所有具有 data-i18n 的元素文字
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key && i18n[currentLang][key]) {
            el.innerText = i18n[currentLang][key];
        }
    });

    // 替換 placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (key && i18n[currentLang][key]) {
            el.setAttribute('placeholder', i18n[currentLang][key]);
        }
    });

    // 替換 optgroup label
    document.querySelectorAll('[data-i18n-label]').forEach(el => {
        const key = el.getAttribute('data-i18n-label');
        if (key && i18n[currentLang][key]) {
            el.setAttribute('label', i18n[currentLang][key]);
        }
    });

    // 若使用者未自訂文案，同步切換範例文案與畫布
    if (isDefaultTitle && i18n[currentLang].default_title) {
        inputTitle.value = i18n[currentLang].default_title;
        displayTitle.innerText = i18n[currentLang].default_title;
    }
    if (isDefaultSubtitle && i18n[currentLang].default_subtitle) {
        inputSubtitle.value = i18n[currentLang].default_subtitle;
        displaySubtitle.innerText = i18n[currentLang].default_subtitle;
    }

    // 更新網頁標題與 SEO Meta 標籤
    document.title = t('page_title');
    document.documentElement.lang = currentLang;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && i18n[currentLang].meta_desc) {
        metaDesc.setAttribute('content', i18n[currentLang].meta_desc);
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', t('page_title'));
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && i18n[currentLang].meta_desc) {
        ogDesc.setAttribute('content', i18n[currentLang].meta_desc);
    }

    // 更新試算表欄位標籤與資料列
    renderAllSpreadsheets();
}

// 頁面初始化執行自適應縮放、試算表初始化與語系載入
window.addEventListener('DOMContentLoaded', () => {
    changeLanguage(currentLang);
    renderAllSpreadsheets();
    setTimeout(updateAutoFitScale, 100);

    // 點擊彈跳視窗半透明遮罩背景（空白處）關閉
    const spreadsheetModal = document.getElementById('spreadsheet-modal');
    if (spreadsheetModal) {
        spreadsheetModal.addEventListener('click', (e) => {
            if (e.target === spreadsheetModal) {
                openSpreadsheetModal(false);
            }
        });
    }

    // 按下鍵盤 Esc 鍵關閉展開的試算表
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isModalOpen) {
            openSpreadsheetModal(false);
        }
    });
});
