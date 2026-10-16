// Run synchronously in <head>, before page content or deferred translations.
(() => {
    const root = document.documentElement;
    let finished = false;
    let timedOut = false;
    let language = 'ar';

    try {
        if (localStorage.getItem('club-language') === 'en') language = 'en';
    } catch {
        // Arabic remains available when browser storage is blocked.
    }

    root.lang = language;
    root.dir = language === 'ar' ? 'rtl' : 'ltr';
    root.classList.add('page-loading');
    root.setAttribute('aria-busy', 'true');

    function finish(ready = true) {
        if (finished) return;
        finished = true;
        clearTimeout(timeout);

        if (!ready) {
            timedOut = true;
            root.lang = 'ar';
            root.dir = 'rtl';
            window.siteI18n?.setLanguage('ar', false);
        }

        root.classList.add('page-loader-leaving');
        // Force the opaque state to be painted before starting the short fade.
        getComputedStyle(root, '::before').opacity;
        root.classList.remove('page-loading');
        root.setAttribute('aria-busy', 'false');
        setTimeout(() => root.classList.remove('page-loader-leaving'), 200);
    }

    const timeout = setTimeout(() => finish(false), 2000);
    window.sitePageLoading = { finish, get timedOut() { return timedOut; } };

    // A restored page should not retain a loading overlay from its previous visit.
    window.addEventListener('pageshow', event => {
        if (event.persisted) {
            finish(Boolean(window.siteI18n));
            root.classList.remove('page-loading', 'page-loader-leaving');
        }
    });
})();
