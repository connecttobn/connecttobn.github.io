 // Global variables
let timeFormat = '12-hour'; // Single time format for all timezones

// Variable to track third timezone visibility
let showThirdTimezone = true;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // First populate timezones and create the timezoneObjects array
    populateTimezones();
    
    // Then initialize select2 after timezoneObjects is defined
    initializeSelect2();
    
    // Load saved preferences from localStorage
    loadSavedPreferences();
    
    // Update display and initialize slider
    updateDisplay();
    initializeTimeSlider();
    
    // Update every minute to keep current time marker accurate
    setInterval(updateCurrentTimeMarkers, 60000);
});

// Load saved preferences from localStorage
function loadSavedPreferences() {
    // Load time format preference
    const savedTimeFormat = localStorage.getItem('timeFormat');
    if (savedTimeFormat) {
        timeFormat = savedTimeFormat;
    }
    
    // Load third timezone visibility preference
    const savedShowThirdTimezone = localStorage.getItem('showThirdTimezone');
    if (savedShowThirdTimezone !== null) {
        showThirdTimezone = savedShowThirdTimezone === 'true';
        document.getElementById('showThirdTimezone').checked = showThirdTimezone;
    } else {
        showThirdTimezone = document.getElementById('showThirdTimezone').checked;
    }
    toggleThirdTimezone(false); // Don't update display yet as we're still loading preferences
    
    // Load saved timezone selections
    const savedTimezone1 = localStorage.getItem('timezone1');
    const savedTimezone2 = localStorage.getItem('timezone2');
    const savedTimezone3 = localStorage.getItem('timezone3');
    
    if (savedTimezone1) document.getElementById('timezone1').value = savedTimezone1;
    if (savedTimezone2) document.getElementById('timezone2').value = savedTimezone2;
    if (savedTimezone3) document.getElementById('timezone3').value = savedTimezone3;
    
    // Update Select2 to reflect the loaded values
    $('#timezone1, #timezone2, #timezone3').trigger('change.select2');
}

// Function to toggle the visibility of the third timezone row
function toggleThirdTimezone(updateDisplayFlag = true) {
    showThirdTimezone = document.getElementById('showThirdTimezone').checked;
    const thirdTimezoneRow = document.querySelector('.time-row-container.tz:nth-of-type(3)');
    
    if (thirdTimezoneRow) {
        thirdTimezoneRow.style.display = showThirdTimezone ? 'flex' : 'none';
    }
    
    // Save preference to localStorage
    localStorage.setItem('showThirdTimezone', showThirdTimezone);
    
    // Update the display to recalculate overlaps (unless specified not to)
    if (updateDisplayFlag) {
        updateDisplay();
    }
}

// Function to initialize select2 dropdowns
function initializeSelect2() {
    // Create data array for select2 with all the searchable information
    const select2Data = timezoneObjects.map(tz => ({
        id: tz.value,
        text: tz.label,
        // Add all searchable data as data attributes
        cities: tz.searchData.split(' ').filter(Boolean)
    }));
    
    // Initialize select2 with the data
    $('#timezone1, #timezone2, #timezone3').select2({
        width: '100%',
        placeholder: 'Search for a timezone, city, country, or abbreviation...',
        allowClear: true,
        data: select2Data,
        matcher: function(params, data) {
            // If there are no search terms, return all of the data
            if ($.trim(params.term) === '') {
                return data;
            }
            
            // Find the matching timezone object
            const tzObj = timezoneObjects.find(tz => tz.value === data.id);
            if (!tzObj) return null;
            
            // Search through all the metadata
            const searchTerm = params.term.toLowerCase();
            if (tzObj.searchData.toLowerCase().indexOf(searchTerm) > -1) {
                return data;
            }
            
            // Return null if no match
            return null;
        }
    });
    
    // Handle select2 change events
    $('#timezone1, #timezone2, #timezone3').on('change', function() {
        // Save selection to localStorage
        const id = this.id;
        const value = this.value;
        localStorage.setItem(id, value);
        
        // Update display
        updateDisplay();
    });
}

