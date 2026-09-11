function createToolHeader(currentTool) {
    const header = document.createElement('div');
    header.className = 'w3-container w3-teal';
    header.innerHTML = `
        <div class="w3-bar w3-large" style="width: 100%; display: flex; justify-content: left; text-align: left">
            <a href="/" class="w3-bar-item w3-button">Home</a>
            <a href="/projects/" class="w3-bar-item w3-button">Projects</a>
            <div class="w3-dropdown-click" style="display: inline-block;">
                <button class="w3-button w3-text-white dropdown-button">
                    <span class="current-tool">Projects</span> <i class="fa fa-caret-down"></i>
                </button> 
                <div id="toolDropdown" class="w3-dropdown-content w3-bar-block w3-card-4 w3-medium" style="z-index: 9999; margin-top: 0;">
                    <div class="w3-container w3-text-black" style="padding: 8px">
                        <strong>Developer Tools</strong>
                    </div>
                    <a href="/projects/timezone-finder/" class="w3-bar-item w3-button ${currentTool === 'timezone-finder' ? 'w3-pale-blue' : ''}">Timezone Meeting Finder</a>
                    <a href="/projects/json-formatter/" class="w3-bar-item w3-button ${currentTool === 'json-formatter' ? 'w3-pale-blue' : ''}">JSON Formatter</a>
                    <a href="/projects/encoder-decoder/" class="w3-bar-item w3-button ${currentTool === 'encoder-decoder' ? 'w3-pale-blue' : ''}">Encoder Decoder</a>
                    <a href="/projects/text-diff/" class="w3-bar-item w3-button ${currentTool === 'text-diff' ? 'w3-pale-blue' : ''}">Text Difference</a>
                    <a href="/projects/qr-code-generator/" class="w3-bar-item w3-button ${currentTool === 'qr-code-generator' ? 'w3-pale-blue' : ''}">QR Code Generator</a>
                    <a href="https://github.com/connecttobn/chrome-todo-tracker" target="_blank" class="w3-bar-item w3-button ${currentTool === 'chrome-todo-tracker' ? 'w3-pale-blue' : ''}">Chrome Todo Tracker</a>
                    
                    <div class="w3-container w3-text-black" style="padding: 8px">
                        <strong>General Tools</strong>
                    </div>
                    <a href="/projects/password-generator/" class="w3-bar-item w3-button ${currentTool === 'password-generator' ? 'w3-pale-blue' : ''}">Password Generator</a>
                    <a href="/projects/event-countdown/" class="w3-bar-item w3-button ${currentTool === 'event-countdown' ? 'w3-pale-blue' : ''}">Event Countdown</a>
                    <a href="/projects/unit-converter/" class="w3-bar-item w3-button ${currentTool === 'unit-converter' ? 'w3-pale-blue' : ''}">Unit Converter</a>
                    <a href="/projects/bmi-calculator/" class="w3-bar-item w3-button ${currentTool === 'bmi-calculator' ? 'w3-pale-blue' : ''}">BMI Calculator</a>
                    <a href="/projects/emi-calculator/" class="w3-bar-item w3-button ${currentTool === 'emi-calculator' ? 'w3-pale-blue' : ''}">EMI Calculator</a>
                    
                    <div class="w3-container w3-text-black" style="padding: 8px">
                        <strong>Kids Learning</strong>
                    </div>
                    <a href="/projects/alphabet-tracer/" class="w3-bar-item w3-button ${currentTool === 'alphabet-tracer' ? 'w3-pale-blue' : ''}">Alphabet Tracer</a>
                    <a href="/projects/shapes/" class="w3-bar-item w3-button ${currentTool === 'shapes' ? 'w3-pale-blue' : ''}">Colorful Shapes</a>
                    <a href="/projects/word-speaker/" class="w3-bar-item w3-button ${currentTool === 'word-speaker' ? 'w3-pale-blue' : ''}">Word Speaker</a>
                    <a href="/projects/maze-tracer/" class="w3-bar-item w3-button ${currentTool === 'maze-tracer' ? 'w3-pale-blue' : ''}">Maze Tracer</a>
                </div>
            </div>

        </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .w3-dropdown-content {
            max-height: 80vh;
            overflow-y: auto;
            z-index: 9999;
        }
        .w3-dropdown-content .w3-container {
            background-color: #f1f1f1;
            margin-top: 8px;
        }
        .w3-dropdown-content .w3-container:first-child {
            margin-top: 0;
        }
        .w3-dropdown-hover:hover .w3-dropdown-content {
            z-index: 9999;
        }
        .w3-dropdown-content {
            max-height: 80vh;
            overflow-y: auto;
            z-index: 9999;
            position: fixed;
            margin-left: -100px;
        }
        .w3-dropdown-content .w3-container {
            background-color: #f1f1f1;
            margin-top: 8px;
        }
        .w3-dropdown-content .w3-container:first-child {
            margin-top: 0;
        }
        .w3-dropdown-content.show {
            display: block;
        }
    `;
    document.head.appendChild(style);

    // Update current tool name
    const toolNames = {
        'json-formatter': 'JSON Formatter',
        'encoder-decoder': 'Encoder Decoder',
        'text-diff': 'Text Difference',
        'timezone-finder': 'Timezone Meeting Finder',
        'qr-code-generator': 'QR Code Generator',
        'password-generator': 'Password Generator',
        'event-countdown': 'Event Countdown',
        'unit-converter': 'Unit Converter',
        'bmi-calculator': 'BMI Calculator',
        'emi-calculator': 'EMI Calculator',
        'alphabet-tracer': 'Alphabet Tracer',
        'shapes': 'Colorful Shapes',
        'word-speaker': 'Word Speaker',
        'maze-tracer': 'Maze Tracer',
        'chrome-todo-tracker': 'Chrome Todo Tracker'
    };

    if (currentTool && toolNames[currentTool]) {
        const currentToolSpan = header.querySelector('.current-tool');
        if (currentToolSpan) {
            currentToolSpan.textContent = toolNames[currentTool] + '';
        }
    }

    // Add click handler for dropdown
    const dropdownButton = header.querySelector('.dropdown-button');
    const dropdown = header.querySelector('#toolDropdown');
    
    if (dropdownButton && dropdown) {
        dropdownButton.addEventListener('click', function(event) {
            event.stopPropagation();
            dropdown.classList.toggle('show');
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInside = dropdownButton?.contains(event.target);
        if (!isClickInside && dropdown) {
            dropdown.classList.remove('show');
        }
    });

    return header;
}
