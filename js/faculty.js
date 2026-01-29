// =========================================
// FACULTY DATA & STATE
// =========================================
let facultyData = null;
let currentCategory = 'all';
let filteredStaff = [];
let currentPointer = 0;

// Detect if mobile
const isMobile = () => window.innerWidth <= 768;

// UPDATED: Page size doubled (16 for desktop, 8 for mobile)
const initialLoadCount = () => isMobile() ? 8 : 16;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data/faculty/content.json');
        facultyData = await response.json();

        document.getElementById('pageTitle').textContent = facultyData.pageTitle;
        loadCategories();

        // Initial load
        filterByCategory('all', document.querySelector('.tab-btn.active') || null);
    } catch (error) {
        console.error('Error loading faculty data:', error);
    }
});

// =========================================
// LOAD CATEGORY TABS
// =========================================
function loadCategories() {
    const container = document.getElementById('categoryTabs');
    if (!container) return;

    facultyData.categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `tab-btn ${cat.id === 'all' ? 'active' : ''}`;
        btn.textContent = cat.name;
        btn.onclick = (e) => filterByCategory(cat.id, e.target);
        container.appendChild(btn);
    });
}

// =========================================
// FILTER LOGIC
// =========================================
function filterByCategory(categoryId, clickedBtn) {
    currentCategory = categoryId;
    currentPointer = 0;

    if (clickedBtn) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        clickedBtn.classList.add('active');
    }

    if (currentCategory === 'all') {
        filteredStaff = [...facultyData.staff];
    } else {
        filteredStaff = facultyData.staff.filter(s => s.category === currentCategory);
    }

    const grid = document.getElementById('facultyGrid');
    if (grid) grid.innerHTML = '';

    // Reset Footer Visibility
    const footer = document.querySelector('.modern-footer');
    if (footer) footer.style.display = 'block';

    loadMoreFaculty();
}

// =========================================
// INCREMENTAL LOADING LOGIC
// =========================================
function loadMoreFaculty() {
    const grid = document.getElementById('facultyGrid');
    if (!grid) return;

    const batchSize = initialLoadCount();
    const nextBatch = filteredStaff.slice(currentPointer, currentPointer + batchSize);

    nextBatch.forEach((member, index) => {
        const card = createFacultyCard(member, index);
        grid.appendChild(card);
    });

    currentPointer += nextBatch.length;
    updateButtons();
}

function createFacultyCard(member, index) {
    const card = document.createElement('div');
    card.className = 'faculty-card';
    card.style.animationDelay = `${(index % initialLoadCount()) * 0.05}s`; // Faster staggered delay

    card.innerHTML = `
        <div class="faculty-img-container">
            <img src="${member.photo}" alt="${member.name}" loading="lazy">
        </div>
        <div class="faculty-info">
            <h3>${member.name}</h3>
            <div class="faculty-designation">${member.designation}</div>
            <div class="faculty-details">
                <div class="detail-item"><strong>Edu:</strong> ${member.qualification}</div>
                <a href="tel:${member.phone}" class="contact-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <span>${member.phone}</span>
                </a>
            </div>
        </div>
    `;
    return card;
}

// =========================================
// BUTTON STATE & HANDLERS
// =========================================
function updateButtons() {
    const btnShowMore = document.getElementById('btnShowMore');
    const btnShowLess = document.getElementById('btnShowLess');

    if (btnShowMore) {
        if (currentPointer < filteredStaff.length) {
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

document.getElementById('btnShowMore').onclick = () => {
    loadMoreFaculty();

    // Hide footer
    const footer = document.querySelector('.modern-footer');
    if (footer) footer.style.display = 'none';
};

document.getElementById('btnShowLess').onclick = () => {
    currentPointer = 0;
    const grid = document.getElementById('facultyGrid');
    if (grid) grid.innerHTML = '';

    // Show footer
    const footer = document.querySelector('.modern-footer');
    if (footer) footer.style.display = 'block';

    loadMoreFaculty();
    document.querySelector('.gallery-section').scrollIntoView({ behavior: 'smooth' });
};

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