// Initialize the vertical time slider
function initializeTimeSlider() {
    const slider = document.getElementById('timeSlider');
    const timeDisplay = document.querySelector('.time-display');
    
    // Set initial position to current time
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const percentageOfDay = (totalMinutes / (24 * 60)) * 100;
    moveSliderTo(percentageOfDay);
    
    // Function to move slider to a specific position
    function moveSliderTo(percentage) {
        // Constrain to time display boundaries
        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;
        
        // Get the timezone picker width to offset the slider
        const timezonePicker = document.querySelector('.timezone-picker');
        const pickerWidth = timezonePicker ? timezonePicker.offsetWidth : 0;
        const timeDisplay = document.querySelector('.time-display');
        const displayWidth = timeDisplay ? timeDisplay.offsetWidth : 0;
        
        // Calculate the actual left position in pixels
        const timeAreaWidth = displayWidth - pickerWidth;
        const leftPosition = pickerWidth + (percentage / 100) * timeAreaWidth;
        
        // Set position as absolute pixels instead of percentage
        slider.style.left = `${leftPosition}px`;
        
        // Update the time display to show the selected time
        updateTimeDisplay(percentage);
    }
    
    // Function to update time display based on slider position
    function updateTimeDisplay(percentage) {
        const totalMinutesInDay = 24 * 60;
        const selectedMinutes = Math.floor((percentage / 100) * totalMinutesInDay);
        const selectedHours = Math.floor(selectedMinutes / 60);
        const selectedMins = selectedMinutes % 60;
    }
    
    // Make slider draggable
    let isDragging = false;
    let startX, startLeft;
    
    // Allow clicking anywhere on the time area (not timezone picker) to move the slider
    timeDisplay.addEventListener('click', function(e) {
        // Don't process if clicking on slider itself or on timezone picker area
        if (e.target === slider || slider.contains(e.target)) return;
        
        // Check if click is in a timezone picker area
        let isInTimezonePicker = false;
        document.querySelectorAll('.timezone-picker').forEach(picker => {
            if (picker.contains(e.target)) {
                isInTimezonePicker = true;
            }
        });
        
        if (isInTimezonePicker) return;
        
        // Get the time area width by subtracting timezone picker width
        const rect = timeDisplay.getBoundingClientRect();
        const timezonePicker = document.querySelector('.timezone-picker');
        const pickerWidth = timezonePicker ? timezonePicker.offsetWidth : 0;
        
        // Calculate click position relative to time area only
        const clickX = e.clientX - rect.left;
        
        // Only process if click is to the right of timezone pickers
        if (clickX <= pickerWidth) return;
        
        // Calculate percentage based on time area width only
        const timeAreaWidth = rect.width - pickerWidth;
        const positionInTimeArea = clickX - pickerWidth;
        const percentage = (positionInTimeArea / timeAreaWidth) * 100;
        
        moveSliderTo(percentage);
    });
    
    // Get reference to time area (excluding timezone picker)
    const getTimeAreaInfo = () => {
        const timezonePicker = document.querySelector('.timezone-picker');
        const pickerWidth = timezonePicker ? timezonePicker.offsetWidth : 0;
        const rect = timeDisplay.getBoundingClientRect();
        const timeAreaWidth = rect.width - pickerWidth;
        return { pickerWidth, rect, timeAreaWidth };
    };
    
    // Convert pixel position to percentage in time area
    const pixelToPercentage = (pixelX) => {
        const { pickerWidth, rect, timeAreaWidth } = getTimeAreaInfo();
        const positionInTimeArea = pixelX - rect.left - pickerWidth;
        return (positionInTimeArea / timeAreaWidth) * 100;
    };
    
    // Touch events for mobile
    slider.addEventListener('touchstart', function(e) {
        isDragging = true;
        startX = e.touches[0].clientX;
        startLeft = parseFloat(slider.style.left) || 0;
        e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        
        const { pickerWidth, rect } = getTimeAreaInfo();
        const touch = e.touches[0];
        const deltaX = touch.clientX - startX;
        
        // Calculate new position in pixels
        let newLeft = startLeft + deltaX;
        
        // Constrain to time area
        if (newLeft < pickerWidth) newLeft = pickerWidth;
        if (newLeft > rect.width) newLeft = rect.width;
        
        // Convert to percentage for the moveSliderTo function
        const percentage = (newLeft - pickerWidth) / (rect.width - pickerWidth) * 100;
        moveSliderTo(percentage);
        e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchend', function() {
        isDragging = false;
    });
    
    // Mouse events for desktop
    slider.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX;
        startLeft = parseFloat(slider.style.left) || 0;
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        const { pickerWidth, rect } = getTimeAreaInfo();
        const deltaX = e.clientX - startX;
        
        // Calculate new position in pixels
        let newLeft = startLeft + deltaX;
        
        // Constrain to time area
        if (newLeft < pickerWidth) newLeft = pickerWidth;
        if (newLeft > rect.width) newLeft = rect.width;
        
        // Convert to percentage for the moveSliderTo function
        const percentage = (newLeft - pickerWidth) / (rect.width - pickerWidth) * 100;
        moveSliderTo(percentage);
    });
    
    document.addEventListener('mouseup', function() {
        isDragging = false;
    });
}

