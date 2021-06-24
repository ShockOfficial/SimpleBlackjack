let $hitBtn;
let $standBtn;
let $dealBtn;
let $card;
let $resultBox;
let $resultIcon;
let $resultText;
let $hitSound = new Audio('../sounds/swish.m4a');
let $winSound = new Audio('../sounds/cash.mp3');
let $loseSound = new Audio('../sounds/aww.mp3');
let $roundEnd = false;


const blackJackGame = {
    user: { side: '.user-box', score: 0, scoreDisplay: '#my-score', points: 0, pointsDisplay: '.value-user' },
    bot: { side: '.bot-box', score: 0, scoreDisplay: '#bot-score', points: 0, pointsDisplay: '.value-bot' },
    isStand: false,
    cards: ['2.png', '3.png', '4.png', '5.jpg', '6.png', '7.png', '8.png', '9.png', '10.png', 'A.png', 'J.png', 'K.png', 'Q.png'],
    cardsValue: { '2.png': 2, '3.png': 3, '4.png': 4, '5.jpg': 5, '6.png': 6, '7.png': 7, '8.png': 8, '9.png': 9, '10.png': 10, 'A.png': [1, 11], 'J.png': 10, 'K.png': 10, 'Q.png': 10 }
}




function prepareDomElements() {
    blackJackGame.user.side = document.querySelector(blackJackGame.user.side);
    blackJackGame.user.pointsDisplay = document.querySelector(blackJackGame.user.pointsDisplay);
    blackJackGame.bot.pointsDisplay = document.querySelector(blackJackGame.bot.pointsDisplay);
    blackJackGame.bot.side = document.querySelector(blackJackGame.bot.side);
    blackJackGame.bot.scoreDisplay = document.querySelector(blackJackGame.bot.scoreDisplay);
    blackJackGame.user.scoreDisplay = document.querySelector(blackJackGame.user.scoreDisplay);
    $hitBtn = document.querySelector('.hit');
    $standBtn = document.querySelector('.stand');
    $dealBtn = document.querySelector('.deal');
    $resultBox = document.querySelector('.result-box')
    $resultIcon = $resultBox.querySelector('.icon');
    $resultText = $resultBox.querySelector('.result')
}

function prepareDomEvent() {

    $hitBtn.addEventListener('click', hitCard);
    $standBtn.addEventListener('click', makeStand);
    $dealBtn.addEventListener('click', makeDeal);
}


function hitCard() {
    let randomIndex = Math.floor(Math.random() * blackJackGame.cards.length)
    let randomCard = blackJackGame.cards[randomIndex];
    if (blackJackGame.isStand) {
        displayCard('../images/' + randomCard, 'bot');
        $hitSound.play();
        addPoints(randomCard, 'bot');
    } else {
        addPoints(randomCard, 'user');
        $hitSound.play();
        displayCard('../images/' + randomCard, 'user');
    }

}

function displayCard(card, activePlayer) {

    let img = document.createElement('img');
    img.setAttribute('src', card);
    img.classList.add('card', 'card-anim');
    blackJackGame[activePlayer].side.append(img);

}

function addPoints(card, activePlayer) {
    let cardValue = blackJackGame.cardsValue[card];

    if (typeof cardValue === typeof []) {

        if (blackJackGame[activePlayer].points + 11 <= 21) {
            blackJackGame[activePlayer].points += cardValue[1];
            blackJackGame[activePlayer].pointsDisplay.innerText = blackJackGame[activePlayer].points;


        } else {
            blackJackGame[activePlayer].points += cardValue[0];
            blackJackGame[activePlayer].pointsDisplay.innerText = blackJackGame[activePlayer].points;

        }
    } else {
        blackJackGame[activePlayer].points += cardValue;
        blackJackGame[activePlayer].pointsDisplay.innerText = blackJackGame[activePlayer].points;

    }
    isBusted(activePlayer);




}

function makeDeal() {
    blackJackGame.user.points = 0;
    blackJackGame.user.pointsDisplay.innerText = 0;
    blackJackGame.bot.pointsDisplay.innerText = 0;
    blackJackGame.bot.points = 0;
    blackJackGame.isStand = false;
    $roundEnd = false;

    let activeCardLeft = blackJackGame.user.side.querySelectorAll('img');
    let activeCardRight = blackJackGame.bot.side.querySelectorAll('img');

    for (let card of activeCardLeft) {
        card.remove();
    }
    for (let card of activeCardRight) {
        card.remove();
    }
}

function makeStand() {
    blackJackGame.isStand = true;
    $hitBtn.disabled = true;
    $standBtn.disabled = true;
    botAutoPlay();
}

async function checkWinner() {
    $hitBtn.disabled = true;
    if (!$roundEnd) {
        if (blackJackGame.user.points < blackJackGame.bot.points) {
            botWins();
            await sleep(2000);
            makeDeal();
        } else if (blackJackGame.user.points === blackJackGame.bot.points) {
            draw()
            await sleep(2000);
            makeDeal();
        } else {
            userWins();
        }
    }
}



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}





async function isBusted(activePlayer) {
    if (blackJackGame[activePlayer].points > 21) {
        $hitBtn.disabled = true;
        $standBtn.disabled = true;
        if (activePlayer === 'user') {
            botWins();
        } else {
            userWins();
        }
        $roundEnd = true;
    }

}




async function botAutoPlay() {
    while (blackJackGame.bot.points < 17 && blackJackGame.isStand === true) {
        hitCard();
        await sleep(800);
    }
    checkWinner();
}


function userWins() {
    $resultBox.classList.add('win');
    $resultBox.classList.remove('hide');
    $resultText.textContent = 'you win';
    $resultIcon.innerHTML = '<i class="fas fa-check"></i>';
    $winSound.play();

    setTimeout(() => {
        $resultBox.classList.remove('win');
        $resultBox.classList.add('hide');
        blackJackGame.user.scoreDisplay.innerText = ++blackJackGame.user.score;
        $hitBtn.disabled = false;
        $standBtn.disabled = false;
        makeDeal();
    }, 2000);
}

function botWins() {

    $resultBox.classList.add('lose');
    $resultBox.classList.remove('hide');
    $resultText.textContent = 'you lose';
    $resultIcon.innerHTML = '<i class="fas fa-frown-open"></i>';

    $loseSound.play()

    setTimeout(() => {

        $resultBox.classList.remove('lose');
        $resultBox.classList.add('hide');
        blackJackGame.bot.scoreDisplay.innerText = ++blackJackGame.bot.score;
        $hitBtn.disabled = false;
        $standBtn.disabled = false;
        makeDeal();


    }, 2000);
}

function draw() {
    $resultBox.classList.add('draw');
    $resultBox.classList.remove('hide');
    $resultText.textContent = 'TIE';
    $resultIcon.innerHTML = '<i class="fas fa-handshake"></i>';

    setTimeout(() => {

        $resultBox.classList.remove('draw');
        $resultBox.classList.add('hide');
        blackJackGame.bot.scoreDisplay.innerText = ++blackJackGame.bot.score;
        blackJackGame.user.scoreDisplay.innerText = ++blackJackGame.user.score;
        $hitBtn.disabled = false;
        $standBtn.disabled = false;
        makeDeal();

    }, 2000);
}





function main() {
    prepareDomElements();
    prepareDomEvent();
}


window.addEventListener('DOMContentLoaded', main)