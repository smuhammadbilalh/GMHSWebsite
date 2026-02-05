// =========================================
// LOAD ALL JSON DATA ON PAGE LOAD (PARALLEL & ROBUST)
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    // We use Promise.allSettled to ensure that if one fails (e.g. particles),
    // the others still load successfully.
    Promise.allSettled([
        loadHeroSlides(),      // Starts slider internally on success
        initParticles(),       // safely checks for library now
        loadStats(),           // Includes the fix for invisible stats
        loadNewsTicker(),
        loadAboutTicker(),
        loadPortals(),
        loadVideo(),
        loadDonors()
    ]).then((results) => {
        // Optional: Log any failures for debugging without stopping the app
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.warn(`Module at index ${index} failed to load:`, result.reason);
            }
        });
    });

    // Initialize static scroll animations immediately
    initStaticScrollAnimations();
});

// =========================================
// LOAD HERO SLIDES (Updated with Lazy Loading)
// =========================================
async function loadHeroSlides() {
    try {
        const response = await fetch('data/home/hero.json');
        const data = await response.json();
        const container = document.getElementById('heroSliderContainer');
        const dotsContainer = document.getElementById('sliderDots');

        if (!container) return;

        container.innerHTML = '';
        data.slides.forEach((slide, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = `slide ${index === 0 ? 'active' : ''}`;

            // LAZY LOADING LOGIC:
            const loadingAttr = index === 0
                ? 'loading="eager" fetchpriority="high"'
                : 'loading="lazy"';

            slideDiv.innerHTML = `
                <img src="${slide.imageUrl}" class="slide-bg" alt="${slide.title}" ${loadingAttr}>
                <div class="slide-overlay"></div>
                <div class="slide-content">
                    ${slide.badgeText ? `<span class="badge">${slide.badgeText}</span>` : ''}
                    <h1>${slide.title}</h1>
                    ${slide.buttonText ? `<a href="${slide.buttonLink}" class="btn-primary">${slide.buttonText}</a>` : ''}
                </div>
            `;
            container.appendChild(slideDiv);
        });

        // Consistent 3-Dot Navigation Logic
        dotsContainer.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('button');
            dot.className = i === 0 ? 'active' : '';
            dot.onclick = () => {
                const slides = document.querySelectorAll('.slide');
                const targetIndex = Math.round((i / 2) * (slides.length - 1));
                goToSlide(targetIndex);
            };
            dotsContainer.appendChild(dot);
        }

        if (data.slides.length > 1) {
            document.getElementById('sliderControls').style.display = 'flex';
        }

        startAutoSlide();

    } catch (error) {
        console.error("Hero Slides failed:", error);
    }
}

// =========================================
// LOAD STATS (FIXED: Race Condition Resolved)
// =========================================
async function loadStats() {
    try {
        const response = await fetch('data/home/stats.json');
        const data = await response.json();
        const container = document.getElementById('statsContainer');

        if (!container) return;

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

        // FIX: Trigger the observer explicitly AFTER items are added to DOM
        initStatsObserver();

    } catch (error) {
        console.error("Error loading stats:", error);
    }
}

// =========================================
// STATS OBSERVER (New Function)
// =========================================
function initStatsObserver() {
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('is-visible', 'counted');
                animateCounter(entry.target);
                observer.unobserve(entry.target); // Stop watching once animated
            }
        });
    }, { threshold: 0.5 });

    const items = document.querySelectorAll('.stat-item');
    items.forEach(item => counterObserver.observe(item));
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
// LOAD PORTALS (Strictly Black Text)
// =========================================
async function loadPortals() {
    const response = await fetch('data/home/portals.json');
    const data = await response.json();
    const header = document.getElementById('portalsHeader');

    header.innerHTML = `
        <h2 style="color: #000000 !important;">${data.title} <span class="accent-text" style="color: #000000 !important;">${data.accent}</span></h2>
        <div class="header-line" style="background-color: #000000;"></div>
    `;

    const grid = document.getElementById('portalsGrid');
    grid.innerHTML = data.cards.map(card => `
        <a href="${card.url}" target="${card.target}" class="square-card" style="color: #000000 !important;">
            <div class="card-icon" style="color: #000000;"><svg viewBox="0 0 24 24" fill="currentColor">${card.iconSvg}</svg></div>
            <h3 style="color: #000000 !important;">${card.title}</h3>
        </a>
    `).join('');

    // Refresh static observer for newly added portal section elements if needed
    initStaticScrollAnimations();
}

// =========================================
// LOAD DONORS CAROUSEL (Updated: 6 Desktop / 2 Mobile)
// =========================================
let donorIndex = 0;
let donorsCount = 0;

async function loadDonors() {
    try {
        const response = await fetch('data/home/donors.json');
        const data = await response.json();

        const titleEl = document.getElementById('donorSectionTitle');
        const descEl = document.getElementById('donorSectionDesc');

        if (titleEl) titleEl.textContent = data.sectionTitle;
        if (descEl) descEl.textContent = data.sectionDescription;

        const track = document.getElementById('donorTrack');

        // Only rendering Image and Name
        track.innerHTML = data.donors.map(donor => `
            <div class="donor-card">
                <div class="donor-image-wrapper">
                    <img src="${donor.image}" alt="${donor.name}" loading="lazy" onerror="this.src='images/schoollogo.svg'">
                </div>
                <h3>${donor.name}</h3>
            </div>
        `).join('');

        donorsCount = data.donors.length;
        renderDonorDots();

        setTimeout(updateDonorPosition, 200);

        // Update on resize to switch between 2 and 6 items
        window.addEventListener('resize', () => {
            renderDonorDots();
            updateDonorPosition();
        });

        setInterval(() => moveDonorSlide(1), 6000);
    } catch (error) {
        console.error("Error loading donors:", error);
    }
}