// Define global variable for timezone objects
let timezoneObjects = [];

// Populate timezone dropdowns with all timezones and UTC offsets
function populateTimezones() {
    const timezone1 = document.getElementById('timezone1');
    const timezone2 = document.getElementById('timezone2');
    const timezone3 = document.getElementById('timezone3');
    
    // Clear existing options
    timezone1.innerHTML = '';
    timezone2.innerHTML = '';
    timezone3.innerHTML = '';
    
    // Define a list of common, reliable timezones with additional metadata
    const timezoneData = [
        { id: 'UTC', abbr: 'UTC', cities: 'Coordinated Universal Time', countries: 'International' },
        { id: 'America/New_York', abbr: 'EST/EDT', cities: 'New York, Washington DC, Atlanta, Miami', countries: 'USA (Eastern)' },
        { id: 'America/Chicago', abbr: 'CST/CDT', cities: 'Chicago, Dallas, Houston, Mexico City', countries: 'USA (Central), Mexico' },
        { id: 'America/Denver', abbr: 'MST/MDT', cities: 'Denver, Phoenix, Salt Lake City', countries: 'USA (Mountain)' },
        { id: 'America/Los_Angeles', abbr: 'PST/PDT', cities: 'Los Angeles, San Francisco, Seattle, Vancouver', countries: 'USA (Pacific), Canada' },
        { id: 'America/Anchorage', abbr: 'AKST/AKDT', cities: 'Anchorage, Juneau', countries: 'USA (Alaska)' },
        { id: 'Pacific/Honolulu', abbr: 'HST', cities: 'Honolulu, Hawaii', countries: 'USA (Hawaii)' },
        { id: 'America/Toronto', abbr: 'EST/EDT', cities: 'Toronto, Ottawa, Montreal', countries: 'Canada (Eastern)' },
        { id: 'America/Vancouver', abbr: 'PST/PDT', cities: 'Vancouver, Victoria', countries: 'Canada (Pacific)' },
        { id: 'America/Mexico_City', abbr: 'CST/CDT', cities: 'Mexico City, Guadalajara', countries: 'Mexico' },
        { id: 'America/Sao_Paulo', abbr: 'BRT', cities: 'São Paulo, Rio de Janeiro, Brasília', countries: 'Brazil' },
        { id: 'America/Argentina/Buenos_Aires', abbr: 'ART', cities: 'Buenos Aires, Córdoba', countries: 'Argentina' },
        { id: 'Europe/London', abbr: 'GMT/BST', cities: 'London, Manchester, Dublin, Lisbon', countries: 'UK, Ireland, Portugal' },
        { id: 'Europe/Paris', abbr: 'CET/CEST', cities: 'Paris, Madrid, Rome, Amsterdam', countries: 'France, Spain, Italy, Netherlands' },
        { id: 'Europe/Berlin', abbr: 'CET/CEST', cities: 'Berlin, Frankfurt, Vienna, Zurich', countries: 'Germany, Austria, Switzerland' },
        { id: 'Europe/Moscow', abbr: 'MSK', cities: 'Moscow, St. Petersburg', countries: 'Russia (Western)' },
        { id: 'Europe/Athens', abbr: 'EET/EEST', cities: 'Athens, Istanbul, Bucharest', countries: 'Greece, Turkey, Romania' },
        { id: 'Asia/Jerusalem', abbr: 'IST/IDT', cities: 'Jerusalem, Tel Aviv', countries: 'Israel' },
        { id: 'Asia/Dubai', abbr: 'GST', cities: 'Dubai, Abu Dhabi, Muscat', countries: 'UAE, Oman' },
        { id: 'Asia/Kolkata', abbr: 'IST', cities: 'Mumbai, Delhi, Bangalore, Chennai', countries: 'India' },
        { id: 'Asia/Bangkok', abbr: 'ICT', cities: 'Bangkok, Ho Chi Minh City, Jakarta', countries: 'Thailand, Vietnam, Indonesia' },
        { id: 'Asia/Singapore', abbr: 'SGT', cities: 'Singapore, Kuala Lumpur, Manila', countries: 'Singapore, Malaysia, Philippines' },
        { id: 'Asia/Tokyo', abbr: 'JST', cities: 'Tokyo, Osaka, Kyoto', countries: 'Japan' },
        { id: 'Asia/Seoul', abbr: 'KST', cities: 'Seoul, Busan', countries: 'South Korea' },
        { id: 'Asia/Shanghai', abbr: 'CST', cities: 'Beijing, Shanghai, Hong Kong, Taipei', countries: 'China, Hong Kong, Taiwan' },
        { id: 'Australia/Sydney', abbr: 'AEST/AEDT', cities: 'Sydney, Melbourne, Brisbane', countries: 'Australia (Eastern)' },
        { id: 'Australia/Perth', abbr: 'AWST', cities: 'Perth, Darwin', countries: 'Australia (Western)' },
        { id: 'Pacific/Auckland', abbr: 'NZST/NZDT', cities: 'Auckland, Wellington', countries: 'New Zealand' }
    ];
    
    // Extract just the timezone IDs for processing
    const commonTimezones = timezoneData.map(tz => tz.id);
    
    // Get current date for consistent offset calculation
    const now = new Date();
    
    // Clear the global timezoneObjects array
    timezoneObjects = [];
    
    commonTimezones.forEach(tz => {
        try {
            // Calculate UTC offset
            const tzDate = new Date(now.toLocaleString('en-US', { timeZone: tz }));
            const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
            const diffMinutes = (tzDate - utcDate) / (1000 * 60);
            const diffHours = Math.floor(Math.abs(diffMinutes) / 60);
            const diffMins = Math.abs(diffMinutes) % 60;
            
            // Format the offset string
            const sign = diffMinutes >= 0 ? '+' : '-';
            const hours = diffHours.toString().padStart(2, '0');
            const minutes = diffMins.toString().padStart(2, '0');
            const offsetStr = `${sign}${hours}:${minutes}`;
            
            // Find the metadata for this timezone
            const metadata = timezoneData.find(item => item.id === tz) || {
                abbr: '',
                cities: '',
                countries: ''
            };
            
            // Format the label
            const name = tz.split('/').pop().replace(/_/g, ' ');
            const region = tz.includes('/') ? tz.split('/')[0] : '';
            const regionDisplay = region ? `(${region}) ` : '';
            
            timezoneObjects.push({
                value: tz,
                label: `${name} ${regionDisplay}[${metadata.abbr}] UTC${offsetStr}`,
                offset: diffMinutes,
                searchData: `${name} ${region} ${metadata.abbr} ${metadata.cities} ${metadata.countries} UTC${offsetStr}`
            });
        } catch (error) {
            console.error(`Error processing timezone ${tz}:`, error);
        }
    });
    
    // Sort by UTC offset
    timezoneObjects.sort((a, b) => a.offset - b.offset);
    
    // Add options to each dropdown
    timezoneObjects.forEach(tz => {
        timezone1.innerHTML += `<option value="${tz.value}">${tz.label}</option>`;
        timezone2.innerHTML += `<option value="${tz.value}">${tz.label}</option>`;
        timezone3.innerHTML += `<option value="${tz.value}">${tz.label}</option>`;
    });
    
    // Set default selections
    timezone1.value = 'America/New_York';
    timezone2.value = 'Europe/London';
    timezone3.value = 'Asia/Kolkata';
}

