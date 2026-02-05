// =========================================
// SPORTS PAGE - CAROUSEL LOGIC
// =========================================
let sportsData = null;

// State Variables
let catIndex = 0;
let achIndex = 0;
let catCount = 0;
let achCount = 0;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data/sports/achievements.json');
        sportsData = await response.json();

        if (sportsData.pageTitle) {
            document.getElementById('pageTitle').textContent = sportsData.pageTitle;
        }

        loadCategoryCarousel();
        loadAchievementCarousel();

    } catch (error) {
        console.error('Error loading sports data:', error);
    }
});

// =========================================
// 1. SPORTS CATEGORIES CAROUSEL
// =========================================
function loadCategoryCarousel() {
    const track = document.getElementById('categoriesTrack');
    const categories = sportsData.sportsCategories;
    catCount = categories.length;

    // Added animation style with staggered delay
    track.innerHTML = categories.map((cat, index) => `
        <div class="sports-card-carousel" style="animation: fadeInUp 0.6s ease-out ${index * 0.15}s forwards;">
            <div class="cat-icon-carousel">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    ${cat.icon}
                </svg>
            </div>
            <h3>${cat.name}</h3>
            <p>${cat.achievements}</p>
        </div>
    `).join('');

    renderDots('categoryDots', catCount, 'moveCategorySlide');
    updateCategoryCarousel();

    // Resize Listener (Shared)
    window.addEventListener('resize', () => {
        updateCategoryCarousel();
        updateAchievementCarousel();
    });

    // Auto Slide
    setInterval(() => moveCategorySlide(1), 5000);
}

function moveCategorySlide(dir) {
    const itemsInView = getItemsInView();
    const maxIndex = Math.max(0, catCount - itemsInView);
    catIndex += dir;
    if (catIndex > maxIndex) catIndex = 0;
    if (catIndex < 0) catIndex = maxIndex;
    updateCategoryCarousel();
}

function updateCategoryCarousel() {
    updateTrack('categoriesTrack', 'categoryDots', catIndex, catCount);
}

// =========================================
// 2. HALL OF FAME CAROUSEL
// =========================================
function loadAchievementCarousel() {
    const track = document.getElementById('achievementsTrack');
    const achievements = sportsData.recentAchievements;
    achCount = achievements.length;

    // Added animation style with staggered delay
    track.innerHTML = achievements.map((ach, index) => `
        <div class="achievement-card-carousel" style="animation: fadeInUp 0.6s ease-out ${index * 0.15}s forwards;">
            <div class="ach-img-wrapper">
                <img src="${ach.image}" alt="${ach.title}" onerror="this.src='images/schoollogo.png'">
                <div class="ach-medal ${ach.medal.toLowerCase()}">${ach.medal}</div>
            </div>
            <div class="ach-content">
                <span class="ach-year">${ach.year}</span>
                <h3>${ach.title}</h3>
                <p>${ach.description}</p>
            </div>
        </div>
    `).join('');

    renderDots('achievementDots', achCount, 'moveAchievementSlide');
    updateAchievementCarousel();

    // Auto Slide
    setInterval(() => moveAchievementSlide(1), 6000);
}

function moveAchievementSlide(dir) {
    const itemsInView = getItemsInView();
    const maxIndex = Math.max(0, achCount - itemsInView);
    achIndex += dir;
    if (achIndex > maxIndex) achIndex = 0;
    if (achIndex < 0) achIndex = maxIndex;
    updateAchievementCarousel();
}

function updateAchievementCarousel() {
    updateTrack('achievementsTrack', 'achievementDots', achIndex, achCount);
}

// =========================================
// SHARED CAROUSEL UTILS
// =========================================
function getItemsInView() {
    if (window.innerWidth < 600) return 1;
    if (window.innerWidth < 901) return 2;
    return 3;
}

function renderDots(containerId, count, funcName) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('button');
        dot.className = i === 0 ? 'active' : '';
        dot.onclick = () => {
            const itemsInView = getItemsInView();
            const maxIndex = Math.max(0, count - itemsInView);
            const targetIndex = Math.round((i / 2) * maxIndex);

            if (funcName === 'moveCategorySlide') {
                catIndex = targetIndex;
                updateCategoryCarousel();
            } else {
                achIndex = targetIndex;
                updateAchievementCarousel();
            }
        };
        container.appendChild(dot);
    }
}

function updateTrack(trackId, dotsId, index, totalCount) {
    const track = document.getElementById(trackId);
    if (!track || !track.children.length) return;

    const card = track.children[0];
    const cardWidth = card.offsetWidth;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.gap) || 20;
    const itemsInView = getItemsInView();
    const maxIndex = Math.max(0, totalCount - itemsInView);

    let translateVal;
    if (window.innerWidth < 600) {
        // Center active card on mobile
        const containerWidth = track.parentElement.offsetWidth;
        const centerOffset = (containerWidth / 2) - (cardWidth / 2);
        translateVal = centerOffset - (index * (cardWidth + gap));
    } else {
        translateVal = -(index * (cardWidth + gap));
    }

    track.style.transform = `translateX(${translateVal}px)`;

    // Update Dots
    const dots = document.querySelectorAll(`#${dotsId} button`);
    if (dots.length === 3) {
        dots.forEach(d => d.classList.remove('active'));
        const activeDot = Math.min(2, Math.floor((index / (maxIndex || 1)) * 3));
        dots[activeDot].classList.add('active');
    }
}

// Global scope for HTML onclick
window.moveCategorySlide = moveCategorySlide;
window.moveAchievementSlide = moveAchievementSlide;