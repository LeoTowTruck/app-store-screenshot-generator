// ==========================================
// 多國語言核心管理器 (i18n Core Loader & Router)
// ==========================================
window.i18n = window.i18n || {};

// 提供快捷全域存取
const i18n = window.i18n;

/**
 * 載入指定語系檔案 (若尚未載入)
 * @param {string} lang 語系代碼 (例如 'zh-TW', 'en', 'ja' 等)
 * @returns {Promise<boolean>}
 */
function loadLocale(lang) {
    if (window.i18n && window.i18n[lang]) {
        return Promise.resolve(true);
    }

    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = `locales/${lang}.js`;
        script.onload = () => resolve(true);
        script.onerror = () => {
            console.warn(`Locale file locales/${lang}.js not found, falling back to default.`);
            resolve(false);
        };
        document.head.appendChild(script);
    });
}