// Format time according to selected format
function formatTime(hour, minute, format) {
    if (format === '24-hour') {
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    } else {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
    }
}

// Get time zone category (working, flexible, off hours)
function getTimeCategory(hour) {
    if (hour >= 9 && hour < 17) {
        return 'working-hours';
    } else if ((hour >= 6 && hour < 9) || (hour >= 17 && hour < 22)) {
        return 'flexible-hours';
    } else {
        return 'off-hours';
    }
}

// Update the time display
function updateDisplay() {
    const timezone1Value = document.getElementById('timezone1').value;
    const timezone2Value = document.getElementById('timezone2').value;
    const timezone3Value = document.getElementById('timezone3').value;
    
    const timezone1Display = document.getElementById('timezone1Display');
    const timezone2Display = document.getElementById('timezone2Display');
    const timezone3Display = document.getElementById('timezone3Display');
    
    // Clear existing displays
    timezone1Display.innerHTML = '';
    timezone2Display.innerHTML = '';
    timezone3Display.innerHTML = '';
    
    // Create time blocks for each timezone
    createTimeBlocks(timezone1Display, timezone1Value, timeFormat);
    createTimeBlocks(timezone2Display, timezone2Value, timeFormat);
    createTimeBlocks(timezone3Display, timezone3Value, timeFormat);
    
    // Add current time markers
    updateCurrentTimeMarkers();
    
    // Update overlap indicator
    updateOverlapIndicator(timezone1Value, timezone2Value, timezone3Value);
}

