const canvas = document.getElementById('tracingCanvas');
const ctx = canvas.getContext('2d');
let currentMode = 'uppercase';
let currentIndex = 0;

const characters = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    lowercase: 'abcdefghijklmnopqrstuvwxyz'.split(''),
    numbers: '0123456789'.split(''),
    kannada: 'ಅ ಆ ಇ ಈ ಉ ಊ ಋ ಎ ಏ ಐ ಒ ಓ ಔ ಅಂ ಅಃ ಕ ಖ ಗ ಘ ಙ ಚ ಛ ಜ ಝ ಞ ಟ ಠ ಡ ಢ ಣ ತ ಥ ದ ಧ ನ ಪ ಫ ಬ ಭ ಮ ಯ ರ ಲ ವ ಶ ಷ ಸ ಹ ಳ'.split(' ')
};

let isDrawing = false;
let lastX = 0;
let lastY = 0;

function setMode(mode) {
    currentMode = mode;
    currentIndex = 0;
    drawLetter();
}

function drawLetter() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const letter = characters[currentMode][currentIndex];
    
    // Draw dotted letter
    const fontSize = currentMode === 'kannada' ? 200 : 300;
    ctx.font = `${fontSize}px ${currentMode === 'kannada' ? 'Noto Sans Kannada' : 'Arial'}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeText(letter, canvas.width/2, canvas.height/2);
}



function nextLetter() {
    currentIndex = (currentIndex + 1) % characters[currentMode].length;
    drawLetter();
}

function prevLetter() {
    currentIndex = (currentIndex - 1 + characters[currentMode].length) % characters[currentMode].length;
    drawLetter();
}

function clearCanvas() {
    drawLetter();
}

// Drawing functionality
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Touch support
canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchend', e => {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
});

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
    if (!isDrawing) return;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.setLineDash([]);
    ctx.stroke();
    
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function stopDrawing() {
    isDrawing = false;
}

// Initialize with first letter
drawLetter();
