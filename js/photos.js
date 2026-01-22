// =========================================
// GALLERY DATA & STATE
// =========================================
let galleryData = null;
let currentCategory = 'all';
let displayedCount = 8;
let allPhotos = [];
let filteredPhotos = [];

// Detect if mobile
const isMobile = () => window.innerWidth <= 900;
const initialLoadCount = () => isMobile() ? 4 : 8;

// =========================================
// LOAD ALL JSON DATA ON PAGE LOAD
// =========================================
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data/photos/gallery.json');
        galleryData = await response.json();

        // Set page title
        document.getElementById('pageTitle').textContent = galleryData.pageTitle;

        // Load categories
        loadCategories();

        // Load initial photos
        loadPhotos();

    } catch (error) {
        console.error('Error loading gallery:', error);
    }
});

// =========================================
// LOAD CATEGORY TABS
// =========================================
function loadCategories() {
    const tabsContainer = document.getElementById('categoryTabs');

    galleryData.categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = `tab-btn ${category.id === 'all' ? 'active' : ''}`;
        btn.textContent = category.name;
        btn.onclick = () => filterByCategory(category.id, btn);
        tabsContainer.appendChild(btn);
    });
}

// =========================================
// FILTER BY CATEGORY
// =========================================
function filterByCategory(categoryId, clickedBtn) {
    currentCategory = categoryId;
    displayedCount = initialLoadCount();

    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    clickedBtn.classList.add('active');

    // Filter and load photos
    loadPhotos();
}

// =========================================
// LOAD PHOTOS
// =========================================
function loadPhotos() {
    // Filter photos based on category
    if (currentCategory === 'all') {
        filteredPhotos = [...galleryData.photos];
    } else {
        filteredPhotos = galleryData.photos.filter(photo => photo.category === currentCategory);
    }

    // Display photos
    displayPhotos();

    // Update buttons
    updateButtons();
}

// =========================================
// DISPLAY PHOTOS (WITH LAZY LOADING)
// =========================================
function displayPhotos() {
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = '';

    const photosToShow = filteredPhotos.slice(0, displayedCount);

    photosToShow.forEach((photo, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.style.animationDelay = `${index * 0.1}s`;

        // Create placeholder while loading
        item.classList.add('loading');

        // Lazy load image
        const img = document.createElement('img');
        img.dataset.src = photo.thumbnail;
        img.alt = photo.title;
        img.loading = 'lazy';

        // When image loads, remove loading state
        img.onload = () => {
            item.classList.remove('loading');
        };

        // Set src to trigger loading
        img.src = img.dataset.src;

        const overlay = document.createElement('div');
        overlay.className = 'gallery-overlay';
        overlay.innerHTML = `<h3>${photo.title}</h3>`;

        item.appendChild(img);
        item.appendChild(overlay);

        // Open lightbox on click
        item.onclick = () => openLightbox(photo.fullImage);

        grid.appendChild(item);
    });
}

// =========================================
// UPDATE SHOW MORE / SHOW LESS BUTTONS
// =========================================
function updateButtons() {
    const btnShowMore = document.getElementById('btnShowMore');
    const btnShowLess = document.getElementById('btnShowLess');

    // Show "Show More" if there are more photos to load
    if (displayedCount < filteredPhotos.length) {
        btnShowMore.classList.remove('hidden');
    } else {
        btnShowMore.classList.add('hidden');
    }

    // Show "Show Less" if we've loaded more than initial
    if (displayedCount > initialLoadCount()) {
        btnShowLess.classList.remove('hidden');
        // Add pulse effect for first 3 seconds
        btnShowLess.classList.add('active');
        setTimeout(() => {
            btnShowLess.classList.remove('active');
        }, 3000);
    } else {
        btnShowLess.classList.add('hidden');
    }
}

// =========================================
// SHOW MORE BUTTON
// =========================================
document.getElementById('btnShowMore').onclick = () => {
    displayedCount += initialLoadCount();
    displayPhotos();
    updateButtons();

    // Smooth scroll to new content
    setTimeout(() => {
        const lastVisibleItem = document.querySelectorAll('.gallery-item')[displayedCount - initialLoadCount()];
        if (lastVisibleItem) {
            lastVisibleItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 100);
};

// =========================================
// SHOW LESS BUTTON
// =========================================
document.getElementById('btnShowLess').onclick = () => {
    displayedCount = initialLoadCount();
    displayPhotos();
    updateButtons();

    // Scroll back to top of gallery
    document.querySelector('.gallery-section').scrollIntoView({ behavior: 'smooth' });
};

// =========================================
// LIGHTBOX FUNCTIONALITY
// =========================================
function openLightbox(imageUrl) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');

    lightboxImg.src = imageUrl;
    lightbox.classList.add('active');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');

    lightbox.classList.remove('active');

    // Clear image source to save memory
    setTimeout(() => {
        lightboxImg.src = '';
    }, 300);

    // Restore body scroll
    document.body.style.overflow = 'auto';
}

// Close lightbox on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// Prevent lightbox from closing when clicking on image
document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') {
        closeLightbox();
    }
});


// =========================================
// RESPONSIVE HANDLING
// =========================================
window.addEventListener('resize', () => {
    // Reset displayed count based on screen size
    if (displayedCount <= initialLoadCount() * 2) {
        displayedCount = initialLoadCount();
        displayPhotos();
        updateButtons();
    }
});
