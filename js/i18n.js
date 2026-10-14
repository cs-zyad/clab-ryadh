// Plain JavaScript translation for the public pages; no build step is required.
(() => {
    const storageKey = 'club-language';
    const dictionaries = window.siteTranslations || {};
    const supported = ['ar', 'en'];
    const previousText = new WeakMap();
    const dictionariesReady = Boolean(dictionaries.ar && dictionaries.en);
    let language = 'ar';

    try {
        const saved = localStorage.getItem(storageKey);
        if (dictionariesReady && !window.sitePageLoading?.timedOut && supported.includes(saved)) language = saved;
    } catch {
        // Browsers that block storage can still switch language for this page.
    }

    function t(key, fallback = '') {
        return dictionaries[language]?.[key] ?? dictionaries.ar?.[key] ?? fallback;
    }

    function apply(root = document) {
        const selectors = '[data-i18n], [data-i18n-alt], [data-i18n-title], [data-i18n-placeholder], [data-i18n-aria-label]';
        const elements = Array.from(root.querySelectorAll(selectors));
        if (root instanceof Element && root.matches(selectors)) elements.unshift(root);

        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (key) {
                const previous = previousText.get(element);
                const runtimeValue = element.hasAttribute('data-i18n-preserve-runtime')
                    && previous !== undefined && element.textContent !== previous;
                if (!runtimeValue) {
                    element.textContent = t(key, element.textContent);
                    previousText.set(element, element.textContent);
                }
            }

            ['alt', 'title', 'placeholder', 'aria-label'].forEach(attribute => {
                const attributeKey = element.getAttribute('data-i18n-' + attribute);
                if (attributeKey) {
                    element.setAttribute(attribute, t(attributeKey, element.getAttribute(attribute) || ''));
                }
            });
        });
    }

    function updateControls() {
        document.querySelectorAll('[data-language-switch]').forEach(button => {
            if (!dictionariesReady) {
                button.hidden = true;
                return;
            }
            const next = language === 'ar' ? 'en' : 'ar';
            button.textContent = next === 'en' ? 'English' : 'العربية';
            button.lang = next;
            button.dir = next === 'ar' ? 'rtl' : 'ltr';
            button.setAttribute('aria-label', t(next === 'en' ? 'common.switchToEnglish' : 'common.switchToArabic'));
            button.hidden = false;
        });
    }

    function setLanguage(next, persist = true) {
        if (!supported.includes(next)) return;
        language = next;
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        apply();
        updateControls();

        if (persist) {
            try {
                localStorage.setItem(storageKey, language);
            } catch {
                // Translation remains usable when persistence is unavailable.
            }
        }

        window.dispatchEvent(new CustomEvent('site:languagechange', { detail: { language } }));
    }

    window.siteI18n = { t, apply, setLanguage, getLanguage: () => language };
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';

    function initialize() {
        document.querySelectorAll('[data-language-switch]').forEach(button => {
            button.addEventListener('click', () => setLanguage(language === 'ar' ? 'en' : 'ar'));
        });
        setLanguage(language, false);
        window.sitePageLoading?.finish(dictionariesReady);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize, { once: true });
    } else {
        initialize();
    }
})();
