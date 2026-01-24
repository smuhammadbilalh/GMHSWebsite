let facultyData = null;
let currentCategory = 'all';
let displayedCount = 8;

document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('data/faculty/content.json');
    facultyData = await response.json();

    document.getElementById('pageTitle').textContent = facultyData.pageTitle;
    loadCategories();
    renderFaculty();
});

function loadCategories() {
    const container = document.getElementById('categoryTabs');
    facultyData.categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `tab-btn ${cat.id === 'all' ? 'active' : ''}`;
        btn.textContent = cat.name;
        btn.onclick = () => {
            currentCategory = cat.id;
            displayedCount = 8;
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderFaculty();
        };
        container.appendChild(btn);
    });
}

function renderFaculty() {
    const grid = document.getElementById('facultyGrid');
    grid.innerHTML = '';

    const filtered = currentCategory === 'all'
        ? facultyData.staff
        : facultyData.staff.filter(s => s.category === currentCategory);

    filtered.slice(0, displayedCount).forEach(member => {
        const card = document.createElement('div');
        card.className = 'faculty-card';
        card.innerHTML = `
            <div class="faculty-img-container">
                <img src="${member.photo}" alt="${member.name}">
            </div>
            <div class="faculty-info">
                <h3>${member.name}</h3>
                <div class="faculty-designation">${member.designation}</div>
                <div class="faculty-details">
                    <div class="detail-item"><strong>Edu:</strong> ${member.qualification}</div>
                    <a href="tel:${member.phone}" class="contact-badge">
                        📞 ${member.phone}
                    </a>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    // Toggle Show More button visibility based on filtered length
    document.getElementById('btnShowMore').classList.toggle('hidden', displayedCount >= filtered.length);
}

document.getElementById('btnShowMore').onclick = () => {
    displayedCount += 8;
    renderFaculty();
};