function getItemsInView() {
    // 6 items on Desktop (>=768px), 2 items on Mobile (<768px)
    return window.innerWidth < 768 ? 2 : 6;
}

function renderDonorDots() {
    const dotsContainer = document.getElementById('donorDots');
    dotsContainer.innerHTML = '';

    // Standard 3-dot navigation
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('button');
        dot.className = i === 0 ? 'active' : '';
        dot.onclick = () => {
            const itemsInView = getItemsInView();
            const maxIndex = donorsCount - itemsInView;
            donorIndex = Math.round((i / 2) * maxIndex);
            updateDonorPosition();
        };
        dotsContainer.appendChild(dot);
    }
}

function moveDonorSlide(direction) {
    const itemsInView = getItemsInView();
    const maxIndex = Math.max(0, donorsCount - itemsInView);

    donorIndex += direction;

    if (donorIndex > maxIndex) donorIndex = 0;
    if (donorIndex < 0) donorIndex = maxIndex;

    updateDonorPosition();
}

function updateDonorPosition() {
    const track = document.getElementById('donorTrack');
    const cards = document.querySelectorAll('.donor-card');
    if (!track || cards.length === 0) return;

    const cardWidth = cards[0].offsetWidth;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.gap) || 20;

    // Standard slide calculation for both Desktop and Mobile
    const translateVal = -(donorIndex * (cardWidth + gap));

    track.style.transform = `translateX(${translateVal}px)`;

    // Update active class for the "primary" item in view
    cards.forEach((card, index) => {
        card.classList.toggle('active-donor', index === donorIndex);
    });

    // Update Dots
    const dots = document.querySelectorAll('#donorDots button');
    if (dots.length === 3) {
        dots.forEach(d => d.classList.remove('active'));
        const itemsInView = getItemsInView();
        const maxIndex = donorsCount - itemsInView;
        const activeDot = Math.min(2, Math.floor((donorIndex / (maxIndex || 1)) * 3));
        dots[activeDot].classList.add('active');
    }
}

// =========================================
// HERO SLIDER FUNCTIONALITY
// =========================================
let heroCurrentSlide = 0;
let slideInterval;

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('#sliderDots button');

    if (slides.length === 0) return;

    if (index >= slides.length) heroCurrentSlide = 0;
    else if (index < 0) heroCurrentSlide = slides.length - 1;
    else heroCurrentSlide = index;

    slides.forEach(slide => slide.classList.remove('active'));
    slides[heroCurrentSlide].classList.add('active');

    if (dots.length === 3) {
        dots.forEach(d => d.classList.remove('active'));
        const activeDot = Math.min(2, Math.floor((heroCurrentSlide / slides.length) * 3));
        dots[activeDot].classList.add('active');
    }
}

function nextSlide() { showSlide(heroCurrentSlide + 1); }
function previousSlide() { showSlide(heroCurrentSlide - 1); }
function goToSlide(index) { showSlide(index); }
function startAutoSlide() { slideInterval = setInterval(nextSlide, 5000); }
function stopAutoSlide() { clearInterval(slideInterval); }

const heroSlider = document.querySelector('.hero-slider');
if (heroSlider) {
    heroSlider.addEventListener('mouseenter', stopAutoSlide);
    heroSlider.addEventListener('mouseleave', startAutoSlide);
}

// =========================================
// ANIMATION UTILITIES
// =========================================
function initStaticScrollAnimations() {
    const observerOptions = { root: null, threshold: 0.1 };
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach((el) => scrollObserver.observe(el));
}

function animateCounter(element) {
    const counterValue = element.querySelector('.counter-value');
    const targetText = element.getAttribute('data-counter');
    const hasPlus = targetText.includes('+');
    const hasPercent = targetText.includes('%');
    const targetNumber = parseInt(targetText.replace(/[^0-9]/g, ''));
    if (isNaN(targetNumber)) return;

    let frame = 0;
    const totalFrames = 120;
    const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const currentCount = Math.round(targetNumber * (1 - Math.pow(1 - progress, 3)));
        let displayText = currentCount.toString();
        if (hasPlus) displayText += '+';
        if (hasPercent) displayText += '%';
        counterValue.textContent = displayText;
        if (frame === totalFrames) clearInterval(counter);
    }, 16);
}

// =========================================
// PARTICLES (Safe Loading)
// =========================================
async function initParticles() {
    if (typeof tsParticles === 'undefined') {
        console.warn("tsParticles library failed to load. Background effect skipped.");
        return;
    }

    await tsParticles.load("tsparticles", {
        fullScreen: { enable: true, zIndex: -1 },
        fpsLimit: 120,
        interactivity: {
            events: {
                onHover: { enable: true, mode: "grab" },
            },
            modes: {
                grab: { distance: 220, links: { opacity: 0.8 } }
            }
        },
        particles: {
            color: { value: "#cbd5e1" },
            links: {
                color: "#cbd5e1",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1.5
            },
            move: {
                enable: true,
                speed: 1.4,
                direction: "none",
                outModes: { default: "out" }
            },
            number: {
                density: { enable: true, area: 800 },
                value: 60
            },
            opacity: { value: { min: 0.4, max: 0.7 } },
            shape: { type: "circle" },
            size: { value: { min: 2, max: 5 } }
        },
        detectRetina: true
    });
}