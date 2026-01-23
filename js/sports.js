// =========================================
// LOAD SPORTS DATA FROM JSON
// =========================================
let sportsData = null;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data/sports/achievements.json');
        sportsData = await response.json();

        // Update Page Title from JSON if needed, or keep HTML default
        if (sportsData.pageTitle) {
            document.getElementById('pageTitle').textContent = sportsData.pageTitle;
        }

        loadSportsNews();
        // Video Carousel loader removed
        loadCategories();
        loadAchievements();

    } catch (error) {
        console.error('Error loading sports data:', error);
    }
});

// =========================================
// LOAD SPORTS NEWS TICKER
// =========================================
function loadSportsNews() {
    const ticker = document.getElementById('sportsNewsTicker');

    const newsItems = sportsData.sportsNews.map(news =>
        `<span class="sports-ticker-item">
            <svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
                ${news.icon}
            </svg>
            ${news.text}
        </span>`
    ).join('');

    ticker.innerHTML = newsItems;
}

// =========================================
// LOAD SPORTS CATEGORIES
// =========================================
function loadCategories() {
    const grid = document.getElementById('categoriesGrid');

    sportsData.sportsCategories.forEach(category => {
        const card = document.createElement('div');
        card.className = 'category-card';

        card.innerHTML = `
            <div class="category-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    ${category.icon}
                </svg>
            </div>
            <h3>${category.name}</h3>
            <p>${category.achievements}</p>
        `;

        grid.appendChild(card);
    });
}

// =========================================
// LOAD ACHIEVEMENTS
// =========================================
function loadAchievements() {
    const grid = document.getElementById('achievementsGrid');

    sportsData.recentAchievements.forEach(achievement => {
        const card = document.createElement('div');
        card.className = 'achievement-card';

        card.innerHTML = `
            <div class="achievement-image">
                ${achievement.image ? `<img src="${achievement.image}" alt="${achievement.title}">` : achievement.title.charAt(0)}
                <div class="medal-badge ${achievement.medal.toLowerCase()}">${achievement.medal}</div>
            </div>
            <div class="achievement-content">
                <span class="achievement-year">${achievement.year}</span>
                <h3>${achievement.title}</h3>
                <p>${achievement.description}</p>
            </div>
        `;

        grid.appendChild(card);
    });
}