// =========================================
// SPORTS PAGE - MODERN REBUILD
// =========================================
let sportsData = null;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data/sports/achievements.json');
        sportsData = await response.json();

        // Update page title if provided
        if (sportsData.pageTitle) {
            document.getElementById('pageTitle').textContent = sportsData.pageTitle;
        }

        loadSportsNews();
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
        `<span class="ticker-item">
            <svg class="icon-inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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

    sportsData.sportsCategories.forEach((category, index) => {
        const card = document.createElement('div');
        card.className = 'category-card-modern';
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <div class="category-icon-modern">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    ${category.icon}
                </svg>
            </div>
            <h3>${category.name}</h3>
            <p>${category.achievements}</p>
        `;

        grid.appendChild(card);
    });

    // Add fade-in animation
    const style = document.createElement('style');
    style.textContent = `
        .category-card-modern {
            opacity: 0;
            animation: cardFadeIn 0.6s ease-out forwards;
        }
        @keyframes cardFadeIn {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// =========================================
// LOAD ACHIEVEMENTS
// =========================================
function loadAchievements() {
    const grid = document.getElementById('achievementsGrid');

    sportsData.recentAchievements.forEach((achievement, index) => {
        const card = document.createElement('div');
        card.className = 'achievement-card-modern';
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <div class="achievement-image-modern">
                ${achievement.image
                ? `<img src="${achievement.image}" alt="${achievement.title}">`
                : achievement.title.charAt(0)
            }
                <div class="achievement-medal-modern ${achievement.medal.toLowerCase()}">${achievement.medal}</div>
            </div>
            <div class="achievement-content-modern">
                <span class="achievement-year-modern">${achievement.year}</span>
                <h3>${achievement.title}</h3>
                <p>${achievement.description}</p>
            </div>
        `;

        grid.appendChild(card);
    });

    // Add fade-in animation
    const style = document.createElement('style');
    style.textContent = `
        .achievement-card-modern {
            opacity: 0;
            animation: achievementFadeIn 0.6s ease-out forwards;
        }
        @keyframes achievementFadeIn {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}