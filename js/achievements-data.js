/* =========================================================================
   Achievements page content (structure only).
   All visible text lives in js/translations.js under "achievements.*" keys,
   in both the "ar" and "en" dictionaries. See js/README.md.

   timeline[]   one entry per year tab (largest "order" shows first)
     id         short id used in the tab and panel ids (letters, digits, dash)
     year       the label shown on the tab and above the year
     label      translation key for the line next to the year
     items[]    achievements; the one with featured: true is shown large
       title, description   translation keys
       category award | partnership | event | initiative | media
       image    optional photo path
       meta[]   optional figures: { n: '+250', unit: '<translation key>' }
                (n is shown left-to-right; unit is translated)

   partners[]   key = translation key for the partner name (alt text and label)
                url = official website, or '' when there is no link
   ========================================================================= */

window.ACHIEVEMENTS_DATA = {
    categories: {
        award:       'achievements.cat.award',
        partnership: 'achievements.cat.partnership',
        event:       'achievements.cat.event',
        initiative:  'achievements.cat.initiative',
        media:       'achievements.cat.media'
    },

    timeline: [
        {
            id: '2025-2026',
            year: '2025 – 2026',
            order: 2026,
            label: 'achievements.y2526.label',
            items: [
                {
                    title: 'achievements.y2526.conference.title',
                    description: 'achievements.y2526.conference.description',
                    category: 'event',
                    featured: true,
                    image: '../assets/achievements/2025-conference.jpg',
                    meta: [{ n: '+250', unit: 'achievements.unit.linkRegistrants' }]
                },
                {
                    title: 'achievements.y2526.minerals.title',
                    description: 'achievements.y2526.minerals.description',
                    category: 'event',
                    meta: [{ n: '+200', unit: 'achievements.unit.beneficiaries' }]
                },
                {
                    title: 'achievements.y2526.jusoor.title',
                    description: 'achievements.y2526.jusoor.description',
                    category: 'initiative',
                    meta: [
                        { n: '+225', unit: 'achievements.unit.beneficiaries' },
                        { n: '+65', unit: 'achievements.unit.projects' }
                    ]
                },
                {
                    title: 'achievements.y2526.thalothiya.title',
                    description: 'achievements.y2526.thalothiya.description',
                    category: 'event',
                    meta: [
                        { n: '+10', unit: 'achievements.unit.sessions' },
                        { n: '+317', unit: 'achievements.unit.beneficiaries' }
                    ]
                },
                {
                    title: 'achievements.y2526.partnerships.title',
                    description: 'achievements.y2526.partnerships.description',
                    category: 'partnership',
                    meta: [{ n: '+10', unit: 'achievements.unit.sponsors' }]
                },
                {
                    title: 'achievements.y2526.visits.title',
                    description: 'achievements.y2526.visits.description',
                    category: 'event',
                    meta: [
                        { n: '+6', unit: 'achievements.unit.visits' },
                        { n: '+10', unit: 'achievements.unit.participations' }
                    ]
                },
                {
                    title: 'achievements.y2526.media.title',
                    description: 'achievements.y2526.media.description',
                    category: 'media',
                    meta: [{ n: '+4.2M', unit: 'achievements.unit.views' }]
                }
            ]
        },
        {
            id: '2024',
            year: '2024',
            order: 2024,
            label: 'achievements.impact',
            items: [
                {
                    title: 'achievements.award',
                    description: 'achievements.awardDescription',
                    category: 'award',
                    featured: true,
                    meta: [{ unit: 'achievements.unit.firstPlace' }]
                }
            ]
        },
        {
            id: '2023',
            year: '2023',
            order: 2023,
            label: 'achievements.foundation',
            items: [
                {
                    title: 'achievements.journey',
                    description: 'achievements.journeyDescription',
                    category: 'initiative',
                    featured: true
                }
            ]
        }
    ],

    partners: [
        { key: 'achievements.partner.mim',            logo: '../assets/partners/mim.png',                  url: 'https://www.mim.gov.sa' },
        { key: 'achievements.partner.monshaat',       logo: '../assets/partners/monshaat.png',             url: 'https://www.monshaat.gov.sa' },
        { key: 'achievements.partner.zatca',          logo: '../assets/partners/zatca.png',                url: 'https://zatca.gov.sa' },
        { key: 'achievements.partner.biban',          logo: '../assets/partners/biban.png',                url: '' },
        { key: 'achievements.partner.jeddahChamber',  logo: '../assets/partners/jeddah-chamber.png',       url: 'https://www.jcci.org.sa' },
        { key: 'achievements.partner.makkahChamber',  logo: '../assets/partners/makkah-chamber.png',       url: 'https://makkahcci.org.sa' },
        { key: 'achievements.partner.wadiMakkah',     logo: '../assets/partners/wadi-makkah.png',          url: 'https://wadimakkah.sa' },
        { key: 'achievements.partner.injaz',          logo: '../assets/partners/injaz-saudi.png',          url: 'https://injaz-saudi.org' },
        { key: 'achievements.partner.industrialHack', logo: '../assets/partners/industrial-hackathon.png', url: '' },
        { key: 'achievements.partner.salla',          logo: '../assets/partners/salla.png',                url: 'https://salla.com' },
        { key: 'achievements.partner.flyadeal',       logo: '../assets/partners/flyadeal.png',             url: 'https://www.flyadeal.com' },
        { key: 'achievements.partner.nahdi',          logo: '../assets/partners/nahdi.png',                url: 'https://www.nahdionline.com' },
        { key: 'achievements.partner.bupa',           logo: '../assets/partners/bupa.png',                 url: 'https://www.bupa.com.sa' },
        { key: 'achievements.partner.johnson',        logo: '../assets/partners/johnson-controls.png',     url: 'https://www.johnsoncontrols.com' },
        { key: 'achievements.partner.gsea',           logo: '../assets/partners/gsea.png',                 url: '' },
        { key: 'achievements.partner.wadiJeddah',     logo: '../assets/partners/wadi-jeddah.png',          url: '' },
        { key: 'achievements.partner.wadiJeddahHub',  logo: '../assets/partners/wadi-jeddah-hub.png',      url: '' },
        { key: 'achievements.partner.kauEndowment',   logo: '../assets/partners/kau-endowment.png',        url: '' },
        { key: 'achievements.partner.kauEngineering', logo: '../assets/partners/kau-engineering.png',      url: '' },
        { key: 'achievements.partner.engineeringDay', logo: '../assets/partners/engineering-day.png',      url: '' },
        { key: 'achievements.partner.mutqen',         logo: '../assets/partners/mutqen.png',               url: '' },
        { key: 'achievements.partner.jada',           logo: '../assets/partners/jada.png',                 url: '' },
        { key: 'achievements.partner.ventureCraft',   logo: '../assets/partners/kfupm-venture-craft.png',  url: '' },
        { key: 'achievements.partner.kiaora',         logo: '../assets/partners/kiaora.png',               url: '' },
        { key: 'achievements.partner.abaad',          logo: '../assets/partners/abaad.png',                url: '' },
        { key: 'achievements.partner.techhub',        logo: '../assets/partners/techhub.png',              url: '' },
        { key: 'achievements.partner.ecc',            logo: '../assets/partners/ecc.png',                  url: '' },
        { key: 'achievements.partner.estidama',       logo: '../assets/partners/estidama.png',             url: '' },
        { key: 'achievements.partner.sportsHack',     logo: '../assets/partners/sports-hackathon.png',     url: '' },
        { key: 'achievements.partner.classmedia',     logo: '../assets/partners/classmedia.png',           url: '' }
    ]
};
