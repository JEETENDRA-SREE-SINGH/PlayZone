// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    {x: 10, y: 10}
];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let highScore = 0;
let gameRunning = false;
let gameLoop;

// Initialize the game
function initGame() {
    loadHighScore();
    generateFood();
    setupEventListeners();
    updateDisplay();
    drawGame();
}

// Setup event listeners
function setupEventListeners() {
    // Keyboard controls
    document.addEventListener('keydown', handleKeyPress);
    
    // Button controls
    document.getElementById('upBtn').addEventListener('click', () => changeDirection(0, -1));
    document.getElementById('downBtn').addEventListener('click', () => changeDirection(0, 1));
    document.getElementById('leftBtn').addEventListener('click', () => changeDirection(-1, 0));
    document.getElementById('rightBtn').addEventListener('click', () => changeDirection(1, 0));
    
    // Game controls
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('pauseBtn').addEventListener('click', pauseGame);
    document.getElementById('resetBtn').addEventListener('click', resetGame);
    document.getElementById('playAgainBtn').addEventListener('click', playAgain);
}

// Handle keyboard input
function handleKeyPress(e) {
    const key = e.key;
    
    // Prevent default behavior for arrow keys and space
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(key)) {
        e.preventDefault();
    }
    
    // Game controls
    if (key === ' ') {
        if (gameRunning) {
            pauseGame();
        } else {
            startGame();
        }
        return;
    }
    
    // Don't change direction if game is not running
    if (!gameRunning) return;
    
    // Direction controls
    switch (key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            changeDirection(0, -1);
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            changeDirection(0, 1);
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            changeDirection(-1, 0);
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            changeDirection(1, 0);
            break;
    }
}

// Change snake direction
function changeDirection(newDx, newDy) {
    // Prevent reverse direction
    if (newDx === -dx && newDy === -dy) {
        return;
    }
    
    // Prevent changing direction to the same direction
    if (newDx === dx && newDy === dy) {
        return;
    }
    
    dx = newDx;
    dy = newDy;
}

// Start the game
function startGame() {
    if (gameRunning) return;
    
    gameRunning = true;
    document.getElementById('gameStatus').textContent = 'Game Running...';
    document.getElementById('startBtn').disabled = true;
    document.getElementById('pauseBtn').disabled = false;
    
    gameLoop = setInterval(update, 150); // Game speed
}

// Pause the game
function pauseGame() {
    if (!gameRunning) return;
    
    gameRunning = false;
    clearInterval(gameLoop);
    document.getElementById('gameStatus').textContent = 'Game Paused - Press SPACE to continue';
    document.getElementById('startBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
}

// Reset the game
function resetGame() {
    gameRunning = false;
    clearInterval(gameLoop);
    
    // Reset game state
    snake = [{x: 10, y: 10}];
    dx = 0;
    dy = 0;
    score = 0;
    
    generateFood();
    updateDisplay();
    drawGame();
    
    document.getElementById('gameStatus').textContent = 'Press SPACE to start!';
    document.getElementById('startBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
    document.getElementById('gameOverModal').style.display = 'none';
}

// Play again (after game over)
function playAgain() {
    document.getElementById('gameOverModal').style.display = 'none';
    resetGame();
}

// Main game update function
function update() {
    moveSnake();
    
    if (checkCollision()) {
        gameOver();
        return;
    }
    
    if (checkFoodCollision()) {
        score += 10;
        generateFood();
        growSnake();
        updateDisplay();
    }
    
    drawGame();
}

// Move the snake
function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    
    // Remove tail (unless food was eaten)
    if (!checkFoodCollision()) {
        snake.pop();
    }
}

// Check for collisions with walls or self
function checkCollision() {
    const head = snake[0];
    
    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }
    
    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

// Check if snake ate food
function checkFoodCollision() {
    const head = snake[0];
    return head.x === food.x && head.y === food.y;
}

// Grow the snake
function growSnake() {
    // Snake automatically grows because we don't remove the tail in moveSnake()
    // when food is eaten
}

// Generate food at random position
function generateFood() {
    let newFood;
    
    do {
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } while (isSnakePosition(newFood.x, newFood.y));
    
    food = newFood;
}

// Check if position is occupied by snake
function isSnakePosition(x, y) {
    return snake.some(segment => segment.x === x && segment.y === y);
}

// Draw the game
function drawGame() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    ctx.fillStyle = '#00ff00';
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Draw head with different color
            ctx.fillStyle = '#00aa00';
        } else {
            ctx.fillStyle = '#00ff00';
        }
        
        ctx.fillRect(
            segment.x * gridSize, 
            segment.y * gridSize, 
            gridSize - 2, 
            gridSize - 2
        );
        
        // Add shine effect to head
        if (index === 0) {
            ctx.fillStyle = '#88ff88';
            ctx.fillRect(
                segment.x * gridSize + 2, 
                segment.y * gridSize + 2, 
                6, 
                6
            );
        }
    });
    
    // Draw food
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(
        food.x * gridSize, 
        food.y * gridSize, 
        gridSize - 2, 
        gridSize - 2
    );
    
    // Add shine effect to food
    ctx.fillStyle = '#ff8888';
    ctx.fillRect(
        food.x * gridSize + 2, 
        food.y * gridSize + 2, 
        6, 
        6
    );
}

