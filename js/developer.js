// =========================================
// LOAD DEVELOPER DATA
// =========================================
let developerData = null;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data/developer/profile.json');
        developerData = await response.json();

        // Load all sections
        loadHero();
        loadAbout();
        loadSkills();
        loadProjects();
        loadExperience();

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
    document.getElementById('heroTagline').textContent = hero.tagline;

    // Load profile image or initials
    const profile = document.getElementById('heroProfile');
    if (hero.profileImage) {
        profile.innerHTML = `<img src="${hero.profileImage}" alt="${hero.name}">`;
    } else {
        const initials = hero.name.split(' ').map(n => n[0]).join('');
        profile.textContent = initials;
    }

    // Load social links
    const socialContainer = document.getElementById('socialLinks');
    developerData.social.forEach(social => {
        const a = document.createElement('a');
        a.href = social.url;
        a.className = 'social-link';
        a.target = '_blank';
        a.title = social.name;
        a.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                ${social.icon}
            </svg>
        `;
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
// LOAD ABOUT SECTION
// =========================================
function loadAbout() {
    const about = developerData.about;

    document.getElementById('aboutDescription').textContent = about.description;

    const statsContainer = document.getElementById('aboutStats');
    about.stats.forEach(stat => {
        const statCard = document.createElement('div');
        statCard.className = 'stat-card';
        statCard.innerHTML = `
            <div class="stat-value">${stat.value}</div>
            <div class="stat-label">${stat.label}</div>
        `;
        statsContainer.appendChild(statCard);
    });
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
// LOAD PROJECTS SECTION
// =========================================
function loadProjects() {
    const projectsGrid = document.getElementById('projectsGrid');

    developerData.projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';

        const techTags = project.tech.map(tech =>
            `<span class="tech-tag">${tech}</span>`
        ).join('');

        projectCard.innerHTML = `
            <div class="project-image">
                ${project.image ? `<img src="${project.image}" alt="${project.title}">` : project.title.charAt(0)}
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${techTags}
                </div>
                <a href="${project.link}" class="project-link">
                    View Project
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </a>
            </div>
        `;

        projectsGrid.appendChild(projectCard);
    });
}

// =========================================
// LOAD EXPERIENCE SECTION
// =========================================
function loadExperience() {
    const timeline = document.getElementById('timeline');

    developerData.experience.forEach(exp => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';

        timelineItem.innerHTML = `
            <div class="timeline-content">
                <div class="timeline-year">${exp.year}</div>
                <h3>${exp.title}</h3>
                <div class="timeline-company">${exp.company}</div>
                <p>${exp.description}</p>
            </div>
            <div class="timeline-dot"></div>
        `;

        timeline.appendChild(timelineItem);
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
    document.querySelectorAll('.section-title, .about-text, .about-stats, .skill-category, .project-card, .timeline-item').forEach(el => {
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
