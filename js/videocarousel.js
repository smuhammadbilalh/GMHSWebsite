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

async function loadVideoCarouselData() {
    try {
        const response = await fetch('data/home/videocarousel.json');
        const data = await response.json();
        document.getElementById('videoSectionTitle').textContent = data.sectionTitle;
        document.getElementById('videoSectionDesc').textContent = data.sectionDescription;
        carouselData.videos = data.videos;
        initVideoCarousel();
    } catch (error) {
        console.error('Error loading video data:', error);
    }
}

function initVideoCarousel() {
    window.addEventListener('resize', () => {
        updateItemsPerView();
        updateCarousel();
    });

    document.querySelector('.v-prev').addEventListener('click', () => {
        navigateCarousel(-1);
        resetAutoPlay();
    });

    document.querySelector('.v-next').addEventListener('click', () => {
        navigateCarousel(1);
        resetAutoPlay();
    });

    const trackContainer = document.querySelector('.v-carousel-wrapper');
    trackContainer.addEventListener('mouseenter', () => carouselData.isPaused = true);
    trackContainer.addEventListener('mouseleave', () => carouselData.isPaused = false);

    updateItemsPerView();
    renderVideos();
    renderVideoDots();
    updateCarousel();
    startAutoPlay();
}

function updateItemsPerView() {
    const width = window.innerWidth;
    carouselData.itemsPerView = width < 768 ? 1 : (width < 1024 ? 2 : 3);
}

function renderVideos() {
    const track = document.getElementById('videoTrack');
    track.innerHTML = carouselData.videos.map(video => `
        <div class="v-card">
            <div class="v-card-inner" onclick="window.open('${video.videoUrl}', '_blank')">
                <div class="v-thumbnail-wrapper">
                    <img src="${video.thumbnail}" alt="${video.title}" class="v-thumbnail">
                    <div class="v-play-overlay"><div class="v-play-btn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></div></div>
                    <span class="v-duration">${video.duration}</span>
                </div>
                <div class="v-content"><h3>${video.title}</h3><p>${video.description}</p></div>
            </div>
        </div>
    `).join('');
}

function renderVideoDots() {
    const dotsContainer = document.getElementById('videoDots');
    dotsContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('button');
        dot.className = i === 0 ? 'active' : '';
        dot.onclick = () => {
            const maxIndex = carouselData.videos.length - carouselData.itemsPerView;
            carouselData.currentIndex = Math.round((i / 2) * maxIndex);
            updateCarousel();
            resetAutoPlay();
        };
        dotsContainer.appendChild(dot);
    }
}

function navigateCarousel(direction) {
    const maxIndex = carouselData.videos.length - carouselData.itemsPerView;
    carouselData.currentIndex += direction;
    if (carouselData.currentIndex > maxIndex) carouselData.currentIndex = 0;
    else if (carouselData.currentIndex < 0) carouselData.currentIndex = maxIndex;
    updateCarousel();
}

function updateCarousel() {
    const track = document.getElementById('videoTrack');
    const cardWidth = 100 / carouselData.itemsPerView;
    track.style.transform = `translateX(-${carouselData.currentIndex * cardWidth}%)`;

    const cards = track.querySelectorAll('.v-card');
    cards.forEach(card => {
        card.style.flex = `0 0 ${cardWidth}%`;
        card.style.maxWidth = `${cardWidth}%`;
    });

    const dots = document.querySelectorAll('#videoDots button');
    if (dots.length === 3) {
        dots.forEach(d => d.classList.remove('active'));
        const maxIndex = carouselData.videos.length - carouselData.itemsPerView;
        const activeDot = Math.min(2, Math.floor((carouselData.currentIndex / (maxIndex || 1)) * 3));
        dots[activeDot].classList.add('active');
    }
}

function startAutoPlay() { carouselData.autoPlayInterval = setInterval(() => { if (!carouselData.isPaused) navigateCarousel(1); }, 3000); }
function resetAutoPlay() { clearInterval(carouselData.autoPlayInterval); startAutoPlay(); }