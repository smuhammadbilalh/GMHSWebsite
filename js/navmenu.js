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

// PARTICLES CONFIGURATION - UPDATED FOR VISIBILITY
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
                color: { value: "#334155" }, // Dark slate for better visibility than pure black
                links: {
                    color: "#334155",
                    distance: 120,
                    enable: true,
                    opacity: 0.4, // Increased from 0.15
                    width: 1.5
                },
                move: {
                    enable: true,
                    speed: 0.8,
                    direction: "none",
                    outModes: { default: "bounce" }
                },
                number: {
                    density: { enable: true, area: 400 },
                    value: 20
                },
                opacity: {
                    value: { min: 0.3, max: 0.6 } // Varied opacity like homepage
                },
                shape: { type: "circle" },
                size: { value: { min: 1, max: 4 } }
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