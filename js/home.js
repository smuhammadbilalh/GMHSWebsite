// =========================================
// LOAD ALL JSON DATA ON PAGE LOAD
// =========================================
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load all JSON files
        await Promise.all([
            loadHeroSlides(),
            loadStats(),
            loadNewsTicker(),
            loadAboutTicker(),
            loadPortals(),
            loadVideo()
        ]);

        // Start slider after loading
        startAutoSlide();
    } catch (error) {
        console.error('Error loading data:', error);
    }
});

// =========================================
// LOAD HERO SLIDES
// =========================================
async function loadHeroSlides() {
    const response = await fetch('data/home/hero.json');
    const data = await response.json();

    const container = document.getElementById('heroSliderContainer');
    const dotsContainer = document.getElementById('sliderDots');

    data.slides.forEach((slide, index) => {
        // Create slide
        const slideDiv = document.createElement('div');
        slideDiv.className = `slide ${index === 0 ? 'active' : ''}`;
        slideDiv.innerHTML = `
            <div class="slide-bg" style="background-image: url('${slide.imageUrl}')"></div>
            <div class="slide-overlay"></div>
            <div class="slide-content">
                ${slide.badgeText ? `<span class="badge" style="background: #000000; color: #ffffff;">${slide.badgeText}</span>` : ''}
                <h1>${slide.title}</h1>
                <p>${slide.description}</p>
                ${slide.buttonText ? `<a href="${slide.buttonLink}" class="btn-primary" style="background: #000000; border-color: #000000; color: #ffffff;">${slide.buttonText}</a>` : ''}
            </div>
        `;
        container.appendChild(slideDiv);

        // Create dot
        const dot = document.createElement('button');
        dot.className = index === 0 ? 'active' : '';
        dot.onclick = () => goToSlide(index);
        dotsContainer.appendChild(dot);
    });

    // Show controls if more than 1 slide
    if (data.slides.length > 1) {
        document.getElementById('sliderControls').style.display = 'flex';
    }
}

// =========================================
// LOAD STATS
// =========================================
async function loadStats() {
    const response = await fetch('data/home/stats.json');
    const data = await response.json();

    const container = document.getElementById('statsContainer');

    data.stats.forEach(stat => {
        const statDiv = document.createElement('div');
        statDiv.className = `stat-item ${stat.highlight ? 'highlight' : ''}`;
        statDiv.setAttribute('data-counter', stat.value);
        statDiv.innerHTML = `
            <strong class="counter-value" style="color: #000000;">0</strong>
            <span style="color: #000000;">${stat.label}</span>
        `;
        container.appendChild(statDiv);
    });
}

// =========================================
// LOAD NEWS TICKER
// =========================================
async function loadNewsTicker() {
    const response = await fetch('data/home/news_ticker.json');
    const data = await response.json();

    document.getElementById('newsTickerLabel').textContent = data.label;

    const marquee = document.getElementById('newsTickerContent');
    marquee.innerHTML = data.items.map(item => `
        <span class="ticker-item">
            <svg class="icon-inline" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2">
                ${item.iconSvg}
            </svg>
            <strong style="color: #000000;">${item.boldText}</strong> 
            <span style="color: #000000;">${item.normalText}</span>
        </span>
    `).join('');
}

// =========================================
// LOAD ABOUT TICKER & VIDEO
// =========================================
async function loadAboutTicker() {
    const response = await fetch('data/home/about_ticker.json');
    const data = await response.json();

    const videoSection = document.getElementById('videoHeroSection');

    const tickerHTML = `
        <div class="ticker-bottom-anchor">
            <div class="news-ticker-bar">
                <div class="ticker-label">${data.label}</div>
                <div class="ticker-content">
                    <marquee behavior="scroll" direction="left" scrollamount="6">
                        ${data.items.map(item => `
                            <span class="ticker-item">
                                <svg class="icon-inline" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2">
                                    ${item.iconSvg}
                                </svg>
                                <strong style="color: #000000;">${item.boldText}</strong> 
                                <span style="color: #000000;">${item.normalText}</span>
                            </span>
                        `).join('')}
                    </marquee>
                </div>
            </div>
        </div>
    `;

    videoSection.insertAdjacentHTML('beforeend', tickerHTML);
}

