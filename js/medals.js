// =========================================
// MEDALS PAGE LOGIC
// =========================================
let medalsData = null;
let currentYearIndex = 0;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data/medals/content.json');
        medalsData = await response.json();

        setupHeader();
        renderDesktopTimeline();
        renderMobileTabs();

        // Load first available year
        if (medalsData.years.length > 0) {
            selectYear(0); // Select most recent year
        }

    } catch (error) {
        console.error('Error loading medals data:', error);
    }
});

function setupHeader() {
    document.getElementById('pageTitle').textContent = medalsData.pageTitle;
    document.getElementById('pageDesc').textContent = medalsData.description;
}

// =========================================
// RENDER & LOGIC: DESKTOP TIMELINE
// =========================================
function renderDesktopTimeline() {
    const list = document.getElementById('yearList');
    if (!list) return;

    list.innerHTML = medalsData.years.map((item, index) => `
        <li class="year-item" onclick="selectYear(${index})" id="year-item-${index}">
            <button class="year-btn">${item.year}</button>
        </li>
    `).join('');

    // Scroll Event for "Wheel" Effect
    list.addEventListener('scroll', handleTimelineScroll);
}

function handleTimelineScroll() {
    const list = document.getElementById('yearList');
    const items = document.querySelectorAll('.year-item');
    const listCenter = list.scrollTop + (list.clientHeight / 2);

    let closestIndex = -1;
    let minDistance = Infinity;

    items.forEach((item, index) => {
        const itemCenter = item.offsetTop + (item.clientHeight / 2);
        const distance = Math.abs(listCenter - itemCenter);

        if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
        }
    });

    // Only update if snapped to a new year close enough
    if (closestIndex !== -1 && closestIndex !== currentYearIndex && minDistance < 40) {
        // Optional: Trigger selectYear on scroll? 
        // Better UX: Highlight only visually, load data on click or settle.
        // For simplicity: We use the scroll to highlight visually, user clicks to select.
        updateVisualActiveState(closestIndex);
    }
}

// =========================================
// RENDER & LOGIC: MOBILE TABS
// =========================================
function renderMobileTabs() {
    const container = document.getElementById('mobileTabs');
    if (!container) return;

    container.innerHTML = medalsData.years.map((item, index) => `
        <button class="mobile-tab-btn" onclick="selectYear(${index})" id="mob-year-${index}">
            ${item.year}
        </button>
    `).join('');
}

// =========================================
// SHARED SELECTION LOGIC
// =========================================
function selectYear(index) {
    currentYearIndex = index;
    const yearData = medalsData.years[index];

    // 1. Update Content Grid
    renderWinners(yearData.winners);

    // 2. Update Visual States
    updateVisualActiveState(index);

    // 3. Desktop: Scroll the timeline to center this item
    const list = document.getElementById('yearList');
    const item = document.getElementById(`year-item-${index}`);
    if (list && item) {
        const scrollTo = item.offsetTop - (list.clientHeight / 2) + (item.clientHeight / 2);
        list.scrollTo({ top: scrollTo, behavior: 'smooth' });
    }

    // 4. Mobile: Scroll tab into view
    const mobBtn = document.getElementById(`mob-year-${index}`);
    if (mobBtn) {
        mobBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
}

function updateVisualActiveState(index) {
    // Desktop
    document.querySelectorAll('.year-item').forEach((el, i) => {
        el.classList.toggle('active', i === index);
    });

    // Mobile
    document.querySelectorAll('.mobile-tab-btn').forEach((el, i) => {
        el.classList.toggle('active', i === index);
    });
}

// =========================================
// RENDER WINNERS GRID
// =========================================
function renderWinners(winners) {
    const grid = document.getElementById('medalGrid');
    if (!grid) return;

    // Clear previous
    grid.innerHTML = '';

    if (!winners || winners.length === 0) {
        grid.innerHTML = `<div class="no-data">No records found for this year.</div>`;
        return;
    }

    // Staggered Animation Delay
    grid.innerHTML = winners.map((winner, i) => `
        <div class="medal-card" style="animation-delay: ${i * 0.1}s">
            <div class="medal-img-wrapper">
                <img src="${winner.image}" alt="${winner.name}" loading="lazy" onerror="this.src='images/schoollogo.svg'">
                <div class="medal-badge ${getMedalClass(winner.award)}">
                    ${getMedalIcon(winner.award)} ${winner.award}
                </div>
            </div>
            <div class="medal-info">
                <h3>${winner.name}</h3>
                <span class="category">${winner.category}</span>
                <p class="details">${winner.details}</p>
            </div>
        </div>
    `).join('');
}

function getMedalClass(award) {
    if (award.toLowerCase().includes('silver')) return 'silver';
    if (award.toLowerCase().includes('bronze')) return 'bronze';
    return 'gold'; // Default
}

function getMedalIcon(award) {
    // Simple SVG Icons
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="12" cy="8" r="7"></circle><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"></path></svg>`;
}