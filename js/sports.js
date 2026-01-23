// =========================================
// LOAD SPORTS DATA FROM JSON
// =========================================
let sportsData = null;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data/sports/achievements.json');
        sportsData = await response.json();

        document.getElementById('pageTitle').textContent = sportsData.pageTitle;

        loadSportsNews();
        loadVideoCarousel();
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
// LOAD VIDEO CAROUSEL
// =========================================
function loadVideoCarousel() {
    const slidesContainer = document.getElementById('carouselSlides');
    const indicatorsContainer = document.getElementById('carouselIndicators');

    sportsData.videoSlides.forEach((slide, index) => {
        // Create slide
        const slideDiv = document.createElement('div');
        slideDiv.className = 'carousel-slide';
        if (index === 0) slideDiv.classList.add('active');

        slideDiv.innerHTML = `
            <div class="carousel-video-container">
                <video class="carousel-video" id="video${index}" poster="${slide.thumbnail}">
                    <source src="${slide.videoUrl}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <div class="video-loading"></div>
            </div>
            
            <div class="video-overlay">
                <div class="video-info">
                    <span class="carousel-category">${slide.category}</span>
                    <h2 class="carousel-title">${slide.title}</h2>
                    <p class="carousel-description">${slide.description}</p>
                </div>
                
                <div class="video-controls">
                    <button class="video-control-btn" id="playBtn${index}" onclick="togglePlay(${index})">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"></path>
                        </svg>
                    </button>
                    
                    <div class="video-progress-container" onclick="seekVideo(${index}, event)">
                        <div class="video-progress-bar" id="progressBar${index}"></div>
                    </div>
                    
                    <span class="video-time">
                        <span id="currentTime${index}">0:00</span> / <span id="duration${index}">0:00</span>
                    </span>
                    
                    <div class="volume-control">
                        <button class="video-control-btn" id="volumeBtn${index}" onclick="toggleMute(${index})">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                            </svg>
                        </button>
                        <input type="range" class="volume-slider" min="0" max="1" step="0.1" value="1" onchange="changeVolume(${index}, event)">
                    </div>
                    
                    <button class="fullscreen-btn" onclick="toggleFullscreen(${index})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        slidesContainer.appendChild(slideDiv);

        // Create indicator
        const indicator = document.createElement('button');
        indicator.className = 'carousel-indicator';
        if (index === 0) indicator.classList.add('active');
        indicator.onclick = () => goToSlide(index);
        indicatorsContainer.appendChild(indicator);
    });

    // Initialize carousel
    initVideoCarousel(sportsData.videoSlides);
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
