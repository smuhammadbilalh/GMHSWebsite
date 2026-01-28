// =========================================
// LOAD DEVELOPER DATA
// =========================================
let developerData = null;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data/developer/profile.json');
        developerData = await response.json();

        loadHero();
        // Removed loadSkills();
        startTypingAnimation();
        // Removed setupScrollAnimations(); - Not needed without skills section

    } catch (error) {
        console.error('Error loading developer data:', error);
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

    // 3. Social Icons (Strictly from JSON)
    const socialContainer = document.getElementById('socialLinks');
    socialContainer.innerHTML = '';

    developerData.social.forEach(social => {
        const a = document.createElement('a');
        a.href = social.url;

        // Generate class name (e.g. "github", "whatsapp")
        const brandName = social.name.toLowerCase().trim();
        a.className = `social-link ${brandName}`;
        a.target = '_blank';
        a.title = social.name;

        // ---------------------------------------------------------
        // SVG RENDERING LOGIC
        // ---------------------------------------------------------
        let svgAttributes = '';

        if (brandName === 'whatsapp') {
            // WhatsApp needs FILL, no stroke
            svgAttributes = `
                viewBox="0 0 24 24" 
                fill="currentColor" 
                stroke="none"`;
        } else {
            // Others need STROKE, no fill
            svgAttributes = `
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round"`;
        }

        a.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" 
                 width="24" height="24" 
                 ${svgAttributes}>
                 ${social.icon}
            </svg>`;

        socialContainer.appendChild(a);
    });
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

// =========================================
// SMOOTH SCROLL (Optional - kept for links)
// =========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});