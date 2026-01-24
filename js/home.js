// =========================================
// LOAD ALL JSON DATA ON PAGE LOAD
// =========================================
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await Promise.all([
            loadHeroSlides(),
            await initParticles(),
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
// LOAD HERO SLIDES (Updated with 3-Dot Logic)
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
    });

    // Persistent 3 Dots Logic
    dotsContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('button');
        dot.className = i === 0 ? 'active' : '';
        dot.onclick = () => {
            const total = document.querySelectorAll('.slide').length;
            const targetIndex = Math.round((i / 2) * (total - 1));
            goToSlide(targetIndex);
        };
        dotsContainer.appendChild(dot);
    }

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
// LOAD DONORS CAROUSEL (Updated with 3-Dot Logic)
// =========================================
let donorIndex = 0;
let donorCardWidth = 330;
let donorsCount = 0;
let visibleDonors = 3;

async function loadDonors() {
    try {
        const response = await fetch('data/home/donors.json');
        const data = await response.json();

        const titleEl = document.getElementById('donorSectionTitle');
        titleEl.textContent = data.sectionTitle;
        const descEl = document.getElementById('donorSectionDesc');
        descEl.textContent = data.sectionDescription;

        const track = document.getElementById('donorTrack');
        const dotsContainer = document.getElementById('donorDots');

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

        // Render Exactly 3 Dots
        dotsContainer.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('button');
            dot.className = i === 0 ? 'active' : '';
            dot.onclick = () => {
                const maxIndex = donorsCount - visibleDonors;
                donorIndex = Math.round((i / 2) * maxIndex);
                updateDonorPosition();
            };
            dotsContainer.appendChild(dot);
        }

        setInterval(() => moveDonorSlide(1), 5000);
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

// =========================================
// DONOR CAROUSEL - PRECISION CENTERING
// =========================================
function updateDonorPosition() {
    const track = document.getElementById('donorTrack');
    const cards = document.querySelectorAll('.donor-card');
    if (!track || cards.length === 0) return;

    const gap = 15;
    const cardWidth = 280;
    const totalCardStep = cardWidth + gap;

    const containerWidth = track.parentElement.offsetWidth;
    // Calculate center based on the specific card width
    const centerOffset = (containerWidth / 2) - (cardWidth / 2);

    const translateVal = centerOffset - (donorIndex * totalCardStep);
    track.style.transform = `translateX(${translateVal}px)`;

    cards.forEach((card, index) => {
        card.classList.remove('active-donor');
        if (index === donorIndex) {
            card.classList.add('active-donor');
        }
    });

    // Precision Dot Update
    const dots = document.querySelectorAll('#donorDots button');
    if (dots.length === 3) {
        dots.forEach(d => d.classList.remove('active'));
        const maxIndex = donorsCount - 1;
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

    // Update the 3 Hero Dots
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
// SCROLL & COUNTER ANIMATIONS
// =========================================
const observerOptions = { root: null, threshold: 0.1 };
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
}, observerOptions);

setTimeout(() => {
    document.querySelectorAll('.animate-on-scroll').forEach((el) => scrollObserver.observe(el));
    document.querySelectorAll('.stat-item').forEach((item) => {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('is-visible', 'counted');
                    animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });
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

async function initParticles() {
    await tsParticles.load("tsparticles", {
        fullScreen: { enable: true, zIndex: -1 },
        fpsLimit: 120,
        interactivity: {
            events: {
                onHover: {
                    enable: true,
                    mode: "grab",
                },
            },
            modes: {
                grab: {
                    distance: 220,
                    links: { opacity: 0.8 } // Brightens connections on hover
                }
            }
        },
        particles: {
            color: { value: "#cbd5e1" }, // Lighter slate for better contrast
            links: {
                color: "#cbd5e1",
                distance: 150,
                enable: true,
                opacity: 0.5, // Increased from 0.2 for much clearer lines
                width: 1.5    // Slightly thicker lines
            },
            move: {
                enable: true,
                speed: 1.4,
                direction: "none",
                outModes: { default: "out" }
            },
            number: {
                density: { enable: true, area: 800 },
                value: 60 // Increased density for a fuller "network" look
            },
            opacity: {
                value: { min: 0.4, max: 0.7 }, // Increased from 0.3 max for "glowing" nodes
            },
            shape: { type: "circle" },
            size: { value: { min: 2, max: 5 } } // Larger, more visible nodes
        },
        detectRetina: true
    });
}