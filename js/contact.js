// =========================================
// LOAD CONTACT DATA FROM JSON
// =========================================
let contactData = null;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data/contact/info.json');
        contactData = await response.json();

        // Set page title
        document.getElementById('pageTitle').textContent = contactData.pageTitle;

        // Load contact cards
        loadContactCards();

        // Load form types
        loadFormTypes();

        // Load map
        loadMap();

        // Setup form submission
        setupForm();

    } catch (error) {
        console.error('Error loading contact data:', error);
    }
});

// =========================================
// LOAD CONTACT CARDS
// =========================================
function loadContactCards() {
    const grid = document.getElementById('contactCardsGrid');

    contactData.contactCards.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'contact-card';

        if (card.link) {
            cardDiv.style.cursor = 'pointer';
            cardDiv.onclick = () => window.open(card.link, card.link.startsWith('http') ? '_blank' : '_self');
        }

        cardDiv.innerHTML = `
            <div class="contact-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    ${card.icon}
                </svg>
            </div>
            <h3>${card.title}</h3>
            <p>${card.detail}</p>
        `;

        grid.appendChild(cardDiv);
    });
}

// =========================================
// LOAD FORM TYPES
// =========================================
function loadFormTypes() {
    const select = document.getElementById('formType');

    contactData.formTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type.value;
        option.textContent = type.label;
        select.appendChild(option);
    });
}

// =========================================
// LOAD GOOGLE MAP
// =========================================
function loadMap() {
    const mapContainer = document.getElementById('mapContainer');

    const iframe = document.createElement('iframe');
    iframe.src = contactData.mapLocation.embedUrl;
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';

    mapContainer.appendChild(iframe);
}

// =========================================
// SETUP FORM SUBMISSION
// =========================================
function setupForm() {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            type: document.getElementById('formType').value,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value
        };

        // Log form data (in production, send to backend)
        console.log('Form submitted:', formData);

        // Show success message
        const successMsg = document.getElementById('formSuccess');
        successMsg.classList.add('show');

        // Reset form
        form.reset();

        // Hide success message after 5 seconds
        setTimeout(() => {
            successMsg.classList.remove('show');
        }, 5000);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
