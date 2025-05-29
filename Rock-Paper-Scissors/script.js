// Game state
let playerScore = 0;
let computerScore = 0;

// Game choices with emojis
const choices = {
    rock: '🪨',
    paper: '📄',
    scissors: '✂️'
};

// DOM elements
const playerScoreEl = document.getElementById('playerScore');
const computerScoreEl = document.getElementById('computerScore');
const playerChoiceEl = document.getElementById('playerChoice');
const computerChoiceEl = document.getElementById('computerChoice');
const resultMessageEl = document.getElementById('resultMessage');
const choiceBtns = document.querySelectorAll('.choice-btn');
const resetBtn = document.getElementById('resetBtn');

// Add event listeners
choiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const playerChoice = btn.dataset.choice;
        playGame(playerChoice);
    });
});

resetBtn.addEventListener('click', resetGame);

// Main game function
function playGame(playerChoice) {
    const computerChoice = getComputerChoice();
    const result = determineWinner(playerChoice, computerChoice);
    
    // Update display
    updateChoicesDisplay(playerChoice, computerChoice, result);
    updateScore(result);
    updateResultMessage(result, playerChoice, computerChoice);
    
    // Add visual effects
    addGameAnimation();
}

// Generate random computer choice
function getComputerChoice() {
    const choiceArray = Object.keys(choices);
    const randomIndex = Math.floor(Math.random() * choiceArray.length);
    return choiceArray[randomIndex];
}

// Determine game winner
function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'tie';
    }
    
    const winConditions = {
        rock: 'scissors',
        paper: 'rock',
        scissors: 'paper'
    };
    
    if (winConditions[playerChoice] === computerChoice) {
        return 'win';
    } else {
        return 'lose';
    }
}

// Update choices display with animations
function updateChoicesDisplay(playerChoice, computerChoice, result) {
    // Reset previous styles
    playerChoiceEl.className = 'choice-circle player-choice';
    computerChoiceEl.className = 'choice-circle computer-choice';
    
    // Update emojis
    playerChoiceEl.querySelector('.choice-emoji').textContent = choices[playerChoice];
    computerChoiceEl.querySelector('.choice-emoji').textContent = choices[computerChoice];
    
    // Add winner/loser styles
    setTimeout(() => {
        if (result === 'win') {
            playerChoiceEl.classList.add('winner');
            computerChoiceEl.classList.add('loser');
        } else if (result === 'lose') {
            computerChoiceEl.classList.add('winner');
            playerChoiceEl.classList.add('loser');
        }
    }, 100);
}

// Update score
function updateScore(result) {
    if (result === 'win') {
        playerScore++;
        playerScoreEl.textContent = playerScore;
        animateScore(playerScoreEl);
    } else if (result === 'lose') {
        computerScore++;
        computerScoreEl.textContent = computerScore;
        animateScore(computerScoreEl);
    }
}

// Update result message
function updateResultMessage(result, playerChoice, computerChoice) {
    // Reset message classes
    resultMessageEl.className = 'result-message';
    
    let message = '';
    
    switch (result) {
        case 'win':
            message = `You Win! ${choices[playerChoice]} beats ${choices[computerChoice]}`;
            resultMessageEl.classList.add('win');
            break;
        case 'lose':
            message = `Computer Wins! ${choices[computerChoice]} beats ${choices[playerChoice]}`;
            resultMessageEl.classList.add('lose');
            break;
        case 'tie':
            message = `It's a Tie! Both chose ${choices[playerChoice]}`;
            resultMessageEl.classList.add('tie');
            break;
    }
    
    resultMessageEl.textContent = message;
}

// Add game animation effects
function addGameAnimation() {
    // Disable buttons temporarily
    choiceBtns.forEach(btn => {
        btn.style.pointerEvents = 'none';
    });
    
    // Re-enable buttons after animation
    setTimeout(() => {
        choiceBtns.forEach(btn => {
            btn.style.pointerEvents = 'auto';
        });
    }, 1000);
}

// Animate score update
function animateScore(scoreElement) {
    scoreElement.style.transform = 'scale(1.3)';
    scoreElement.style.transition = 'transform 0.3s ease';
    
    setTimeout(() => {
        scoreElement.style.transform = 'scale(1)';
    }, 300);
}

// Reset game
function resetGame() {
    playerScore = 0;
    computerScore = 0;
    
    playerScoreEl.textContent = '0';
    computerScoreEl.textContent = '0';
    
    // Reset choice displays
    playerChoiceEl.className = 'choice-circle player-choice';
    computerChoiceEl.className = 'choice-circle computer-choice';
    playerChoiceEl.querySelector('.choice-emoji').textContent = '❓';
    computerChoiceEl.querySelector('.choice-emoji').textContent = '❓';
    
    // Reset result message
    resultMessageEl.className = 'result-message';
    resultMessageEl.textContent = 'Choose your weapon!';
    
    // Add reset animation
    const container = document.querySelector('.container');
    container.style.animation = 'pulse 0.5s ease-in-out';
    
    setTimeout(() => {
        container.style.animation = '';
    }, 500);
}

// Initialize game message
document.addEventListener('DOMContentLoaded', () => {
    resultMessageEl.textContent = 'Choose your weapon!';
});