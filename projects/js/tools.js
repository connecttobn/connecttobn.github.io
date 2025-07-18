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
            // Check if the pressed key is a number (0-9) or letter (a-z)
            const key = event.key.toLowerCase();
            if (/^[0-9a-z]$/.test(key)) {
                // Find the card with the matching shortcut key
                const shortcutElements = document.querySelectorAll('.shortcut-key[data-key="' + key + '"]');
                if (shortcutElements.length > 0) {
                    // Find the parent card and its link
                    const cardContainer = shortcutElements[0].closest('.w3-container');
                    if (cardContainer) {
                        const cardElement = cardContainer.closest('.tool-card');
                        if (cardElement) {
                            const linkElement = cardElement.querySelector('a');
                            if (linkElement && linkElement.href) {
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
            
            // Find the container where we'll add the shortcut
            const container = card.querySelector('.w3-round-large');
            if (!container) return;
            
            // Make sure container has position: relative
            if (container.style.position !== 'relative') {
                container.style.position = 'relative';
            }
            
            // Determine the next available key
            let key;
            if (index < 10) {
                // Use numbers 0-9 in order
                key = String((index + 1) % 10); // This gives 1,2,3,4,5,6,7,8,9,0
            } else {
                // Use alphabet keys after running out of numbers
                key = String.fromCharCode(97 + (index - 10)); // 97 is ASCII for 'a'
            }
            
            // Skip if this key is already used
            if (shortcutKeys.includes(key)) {
                // Find the next available key
                for (let i = 0; i < 36; i++) {
                    let testKey;
                    if (i < 10) {
                        testKey = String(i);
                    } else {
                        testKey = String.fromCharCode(97 + (i - 10));
                    }
                    
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
            shortcutElement.style.backgroundColor = 'rgba(255,255,255,0.3)';
            shortcutElement.style.borderRadius = '4px';
            shortcutElement.style.padding = '2px 8px';
            shortcutElement.style.color = 'white';
            shortcutElement.style.fontWeight = 'bold';
            
            container.appendChild(shortcutElement);
        });
    }
    
    // Run the assignment function when the page loads
    assignShortcutKeys();
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
