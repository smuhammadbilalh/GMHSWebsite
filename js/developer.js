// =========================================
// LOAD DEVELOPER DATA
// =========================================
let developerData = null;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load Developer Profile
        const response = await fetch('data/developer/profile.json');
        developerData = await response.json();

        loadHero();
        startTypingAnimation();

        // Load Developer Ticker (From Footer Data)
        loadDeveloperTicker();

    } catch (error) {
        console.error('Error loading data:', error);
    }
});

// =========================================
// LOAD HERO SECTION
// =========================================
function loadHero() {
    const hero = developerData.hero;

    // 1. Text Content
    document.getElementById('heroName').textContent = hero.name;
    document.getElementById('heroDescription').textContent = hero.description;

    // 2. Profile Image
    const profile = document.getElementById('heroProfile');
    if (hero.profileImage) {
        profile.innerHTML = `<img src="${hero.profileImage}" alt="${hero.name}">`;
    } else {
        const initials = hero.name.split(' ').map(n => n[0]).join('');
        profile.textContent = initials;
    }

    // 3. Social Icons
    const socialContainer = document.getElementById('socialLinks');
    socialContainer.innerHTML = '';

    developerData.social.forEach(social => {
        const a = document.createElement('a');
        a.href = social.url;

        // Generate class name
        const brandName = social.name.toLowerCase().trim();
        a.className = `social-link ${brandName}`;
        a.target = '_blank';
        a.title = social.name;

        // SVG attributes
        let svgAttributes = '';
        if (brandName === 'whatsapp') {
            svgAttributes = `viewBox="0 0 24 24" fill="currentColor" stroke="none"`;
        } else {
            svgAttributes = `viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
        }

        a.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" ${svgAttributes}>${social.icon}</svg>`;
        socialContainer.appendChild(a);
    });
}

// =========================================
// LOAD DEVELOPER TICKER (Footer Data)
// =========================================
async function loadDeveloperTicker() {
    try {
        // Fetching from footer.json where the developer ticker data lives
        const response = await fetch('data/footer.json');
        const data = await response.json();

        const label = document.getElementById('devTickerLabel');
        const marquee = document.getElementById('devTickerContent');

        if (label && marquee && data.developerTicker) {
            // Set fixed label
            label.textContent = "DEVELOPER";

            // Render Items
            marquee.innerHTML = data.developerTicker.map(item => `
                <span class="ticker-item">
                    <svg class="icon-inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        ${item.icon}
                    </svg>
                    <strong>${item.label}:</strong> ${item.text}
                </span>
            `).join('');
        }
    } catch (error) {
        console.error("Error loading developer ticker:", error);
    }
}

// =========================================
// TYPING ANIMATION
// =========================================
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function startTypingAnimation() {
    if (!developerData || !developerData.hero) return;

    const roles = developerData.hero.roles;
    const typingText = document.getElementById('typingText');
    const currentRole = roles[roleIndex];

    if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let typingSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500;
    }

    setTimeout(startTypingAnimation, typingSpeed);
}