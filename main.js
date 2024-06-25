const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreContainer = document.querySelector('.score');
const highScoreContainer = document.querySelector('.high-score');
const box = 10;
let snake = [];
let score = 0;
let highScore = 0;
const bloodSplash = new Image();
bloodSplash.src = ''

// Add high score as 0 to local storage if it is the first time
if (!localStorage.getItem('high-score')) {
    localStorage.setItem('high-score', highScore);
} else {
    // get high score fron local storage and show it
    highScoreContainer.textContent = localStorage.getItem('high-score');
}
//snake[0] = { x: 10 * box, y: 10 * box };
snake[0] = { x: parseInt(canvas.width / 4), y: parseInt(canvas.height / 2) };

// direction will be UP, RIGHT, DOWN and LEFT
let direction = "RIGHT";
let food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
};

document.addEventListener('keydown', setDirection);
clickBtn();

// update score each time the snake eats the food
function updateScore() {
    scoreContainer.textContent = score;
}

// Chanes direction of the snake every time an arrow is clicked
function setDirection(event) {
    if ((event.keyCode === 37 || event.keyCode === 76 || event.keyCode === 108) && direction !== 'RIGHT') direction = 'LEFT';
    else if ((event.keyCode === 38 || event.keyCode === 85 || event.keyCode === 117) && direction !== 'DOWN') direction = 'UP';
    else if ((event.keyCode === 39 || event.keyCode === 82 || event.keyCode === 114) && direction !== 'LEFT') direction = 'RIGHT';
    else if ((event.keyCode === 40 || event.keyCode === 68 || event.keyCode === 100) && direction !== 'UP') direction = 'DOWN';
    else direction = direction;
}

// change direction when play with mobile
function clickBtn() {
    if (/Android/i.test(navigator.userAgent) || /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        document.querySelector('.play-on-mobile').style.display = 'flex';
        const btns = Array.from(document.querySelectorAll('.play-on-mobile span'));
        btns.forEach(btn => {
            btn.addEventListener('touchend', function(e) {
                let code = this.dataset.code;
                if (code === "l" && direction !== 'RIGHT') direction = 'LEFT';
                else if (code === "u" && direction !== 'DOWN') direction = 'UP';
                else if (code === "r" && direction !== 'LEFT') direction = 'RIGHT';
                else if (code === "d" && direction !== 'UP') direction = 'DOWN';
                else direction = direction;
            })
        })
    } else {
        document.querySelector('.play-on-mobile').style.display = 'none';
        return;
    }
}

// check collision of the snake with itself 
function collision(newHead, array) {
    for (let i = 0; i < array.length; i++) {
        if (newHead.x === array[i].x && newHead.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? 'green' : 'white';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = 'red';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        food = {
            x: Math.floor(Math.random() * 40) * box,
            y: Math.floor(Math.random() * 40) * box
        };
        score += 1
        updateScore();
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        drawText(`Game Over!`, 200, 180);
        drawText(`Your final score is: ${score}`, 200, 210);
        updateHighScore();
        drawBloodSplash(snakeX, snakeY)
    }

    snake.unshift(newHead);
}

// add a text to the center of the canvas to inform the player the the game is over
function drawText(text, x, y) {
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
}

// update high score if score of current game is greater that high score
function updateHighScore() {
    let oldHighScore = parseInt(localStorage.getItem('high-score'));
    if (oldHighScore < score) {
        localStorage.setItem('high-score', score);
    }
}

// draw a blood splash
function drawBloodSplash(x, y) {
    ctx.fillStyle = 'red';
    for (let i = 0; i < 50; i++) {
        const radius = Math.random() * 20;
        const angle = Math.random() * Math.PI * 2;
        const dx = Math.cos(angle) * radius;
        const dy = Math.sin(angle) * radius;
        ctx.beginPath();
        ctx.arc(x + dx, y + dy, Math.random() * 10, 0, Math.PI * 2);
        ctx.fill();
    }
}

let game = setInterval(draw, 100);