// Create time blocks for a timezone
function createTimeBlocks(container, timezone, format) {
    const now = new Date();
    
    // Create 24 hour blocks
    for (let i = 0; i < 24; i++) {
        const blockWidth = (100 / 24); // Width percentage for each hour
        let tzHour = i; // Default to local hour if timezone conversion fails
        
        try {
            // Get the actual time in the target timezone for this hour
            const localTime = new Date();
            localTime.setHours(i, 0, 0, 0);
            
            // Convert to target timezone
            const options = { timeZone: timezone, hour12: false };
            const timeString = localTime.toLocaleString('en-US', options);
            const tzTime = new Date(timeString);
            tzHour = tzTime.getHours();
        } catch (error) {
            console.error(`Error with timezone ${timezone}:`, error);
            // Continue with local hour if there's an error
        }
        
        // Create time block
        const timeBlock = document.createElement('div');
        timeBlock.className = `time-block ${getTimeCategory(tzHour)}`;
        timeBlock.style.left = `${i * blockWidth}%`;
        timeBlock.style.width = `${blockWidth}%`;
        timeBlock.setAttribute('data-hour', tzHour);
        
        // Add time label
        const timeLabel = document.createElement('div');
        timeLabel.className = 'time-block-label';
        timeLabel.textContent = formatTime(tzHour, 0, format);
        timeBlock.appendChild(timeLabel);
        
        container.appendChild(timeBlock);
    }
}

