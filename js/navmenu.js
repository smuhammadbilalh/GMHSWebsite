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

// Active Link Detection & Parent Highlighting
function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    const pageMap = {
        'index.html': 'home', '': 'home',
        'academics.html': 'academics',
        'sports.html': 'sports',
        'photos.html': 'photos',
        'contact.html': 'contact',
        'faculty.html': 'faculty',
        'developer.html': 'developer',
        'co-curricular.html': 'co-curricular',
        'medals.html': 'medals',
        'alumni.html': 'alumni'
    };

    const activePage = pageMap[currentPage] || 'home';

    // Reset states
    document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
        link.classList.remove('active');
        link.classList.remove('parent-active');
    });
    document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
        trigger.classList.remove('parent-active');
    });

    // Set Active States
    document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
        if (link.getAttribute('data-page') === activePage) {
            link.classList.add('active');

            // Desktop Parent Logic
            const desktopDropdown = link.closest('.dropdown-menu');
            if (desktopDropdown) {
                const parentLi = desktopDropdown.closest('.dropdown-parent');
                if (parentLi) {
                    const parentTrigger = parentLi.querySelector('.dropdown-trigger');
                    if (parentTrigger) {
                        parentTrigger.classList.add('parent-active');
                    }
                }
            }
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

// PARTICLES CONFIGURATION - LOAD FOR DESKTOP & MOBILE
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

        const particleConfig = {
            fullScreen: { enable: false },
            fpsLimit: 60,
            particles: {
                color: { value: "#94a3b8" },
                links: {
                    color: "#94a3b8",
                    distance: 100,
                    enable: true,
                    opacity: 0.15,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 0.8,
                    direction: "none",
                    outModes: { default: "bounce" }
                },
                number: {
                    density: { enable: false },
                    value: 45
                },
                opacity: {
                    value: { min: 0.1, max: 0.3 }
                },
                shape: { type: "circle" },
                size: { value: { min: 1, max: 3 } }
            },
            detectRetina: true
        };

        // 1. Load for Desktop Navbar
        await tsParticles.load("nav-particles", particleConfig);

        // 2. Load for Mobile Panel
        await tsParticles.load("mobile-nav-particles", particleConfig);

    } catch (e) {
        console.log("Nav particles skipped");
    }
})();