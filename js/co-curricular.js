// =========================================
// CO-CURRICULAR PAGE LOGIC
// =========================================
let activityData = null;
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data/co-curricular/content.json');
        activityData = await response.json();

        setupHeader();
        renderFilterTabs();

        // Initial Load
        const defaultTab = document.querySelector('.tab-btn.active');
        filterActivities('all', defaultTab);

    } catch (error) {
        console.error('Error loading co-curricular data:', error);
    }
});

function setupHeader() {
    document.getElementById('pageTitle').textContent = activityData.pageTitle;
    // Description removed
}

// =========================================
// RENDER FILTER TABS
// =========================================
function renderFilterTabs() {
    const container = document.getElementById('categoryTabs');
    if (!container) return;

    activityData.categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `tab-btn ${cat.id === 'all' ? 'active' : ''}`;
        btn.textContent = cat.name;
        btn.onclick = (e) => filterActivities(cat.id, e.target);
        container.appendChild(btn);
    });
}

// =========================================
// FILTER LOGIC
// =========================================
function filterActivities(categoryId, clickedBtn) {
    currentFilter = categoryId;

    // Update Active Button Visuals
    if (clickedBtn) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        clickedBtn.classList.add('active');

        // Scroll tab into view (Mobile UX)
        clickedBtn.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }

    renderActivities(categoryId);
}

// =========================================
// RENDER ACTIVITY CARDS
// =========================================
function renderActivities(filter) {
    const grid = document.getElementById('activityGrid');
    if (!grid) return;

    grid.innerHTML = ''; // Clear grid

    const filteredItems = filter === 'all'
        ? activityData.activities
        : activityData.activities.filter(item => item.category === filter);

    if (filteredItems.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #94a3b8; padding: 40px;">No activities found for this category.</p>`;
        return;
    }

    filteredItems.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'activity-card';
        card.style.animationDelay = `${index * 0.1}s`; // Staggered entrance

        card.innerHTML = `
            <div class="activity-img-wrapper">
                <img src="${item.image}" alt="${item.title}" class="activity-img" loading="lazy" onerror="this.src='images/schoollogo.png'">
                <div class="category-badge">${getCategoryName(item.category)}</div>
            </div>
            <div class="activity-content">
                <div class="activity-date">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    ${item.date}
                </div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Helper to get pretty name from ID
function getCategoryName(id) {
    const cat = activityData.categories.find(c => c.id === id);
    return cat ? cat.name : id;
}

// =========================================
// TAB SCROLLING LOGIC (Desktop Arrows)
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