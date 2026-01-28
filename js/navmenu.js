// Mobile Menu Toggle Functions
function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const mobileOverlay = document.getElementById('mobileOverlay');
    mobileNav.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.classList.toggle('menu-open', mobileNav.classList.contains('active'));
}

function closeMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const mobileOverlay = document.getElementById('mobileOverlay');
    mobileNav.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.classList.remove('menu-open');
}

// Active Link Detection
function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const pageMap = {
        'index.html': 'home', '': 'home',
        'academics.html': 'academics',
        'sports.html': 'sports',
        'photos.html': 'photos',
        'contact.html': 'contact',
        'faculty.html': 'faculty',
        'developer.html': 'developer'
    };
    const activePage = pageMap[currentPage] || 'home';

    document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
        if (link.getAttribute('data-page') === activePage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    setActiveLink();
    document.body.classList.remove('menu-open');
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMobileMenu(); });
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 1024) closeMobileMenu();
        }, 250);
    });
});

// PARTICLES CONFIGURATION - HIGH DENSITY & VERY SUBTLE
(async function initNavParticles() {
    const waitForLib = new Promise((resolve, reject) => {
        let attempts = 0;
        const check = setInterval(() => {
            if (typeof tsParticles !== 'undefined') {
                clearInterval(check);
                resolve(tsParticles);
            }
            if (attempts++ > 30) {
                clearInterval(check);
                reject("Timeout");
            }
        }, 100);
    });

    try {
        await waitForLib;
        await tsParticles.load("nav-particles", {
            fullScreen: { enable: false },
            fpsLimit: 60,
            particles: {
                // LIGHT GRAY COLOR for subtlety
                color: { value: "#94a3b8" },
                links: {
                    color: "#94a3b8",
                    distance: 100,
                    enable: true,
                    opacity: 0.15, // Very faint connections
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 0.8,
                    direction: "none",
                    outModes: { default: "bounce" }
                },
                number: {
                    // DENSITY DISABLED: Forces exactly 45 particles to appear
                    density: { enable: false },
                    value: 45
                },
                opacity: {
                    value: { min: 0.1, max: 0.3 } // Very low opacity
                },
                shape: { type: "circle" },
                size: { value: { min: 1, max: 3 } }
            },
            detectRetina: true
        });
    } catch (e) {
        console.log("Nav particles skipped");
    }
})();

function toggleMobileDropdown(btn) {
    const content = btn.nextElementSibling;
    const arrow = btn.querySelector('.mobile-arrow');
    if (content.style.maxHeight) {
        content.style.maxHeight = null;
        arrow.style.transform = 'rotate(0deg)';
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
        arrow.style.transform = 'rotate(180deg)';
    }
}