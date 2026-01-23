// =========================================
// LOAD ALL JSON DATA ON PAGE LOAD
// =========================================
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await Promise.all([
            loadHeroSlides(),
            loadStats(),
            loadNewsTicker(),
            loadAboutTicker(),
            loadPortals(),
            loadVideo(),
            loadDonors()
        ]);
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

        const dot = document.createElement('button');
        dot.className = index === 0 ? 'active' : '';
        dot.onclick = () => goToSlide(index);
        dotsContainer.appendChild(dot);
    });

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
            <svg class="icon-inline" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2">${item.iconSvg}</svg>
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
                                <svg class="icon-inline" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2">${item.iconSvg}</svg>
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
// LOAD PORTALS
// =========================================
async function loadPortals() {
    const response = await fetch('data/home/portals.json');
    const data = await response.json();
    const header = document.getElementById('portalsHeader');
    header.innerHTML = `
        <h2 style="color: #000000;">${data.title} <span class="accent-text" style="color: #000000;">${data.accent}</span></h2>
        <div class="header-line" style="background-color: #000000;"></div>
    `;
    const grid = document.getElementById('portalsGrid');
    grid.innerHTML = data.cards.map(card => `
        <a href="${card.url}" target="${card.target}" class="square-card" style="color: #000000;">
            <div class="card-icon" style="color: #000000;"><svg viewBox="0 0 24 24" fill="currentColor">${card.iconSvg}</svg></div>
            <h3 style="color: #000000;">${card.title}</h3>
        </a>
    `).join('');
}

// =========================================
// LOAD DONORS CAROUSEL
// =========================================
let donorIndex = 0;
let donorCardWidth = 330;
let donorsCount = 0;
let visibleDonors = 3;

async function loadDonors() {
    try {
        const response = await fetch('data/home/donors.json');
        const data = await response.json();

        // Headers
        const titleEl = document.getElementById('donorSectionTitle');
        titleEl.textContent = data.sectionTitle;
        titleEl.style.color = '#000000';
        const descEl = document.getElementById('donorSectionDesc');
        descEl.textContent = data.sectionDescription;
        descEl.style.color = '#000000';

        const track = document.getElementById('donorTrack');
        const dotsContainer = document.getElementById('donorDots');

        // Render Cards
        track.innerHTML = data.donors.map(donor => `
            <div class="donor-card">
                <div class="donor-image-wrapper">
                    <img src="${donor.image}" alt="${donor.name}" onerror="this.src='images/schoollogo.svg'">
                </div>
                <h3>${donor.name}</h3>
                <span class="donor-contribution">${donor.contribution}</span>
                <p class="donor-message">"${donor.message}"</p>
            </div>
        `).join('');

        donorsCount = data.donors.length;

        // Render Dots
        dotsContainer.innerHTML = '';
        data.donors.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = index === 0 ? 'active' : '';
            dot.onclick = () => {
                donorIndex = index;
                // Boundary check for groups
                if (window.innerWidth >= 768 && donorIndex > donorsCount - visibleDonors) {
                    donorIndex = donorsCount - visibleDonors;
                }
                updateDonorPosition();
            };
            dotsContainer.appendChild(dot);
        });

        // Setup Auto Scroll
        setInterval(() => {
            moveDonorSlide(1);
        }, 5000);

    } catch (error) {
        console.error("Error loading donors:", error);
    }
}

function moveDonorSlide(direction) {
    if (window.innerWidth < 768) {
        visibleDonors = 1;
        donorCardWidth = 295;
    } else {
        visibleDonors = 3;
        donorCardWidth = 330;
    }

    const maxIndex = donorsCount - visibleDonors;
    donorIndex += direction;

    if (donorIndex > maxIndex) donorIndex = 0;
    if (donorIndex < 0) donorIndex = maxIndex;

    updateDonorPosition();
}

function updateDonorPosition() {
    const track = document.getElementById('donorTrack');
    const translateVal = -(donorIndex * donorCardWidth);
    track.style.transform = `translateX(${translateVal}px)`;

    // Update dots active state
    const dots = document.querySelectorAll('#donorDots button');
    dots.forEach((dot, index) => {
        if (index === donorIndex) dot.classList.add('active');
        else dot.classList.remove('active');
    });
}

// =========================================
// HERO SLIDER FUNCTIONALITY
// =========================================
let heroCurrentSlide = 0;
let slideInterval;

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dots button');

    if (slides.length === 0) return;

    if (index >= slides.length) heroCurrentSlide = 0;
    else if (index < 0) heroCurrentSlide = slides.length - 1;
    else heroCurrentSlide = index;

    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (dots[i]) dots[i].classList.remove('active');
    });

    slides[heroCurrentSlide].classList.add('active');
    if (dots[heroCurrentSlide]) dots[heroCurrentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(heroCurrentSlide + 1);
}

function previousSlide() {
    showSlide(heroCurrentSlide - 1);
}

function goToSlide(index) {
    showSlide(index);
}

function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 5000);
}

function stopAutoSlide() {
    clearInterval(slideInterval);
}

const heroSlider = document.querySelector('.hero-slider');
if (heroSlider) {
    heroSlider.addEventListener('mouseenter', stopAutoSlide);
    heroSlider.addEventListener('mouseleave', startAutoSlide);
}

// =========================================
// SCROLL & COUNTER ANIMATIONS
// =========================================
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
}, observerOptions);

setTimeout(() => {
    document.querySelectorAll('.animate-on-scroll').forEach((el) => scrollObserver.observe(el));
}, 100);

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('is-visible');
            entry.target.classList.add('counted');
            animateCounter(entry.target);
        }
    });
}, { threshold: 0.5 });

setTimeout(() => {
    document.querySelectorAll('.stat-item').forEach((item) => counterObserver.observe(item));
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
        const progress = frame * (2 - frame / totalFrames) / totalFrames; // simplified easeOutQuad
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