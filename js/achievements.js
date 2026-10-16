/* =========================================================================
   Achievements page: builds the year tabs, achievement cards and partner
   logos from js/achievements-data.js, and runs the counters, the cards strip
   and the envelope.

   Text: every string comes from js/translations.js. Generated elements carry
   data-i18n / data-i18n-alt / data-i18n-aria-label keys, so the site's
   language switch (js/i18n.js) translates them like the rest of the page.
   Loaded with defer, after translations.js and i18n.js.
   ========================================================================= */
(function () {
    'use strict';

    var data = window.ACHIEVEMENTS_DATA || { timeline: [], partners: [], categories: {} };
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function t(key) {
        if (window.siteI18n) return window.siteI18n.t(key, key);
        var ar = (window.siteTranslations || {}).ar || {};
        return ar[key] || key;
    }

    function esc(str) {
        return String(str == null ? '' : str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    /* A translated text node: <tag data-i18n="key">current text</tag> */
    function tx(tag, cls, key) {
        return '<' + tag + (cls ? ' class="' + cls + '"' : '') + ' data-i18n="' + esc(key) + '">' + esc(t(key)) + '</' + tag + '>';
    }

    /* ---------------- Counters ----------------
       data-target: the number, data-suffix: K or M (optional) */
    function initStats() {
        var nums = document.querySelectorAll('.ach-stat__num');
        var section = document.querySelector('.ach-numbers');
        if (!section || !nums.length) return;

        function start() {
            nums.forEach(function (el) {
                var target = +el.getAttribute('data-target');
                var suffix = el.getAttribute('data-suffix') || '';
                if (reduceMotion) { el.textContent = target + suffix; return; }
                var duration = 1600, t0 = null;
                (function frame(ts) {
                    if (!t0) t0 = ts || performance.now();
                    var p = Math.min(((ts || t0) - t0) / duration, 1);
                    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
                    if (p < 1) requestAnimationFrame(frame);
                })();
            });
        }

        nums.forEach(function (el) { if (!reduceMotion) el.textContent = '0' + (el.getAttribute('data-suffix') || ''); });
        if (!('IntersectionObserver' in window)) { start(); return; }
        var io = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) { start(); io.unobserve(section); }
        }, { threshold: 0.4 });
        io.observe(section);
    }

    /* ---------------- Cards ---------------- */
    function catLabel(key) {
        var k = (data.categories || {})[key];
        return k ? tx('span', 'ach-card__cat', k) : '';
    }

    /* Figures such as "+225 beneficiaries · +65 projects": the number stays
       left-to-right inside Arabic text, the unit is translated. */
    function footer(item) {
        if (!item.meta || !item.meta.length) return '';
        var parts = item.meta.map(function (m) {
            return (m.n ? '<bdi dir="ltr">' + esc(m.n) + '</bdi> ' : '') + tx('span', '', m.unit);
        });
        return '<div class="ach-card__foot"><span class="ach-card__meta">' + parts.join(' · ') + '</span></div>';
    }

    function featuredCard(item) {
        var media = item.image
            ? '<div class="ach-card__media"><img src="' + esc(item.image) + '" alt="' + esc(t(item.title)) + '" data-i18n-alt="' + esc(item.title) + '" loading="lazy"></div>'
            : '';
        return '' +
            '<article class="ach-card ach-card--featured' + (item.image ? '' : ' is-text') + '">' +
            media +
            '<div class="ach-card__body">' +
            catLabel(item.category) +
            tx('h3', 'ach-card__title', item.title) +
            tx('p', 'ach-card__desc', item.description) +
            footer(item) +
            '</div>' +
            '</article>';
    }

    function compactCard(item) {
        return '' +
            '<article class="ach-card ach-card--compact">' +
            catLabel(item.category) +
            tx('h3', 'ach-card__title', item.title) +
            tx('p', 'ach-card__desc', item.description) +
            footer(item) +
            '</article>';
    }

    /* ---------------- Years ---------------- */
    function renderTimeline() {
        var list = document.getElementById('journey-list');
        var rail = document.getElementById('year-rail');
        if (!list || !rail) return;

        var years = (data.timeline || []).slice().sort(function (a, b) { return (b.order || 0) - (a.order || 0); });

        rail.innerHTML = '<div class="year-rail__track" role="tablist">' + years.map(function (y) {
            return '<button type="button" role="tab" class="year-rail__item" id="tab-' + esc(y.id) + '" aria-controls="year-' + esc(y.id) + '" data-year="' + esc(y.id) + '">' +
                '<bdi>' + esc(y.year) + '</bdi></button>';
        }).join('') + '</div>';

        list.innerHTML = years.map(function (y) {
            var items = (y.items || []).slice();
            var fIdx = items.findIndex(function (i) { return i.featured; });
            var featured = fIdx > -1 ? items.splice(fIdx, 1)[0] : null;
            return '' +
                '<section class="year-block" role="tabpanel" id="year-' + esc(y.id) + '" aria-labelledby="tab-' + esc(y.id) + '" data-year="' + esc(y.id) + '">' +
                '<header class="year-head">' +
                '<h3 class="year-head__year"><bdi>' + esc(y.year) + '</bdi></h3>' +
                (y.label ? tx('span', 'year-head__label', y.label) : '') +
                '</header>' +
                (featured ? featuredCard(featured) : '') +
                (items.length ? '' +
                    '<div class="ach-slider">' +
                    '<div class="ach-slider__track" tabindex="0" aria-label="' + esc(t('achievements.moreLabel')) + '" data-i18n-aria-label="achievements.moreLabel">' + items.map(compactCard).join('') + '</div>' +
                    '<div class="ach-slider__nav">' +
                    '<button type="button" class="ach-slider__btn" data-dir="-1" aria-label="' + esc(t('achievements.previous')) + '" data-i18n-aria-label="achievements.previous"><i data-lucide="chevron-right"></i></button>' +
                    '<button type="button" class="ach-slider__btn" data-dir="1" aria-label="' + esc(t('achievements.next')) + '" data-i18n-aria-label="achievements.next"><i data-lucide="chevron-left"></i></button>' +
                    '</div>' +
                    '</div>' : '') +
                '</section>';
        }).join('');

        initYearRail();
    }

    /* The year bar works as tabs: one year is shown at a time */
    function initYearRail() {
        var tabs = Array.prototype.slice.call(document.querySelectorAll('.year-rail__item'));
        var blocks = Array.prototype.slice.call(document.querySelectorAll('.year-block'));
        if (!tabs.length) return;

        function show(id, focus) {
            tabs.forEach(function (tab) {
                var on = tab.getAttribute('data-year') === id;
                tab.classList.toggle('is-active', on);
                tab.setAttribute('aria-selected', on ? 'true' : 'false');
                tab.tabIndex = on ? 0 : -1;
                if (on && focus) tab.focus();
            });
            blocks.forEach(function (b) {
                var on = b.getAttribute('data-year') === id;
                b.hidden = !on;
                if (on) {
                    b.classList.remove('is-shown'); void b.offsetWidth; b.classList.add('is-shown');
                    var sl = b.querySelector('.ach-slider');
                    if (sl && sl._update) sl._update();
                }
            });
        }

        tabs.forEach(function (tab, i) {
            tab.addEventListener('click', function () { show(tab.getAttribute('data-year')); });
            tab.addEventListener('keydown', function (e) {
                var dir = document.documentElement.dir === 'ltr' ? 1 : -1;
                var next = null;
                if (e.key === 'ArrowRight') next = i - dir;
                if (e.key === 'ArrowLeft') next = i + dir;
                if (e.key === 'Home') next = 0;
                if (e.key === 'End') next = tabs.length - 1;
                if (next === null) return;
                e.preventDefault();
                next = (next + tabs.length) % tabs.length;
                show(tabs[next].getAttribute('data-year'), true);
            });
        });

        show(tabs[0].getAttribute('data-year'));
    }

    /* ---------------- Cards strip (manual: arrows and swipe) ---------------- */
    function initSliders() {
        document.querySelectorAll('.ach-slider').forEach(function (slider) {
            var track = slider.querySelector('.ach-slider__track');
            var btns = slider.querySelectorAll('.ach-slider__btn');
            var nav = slider.querySelector('.ach-slider__nav');

            function rtl() { return getComputedStyle(track).direction === 'rtl'; }
            function step() {
                var card = track.firstElementChild;
                var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
                return card ? card.getBoundingClientRect().width + gap : track.clientWidth;
            }
            function update() {
                var max = track.scrollWidth - track.clientWidth;
                var pos = Math.abs(track.scrollLeft);
                nav.hidden = max <= 2;
                btns[0].disabled = pos <= 2;
                btns[1].disabled = pos >= max - 2;
            }
            btns.forEach(function (b) {
                b.addEventListener('click', function () {
                    var forward = +b.getAttribute('data-dir');
                    var sign = rtl() ? -1 : 1;
                    track.scrollBy({ left: forward * sign * step(), behavior: reduceMotion ? 'auto' : 'smooth' });
                });
            });
            track.addEventListener('scroll', update, { passive: true });
            window.addEventListener('resize', update);
            slider._update = update;
            slider._reset = function () { track.scrollLeft = 0; update(); };
            update();
        });
    }

    /* ---------------- Partners: two auto-scrolling rows ---------------- */
    function partnerTile(p, hidden) {
        var name = esc(t(p.key));
        var img = '<img src="' + esc(p.logo) + '" loading="lazy" draggable="false" ' +
            (hidden ? 'alt=""' : 'alt="' + name + '" data-i18n-alt="' + esc(p.key) + '"') + '>';
        if (hidden) {
            return p.url
                ? '<a class="partner partner--link" href="' + esc(p.url) + '" target="_blank" rel="noopener noreferrer" tabindex="-1" aria-hidden="true">' + img + '<span class="partner__go"><i data-lucide="arrow-up-left"></i></span></a>'
                : '<div class="partner" aria-hidden="true">' + img + '</div>';
        }
        if (p.url) {
            return '<a class="partner partner--link" href="' + esc(p.url) + '" target="_blank" rel="noopener noreferrer" ' +
                'title="' + name + '" data-i18n-title="' + esc(p.key) + '">' +
                img + '<span class="partner__go" aria-hidden="true"><i data-lucide="arrow-up-left"></i></span></a>';
        }
        return '<div class="partner" title="' + name + '" data-i18n-title="' + esc(p.key) + '">' + img + '</div>';
    }

    function renderPartners() {
        var wrap = document.getElementById('partners-grid');
        if (!wrap) return;
        var list = (data.partners || []).filter(function (p) { return p.logo; });
        var half = Math.ceil(list.length / 2);
        var rows = [list.slice(0, half), list.slice(half)];
        wrap.innerHTML = rows.map(function (row, i) {
            var set = row.map(function (p) { return partnerTile(p, false); }).join('');
            var copy = row.map(function (p) { return partnerTile(p, true); }).join('');
            return '<div class="marquee' + (i % 2 ? ' marquee--reverse' : '') + '" dir="ltr">' +
                '<div class="marquee__track" data-count="' + row.length + '">' +
                '<div class="marquee__set">' + set + '</div>' +
                '<div class="marquee__set" aria-hidden="true">' + copy + '</div>' +
                '</div></div>';
        }).join('');
        /* speed: about 4 seconds per logo, at least 30 seconds per loop */
        wrap.querySelectorAll('.marquee__track').forEach(function (track) {
            track.style.setProperty('--marquee-duration', Math.max(30, +track.getAttribute('data-count') * 4) + 's');
        });
    }

    /* ---------------- Reveal on scroll ---------------- */
    function initReveal() {
        var els = document.querySelectorAll('.ach-cta__inner');
        if (reduceMotion || !('IntersectionObserver' in window)) return;
        els.forEach(function (el) { el.classList.add('will-reveal'); });
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { e.target.classList.add('is-revealed'); io.unobserve(e.target); }
            });
        }, { threshold: 0.12 });
        els.forEach(function (el) { io.observe(el); });
    }

    /* ---------------- Envelope ---------------- */
    function initEnvelope() {
        var env = document.getElementById('cta-envelope');
        if (!env) return;
        env.addEventListener('click', function () {
            var open = env.classList.toggle('is-open');
            env.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    renderTimeline();
    initSliders();
    renderPartners();
    initStats();
    initReveal();
    initEnvelope();

    /* Generated text follows the current language; icons are drawn once rendered. */
    var page = document.querySelector('.achievements-page');
    if (window.siteI18n && page) window.siteI18n.apply(page);
    if (window.lucide) window.lucide.createIcons();

    /* Switching language flips the page direction: restart each strip from its start. */
    window.addEventListener('site:languagechange', function () {
        document.querySelectorAll('.ach-slider').forEach(function (sl) { if (sl._reset) sl._reset(); });
    });
})();
