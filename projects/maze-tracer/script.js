const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Maze properties
const gridSize = 4; // 4x4 grid for simple mazes
let cellSize = canvas.width / gridSize; // This will be updated in resizeCanvas
let maze = [];
let obstacles = [];
let pathColor = '#FF9800';
let obstacleColor = '#E91E63';
let showObstacles = false;

// Get UI elements
const toggleButton = document.getElementById('toggleObstacles');

// Initialize
function init() {
    // Make canvas responsive
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

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

function resizeCanvas() {
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth;
    
    // Make canvas square based on container width
    canvas.width = containerWidth;
    canvas.height = containerWidth;
    
    // Reset any transformations
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    // Calculate cell size based on canvas width
    cellSize = containerWidth / gridSize;
    
    // Redraw the current maze
    if (maze.length > 0) {
        drawMaze();
    }
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
    
    // Generate a simple path with some curves and obstacles
    const mazeTypes = [
        {
            path: [[0,1], [1,1], [2,1], [3,1]], // Straight path
            obstacles: [
                { start: [1,2], end: [2,2] }, // Horizontal line right of path
                { start: [1,0], end: [2,0] }  // Horizontal line left of path
            ]
        },
        {
            path: [[0,2], [1,2], [1,1], [2,1], [2,0], [3,0]], // S-shaped path
            obstacles: [
                { start: [0,3], end: [1,3] }, // Right edge line
                { start: [2,2], end: [3,2] }  // Middle blocking line
            ]
        },
        {
            path: [[0,0], [1,1], [2,0], [3,1]], // Zigzag path
            obstacles: [
                { start: [1,2], end: [2,2] }, // Right side block
                { start: [0,3], end: [3,3] }  // Far right vertical line
            ]
        },
        {
            path: [[0,1], [1,1], [2,1], [2,2], [2,3]], // L-shaped path
            obstacles: [
                { start: [0,0], end: [2,0] }, // Top horizontal line
                { start: [3,1], end: [3,3] }  // Bottom right block
            ]
        }
    ];
    
    const selectedMaze = mazeTypes[Math.floor(Math.random() * mazeTypes.length)];
    maze = selectedMaze.path;
    obstacles = selectedMaze.obstacles;
}

// Draw the maze
function toggleObstacles() {
    showObstacles = !showObstacles;
    toggleButton.innerHTML = showObstacles ? 
        '<i class="fa fa-eye-slash"></i> Hide Obstacles' :
        '<i class="fa fa-eye"></i> Show Obstacles';
    drawMaze();
}

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
    
    // Draw obstacles with crossed lines
    if (showObstacles) {
        ctx.strokeStyle = obstacleColor;
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        
        obstacles.forEach(obstacle => {
        const startX = (obstacle.start[1] + 0.5) * cellSize;
        const startY = (obstacle.start[0] + 0.5) * cellSize;
        const endX = (obstacle.end[1] + 0.5) * cellSize;
        const endY = (obstacle.end[0] + 0.5) * cellSize;
        
        // Main line
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Add cross lines
        const crossSize = 20;
        const dx = endX - startX;
        const dy = endY - startY;
        const length = Math.sqrt(dx * dx + dy * dy);
        const numCrosses = Math.floor(length / (crossSize * 2));
        const angle = Math.atan2(dy, dx);
        
        for (let i = 1; i <= numCrosses; i++) {
            const t = i / (numCrosses + 1);
            const crossX = startX + dx * t;
            const crossY = startY + dy * t;
            
            // Draw X shape
            ctx.beginPath();
            ctx.moveTo(crossX - crossSize/2 * Math.cos(angle - Math.PI/4),
                      crossY - crossSize/2 * Math.sin(angle - Math.PI/4));
            ctx.lineTo(crossX + crossSize/2 * Math.cos(angle - Math.PI/4),
                      crossY + crossSize/2 * Math.sin(angle - Math.PI/4));
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(crossX - crossSize/2 * Math.cos(angle + Math.PI/4),
                      crossY - crossSize/2 * Math.sin(angle + Math.PI/4));
            ctx.lineTo(crossX + crossSize/2 * Math.cos(angle + Math.PI/4),
                      crossY + crossSize/2 * Math.sin(angle + Math.PI/4));
            ctx.stroke();
        }
    });
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
