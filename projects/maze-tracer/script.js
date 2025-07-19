const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Maze properties
const gridSize = 4; // 4x4 grid for simple mazes
const cellSize = canvas.width / gridSize;
let maze = [];
let pathColor = '#FF9800';

// Initialize
function init() {
    // Set up touch and mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
    
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);
    
    newMaze();
}

// Event handlers
function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    if (e.type === 'touchstart') {
        isDrawing = true;
        [lastX, lastY] = [x, y];
    } else if (e.type === 'touchmove' && isDrawing) {
        drawLine(x, y);
    }
}

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
    if (!isDrawing) return;
    drawLine(e.offsetX, e.offsetY);
}

function drawLine(x, y) {
    ctx.beginPath();
    ctx.strokeStyle = pathColor;
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    [lastX, lastY] = [x, y];
}

function stopDrawing() {
    isDrawing = false;
}

// Generate new maze
function newMaze() {
    clearCanvas();
    generateMaze();
    drawMaze();
}

// Clear the path but keep the maze
function clearPath() {
    drawMaze();
}

// Clear everything and redraw maze
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Generate a simple maze suitable for young children
function generateMaze() {
    maze = [];
    
    // Create a simple path with some curves
    const pathTypes = [
        // Straight path from top to bottom
        [[0,1], [1,1], [2,1], [3,1]],
        // S-shaped path
        [[0,2], [1,2], [1,1], [2,1], [2,0], [3,0]],
        // Zigzag path
        [[0,0], [1,1], [2,0], [3,1]],
        // L-shaped path
        [[0,1], [1,1], [2,1], [2,2], [2,3]]
    ];
    
    maze = pathTypes[Math.floor(Math.random() * pathTypes.length)];
}

// Draw the maze
function drawMaze() {
    clearCanvas();
    
    // Draw background
    ctx.fillStyle = '#E0F2F1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#B2DFDB';
    ctx.lineWidth = 2;
    for (let i = 0; i <= gridSize; i++) {
        const pos = i * cellSize;
        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, pos);
        ctx.lineTo(canvas.width, pos);
        ctx.stroke();
    }
    
    // Draw path hints
    ctx.strokeStyle = '#80CBC4';
    ctx.lineWidth = 30;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Draw start and end markers
    const startCell = maze[0];
    const endCell = maze[maze.length - 1];
    
    // Draw start marker (green circle)
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.arc(
        (startCell[1] + 0.5) * cellSize,
        (startCell[0] + 0.5) * cellSize,
        20, 0, Math.PI * 2
    );
    ctx.fill();
    
    // Draw end marker (red star)
    const centerX = (endCell[1] + 0.5) * cellSize;
    const centerY = (endCell[0] + 0.5) * cellSize;
    drawStar(centerX, centerY, 25, '#F44336');
}

// Helper function to draw a star
function drawStar(cx, cy, size, color) {
    const spikes = 5;
    const outerRadius = size;
    const innerRadius = size / 2;
    
    ctx.beginPath();
    ctx.fillStyle = color;
    
    for(let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / spikes - Math.PI / 2;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        
        if(i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.closePath();
    ctx.fill();
}

// Start the game
init();
