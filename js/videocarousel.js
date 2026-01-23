// =========================================
// VIDEO CAROUSEL COMPONENT
// =========================================

let carouselData = {
    videos: [],
    currentIndex: 0,
    itemsPerView: 3,
    autoPlayInterval: null,
    isPaused: false
};

document.addEventListener('DOMContentLoaded', () => {
    loadVideoCarouselData();
});

// Load Data from JSON
async function loadVideoCarouselData() {
    try {
        const response = await fetch('data/home/videocarousel.json');
        const data = await response.json();

        // Update Section Header
        const titleEl = document.getElementById('videoSectionTitle');
        const descEl = document.getElementById('videoSectionDesc');

        if (titleEl) titleEl.textContent = data.sectionTitle;
        if (descEl) descEl.textContent = data.sectionDescription;

        carouselData.videos = data.videos;

        initVideoCarousel();
    } catch (error) {
        console.error('Error loading video carousel data:', error);
    }
}

function initVideoCarousel() {
    // Setup resize listener
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const oldItemsPerView = carouselData.itemsPerView;
            updateItemsPerView();
            if (oldItemsPerView !== carouselData.itemsPerView) {
                carouselData.currentIndex = 0;
                updateCarousel();
            }
        }, 250);
    });

    // Add event listeners for navigation
    document.querySelector('.v-prev').addEventListener('click', () => {
        navigateCarousel(-1);
        resetAutoPlay();
    });

    document.querySelector('.v-next').addEventListener('click', () => {
        navigateCarousel(1);
        resetAutoPlay();
    });

    // Pause on Hover
    const trackContainer = document.querySelector('.v-carousel-wrapper');
    trackContainer.addEventListener('mouseenter', () => {
        carouselData.isPaused = true;
    });

    trackContainer.addEventListener('mouseleave', () => {
        carouselData.isPaused = false;
    });

    // Initialize
    updateItemsPerView();
    renderVideos();
    renderVideoDots(); // NEW: Render dots
    updateCarousel();
    startAutoPlay();
}

function updateItemsPerView() {
    const width = window.innerWidth;
    if (width < 768) {
        carouselData.itemsPerView = 1;
    } else if (width < 1024) {
        carouselData.itemsPerView = 2;
    } else {
        carouselData.itemsPerView = 3;
    }
}

function renderVideos() {
    const track = document.getElementById('videoTrack');
    track.innerHTML = ''; // Clear existing

    carouselData.videos.forEach(video => {
        const card = document.createElement('div');
        card.className = 'v-card';
        card.innerHTML = `
            <div class="v-card-inner" onclick="window.open('${video.videoUrl}', '_blank')">
                <div class="v-thumbnail-wrapper">
                    <img src="${video.thumbnail}" alt="${video.title}" class="v-thumbnail">
                    <div class="v-play-overlay">
                        <div class="v-play-btn">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                    </div>
                    <span class="v-duration">${video.duration}</span>
                </div>
                <div class="v-content">
                    <h3>${video.title}</h3>
                    <p>${video.description}</p>
                </div>
            </div>
        `;
        track.appendChild(card);
    });
}

function renderVideoDots() {
    const dotsContainer = document.getElementById('videoDots');
    dotsContainer.innerHTML = '';

    // We create one dot per video so the user can jump to specific start points
    carouselData.videos.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = index === 0 ? 'active' : '';
        dot.onclick = () => {
            carouselData.currentIndex = index;

            // Adjust index if out of bounds (for group view)
            if (carouselData.currentIndex > carouselData.videos.length - carouselData.itemsPerView) {
                carouselData.currentIndex = carouselData.videos.length - carouselData.itemsPerView;
            }

            updateCarousel();
            resetAutoPlay();
        };
        dotsContainer.appendChild(dot);
    });
}

function navigateCarousel(direction) {
    carouselData.currentIndex += direction;

    // Loop logic
    if (carouselData.currentIndex > carouselData.videos.length - carouselData.itemsPerView) {
        carouselData.currentIndex = 0;
    } else if (carouselData.currentIndex < 0) {
        carouselData.currentIndex = carouselData.videos.length - carouselData.itemsPerView;
    }

    updateCarousel();
}

function updateCarousel() {
    const track = document.getElementById('videoTrack');
    const cardWidth = 100 / carouselData.itemsPerView;

    // Move by one card width * current index
    const translateValue = -(carouselData.currentIndex * cardWidth);

    // Update individual card widths
    const cards = track.querySelectorAll('.v-card');
    cards.forEach(card => {
        card.style.flex = `0 0 ${cardWidth}%`;
        card.style.maxWidth = `${cardWidth}%`;
    });

    // Slide track
    track.style.transform = `translateX(${translateValue}%)`;

    // Update Dots Active State
    const dots = document.querySelectorAll('#videoDots button');
    dots.forEach((dot, index) => {
        if (index === carouselData.currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function startAutoPlay() {
    carouselData.autoPlayInterval = setInterval(() => {
        if (!carouselData.isPaused) {
            navigateCarousel(1);
        }
    }, 3000);
}

function resetAutoPlay() {
    clearInterval(carouselData.autoPlayInterval);
    startAutoPlay();
}