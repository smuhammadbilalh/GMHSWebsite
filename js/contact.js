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

        // Load map (Hardcoded in JS)
        loadMap();

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
// LOAD GOOGLE MAP (IFRAME APPROACH)
// =========================================
function loadMap() {
    const mapContainer = document.getElementById('mapContainer');

    const iframe = document.createElement('iframe');

    // EXACT URL requested by user
    iframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d837.4858869399271!2d73.75546094373954!3d32.89966079459924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391f99fda557f7db%3A0xb9027cf2f719252!2sGovt%20Model%20High%20School!5e0!3m2!1sen!2s!4v1770354943218!5m2!1sen!2s";

    // Responsive Styling (Fills the CSS parent container)
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "0";

    // Attributes
    iframe.allowFullscreen = true;
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";

    mapContainer.appendChild(iframe);
}