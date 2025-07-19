const canvas = document.getElementById('shapesCanvas');
const ctx = canvas.getContext('2d');

const colors = [
    '#FF0000', // Bright Red
    '#00FF00', // Bright Green
    '#0000FF', // Bright Blue
    '#FF00FF', // Bright Magenta
    '#00FFFF', // Bright Cyan
    '#FFFF00', // Bright Yellow
    '#FF4500', // Bright Orange
    '#FF1493', // Deep Pink
    '#7FFF00', // Bright Lime
    '#00FF7F'  // Spring Green
];

const shapes = ['circle', 'half-circle', 'crescent', 'square', 'rectangle', 'triangle', 'rhombus', 'pentagon', 'hexagon', 'star', 'heart'];
let currentShapeIndex = 0;

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function drawCircle(x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawSquare(x, y, size) {
    ctx.beginPath();
    ctx.rect(x - size/2, y - size/2, size, size);
    ctx.fill();
}

function drawRectangle(x, y, size) {
    ctx.beginPath();
    ctx.rect(x - size/2, y - size/3, size, size * 0.66);
    ctx.fill();
}

function drawRhombus(x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y - size/2);  // Top point
    ctx.lineTo(x + size/2, y);  // Right point
    ctx.lineTo(x, y + size/2);  // Bottom point
    ctx.lineTo(x - size/2, y);  // Left point
    ctx.closePath();
    ctx.fill();
}

function drawPentagon(x, y, size) {
    const sides = 5;
    const radius = size/2;
    const rotation = -Math.PI/2; // Rotate to point up
    
    ctx.beginPath();
    ctx.moveTo(
        x + radius * Math.cos(rotation),
        y + radius * Math.sin(rotation)
    );
    
    for (let i = 1; i <= sides; i++) {
        const angle = rotation + (i * 2 * Math.PI) / sides;
        ctx.lineTo(
            x + radius * Math.cos(angle),
            y + radius * Math.sin(angle)
        );
    }
    
    ctx.closePath();
    ctx.fill();
}

function drawHexagon(x, y, size) {
    const sides = 6;
    const radius = size/2;
    const rotation = 0; // Flat sides on top/bottom
    
    ctx.beginPath();
    ctx.moveTo(
        x + radius * Math.cos(rotation),
        y + radius * Math.sin(rotation)
    );
    
    for (let i = 1; i <= sides; i++) {
        const angle = rotation + (i * 2 * Math.PI) / sides;
        ctx.lineTo(
            x + radius * Math.cos(angle),
            y + radius * Math.sin(angle)
        );
    }
    
    ctx.closePath();
    ctx.fill();
}

function drawTriangle(x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y - size/2);
    ctx.lineTo(x + size/2, y + size/2);
    ctx.lineTo(x - size/2, y + size/2);
    ctx.closePath();
    ctx.fill();
}

function drawStar(x, y, size) {
    const spikes = 5;
    const outerRadius = size/2;
    const innerRadius = size/4;
    
    ctx.beginPath();
    for(let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / spikes;
        if(i === 0) {
            ctx.moveTo(x + radius * Math.cos(angle - Math.PI/2), 
                      y + radius * Math.sin(angle - Math.PI/2));
        } else {
            ctx.lineTo(x + radius * Math.cos(angle - Math.PI/2), 
                      y + radius * Math.sin(angle - Math.PI/2));
        }
    }
    ctx.closePath();
    ctx.fill();
}

function drawHalfCircle(x, y, size) {
    ctx.beginPath();
    ctx.arc(x, y, size/2, 0, Math.PI, false);
    ctx.fill();
}

function drawCrescent(x, y, size) {
    const radius = size/2;
    
    ctx.beginPath();
    // Outer circle
    ctx.arc(x, y, radius, -Math.PI/2, Math.PI/2, false);
    // Inner circle (shifted right and slightly smaller)
    ctx.arc(x + radius * 0.5, y, radius * 0.95, Math.PI/2, -Math.PI/2, true);
    ctx.closePath();
    ctx.fill();
}

function drawHeart(x, y, size) {
    // Make heart bigger than other shapes
    const width = size * 1.3;
    const height = size * 1.3;
    
    ctx.beginPath();
    
    // Move to bottom point
    ctx.moveTo(x, y + height/3);
    
    // Left curve
    ctx.quadraticCurveTo(
        x - width/2, y,           // Control point
        x - width/2, y - height/4  // End point
    );
    
    // Top left curve
    ctx.quadraticCurveTo(
        x - width/2, y - height/1.5,  // Control point
        x, y - height/2              // End point
    );
    
    // Top right curve
    ctx.quadraticCurveTo(
        x + width/2, y - height/1.5,  // Control point
        x + width/2, y - height/4     // End point
    );
    
    // Right curve
    ctx.quadraticCurveTo(
        x + width/2, y,  // Control point
        x, y + height/3  // End point
    );
    
    ctx.fill();
}


function drawCurrentShape() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getRandomColor();
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseSize = 150;
    
    const shape = shapes[currentShapeIndex];
    // Adjust size based on shape
    const size = shape === 'circle' ? baseSize : baseSize * 1.4;
    
    switch(shape) {
        case 'circle':
            drawCircle(centerX, centerY, size);
            break;
        case 'half-circle':
            drawHalfCircle(centerX, centerY, size);
            break;
        case 'crescent':
            drawCrescent(centerX, centerY, size);
            break;
        case 'square':
            drawSquare(centerX, centerY, size);
            break;
        case 'rectangle':
            drawRectangle(centerX, centerY, size);
            break;
        case 'triangle':
            drawTriangle(centerX, centerY, size);
            break;
        case 'rhombus':
            drawRhombus(centerX, centerY, size);
            break;
        case 'pentagon':
            drawPentagon(centerX, centerY, size);
            break;
        case 'hexagon':
            drawHexagon(centerX, centerY, size);
            break;
        case 'star':
            drawStar(centerX, centerY, size);
            break;
        case 'heart':
            drawHeart(centerX, centerY, size);
            break;
    }
}

function prevShape() {
    currentShapeIndex = (currentShapeIndex - 1 + shapes.length) % shapes.length;
    drawCurrentShape();
}

function nextShape() {
    currentShapeIndex = (currentShapeIndex + 1) % shapes.length;
    drawCurrentShape();
}

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowLeft':
            prevShape();
            break;
        case 'ArrowRight':
            nextShape();
            break;
    }
});

// Initialize with first shape
drawCurrentShape();
