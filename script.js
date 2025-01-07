const cardValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']; // These are the card values
let cards = [...cardValues, ...cardValues]; // Double the array to create pairs
let flippedCards = [];
let matchedCards = [];
let moves = 0;
let timer = 0;
let gameInterval;

const gameBoard = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const restartButton = document.getElementById('restart-btn'); // Restart button element

// Function to shuffle the cards
function shuffleCards() {
    cards.sort(() => Math.random() - 0.5); // Randomize the order of the cards
}

// Function to create a card
function createCard(cardValue) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = cardValue; // Store the card value
    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
}

// Function to start the game
function startGame() {
    gameBoard.innerHTML = ''; // Clear the game board (for restart)
    flippedCards = []; // Reset flipped cards
    matchedCards = []; // Reset matched cards
    moves = 0; // Reset moves
    timer = 0; // Reset timer
    movesDisplay.innerText = moves; // Display moves
    timerDisplay.innerText = timer; // Display timer
    shuffleCards(); // Shuffle the cards
    cards.forEach(createCard); // Create the cards
    startTimer(); // Start the timer
}

// Function to flip a card
function flipCard(event) {
    const card = event.target;

    if (flippedCards.length < 2 && !card.classList.contains('flipped') && !card.classList.contains('matched')) {
        card.classList.add('flipped');
        card.innerText = card.dataset.value;
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            checkMatch();
        }
    }
}

// Function to check if the two flipped cards match
function checkMatch() {
    moves++;
    movesDisplay.innerText = moves;

    if (flippedCards[0].dataset.value === flippedCards[1].dataset.value) {
        flippedCards[0].classList.add('matched');
        flippedCards[1].classList.add('matched');
        matchedCards.push(...flippedCards);
        flippedCards = [];

        if (matchedCards.length === cards.length) {
            clearInterval(gameInterval);
            alert('You Win!');
        }
    } else {
        setTimeout(() => {
            flippedCards[0].classList.remove('flipped');
            flippedCards[1].classList.remove('flipped');
            flippedCards[0].innerText = '';
            flippedCards[1].innerText = '';
            flippedCards = [];
        }, 1000);
    }
}

// Function to start the timer
function startTimer() {
    gameInterval = setInterval(() => {
        timer++;
        timerDisplay.innerText = timer;
    }, 1000);
}

// Add event listener to restart button
restartButton.addEventListener('click', startGame);

// Start the game when the page loads
startGame();
