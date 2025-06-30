/**
 * Tools page functionality
 */

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get the search input element
    const searchInput = document.getElementById('toolSearch');
    
    // Add event listener for real-time search
    if (searchInput) {
        searchInput.addEventListener('input', searchTools);
        
        // Also keep the Enter key functionality
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                searchTools();
            }
        });
    }
});

/**
 * Search tools based on input value
 */
function searchTools() {
    // Get the search input value
    const searchInput = document.getElementById('toolSearch').value.toLowerCase();
    
    // Get all tool cards
    const toolCards = document.getElementsByClassName('tool-card');
    
    // Loop through all tool cards
    for (let i = 0; i < toolCards.length; i++) {
        const card = toolCards[i];
        const tags = card.getAttribute('data-tags').toLowerCase();
        const title = card.querySelector('h5').textContent.toLowerCase();
        
        // Check if the search input matches any tags or title
        if (tags.includes(searchInput) || title.includes(searchInput) || searchInput === '') {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    }
}