// Update current time markers
function updateCurrentTimeMarkers() {
    const timezone1Value = document.getElementById('timezone1').value;
    const timezone2Value = document.getElementById('timezone2').value;
    const timezone3Value = document.getElementById('timezone3').value;
    
    updateCurrentTimeMarker('timezone1Display', timezone1Value);
    updateCurrentTimeMarker('timezone2Display', timezone2Value);
    updateCurrentTimeMarker('timezone3Display', timezone3Value);
}

// Update current time marker for a specific timezone
function updateCurrentTimeMarker(containerId, timezone) {
    const container = document.getElementById(containerId);
    
    // Remove existing marker if any
    const existingMarker = container.querySelector('.current-time-marker');
    if (existingMarker) {
        existingMarker.remove();
    }
    
    // Create new marker
    const marker = document.createElement('div');
    marker.className = 'current-time-marker';
    
    // Calculate position based on current time in the timezone
    const now = new Date();
    const options = { timeZone: timezone, hour12: false };
    const timeString = now.toLocaleString('en-US', { ...options, hour: 'numeric', minute: 'numeric', second: 'numeric' });
    const [time, period] = timeString.split(' ');
    const [hours, minutes, seconds] = time.split(':').map(Number);
    
    // Calculate percentage through the day
    const totalMinutes = hours * 60 + minutes;
    const percentageOfDay = (totalMinutes / (24 * 60)) * 100;
    
    // Position the marker horizontally
    marker.style.left = `${percentageOfDay}%`;
    marker.style.height = '100%';
    marker.style.width = '2px';
    marker.style.top = '0';
    
    container.appendChild(marker);
}

// Update overlap indicator
function updateOverlapIndicator(timezone1, timezone2, timezone3) {
    const overlapIndicator = document.getElementById('overlapIndicator');
    overlapIndicator.innerHTML = '';
    
    // For each hour of the day, check overlap
    for (let i = 0; i < 24; i++) {
        const blockWidth = (100 / 24); // Width percentage for each hour
        const leftPosition = i * blockWidth;
        
        // Get categories for each timezone at this hour
        const category1 = getCategoryForHourInTimezone(i, timezone1);
        const category2 = getCategoryForHourInTimezone(i, timezone2);
        let category3 = 'working-hours'; // Default to working hours if third timezone is hidden
        
        if (showThirdTimezone) {
            category3 = getCategoryForHourInTimezone(i, timezone3);
        }
        
        // Determine overlap status
        let overlapClass = 'no-overlap';
        
        if (showThirdTimezone) {
            // Consider all three timezones
            if (category1 === 'working-hours' && category2 === 'working-hours' && category3 === 'working-hours') {
                // All working hours - full green
                overlapClass = 'full-overlap';
            } else if (
                // At least one working hour and the rest are flexible
                ((category1 === 'working-hours' && (category2 === 'flexible-hours' || category3 === 'flexible-hours')) ||
                (category2 === 'working-hours' && (category1 === 'flexible-hours' || category3 === 'flexible-hours')) ||
                (category3 === 'working-hours' && (category1 === 'flexible-hours' || category2 === 'flexible-hours'))) &&
                // None are off hours
                category1 !== 'off-hours' && category2 !== 'off-hours' && category3 !== 'off-hours'
            ) {
                // Mix of working and flexible - light green
                overlapClass = 'good-overlap';
            } else if (
                // All are at least flexible hours
                (category1 === 'working-hours' || category1 === 'flexible-hours') &&
                (category2 === 'working-hours' || category2 === 'flexible-hours') &&
                (category3 === 'working-hours' || category3 === 'flexible-hours')
            ) {
                // All flexible - yellow
                overlapClass = 'partial-overlap';
            }
        } else {
            // Consider only two timezones
            if (category1 === 'working-hours' && category2 === 'working-hours') {
                // Both working hours - full green
                overlapClass = 'full-overlap';
            } else if (
                // One working hour and one flexible
                ((category1 === 'working-hours' && category2 === 'flexible-hours') ||
                (category2 === 'working-hours' && category1 === 'flexible-hours'))
            ) {
                // Mix of working and flexible - light green
                overlapClass = 'good-overlap';
            } else if (
                // Both are at least flexible hours
                (category1 === 'working-hours' || category1 === 'flexible-hours') &&
                (category2 === 'working-hours' || category2 === 'flexible-hours')
            ) {
                // Both flexible - yellow
                overlapClass = 'partial-overlap';
            }
        }
        
        // Create indicator block
        const indicator = document.createElement('div');
        indicator.className = `time-block ${overlapClass}`;
        indicator.style.left = `${leftPosition}%`;
        indicator.style.width = `${blockWidth}%`;
        indicator.style.cursor = 'pointer';
        indicator.setAttribute('data-hour', i);
        
        // Add title/tooltip
        indicator.title = 'Click to create Outlook meeting';
        
        // Add click event to open Outlook meeting
        indicator.addEventListener('click', function() {
            createOutlookMeeting(i, timezone1, timezone2, timezone3);
        });
        
        overlapIndicator.appendChild(indicator);
    }
}

