// Refresh only copyright text, preserving links and translation spans in the footer.
function updateCopyrightYear() {
    const year = String(new Date().getFullYear());
    document.querySelectorAll('.site-footer-copyright').forEach(footer => {
        const textNodes = document.createTreeWalker(footer, NodeFilter.SHOW_TEXT);
        while (textNodes.nextNode()) {
            const node = textNodes.currentNode;
            node.nodeValue = node.nodeValue.replace(/[0-9]{4}|[٠-٩]{4}/g, previous => (
                /[٠-٩]/.test(previous)
                    ? year.replace(/[0-9]/g, digit => '٠١٢٣٤٥٦٧٨٩'[Number(digit)])
                    : year
            ));
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateCopyrightYear, { once: true });
} else {
    updateCopyrightYear();
}
window.addEventListener('site:languagechange', updateCopyrightYear);

// Mobile Toggle Logic
const mobileToggle = document.getElementById('mobile-toggle');
const navMenu = document.querySelector('.nav-menu');

function setMenuOpen(open) {
    navMenu?.classList.toggle('active', open);
    mobileToggle?.setAttribute('aria-expanded', String(open));
    // Lucide replaces the original <i> with an SVG after initial rendering.
    const currentIcon = mobileToggle?.querySelector('[data-lucide]');
    if (currentIcon) {
        const icon = document.createElement('i');
        icon.setAttribute('data-lucide', open ? 'x' : 'menu');
        currentIcon.replaceWith(icon);
        window.lucide?.createIcons();
    }
}

mobileToggle?.addEventListener('click', () => setMenuOpen(!navMenu?.classList.contains('active')));

// Close menu when clicking links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        setMenuOpen(false);
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    if (window.scrollY > 50) {
        header.style.padding = '0.8rem 0';
        header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
    } else {
        header.style.padding = '1rem 0';
        header.style.boxShadow = 'none';
    }
});

// Slider Logic
const slider = document.getElementById('main-slider');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let currentIndex = 0;

function updateSlider() {
    if (!slider) return;
    const direction = document.documentElement.dir === 'rtl' ? 1 : -1;
    slider.style.transform = `translateX(${direction * currentIndex * 100}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

window.addEventListener('site:languagechange', updateSlider);

nextBtn?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
});

prevBtn?.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider();
});

// Auto-advance
setInterval(() => {
    if (slides.length > 0) {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
    }
}, 5000);

// =============================================
// Radial Hub Interaction Logic (Mobile-aware)
// =============================================
const hubNodes = document.querySelectorAll('.hub-node-item');
const infoBlocks = document.querySelectorAll('.info-block');
const hubGrid = document.getElementById('radial-hub-grid') || document.querySelector('.radial-hub-grid');
const hubVisual = document.querySelector('.radial-hub-visual-area');
const hubPanel = document.querySelector('.radial-hub-info-panel');

function isMobile() {
    return window.innerWidth <= 992;
}

function showCard(targetId) {
    // Update nodes active state
    hubNodes.forEach(n => n.classList.remove('active'));
    document.querySelector(`[data-target="${targetId}"]`)?.classList.add('active');

    // Update info blocks
    infoBlocks.forEach(block => {
        block.classList.remove('active');
        // Hide all back buttons
        const btn = block.querySelector('.hub-back-btn');
        if (btn) btn.style.display = 'none';
    });

    const targetBlock = document.getElementById(targetId);
    if (targetBlock) {
        targetBlock.classList.add('active');
        if (isMobile()) {
            const backBtn = targetBlock.querySelector('.hub-back-btn');
            if (backBtn) backBtn.style.display = 'flex';
        }
    }

    // Mobile: swap panels
    if (isMobile() && hubVisual && hubPanel) {
        hubVisual.style.display = 'none';
        hubPanel.style.display = 'flex';
        // Trigger animation
        hubPanel.style.animation = 'none';
        hubPanel.offsetHeight; // reflow
        hubPanel.style.animation = 'premiumCardEntrance 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    }
}

function showOrbit() {
    // Restore orbit view
    if (isMobile() && hubVisual && hubPanel) {
        hubPanel.style.display = 'none';
        hubVisual.style.display = '';
        hubVisual.style.animation = 'fadeInSoft 0.4s ease forwards';
    }
    // Hide all back buttons
    infoBlocks.forEach(block => {
        const btn = block.querySelector('.hub-back-btn');
        if (btn) btn.style.display = 'none';
    });
}

// On page load: hide panel on mobile, hide all back buttons
if (isMobile()) {
    if (hubPanel) hubPanel.style.display = 'none';
}
infoBlocks.forEach(block => {
    const btn = block.querySelector('.hub-back-btn');
    if (btn) btn.style.display = 'none';
});

// Node click
hubNodes.forEach(node => {
    node.addEventListener('click', () => {
        const targetId = node.getAttribute('data-target');
        showCard(targetId);
    });
});

// Back button click (delegated on document to avoid issues)
document.addEventListener('click', (e) => {
    if (e.target.closest('.hub-back-btn')) {
        e.stopPropagation();
        showOrbit();
    }
});

// On resize: reset to desktop state if screen grows
window.addEventListener('resize', () => {
    if (!isMobile()) {
        if (hubVisual) hubVisual.style.display = '';
        if (hubPanel) hubPanel.style.display = '';
        infoBlocks.forEach(block => {
            const btn = block.querySelector('.hub-back-btn');
            if (btn) btn.style.display = 'none';
        });
    }
});


