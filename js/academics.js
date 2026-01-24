// =========================================
// ACADEMICS PAGE - MAIN LOGIC
// =========================================
let academicsData = null;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data/academics/content.json');
        academicsData = await response.json();

        loadHeroContent();
        loadToppers();
        loadCurriculum();
        loadLibraryLink();

    } catch (error) {
        console.error('Error loading academics data:', error);
    }
});

// =========================================
// LOAD HERO CONTENT
// =========================================
function loadHeroContent() {
    document.getElementById('heroSubtitle').textContent = academicsData.hero.subtitle;
    document.getElementById('heroTitle').textContent = academicsData.hero.title + ' ';
    document.getElementById('heroHighlight').textContent = academicsData.hero.highlight;
    document.getElementById('heroDescription').textContent = academicsData.hero.description;
}

// =========================================
// LOAD TOPPERS (PODIUM LAYOUT)
// =========================================
function loadToppers() {
    const grid = document.getElementById('toppersGrid');
    const toppers = academicsData.toppers;

    if (toppers.length < 3) return;

    // Order: 2nd, 1st, 3rd (Podium style)
    const orderedToppers = [toppers[1], toppers[0], toppers[2]];
    const classes = ['side', 'center', 'side'];
    const badges = ['silver', 'gold', 'bronze'];

    orderedToppers.forEach((topper, index) => {
        const card = document.createElement('div');
        card.className = `podium-card ${classes[index]}`;

        card.innerHTML = `
            ${index === 1 ? `
                <div class="crown-icon">
                    <svg viewBox="0 0 24 24" fill="#fbbf24">
                        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"></path>
                    </svg>
                </div>
            ` : ''}
            <div class="rank-badge ${badges[index]}">${topper.rank}</div>
            <div class="student-img-box ${index === 1 ? 'large' : ''}">
                ${topper.image
                ? `<img src="${topper.image}" alt="${topper.name}">`
                : topper.name.charAt(0)
            }
            </div>
            <h3>${topper.name}</h3>
            <p class="marks">${topper.marks}</p>
            <span class="group">${topper.group}</span>
        `;

        grid.appendChild(card);
    });
}

// =========================================
// LOAD CURRICULUM
// =========================================
function loadCurriculum() {
    // Middle Section Subjects
    const middleSubjects = document.getElementById('middleSubjects');
    academicsData.middleSection.subjects.forEach(subject => {
        const li = document.createElement('li');
        li.textContent = subject;
        middleSubjects.appendChild(li);
    });

    // Secondary Section Groups
    const groups = academicsData.secondarySection.groups;

    // Biology Group
    const bioTags = document.getElementById('bioTags');
    groups.biology.subjects.forEach(subject => {
        const span = document.createElement('span');
        span.textContent = subject;
        bioTags.appendChild(span);
    });

    // Computer Science Group
    const csTags = document.getElementById('csTags');
    groups.computer.subjects.forEach(subject => {
        const span = document.createElement('span');
        span.textContent = subject;
        csTags.appendChild(span);
    });

    // Arts Group
    const artsTags = document.getElementById('artsTags');
    groups.arts.subjects.forEach(subject => {
        const span = document.createElement('span');
        span.textContent = subject;
        artsTags.appendChild(span);
    });

    // Update descriptions
    document.getElementById('middleDesc').textContent = academicsData.middleSection.description;
}

// =========================================
// GROUP TAB SWITCHING
// =========================================
function switchGroup(groupName) {
    // Update tab active states
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update panel visibility
    document.querySelectorAll('.group-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById(`group-${groupName}`).classList.add('active');
}

// Make function global
window.switchGroup = switchGroup;

// =========================================
// LOAD LIBRARY LINK
// =========================================
function loadLibraryLink() {
    const link = document.getElementById('libraryLink');
    link.href = academicsData.digitalLibrary.link;
}