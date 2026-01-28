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
        renderActivities('all');

    } catch (error) {
        console.error('Error loading co-curricular data:', error);
    }
});

function setupHeader() {
    document.getElementById('pageTitle').textContent = activityData.pageTitle;
    document.getElementById('pageDesc').textContent = activityData.description;
}

// =========================================
// RENDER FILTER TABS
// =========================================
function renderFilterTabs() {
    const container = document.getElementById('filterTabs');
    if (!container) return;

    activityData.categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `filter-btn ${cat.id === 'all' ? 'active' : ''}`;
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
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    clickedBtn.classList.add('active');

    // SCROLL TO CENTER LOGIC
    clickedBtn.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
    });

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
            <div style="overflow: hidden;">
                <img src="${item.image}" alt="${item.title}" class="activity-img" loading="lazy" onerror="this.src='images/schoollogo.svg'">
            </div>
            <div class="activity-content">
                <span class="activity-date">${item.date}</span>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <span class="category-tag">${getCategoryName(item.category)}</span>
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