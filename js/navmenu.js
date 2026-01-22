// Mobile Menu Toggle Functions
function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const mobileOverlay = document.getElementById('mobileOverlay');

    mobileNav.classList.toggle('active');
    mobileOverlay.classList.toggle('active');

    // Use class instead of inline style for better control
    if (mobileNav.classList.contains('active')) {
        document.body.classList.add('menu-open');
    } else {
        document.body.classList.remove('menu-open');
    }
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

    // Map pages to their data-page attributes
    const pageMap = {
        'index.html': 'home',
        '': 'home',
        'academics.html': 'academics',
        'sports.html': 'sports',
        'photos.html': 'photos',
        'contact.html': 'contact',
        'developer.html': 'developer'
    };

    const activePage = pageMap[currentPage] || 'home';

    // Set active class for desktop menu
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('data-page') === activePage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Set active class for mobile menu
    document.querySelectorAll('.mobile-nav a').forEach(link => {
        if (link.getAttribute('data-page') === activePage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    setActiveLink();

    // Ensure body overflow is correct on page load
    document.body.classList.remove('menu-open');

    // Close mobile menu on escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });

    // Close mobile menu on window resize (if open)
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if (window.innerWidth > 1024) {
                closeMobileMenu();
            }
        }, 250);
    });
});
