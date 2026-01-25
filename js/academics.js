// =========================================
// ACADEMICS PAGE - MAIN LOGIC
// =========================================
let academicsData = null;

// Carousel State
let positionIndex = 0;
let positionsCount = 0;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data/academics/content.json');
        academicsData = await response.json();

        loadHeroContent();
        loadToppersCarousel(); // Updated to Carousel
        loadCurriculum();
        loadSchoolDetails();
        loadLibraryLink();

    } catch (error) {
        console.error('Error loading academics data:', error);
    }
});

function loadHeroContent() {
    document.getElementById('pageTitle').textContent = academicsData.pageTitle;
}

// =========================================
// TOPPERS CAROUSEL LOGIC
// =========================================
function loadToppersCarousel() {
    const track = document.getElementById('positionTrack');
    const toppers = academicsData.toppers;
    positionsCount = toppers.length;

    if (!track) return;

    // Render Cards
    track.innerHTML = toppers.map((topper, index) => `
        <div class="position-card">
            <div class="pos-rank-badge">#${topper.rank}</div>
            <div class="pos-img-wrapper">
                <img src="${topper.image}" alt="${topper.name}" onerror="this.src='https://api.dicebear.com/7.x/initials/svg?seed=${topper.name}'">
            </div>
            <h3>${topper.name}</h3>
            <p class="pos-marks">${topper.marks}</p>
            <span class="pos-group">${topper.group}</span>
        </div>
    `).join('');

    renderPositionDots();
    updatePositionCarousel();

    // Responsive Listener
    window.addEventListener('resize', updatePositionCarousel);

    // Auto-slide every 5 seconds
    setInterval(() => movePositionSlide(1), 5000);
}

function renderPositionDots() {
    const dotsContainer = document.getElementById('positionDots');
    dotsContainer.innerHTML = '';

    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('button');
        dot.className = i === 0 ? 'active' : '';
        dot.onclick = () => {
            const itemsInView = window.innerWidth < 600 ? 1 : (window.innerWidth < 901 ? 2 : 3);
            const maxIndex = Math.max(0, positionsCount - itemsInView);
            positionIndex = Math.round((i / 2) * maxIndex);
            updatePositionCarousel();
        };
        dotsContainer.appendChild(dot);
    }
}

function movePositionSlide(direction) {
    const itemsInView = window.innerWidth < 600 ? 1 : (window.innerWidth < 901 ? 2 : 3);
    const maxIndex = Math.max(0, positionsCount - itemsInView);

    positionIndex += direction;

    if (positionIndex > maxIndex) positionIndex = 0;
    if (positionIndex < 0) positionIndex = maxIndex;

    updatePositionCarousel();
}

function updatePositionCarousel() {
    const track = document.getElementById('positionTrack');
    const cards = document.querySelectorAll('.position-card');

    if (!track || cards.length === 0) return;

    const cardWidth = cards[0].offsetWidth;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.gap) || 20;

    const itemsInView = window.innerWidth < 600 ? 1 : (window.innerWidth < 901 ? 2 : 3);
    const maxIndex = Math.max(0, positionsCount - itemsInView);

    let translateVal;

    if (window.innerWidth < 600) {
        // Center active card on mobile
        const containerWidth = track.parentElement.offsetWidth;
        const centerOffset = (containerWidth / 2) - (cardWidth / 2);
        translateVal = centerOffset - (positionIndex * (cardWidth + gap));
    } else {
        // Align left on desktop
        translateVal = -(positionIndex * (cardWidth + gap));
    }

    track.style.transform = `translateX(${translateVal}px)`;

    // Update Dots
    const dots = document.querySelectorAll('#positionDots button');
    if (dots.length === 3) {
        dots.forEach(d => d.classList.remove('active'));
        const activeDot = Math.min(2, Math.floor((positionIndex / (maxIndex || 1)) * 3));
        dots[activeDot].classList.add('active');
    }
}

// Make globally available for HTML buttons
window.movePositionSlide = movePositionSlide;

// =========================================
// LOAD CURRICULUM
// =========================================
function loadCurriculum() {
    const middleSubjects = document.getElementById('middleSubjects');
    academicsData.middleSection.subjects.forEach(subject => {
        const li = document.createElement('li');
        li.textContent = subject;
        middleSubjects.appendChild(li);
    });

    document.getElementById('middleDesc').textContent = academicsData.middleSection.description;

    const groups = academicsData.secondarySection.groups;
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
// LOAD SCHOOL DETAILS
// =========================================
function loadSchoolDetails() {
    document.getElementById('uniformTitle').textContent = academicsData.uniform.title;
    document.getElementById('uniformDesc').textContent = academicsData.uniform.description;

    const uniformBody = document.getElementById('uniformBody');
    const uniformContainer = document.createElement('div');
    uniformContainer.className = 'uniform-layout';

    const uniformList = document.createElement('ul');
    uniformList.className = 'subject-list';
    academicsData.uniform.items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        uniformList.appendChild(li);
    });

    const uniformImg = document.createElement('img');
    uniformImg.className = 'uniform-img';
    uniformImg.src = academicsData.uniform.image || 'images/uniform_placeholder.jpg';
    uniformImg.alt = 'School Uniform';

    uniformContainer.appendChild(uniformList);
    uniformContainer.appendChild(uniformImg);
    uniformBody.appendChild(uniformContainer);

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
// UTILS
// =========================================
function switchGroup(groupName) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    document.querySelectorAll('.group-panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById(`group-${groupName}`).classList.add('active');
}
window.switchGroup = switchGroup;

function loadLibraryLink() {
    const link = document.getElementById('libraryLink');
    link.href = academicsData.digitalLibrary.link;
}