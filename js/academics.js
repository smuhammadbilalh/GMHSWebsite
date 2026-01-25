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
        loadSchoolDetails(); // New Function
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

        // Uses Dicebear API for dummy images if image is present in JSON
        card.innerHTML = `
            ${index === 1 ? `
                <div class="crown-icon">
                    <svg viewBox="0 0 24 24" fill="#e2e8f0"> <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"></path>
                    </svg>
                </div>
            ` : ''}
            <div class="rank-badge ${badges[index]}">${topper.rank}</div>
            <div class="student-img-box ${index === 1 ? 'large' : ''}">
                <img src="${topper.image}" alt="${topper.name}" onerror="this.src='https://api.dicebear.com/7.x/initials/svg?seed=${topper.name}'">
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

    document.getElementById('middleDesc').textContent = academicsData.middleSection.description;

    // Secondary Section Groups
    const groups = academicsData.secondarySection.groups;

    // Helper to populate tags
    const populateTags = (elementId, subjects) => {
        const container = document.getElementById(elementId);
        subjects.forEach(subject => {
            const span = document.createElement('span');
            span.textContent = subject;
            container.appendChild(span);
        });
    };

    populateTags('bioTags', groups.biology.subjects);
    populateTags('csTags', groups.computer.subjects);
    populateTags('artsTags', groups.arts.subjects);
}

// =========================================
// LOAD SCHOOL DETAILS (UNIFORM & FEES)
// =========================================
function loadSchoolDetails() {
    // Uniform Section
    document.getElementById('uniformTitle').textContent = academicsData.uniform.title;
    document.getElementById('uniformDesc').textContent = academicsData.uniform.description;
    const uniformList = document.getElementById('uniformList');

    academicsData.uniform.items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        uniformList.appendChild(li);
    });

    // Fee Section
    document.getElementById('feeTitle').textContent = academicsData.fees.title;
    document.getElementById('feeDesc').textContent = academicsData.fees.description;
    const feeList = document.getElementById('feeList');

    academicsData.fees.details.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        feeList.appendChild(li);
    });
}

// =========================================
// GROUP TAB SWITCHING
// =========================================
function switchGroup(groupName) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');

    document.querySelectorAll('.group-panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById(`group-${groupName}`).classList.add('active');
}
window.switchGroup = switchGroup;

// =========================================
// LOAD LIBRARY LINK
// =========================================
function loadLibraryLink() {
    const link = document.getElementById('libraryLink');
    link.href = academicsData.digitalLibrary.link;
}