// Get category for a specific hour in a timezone
function getCategoryForHourInTimezone(hour, timezone) {
    const now = new Date();
    const options = { timeZone: timezone, hour12: false };
    
    // Create a date for today at the specified hour in the target timezone
    const targetDate = new Date(now);
    targetDate.setHours(hour, 0, 0, 0);
    
    // Get the hour in the target timezone
    const timeString = targetDate.toLocaleString('en-US', { ...options, hour: 'numeric' });
    const targetHour = parseInt(timeString.split(':')[0]);
    
    return getTimeCategory(targetHour);
}

// Function to create an Outlook meeting for the selected hour
function createOutlookMeeting(hour, timezone1, timezone2, timezone3) {
    // Get current date
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    
    // Create start and end times (1 hour meeting)
    const startDate = new Date(year, month, day);
    startDate.setHours(hour, 0, 0, 0);
    
    const endDate = new Date(year, month, day);
    endDate.setHours(hour + 1, 0, 0, 0);
    
    // Format dates for Outlook URL in UTC format YYYY-MM-DDTHH:mm:ss
    const formatDateForOutlook = (date) => {
        // Format as YYYY-MM-DDTHH:mm:ss in UTC
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };
    
    const startTime = formatDateForOutlook(startDate);
    const endTime = formatDateForOutlook(endDate);    
    // Create meeting subject with timezone information
    let subject = 'Meeting';
    
    // Get timezone names for the subject
    const getTimezoneName = (tz) => {
        const tzObj = timezoneObjects.find(obj => obj.value === tz);
        if (tzObj) {
            return tzObj.value.split('/').pop().replace(/_/g, ' ');
        }
        return tz;
    };
    
    // Add timezone names to subject
    subject += ` (${getTimezoneName(timezone1)}`;
    subject += `, ${getTimezoneName(timezone2)}`;
    if (showThirdTimezone && timezone3) {
        subject += `, ${getTimezoneName(timezone3)}`;
    }
    subject += ')';
    
    // Create body with timezone information
    let body = 'Please let me know if this schedule works for you.\n';
    body += `We will discuss the following:\n`;
    
    // Create Outlook URL
    const outlookUrl = `https://outlook.office.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}&startdt=${startTime}&enddt=${endTime}`;
    
    // Open in new tab
    window.open(outlookUrl, '_blank');
}
