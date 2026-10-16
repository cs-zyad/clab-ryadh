# CSS organization

Public pages load styles in this order:

`loading.css` loads first, before the list below, to protect the first paint with a
white loading screen, club logo and spinner. It activates only when `loading.js`
adds the loading class, so the Arabic page stays visible with JavaScript disabled.

1. `style.css`: existing site design, components and responsive rules.
2. `public-shared.css`: shared page hero, footer and small icon styles extracted from HTML.
3. The page stylesheet, when needed:
   - `home.css` for `/index.html`.
   - `activities.css` for `/activities/index.html`, including generated ticket markup.
   - `members.css` for `/members/index.html`.
   - `achievements.css` for `/achievements/index.html`.

About and development use only the first two files; they have no additional embedded page rules.

All public pages also load `i18n.css` last for language controls and direction-specific
adjustments. Directional spacing, alignment, borders and positioning use logical CSS
properties so Arabic uses RTL and English uses LTR. Geometric centering stays physical.

Add shared presentation to `public-shared.css`, and page-specific presentation to the
matching page file. Use descriptive classes in HTML rather than `style` attributes
or embedded `<style>` blocks. Keep stylesheet links after `style.css` in `<head>`.

JavaScript still sets runtime visibility and interaction state where needed.
Ticket status colors are defined in `activities.css` and selected with state classes.
The targeted members selectors preserve the precedence of the former inline styles,
including over card hover rules, without blocking JavaScript style changes.

Admin pages are outside this public-page cleanup.
