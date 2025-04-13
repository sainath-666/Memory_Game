// Modern card symbols using emoji and icons
const cardSymbols = [
    '🚀', '🌟', '🎮', '🎯', '🎨', '🎭', '🎪', '🎢'
];

let cards = [...cardSymbols, ...cardSymbols]; // Double the array to create pairs
let flippedCards = [];
let matchedCards = [];
let moves = 0;
let timer = 0;
let gameInterval;
let isFirstClick = true;
let canFlip = true;

// DOM elements
const gameBoard = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const restartButton = document.getElementById('restart-btn');
const winContainer = document.getElementById('win-container');

/**
 * Fisher-Yates shuffle algorithm - more efficient than Math.random() - 0.5
 */
function shuffleCards() {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]]; // Swap elements
    }
}

/**
 * Create a card element with animation and event listeners
 */
function createCard(cardValue, index) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = cardValue;
    card.dataset.index = index;
    
    // Add a slight delay to each card for a staggered animation effect
    setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'rotateY(0deg)';
    }, index * 50);
    
    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
}

/**
 * Initialize or restart the game
 */
function startGame() {
    // Clear any previous game state
    clearInterval(gameInterval);
    gameBoard.innerHTML = '';
    winContainer.innerHTML = '';
    
    // Reset game variables
    flippedCards = [];
    matchedCards = [];
    moves = 0;
    timer = 0;
    isFirstClick = true;
    canFlip = true;
    
    // Update UI
    movesDisplay.innerText = moves;
    timerDisplay.innerText = timer;
    
    // Shuffle and create cards
    shuffleCards();
    cards.forEach((cardValue, index) => createCard(cardValue, index));
}

/**
 * Handle card flip logic
 */
function flipCard(event) {
    // Start timer on first click
    if (isFirstClick) {
        startTimer();
        isFirstClick = false;
    }
    
    const card = event.currentTarget;
    
    // Prevent flipping if animations are in progress or card is already flipped/matched
    if (!canFlip || flippedCards.length >= 2 || 
        card.classList.contains('flipped') || 
        card.classList.contains('matched')) {
        return;
    }
    
    // Flip the card
    card.classList.add('flipped');
    card.innerText = card.dataset.value;
    flippedCards.push(card);
    
    // Check for a match if two cards are flipped
    if (flippedCards.length === 2) {
        checkMatch();
    }
}

/**
 * Check if the flipped cards match
 */
function checkMatch() {
    moves++;
    movesDisplay.innerText = moves;
    canFlip = false;
    
    const [card1, card2] = flippedCards;
    
    if (card1.dataset.value === card2.dataset.value) {
        // Cards match
        handleMatch(card1, card2);
    } else {
        // Cards don't match
        handleMismatch(card1, card2);
    }
}

/**
 * Handle matching cards
 */
function handleMatch(card1, card2) {
    // Add matched class with animation
    card1.classList.add('matched');
    card2.classList.add('matched');
    
    // Add to matched cards array
    matchedCards.push(card1, card2);
    flippedCards = [];
    canFlip = true;
    
    // Check for win condition
    if (matchedCards.length === cards.length) {
        setTimeout(() => {
            showWinMessage();
        }, 500);
    }
}

/**
 * Handle mismatched cards
 */
function handleMismatch(card1, card2) {
    setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        setTimeout(() => {
            card1.innerText = '';
            card2.innerText = '';
            flippedCards = [];
            canFlip = true;
        }, 300);
    }, 1000);
}

/**
 * Start the game timer
 */
function startTimer() {
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        timer++;
        timerDisplay.innerText = timer;
    }, 1000);
}

/**
 * Display win message with confetti animation
 */
function showWinMessage() {
    clearInterval(gameInterval);
    
    // Create win message element
    const winMessage = document.createElement('div');
    winMessage.classList.add('win-message');
    winMessage.innerHTML = `
        <h2>Congratulations! 🎉</h2>
        <p>You completed the game in:</p>
        <p><strong>${moves}</strong> moves and <strong>${timer}</strong> seconds</p>
        <button id="play-again" class="restart-btn">Play Again</button>
    `;
    
    winContainer.appendChild(winMessage);
    
    // Add event listener to play again button
    document.getElementById('play-again').addEventListener('click', startGame);
    
    // Create confetti effect
    createConfetti();
}

/**
 * Create confetti animation for win celebration
 */
function createConfetti() {
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 10 + 5}px`;
        confetti.style.background = getRandomColor();
        confetti.style.position = 'fixed';
        confetti.style.top = '-10px';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.zIndex = '99';
        confetti.style.borderRadius = '50%';
        confetti.style.animation = `confetti ${Math.random() * 3 + 2}s linear forwards`;
        document.body.appendChild(confetti);
        
        // Remove confetti after animation completes
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

/**
 * Generate random color for confetti
 */
function getRandomColor() {
    const colors = [
        '#6366f1', // Primary
        '#8b5cf6', // Secondary
        '#ec4899', // Accent
        '#10b981', // Success
        '#f59e0b', // Warning
        '#ef4444'  // Danger
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Event listeners
restartButton.addEventListener('click', startGame);

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', startGame);
