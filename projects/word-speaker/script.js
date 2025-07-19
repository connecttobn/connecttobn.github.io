const wordSets = {
    'two': [
        // Two letter words
        'up', 'on', 'in', 'at', 'to', 'go', 'no', 'so', 'by', 'my',
        'hi', 'me', 'we', 'he', 'be', 'do', 'it', 'is', 'am', 'an'
    ],
    'three-easy': [
        // Simple three letter words
        'cat', 'dog', 'pig', 'hat', 'bat', 'rat', 'sun', 'fun', 'run', 'cup',
        'map', 'nap', 'tap', 'red', 'bed', 'fox', 'box', 'jam', 'ham', 'dad',
        'mom', 'car', 'bus', 'toy', 'day'
    ],
    'three-medium': [
        // More three letter words
        'bag', 'big', 'bug', 'can', 'cap', 'cut', 'dig', 'dot', 'egg', 'fan',
        'fit', 'get', 'got', 'gym', 'had', 'hop', 'hot', 'hut', 'ink', 'jar',
        'jog', 'key', 'kid', 'leg', 'let', 'lid', 'log', 'man', 'mix', 'net'
    ],
    'three-hard': [
        // Challenge words
        'ask', 'buy', 'cry', 'dry', 'fly', 'fry', 'gym', 'joy', 'pay', 'shy',
        'sky', 'spy', 'try', 'way', 'why', 'bow', 'cow', 'how', 'now', 'owl',
        'raw', 'saw', 'new', 'yam', 'yes', 'yet', 'you', 'zip', 'zoo', 'zap'
    ]
};

let currentDifficulty = 'two';
let currentIndex = 0;
const wordElement = document.getElementById('currentWord');

function setDifficulty(level) {
    currentDifficulty = level;
    currentIndex = 0;
    updateDisplay();
}

// Speech synthesis setup
const speechSynthesis = window.speechSynthesis;
let speaking = false;

function speakWord() {
    if (speaking) return;
    
    const word = wordSets[currentDifficulty][currentIndex];
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.8; // Slightly slower for clarity
    utterance.pitch = 1.2; // Slightly higher pitch for child-friendly voice
    
    speaking = true;
    utterance.onend = () => {
        speaking = false;
    };
    
    speechSynthesis.speak(utterance);
}

function updateDisplay() {
    wordElement.textContent = wordSets[currentDifficulty][currentIndex];
}

function nextWord() {
    currentIndex = (currentIndex + 1) % wordSets[currentDifficulty].length;
    updateDisplay();
}

function prevWord() {
    currentIndex = (currentIndex - 1 + wordSets[currentDifficulty].length) % wordSets[currentDifficulty].length;
    updateDisplay();
}

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowLeft':
            prevWord();
            break;
        case 'ArrowRight':
            nextWord();
            break;
        case ' ': // Spacebar
            speakWord();
            e.preventDefault();
            break;
    }
});

// Initialize
updateDisplay();
