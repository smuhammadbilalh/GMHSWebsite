// =========================================
// LOAD DEVELOPER DATA
// =========================================
let developerData = null;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data/developer/profile.json');
        developerData = await response.json();

        // Load specific sections
        loadHero();
        loadSkills();

        // Start typing animation
        startTypingAnimation();

        // Setup scroll animations
        setupScrollAnimations();

    } catch (error) {
        console.error('Error loading developer data:', error);
    }
});

// =========================================
// LOAD HERO SECTION
// =========================================
function loadHero() {
    const hero = developerData.hero;

    document.getElementById('heroName').textContent = hero.name;
    document.getElementById('heroDescription').textContent = hero.description;

    // Load profile image or initials
    const profile = document.getElementById('heroProfile');
    if (hero.profileImage) {
        profile.innerHTML = `<img src="${hero.profileImage}" alt="${hero.name}">`;
    } else {
        const initials = hero.name.split(' ').map(n => n[0]).join('');
        profile.textContent = initials;
    }

    // Load social links with SVG icons
    const socialContainer = document.getElementById('socialLinks');

    const socialIcons = [
        {
            name: 'GitHub',
            url: developerData.social[0].url,
            svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>'
        },
        {
            name: 'LinkedIn',
            url: developerData.social[1].url,
            svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>'
        },
        {
            name: 'Email',
            url: developerData.social[2].url,
            svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>'
        },
        {
            name: 'WhatsApp',
            url: developerData.social[3].url,
            svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>'
        }
    ];

    socialIcons.forEach(social => {
        const a = document.createElement('a');
        a.href = social.url;
        a.className = 'social-link';
        a.target = '_blank';
        a.title = social.name;
        a.innerHTML = social.svg;
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
// LOAD SKILLS SECTION
// =========================================
function loadSkills() {
    const skillsGrid = document.getElementById('skillsGrid');

    developerData.skills.forEach((category, index) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'skill-category';

        let skillsHTML = '';
        category.technologies.forEach(tech => {
            skillsHTML += `
                <div class="skill-item">
                    <div class="skill-header">
                        <span class="skill-name">${tech.name}</span>
                        <span class="skill-percentage">${tech.level}%</span>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-progress" data-level="${tech.level}"></div>
                    </div>
                </div>
            `;
        });

        categoryDiv.innerHTML = `
            <h3>${category.category}</h3>
            ${skillsHTML}
        `;

        skillsGrid.appendChild(categoryDiv);
    });
}

// =========================================
// SCROLL ANIMATIONS
// =========================================
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animate skill bars
                if (entry.target.classList.contains('skill-category')) {
                    const progressBars = entry.target.querySelectorAll('.skill-progress');
                    progressBars.forEach(bar => {
                        const level = bar.getAttribute('data-level');
                        setTimeout(() => {
                            bar.style.width = level + '%';
                        }, 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    document.querySelectorAll('.section-title, .skill-category').forEach(el => {
        observer.observe(el);
    });
}

// =========================================
// SMOOTH SCROLL
// =========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});