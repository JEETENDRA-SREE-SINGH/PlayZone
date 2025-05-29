// Game state
let gameSequence = [];
let playerSequence = [];
let level = 1;
let score = 0;
let bestScore = parseInt(localStorage.getItem('simonBestScore')) || 0;
let isPlaying = false;
let isShowingSequence = false;
let currentSequenceIndex = 0;

// Game settings
const colors = ['red', 'blue', 'yellow', 'green'];
const sounds = {
    red: 261.63,    // C4
    blue: 329.63,   // E4
    yellow: 392.00, // G4
    green: 523.25   // C5
};

// Difficulty settings
const difficulty = {
    easy: 1500,
    medium: 1000,
    hard: 700,
    expert: 500
};

// DOM elements
const levelEl = document.getElementById('level');
const scoreEl = document.getElementById('score');
const bestScoreEl = document.getElementById('bestScore');
const statusMessageEl = document.getElementById('statusMessage');
const progressFillEl = document.getElementById('progressFill');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const helpBtn = document.getElementById('helpBtn');
const helpModal = document.getElementById('helpModal');
const closeHelpBtn = document.getElementById('closeHelpBtn');
const difficultySelect = document.getElementById('difficultySelect');
const simonButtons = document.querySelectorAll('.simon-button');

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
    loadBestScore();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetGame);
    helpBtn.addEventListener('click', showHelp);
    closeHelpBtn.addEventListener('click', hideHelp);
    
    // Simon button listeners
    simonButtons.forEach(button => {
        button.addEventListener('click', handleButtonClick);
    });
    
    // Modal close on outside click
    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) hideHelp();
    });
    
    // Keyboard support
    document.addEventListener('keydown', handleKeyPress);
}

// Handle keyboard input
function handleKeyPress(e) {
    if (!isPlaying || isShowingSequence) return;
    
    const keyMap = {
        '1': 'red',
        '2': 'blue', 
        '3': 'yellow',
        '4': 'green'
    };
    
    const color = keyMap[e.key];
    if (color) {
        const button = document.getElementById(color + 'Button');
        handleButtonClick({ target: button });
    }
}

// Start new game
function startGame() {
    if (isPlaying) return;
    
    isPlaying = true;
    gameSequence = [];
    playerSequence = [];
    level = 1;
    score = 0;
    
    updateDisplay();
    updateStatus('Get ready...', 'playing');
    disableButtons();
    
    setTimeout(() => {
        nextLevel();
    }, 1000);
}

// Reset game
function resetGame() {
    isPlaying = false;
    isShowingSequence = false;
    gameSequence = [];
    playerSequence = [];
    level = 1;
    score = 0;
    currentSequenceIndex = 0;
    
    updateDisplay();
    updateStatus('Press START to begin!');
    enableButtons();
    clearButtonStates();
    updateProgress(0);
}

// Next level
function nextLevel() {
    level++;
    playerSequence = [];
    currentSequenceIndex = 0;
    
    // Add new color to sequence
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    gameSequence.push(randomColor);
    
    updateDisplay();
    updateProgress(0);
    
    setTimeout(() => {
        showSequence();
    }, 500);
}

// Show sequence to player
function showSequence() {
    isShowingSequence = true;
    updateStatus(`Level ${level} - Watch carefully!`, 'playing');
    disableButtons();
    
    let sequenceIndex = 0;
    const interval = getCurrentDifficulty();
    
    const showNext = () => {
        if (sequenceIndex < gameSequence.length) {
            const color = gameSequence[sequenceIndex];
            flashButton(color);
            sequenceIndex++;
            setTimeout(showNext, interval);
        } else {
            // Sequence complete
            setTimeout(() => {
                isShowingSequence = false;
                updateStatus(`Your turn! Repeat the sequence (${gameSequence.length} buttons)`, 'playing');
                enableButtons();
            }, 500);
        }
    };
    
    showNext();
}

