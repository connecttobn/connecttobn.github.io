/**
 * Tools page functionality
 */

// Search functionality and keyboard shortcuts
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
    
    // Add keyboard shortcuts for project cards
    document.addEventListener('keydown', function(event) {
        // Only trigger shortcuts if not typing in an input field
        if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            // Check if the pressed key is a capital letter (A-Z)
            const key = event.key;
            if (/^[a-zA-Z]$/.test(key)) {
                // Log the key press for debugging
                console.log('Shortcut key pressed:', key);
                
                // Convert key to uppercase for matching (since our shortcuts are uppercase)
                const upperKey = key.toUpperCase();
                
                // Find the card with the matching shortcut key
                const shortcutElements = document.querySelectorAll('.shortcut-key[data-key="' + upperKey + '"]');
                console.log('Found shortcut elements for key ' + upperKey + ':', shortcutElements.length);
                
                if (shortcutElements.length > 0) {
                    // Find the parent card and its link
                    const cardContainer = shortcutElements[0].closest('.w3-container');
                    if (cardContainer) {
                        const cardElement = cardContainer.closest('.tool-card');
                        if (cardElement) {
                            const linkElement = cardElement.querySelector('a');
                            if (linkElement && linkElement.href) {
                                // Prevent default behavior (important for the '0' key)
                                event.preventDefault();
                                
                                // Navigate to the project
                                window.location.href = linkElement.href;
                            }
                        }
                    }
                }
            }
        }
    });
    
    // Automatically assign shortcut keys to all tool cards
    function assignShortcutKeys() {
        const toolCards = document.querySelectorAll('.tool-card');
        const shortcutKeys = [];
        
        // First, collect all existing shortcut keys
        document.querySelectorAll('.shortcut-key').forEach(function(element) {
            shortcutKeys.push(element.getAttribute('data-key'));
        });
        
        // Then, assign keys to cards without shortcuts
        toolCards.forEach(function(card, index) {
            // Skip cards that already have shortcuts
            if (card.querySelector('.shortcut-key')) {
                return;
            }
            
            // Find the container where we'll add the shortcut - look for the colored container
            const container = card.querySelector('.w3-container.w3-round-large');
            if (!container) {
                console.log('Container not found for card:', card);
                return;
            }
            
            // Make sure container has position: relative
            container.style.position = 'relative';
            
            // Determine the next available key
            let key;
            // Use capital alphabets (A-Z) for all shortcuts
            key = String.fromCharCode(65 + index % 26); // 65 is ASCII for 'A'
            
            // Skip if this key is already used
            if (shortcutKeys.includes(key)) {
                // Find the next available key
                for (let i = 0; i < 26; i++) {
                    let testKey = String.fromCharCode(65 + i); // Capital A-Z
                    
                    if (!shortcutKeys.includes(testKey)) {
                        key = testKey;
                        break;
                    }
                }
            }
            
            // Add this key to our used keys list
            shortcutKeys.push(key);
            
            // Create and add the shortcut key element
            const shortcutElement = document.createElement('div');
            shortcutElement.className = 'shortcut-key';
            shortcutElement.setAttribute('data-key', key);
            shortcutElement.textContent = key;
            shortcutElement.style.position = 'absolute';
            shortcutElement.style.top = '5px';
            shortcutElement.style.right = '10px';
            shortcutElement.style.backgroundColor = 'rgba(0,0,0,0.1)';
            shortcutElement.style.borderRadius = '4px';
            shortcutElement.style.padding = '2px 8px';
            shortcutElement.style.color = 'black';
            shortcutElement.style.fontWeight = 'bold';
            
            container.appendChild(shortcutElement);
        });
    }
    
    // Run the assignment function when the page loads with a small delay to ensure DOM is ready
    setTimeout(function() {
        assignShortcutKeys();
        console.log('Shortcut keys assigned');
    }, 100);
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
