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
// =========================================
// LOAD GOOGLE MAP
// =========================================
function loadMap() {
    const mapContainer = document.getElementById('mapContainer');

    const iframe = document.createElement('iframe');

    // Updated to use the specific hardcoded URL provided
    iframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1674.9717738798543!2d73.75519632252828!3d32.89966079459924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391f99fda557f7db%3A0xb9027cf2f719252!2sGovt%20Model%20High%20School!5e0!3m2!1sen!2s!4v1769501971690!5m2!1sen!2s";

    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.allowFullscreen = true; // Added allowfullscreen support

    // Note: Width, Height, and Border styles are already handled 
    // by your contact.css (.map-container iframe) to ensure responsiveness.

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