// Flash button
function flashButton(color) {
    const button = document.getElementById(color + 'Button');
    button.classList.add('active', 'flash');
    playSound(color);
    
    setTimeout(() => {
        button.classList.remove('active', 'flash');
    }, getCurrentDifficulty() * 0.6);
}

// Handle button click
function handleButtonClick(e) {
    if (!isPlaying || isShowingSequence) return;
    
    const button = e.target.closest('.simon-button');
    if (!button) return;
    
    const color = button.dataset.color;
    playerSequence.push(color);
    
    // Visual feedback
    button.classList.add('active');
    playSound(color);
    
    setTimeout(() => {
        button.classList.remove('active');
    }, 200);
    
    // Check if correct
    const currentIndex = playerSequence.length - 1;
    if (playerSequence[currentIndex] !== gameSequence[currentIndex]) {
        // Wrong button
        gameOver();
        return;
    }
    
    // Update progress
    updateProgress((playerSequence.length / gameSequence.length) * 100);
    
    // Check if sequence complete
    if (playerSequence.length === gameSequence.length) {
        // Level complete
        score += level * 10;
        updateDisplay();
        
        setTimeout(() => {
            if (level < 20) {
                nextLevel();
            } else {
                // Game won
                gameWon();
            }
        }, 1000);
    }
}

// Game over
function gameOver() {
    isPlaying = false;
    updateStatus('Game Over! Wrong sequence.', 'error');
    disableButtons();
    
    // Update best score
    if (score > bestScore) {
        bestScore = score;
        saveBestScore();
        updateStatus(`New Best Score: ${bestScore}! Game Over.`, 'error');
    }
    
    updateDisplay();
    
    // Flash all buttons red
    simonButtons.forEach(button => {
        button.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a52)';
    });
    
    setTimeout(() => {
        clearButtonStates();
        enableButtons();
    }, 2000);
}

// Game won
function gameWon() {
    isPlaying = false;
    updateStatus('Congratulations! You completed all 20 levels!', 'playing');
    
    score += 1000; // Bonus for completing
    if (score > bestScore) {
        bestScore = score;
        saveBestScore();
    }
    
    updateDisplay();
    
    // Flash all buttons gold
    simonButtons.forEach(button => {
        button.style.background = 'linear-gradient(135deg, #ffe66d, #ffcc02)';
    });
    
    setTimeout(() => {
        clearButtonStates();
        enableButtons();
    }, 3000);
}

// Utility functions
function getCurrentDifficulty() {
    return difficulty[difficultySelect.value];
}

function updateDisplay() {
    levelEl.textContent = level;
    scoreEl.textContent = score;
    bestScoreEl.textContent = bestScore;
}

function updateStatus(message, type = '') {
    statusMessageEl.textContent = message;
    statusMessageEl.className = `status-message ${type}`;
}

function updateProgress(percentage) {
    progressFillEl.style.width = `${percentage}%`;
}

function disableButtons() {
    simonButtons.forEach(button => {
        button.classList.add('disabled');
    });
}

function enableButtons() {
    simonButtons.forEach(button => {
        button.classList.remove('disabled');
    });
}

function clearButtonStates() {
    simonButtons.forEach(button => {
        button.classList.remove('active', 'flash');
        button.style.background = '';
    });
}

function loadBestScore() {
    bestScoreEl.textContent = bestScore;
}

function saveBestScore() {
    localStorage.setItem('simonBestScore', bestScore.toString());
}

// Sound system
let audioContext;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSound(color) {
    try {
        initAudio();
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(sounds[color], audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
        // Fallback for browsers without Web Audio API
        console.log('Audio not supported');
    }
}

// Help modal functions
function showHelp() {
    helpModal.classList.add('show');
}

function hideHelp() {
    helpModal.classList.remove('show');
}

// Start audio context on first user interaction
document.addEventListener('click', () => {
    initAudio();
}, { once: true });