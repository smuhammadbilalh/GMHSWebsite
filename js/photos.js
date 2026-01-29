// =========================================
// GALLERY DATA & STATE
// =========================================
let galleryData = null;
let currentCategory = 'all';
let filteredPhotos = [];
let currentPointer = 0; // Tracks the next photo to load

// Detect if mobile
const isMobile = () => window.innerWidth <= 900;

// UPDATED: Page size doubled (16 for desktop, 8 for mobile)
const initialLoadCount = () => isMobile() ? 8 : 16;

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

        // Initial load for 'all' category
        filterByCategory('all', document.querySelector('.tab-btn.active') || null);

    } catch (error) {
        console.error('Error loading gallery:', error);
    }
});

// =========================================
// LOAD CATEGORY TABS
// =========================================
function loadCategories() {
    const tabsContainer = document.getElementById('categoryTabs');
    if (!tabsContainer) return;

    galleryData.categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = `tab-btn ${category.id === 'all' ? 'active' : ''}`;
        btn.textContent = category.name;
        btn.onclick = (e) => filterByCategory(category.id, e.target);
        tabsContainer.appendChild(btn);
    });
}

// =========================================
// FILTER BY CATEGORY
// =========================================
function filterByCategory(categoryId, clickedBtn) {
    currentCategory = categoryId;
    currentPointer = 0; // Reset pointer for new category

    // Update active tab UI
    if (clickedBtn) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        clickedBtn.classList.add('active');
    }

    // Prepare filtered list
    if (currentCategory === 'all') {
        filteredPhotos = [...galleryData.photos];
    } else {
        filteredPhotos = galleryData.photos.filter(photo => photo.category === currentCategory);
    }

    // Clear grid and load first batch
    const grid = document.getElementById('galleryGrid');
    if (grid) grid.innerHTML = '';

    // Reset Footer Visibility
    const footer = document.querySelector('.modern-footer');
    if (footer) footer.style.display = 'block';

    loadMorePhotos();
}

// =========================================
// INCREMENTAL LOADING LOGIC
// =========================================
function loadMorePhotos() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    const batchSize = initialLoadCount();
    const nextBatch = filteredPhotos.slice(currentPointer, currentPointer + batchSize);

    // Append ONLY new items to existing grid
    nextBatch.forEach((photo, index) => {
        const item = createGalleryItem(photo, index);
        grid.appendChild(item);
    });

    // Update state pointer
    currentPointer += nextBatch.length;
    updateButtons();
}

// =========================================
// CREATE GALLERY ITEM (DOM ELEMENT)
// =========================================
function createGalleryItem(photo, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.style.animationDelay = `${(index % initialLoadCount()) * 0.05}s`; // Faster staggered animation
    item.classList.add('loading');

    // Browser-native lazy loading for performance
    const img = document.createElement('img');
    img.alt = photo.title;
    img.loading = 'lazy';

    img.onload = () => item.classList.remove('loading');
    img.src = photo.thumbnail;

    const overlay = document.createElement('div');
    overlay.className = 'gallery-overlay';
    overlay.innerHTML = `<h3>${photo.title}</h3>`;

    item.appendChild(img);
    item.appendChild(overlay);

    // Lightbox trigger
    item.onclick = () => openLightbox(photo.fullImage);

    return item;
}

// =========================================
// UPDATE SHOW MORE / SHOW LESS BUTTONS
// =========================================
function updateButtons() {
    const btnShowMore = document.getElementById('btnShowMore');
    const btnShowLess = document.getElementById('btnShowLess');

    if (btnShowMore) {
        if (currentPointer < filteredPhotos.length) {
            btnShowMore.classList.remove('hidden');
        } else {
            btnShowMore.classList.add('hidden');
        }
    }

    if (btnShowLess) {
        if (currentPointer > initialLoadCount()) {
            btnShowLess.classList.remove('hidden');
        } else {
            btnShowLess.classList.add('hidden');
        }
    }
}

// =========================================
// BUTTON HANDLERS (FOOTER TOGGLING INCLUDED)
// =========================================
document.getElementById('btnShowMore').onclick = () => {
    loadMorePhotos();

    // HIDE footer when expanding
    const footer = document.querySelector('.modern-footer');
    if (footer) footer.style.display = 'none';

    // Optional: Smooth scroll to the start of the NEW content
    setTimeout(() => {
        const items = document.querySelectorAll('.gallery-item');
        const firstNewItem = items[currentPointer - initialLoadCount()];
        if (firstNewItem) {
            firstNewItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 50);
};

document.getElementById('btnShowLess').onclick = () => {
    // Reset to first batch
    currentPointer = 0;
    const grid = document.getElementById('galleryGrid');
    if (grid) grid.innerHTML = '';

    // RESTORE Footer when collapsing
    const footer = document.querySelector('.modern-footer');
    if (footer) footer.style.display = 'block';

    loadMorePhotos();

    // Scroll back to gallery top
    document.querySelector('.gallery-section').scrollIntoView({ behavior: 'smooth' });
};

// =========================================
// LIGHTBOX FUNCTIONALITY
// =========================================
function openLightbox(imageUrl) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');

    if (lightbox && lightboxImg) {
        lightboxImg.src = imageUrl;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');

    if (lightbox) lightbox.classList.remove('active');
    if (lightboxImg) {
        setTimeout(() => { lightboxImg.src = ''; }, 300);
    }
    document.body.style.overflow = 'auto';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

// =========================================
// TAB SCROLLING LOGIC
// =========================================
const tabsContainer = document.getElementById('categoryTabs');
const leftBtn = document.getElementById('scrollLeftBtn');
const rightBtn = document.getElementById('scrollRightBtn');

if (tabsContainer && leftBtn && rightBtn) {
    const SCROLL_AMOUNT = 300;

    rightBtn.onclick = () => tabsContainer.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
    leftBtn.onclick = () => tabsContainer.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });

    const handleScrollButtons = () => {
        const currentScroll = tabsContainer.scrollLeft;
        const maxScroll = tabsContainer.scrollWidth - tabsContainer.clientWidth;
        leftBtn.classList.toggle('hidden', currentScroll <= 10);
        rightBtn.classList.toggle('hidden', currentScroll >= maxScroll - 10);
    };

    tabsContainer.addEventListener('scroll', handleScrollButtons);
    window.addEventListener('resize', handleScrollButtons);
    setTimeout(handleScrollButtons, 100);
}