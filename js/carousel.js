// =========================================
// VIDEO CAROUSEL FUNCTIONALITY
// =========================================

let currentSlide = 0;
let videos = [];
let isPlaying = false;

function initVideoCarousel(slides) {
    if (slides.length === 0) return;

    videos = document.querySelectorAll('.carousel-video');
    showSlide(0);

    // Setup video event listeners
    videos.forEach((video, index) => {
        video.addEventListener('timeupdate', () => updateProgress(index));
        video.addEventListener('loadedmetadata', () => updateDuration(index));
        video.addEventListener('ended', () => {
            if (index === currentSlide) {
                nextSlide();
            }
        });
    });
}

function showSlide(index) {
    const slidesContainer = document.getElementById('carouselSlides');
    const slides = slidesContainer.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');

    if (slides.length === 0) return;

    // Wrap around
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    // Pause all videos
    videos.forEach(video => {
        video.pause();
        video.currentTime = 0;
    });

    // Move slides
    const offset = -currentSlide * 100;
    slidesContainer.style.transform = `translateX(${offset}%)`;

    // Update active states
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(ind => ind.classList.remove('active'));

    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');

    // Reset play state
    isPlaying = false;
    updatePlayButton(currentSlide);
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

function goToSlide(index) {
    showSlide(index);
}

// Video Controls
function togglePlay(slideIndex) {
    const video = videos[slideIndex];
    const playBtn = document.querySelector(`#playBtn${slideIndex}`);

    if (video.paused) {
        video.play();
        isPlaying = true;
    } else {
        video.pause();
        isPlaying = false;
    }

    updatePlayButton(slideIndex);
}

function updatePlayButton(slideIndex) {
    const playBtn = document.querySelector(`#playBtn${slideIndex}`);
    if (!playBtn) return;

    const video = videos[slideIndex];

    if (video && !video.paused) {
        playBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
        `;
    } else {
        playBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"></path>
            </svg>
        `;
    }
}

function updateProgress(slideIndex) {
    const video = videos[slideIndex];
    const progressBar = document.querySelector(`#progressBar${slideIndex}`);
    const currentTimeEl = document.querySelector(`#currentTime${slideIndex}`);

    if (!video || !progressBar) return;

    const progress = (video.currentTime / video.duration) * 100;
    progressBar.style.width = progress + '%';

    if (currentTimeEl) {
        currentTimeEl.textContent = formatTime(video.currentTime);
    }
}

function updateDuration(slideIndex) {
    const video = videos[slideIndex];
    const durationEl = document.querySelector(`#duration${slideIndex}`);

    if (!video || !durationEl) return;

    durationEl.textContent = formatTime(video.duration);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function seekVideo(slideIndex, event) {
    const video = videos[slideIndex];
    const progressContainer = event.currentTarget;
    const rect = progressContainer.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;

    video.currentTime = pos * video.duration;
}

function changeVolume(slideIndex, event) {
    const video = videos[slideIndex];
    video.volume = event.target.value;
}

function toggleMute(slideIndex) {
    const video = videos[slideIndex];
    const volumeBtn = document.querySelector(`#volumeBtn${slideIndex}`);

    video.muted = !video.muted;

    if (video.muted) {
        volumeBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
        `;
    } else {
        volumeBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
        `;
    }
}

function toggleFullscreen(slideIndex) {
    const container = document.querySelector('.carousel-container');

    if (!document.fullscreenElement) {
        container.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === ' ') {
        e.preventDefault();
        togglePlay(currentSlide);
    }
});

// Touch swipe
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('DOMContentLoaded', () => {
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    if (carouselWrapper) {
        carouselWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        carouselWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
});

function handleSwipe() {
    if (touchEndX < touchStartX - 50) nextSlide();
    if (touchEndX > touchStartX + 50) prevSlide();
}
