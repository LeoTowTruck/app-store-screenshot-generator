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
    if (item) item.classList.toggle('active');
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
// 9. 圖片匯出下載 (Single Export)
// ==========================================
function downloadPromoCard() {
    const btnSingle = document.getElementById('btn-export-single');
    const originalText = btnSingle ? btnSingle.innerHTML : '';
    if (btnSingle) {
        btnSingle.innerHTML = t('alert_exporting');
        btnSingle.style.opacity = '0.7';
        btnSingle.disabled = true;
    }

    // 暫時確保縮放不影響高解析度輸出
    html2canvas(promoCard, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false
    }).then(canvas => {
        const link = document.createElement('a');
        const cleanTitle = (inputTitle.value || 'promo').trim().replace(/[/\\?%*:|"<>]/g, '_');
        link.download = `${cleanTitle}_1242x2688.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).catch(err => {
        console.error("產圖失敗:", err);
        alert(t('alert_export_error'));
    }).finally(() => {
        if (btnSingle) {
            btnSingle.innerHTML = originalText;
            btnSingle.style.opacity = '1';
            btnSingle.disabled = false;
        }
    });
}

// ==========================================
// 10. Excel 批次產圖與 ZIP 下載 (Batch Processing)
// ==========================================
let imageFilesMap = {};

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

async function processBatch() {
    const pasteText = document.getElementById('excel-paste-area').value.trim();
    if (!pasteText) return alert(t('alert_paste_first'));

    const lines = pasteText.split('\n');
    const zip = new JSZip();
    let generatedCount = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const cols = line.split('\t');
        if (cols.length < 2) continue;

        const saveName = cols[0] ? cols[0].trim() : '';
        const title = cols[1] ? cols[1].trim() : '';
        const subtitle = cols[2] ? cols[2].trim() : '';
        const imgPath = cols[3] ? cols[3].trim() : '';

        if (saveName === '儲存名稱.png' || title === '標題') continue;
        if (!saveName || saveName === '.png') continue;

        // 更新文字
        inputTitle.value = title;
        displayTitle.innerText = title;
        inputSubtitle.value = subtitle;
        displaySubtitle.innerText = subtitle;

        // 搜尋匹配檔案
        const fileNameOnly = imgPath.split('/').pop().split('\\').pop();
        let targetFile = imageFilesMap[fileNameOnly] || 
                        imageFilesMap[fileNameOnly + '.png'] || 
                        imageFilesMap[fileNameOnly + '.jpg'] ||
                        imageFilesMap[fileNameOnly + '.jpeg'];

        if (targetFile) {
            await setScreenImageFromFile(targetFile);
        }

        await new Promise(r => setTimeout(r, 200));

        const canvas = await html2canvas(promoCard, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png').split(',')[1];
        
        const outputName = saveName.endsWith('.png') ? saveName : `${saveName}.png`;
        zip.file(outputName, imgData, { base64: true });
        generatedCount++;
    }

    if (generatedCount === 0) {
        return alert(t('alert_no_valid_data'));
    }

    zip.generateAsync({ type: "blob" }).then(content => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(content);
        a.download = "batch_promo_cards.zip";
        a.click();
    });
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
        alert("已複製範例文字！您可以直接貼到下方文字框測試批次生成。");
    } catch (err) {
        alert("複製失敗，請手動複製範例。");
    }
    document.body.removeChild(tempTextArea);
}

// ==========================================
// 11. 多國語言字典與處理 (i18n Localization handled via i18n.js)
// ==========================================
let currentLang = localStorage.getItem('app_promo_lang') || 'en';
if (!i18n[currentLang]) currentLang = 'en';

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
}

// 頁面初始化執行自適應縮放與語系載入
window.addEventListener('DOMContentLoaded', () => {
    changeLanguage(currentLang);
    setTimeout(updateAutoFitScale, 100);
});
