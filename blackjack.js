// Определяем масти и значения карт
const suits = ['♠', '♥', '♦', '♣'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Переменные для колоды и рук
let deck = [];
let playerHand = [];
let dealerHand = [];
let gameOver = false;

// Создание и перемешивание колоды
function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    shuffle(deck);
}

// Перемешивание колоды (алгоритм Фишера-Йетса)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Подсчёт очков
function getScore(hand) {
    let sum = 0;
    let aces = 0;
    for (let card of hand) {
        if (card.value === 'A') {
            aces++;
            sum += 1;
        } else if (['J', 'Q', 'K'].includes(card.value)) {
            sum += 10;
        } else {
            sum += parseInt(card.value);
        }
    }
    if (aces > 0 && sum + 10 <= 21) {
        sum += 10; // Один туз считается как 11, если это выгодно
    }
    return sum;
}

// Отображение карт и состояния игры
function render() {
    // Карты игрока
    document.getElementById('player-cards').innerHTML = '';
    for (let card of playerHand) {
        let cardElem = document.createElement('div');
        cardElem.className = 'card';
        cardElem.textContent = card.value + card.suit;
        document.getElementById('player-cards').appendChild(cardElem);
    }

    // Карты дилера
    document.getElementById('dealer-cards').innerHTML = '';
    if (gameOver) {
        for (let card of dealerHand) {
            let cardElem = document.createElement('div');
            cardElem.className = 'card';
            cardElem.textContent = card.value + card.suit;
            document.getElementById('dealer-cards').appendChild(cardElem);
        }
    } else {
        let cardElem1 = document.createElement('div');
        cardElem1.className = 'card';
        cardElem1.textContent = dealerHand[0].value + dealerHand[0].suit;
        document.getElementById('dealer-cards').appendChild(cardElem1);
        let cardElem2 = document.createElement('div');
        cardElem2.className = 'card';
        cardElem2.textContent = '?';
        document.getElementById('dealer-cards').appendChild(cardElem2);
    }

    // Обновление очков и результата
    document.getElementById('player-score').textContent = getScore(playerHand);
    document.getElementById('result').textContent = '';
    if (gameOver) {
        let playerScore = getScore(playerHand);
        let dealerScore = getScore(dealerHand);
        if (playerScore > 21) {
            document.getElementById('result').textContent = 'Вы проиграли';
        } else if (dealerScore > 21 || playerScore > dealerScore) {
            document.getElementById('result').textContent = 'Вы выиграли';
        } else if (playerScore < dealerScore) {
            document.getElementById('result').textContent = 'Вы проиграли';
        } else {
            document.getElementById('result').textContent = 'Ничья';
        }
    }
}

// Начало новой игры
function startGame() {
    createDeck();
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    gameOver = false;
    render();
}

// Действие "Взять карту"
document.getElementById('hit').addEventListener('click', () => {
    if (!gameOver) {
        playerHand.push(deck.pop());
        render();
        if (getScore(playerHand) > 21) {
            gameOver = true;
            render();
        }
    }
});

// Действие "Остановиться"
document.getElementById('stand').addEventListener('click', () => {
    if (!gameOver) {
        gameOver = true;
        while (getScore(dealerHand) < 17) {
            dealerHand.push(deck.pop());
        }
        render();
    }
});

// Действие "Новая игра"
document.getElementById('new-game').addEventListener('click', startGame);

// Запуск игры при загрузке
startGame();