async function loadVideo() {
    const response = await fetch('data/home/video.json');
    const data = await response.json();

    const videoSection = document.getElementById('videoHeroSection');

    const videoHTML = `
        <video class="video-bg" ${data.autoplay ? 'autoplay' : ''} ${data.muted ? 'muted' : ''} ${data.loop ? 'loop' : ''} playsinline>
            <source src="${data.videoPath}" type="video/mp4" />
        </video>
        <div class="video-overlay"></div>
    `;

    videoSection.insertAdjacentHTML('afterbegin', videoHTML);
}

// =========================================
// LOAD PORTALS (FIXED: STRICT BLACK TEXT)
// =========================================
async function loadPortals() {
    const response = await fetch('data/home/portals.json');
    const data = await response.json();

    // Set header - Enforcing inline black color
    const header = document.getElementById('portalsHeader');
    header.innerHTML = `
        <h2 style="color: #000000;">${data.title} <span class="accent-text" style="color: #000000;">${data.accent}</span></h2>
        <div class="header-line" style="background-color: #000000;"></div>
    `;

    // Set cards - Enforcing inline black color for text and icons
    const grid = document.getElementById('portalsGrid');
    grid.innerHTML = data.cards.map(card => `
        <a href="${card.url}" target="${card.target}" class="square-card" style="color: #000000;">
            <div class="card-icon" style="color: #000000;">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    ${card.iconSvg}
                </svg>
            </div>
            <h3 style="color: #000000;">${card.title}</h3>
        </a>
    `).join('');
}

// =========================================
// HERO SLIDER FUNCTIONALITY
// =========================================
let currentSlide = 0;
let slideInterval;

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dots button');

    if (slides.length === 0) return;

    if (index >= slides.length) currentSlide = 0;
    if (index < 0) currentSlide = slides.length - 1;

    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (dots[i]) dots[i].classList.remove('active');
    });

    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
}

function nextSlide() {
    currentSlide++;
    showSlide(currentSlide);
}

function previousSlide() {
    currentSlide--;
    showSlide(currentSlide);
}

function goToSlide(index) {
    currentSlide = index;
    showSlide(currentSlide);
}

function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 5000);
}

function stopAutoSlide() {
    clearInterval(slideInterval);
}

// Pause on hover
document.querySelector('.hero-slider')?.addEventListener('mouseenter', stopAutoSlide);
document.querySelector('.hero-slider')?.addEventListener('mouseleave', startAutoSlide);

// =========================================
// SCROLL ANIMATIONS
// =========================================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, observerOptions);

// Observe after DOM loads
setTimeout(() => {
    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        scrollObserver.observe(el);
    });
}, 100);

// =========================================
// COUNTER ANIMATIONS
// =========================================
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('is-visible');
            entry.target.classList.add('counted');
            animateCounter(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe counters after they're loaded
setTimeout(() => {
    document.querySelectorAll('.stat-item').forEach((item) => {
        counterObserver.observe(item);
    });
}, 500);

function animateCounter(element) {
    const counterValue = element.querySelector('.counter-value');
    const targetText = element.getAttribute('data-counter');

    const hasPlus = targetText.includes('+');
    const hasPercent = targetText.includes('%');
    const targetNumber = parseInt(targetText.replace(/[^0-9]/g, ''));

    if (isNaN(targetNumber)) return;

    const duration = 2000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);

    let frame = 0;

    const counter = setInterval(() => {
        frame++;

        const progress = easeOutQuad(frame / totalFrames);
        const currentCount = Math.round(targetNumber * progress);

        let displayText = currentCount.toString();
        if (hasPlus) displayText += '+';
        if (hasPercent) displayText += '%';

        counterValue.textContent = displayText;

        if (frame === totalFrames) {
            clearInterval(counter);
            counterValue.textContent = targetText;
        }
    }, frameDuration);
}

function easeOutQuad(t) {
    return t * (2 - t);
}