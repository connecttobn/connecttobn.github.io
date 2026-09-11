const canvas = document.getElementById('tracingCanvas');
const ctx = canvas.getContext('2d');
let currentMode = 'uppercase';
let currentIndex = 0;

const characters = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    lowercase: 'abcdefghijklmnopqrstuvwxyz'.split(''),
    numbers: '0123456789'.split(''),
    kannada: 'ಅ ಆ ಇ ಈ ಉ ಊ ಋ ಎ ಏ ಐ ಒ ಓ ಔ ಅಂ ಅಃ ಕ ಖ ಗ ಘ ಙ ಚ ಛ ಜ ಝ ಞ ಟ ಠ ಡ ಢ ಣ ತ ಥ ದ ಧ ನ ಪ ಫ ಬ ಭ ಮ ಯ ರ ಲ ವ ಶ ಷ ಸ ಹ ಳ'.split(' '),
    shapes: ['square', 'circle', 'triangle', 'rectangle', 'star']
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
    const item = characters[currentMode][currentIndex];
    
    if (currentMode === 'shapes') {
        drawShape(item);
    } else {
        // Draw dotted letter
        const fontSize = currentMode === 'kannada' ? 200 : 300;
        ctx.font = `${fontSize}px ${currentMode === 'kannada' ? 'Noto Sans Kannada' : 'Arial'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeText(item, canvas.width/2, canvas.height/2);
    }
}

function drawShape(shape) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const size = 200;
    
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    switch(shape) {
        case 'square':
            ctx.beginPath();
            ctx.rect(centerX - size/2, centerY - size/2, size, size);
            ctx.stroke();
            break;
            
        case 'circle':
            ctx.beginPath();
            ctx.arc(centerX, centerY, size/2, 0, Math.PI * 2);
            ctx.stroke();
            break;
            
        case 'triangle':
            ctx.beginPath();
            ctx.moveTo(centerX, centerY - size/2);
            ctx.lineTo(centerX - size/2, centerY + size/2);
            ctx.lineTo(centerX + size/2, centerY + size/2);
            ctx.closePath();
            ctx.stroke();
            break;
            
        case 'rectangle':
            ctx.beginPath();
            ctx.rect(centerX - size*0.6, centerY - size/3, size*1.2, size*0.66);
            ctx.stroke();
            break;
            
        case 'star':
            ctx.beginPath();
            const spikes = 5;
            const outerRadius = size/2;
            const innerRadius = size/4;
            
            for(let i = 0; i < spikes * 2; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const angle = (i * Math.PI) / spikes;
                if(i === 0) {
                    ctx.moveTo(centerX + radius * Math.cos(angle - Math.PI/2),
                             centerY + radius * Math.sin(angle - Math.PI/2));
                } else {
                    ctx.lineTo(centerX + radius * Math.cos(angle - Math.PI/2),
                             centerY + radius * Math.sin(angle - Math.PI/2));
                }
            }
            ctx.closePath();
            ctx.stroke();
            break;
    }
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
    const rect = canvas.getBoundingClientRect();
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
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

function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function startDrawing(e) {
    isDrawing = true;
    const coords = getCoordinates(e);
    [lastX, lastY] = [coords.x, coords.y];
}

function draw(e) {
    if (!isDrawing) return;
    
    const coords = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(coords.x, coords.y);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.setLineDash([]);
    ctx.stroke();
    
    [lastX, lastY] = [coords.x, coords.y];
}

function stopDrawing() {
    isDrawing = false;
}

// Initialize with first letter
drawLetter();
