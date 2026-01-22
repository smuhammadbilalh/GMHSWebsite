// Mobile Menu Toggle Functions
function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const mobileOverlay = document.getElementById('mobileOverlay');

    mobileNav.classList.toggle('active');
    mobileOverlay.classList.toggle('active');

    // Prevent body scroll when menu is open
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const mobileOverlay = document.getElementById('mobileOverlay');

    mobileNav.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
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

    // Close mobile menu on escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
});