// Update display elements
function updateDisplay() {
    document.getElementById('score').textContent = score;
    document.getElementById('highScore').textContent = highScore;
}

// Game over
function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    
    // Check for high score
    let isNewHighScore = false;
    if (score > highScore) {
        highScore = score;
        saveHighScore();
        isNewHighScore = true;
    }
    
    // Show game over modal
    document.getElementById('finalScore').textContent = score;
    document.getElementById('newHighScore').style.display = isNewHighScore ? 'block' : 'none';
    document.getElementById('gameOverModal').style.display = 'block';
    
    // Reset buttons
    document.getElementById('startBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
    document.getElementById('gameStatus').textContent = 'Game Over!';
    
    updateDisplay();
}

// Save high score to localStorage
function saveHighScore() {
    localStorage.setItem('snakeHighScore', highScore.toString());
}

// Load high score from localStorage
function loadHighScore() {
    const saved = localStorage.getItem('snakeHighScore');
    if (saved) {
        highScore = parseInt(saved);
    }
}

// Add visual feedback for button presses
function addButtonFeedback() {
    const buttons = document.querySelectorAll('.control-btn, .game-btn');
    buttons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(2px)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = '';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// Prevent context menu on right click (for mobile)
canvas.addEventListener('contextmenu', e => e.preventDefault());

// Touch controls for mobile
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchmove', handleTouchMove, false);

function handleTouchStart(e) {
    e.preventDefault();
    const firstTouch = e.touches[0];
    touchStartX = firstTouch.clientX;
    touchStartY = firstTouch.clientY;
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!touchStartX || !touchStartY || !gameRunning) {
        return;
    }
    
    const xUp = e.touches[0].clientX;
    const yUp = e.touches[0].clientY;
    
    const xDiff = touchStartX - xUp;
    const yDiff = touchStartY - yUp;
    
    // Minimum swipe distance
    if (Math.abs(xDiff) < 10 && Math.abs(yDiff) < 10) {
        return;
    }
    
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        // Horizontal swipe
        if (xDiff > 0) {
            changeDirection(-1, 0); // Left
        } else {
            changeDirection(1, 0);  // Right
        }
    } else {
        // Vertical swipe
        if (yDiff > 0) {
            changeDirection(0, -1); // Up
        } else {
            changeDirection(0, 1);  // Down
        }
    }
    
    touchStartX = 0;
    touchStartY = 0;
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    initGame();
    addButtonFeedback();
});