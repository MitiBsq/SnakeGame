//Declaring the global variables
const snake = new Object();
let lastPressed = new Object();

//Adding even-function to play game button
document.getElementById('playGameButton').addEventListener('click', playTheGame);
function playTheGame() {
    document.getElementById('header').innerText = 'Snake.miti';
    document.getElementById('header').style.textAlign = 'start';
    document.getElementById('header').style.fontSize = '3em';
    document.getElementById('header').style.marginTop = "0";
    document.getElementById('header').style.borderBottom = '1px black solid';
    //For restarting the game
    if (document.getElementById('playGame')) {
        document.getElementById('playGame').remove();
        document.getElementById('scoreTable').style.display = 'flex';
    }
    //The main generative functions
    generateTheGameBox();
    generateTheSnake();
    generateTheApples();
}

//Function for generating the game box
function generateTheGameBox() {
    const theGameBox = document.createElement('table');
    theGameBox.id = 'theGameBox';
    document.getElementById('theGame').appendChild(theGameBox);
    for (let i = 0; i < 20; ++i) {
        const insideRow = document.getElementById('theGameBox').insertRow(i);
        for (let j = 0; j < 20; ++j) {
            const theBox = insideRow.insertCell(j);
            theBox.id = 'row' + i + 'C' + j;
            theBox.style.backgroundColor = 'white';
            //Adding attribute to the "td" element to act as an input-like type
            theBox.setAttribute('tabindex', '10000');
            //Removing the "click" event(not focusing)
            document.body.addEventListener('mousedown', (event) => {
                event.preventDefault();
            });
            //Adding the keypads for directions as an event
            theBox.addEventListener('keydown', (event) => {
                let direction;
                if (event.key === "ArrowLeft" || event.key === 'ArrowRight') {
                    direction = 'horizontal';
                } else {
                    direction = 'vertical';
                }
                if (lastPressed.arrowPressed === undefined) {
                    lastPressed.arrowPressed = 'ArrowRight';
                    lastPressed.direction = 'horizontal';
                    snakePosition("ArrowRight", i, j);
                } else if (lastPressed.arrowPressed !== event.key && lastPressed.direction !== direction) {
                    //Checking if the key pressed is not the same as previous or in opposite direction from the last
                    lastPressed.arrowPressed = event.key;
                    lastPressed.direction = direction;
                    snakePosition(event.key, i, j);
                }
                if (event.key == 'Tab') {
                    //Eliminating the 'tab' key preset 'function'
                    event.preventDefault();
                }
            });
        }
    }
}

//Function for generating the snake 'body'(using positions on the box);
function generateTheSnake() {
    snake.headPosition = 'row' + 10 + 'C' + 4;
    document.getElementById(snake.headPosition).focus();
    snake.tail = new Array();
    for (let i = 3; i > 1; --i) {
        snake.tail.push('row' + 10 + 'C' + i);
    }
    designTheSnake();
}

//Main movement function for the snake
let snakeDirection;
function snakePosition(arrowPressed, rowPosition, columnPosition) {
    switch (arrowPressed) {
        case 'ArrowUp':
            //Adding the first movement, and then applying the loop
            clearInterval(snakeDirection);
            --rowPosition;
            if (moveSnake(rowPosition, columnPosition) === 'gameLost') {
                return;
            }
            snakeDirection = setInterval(() => {
                --rowPosition;
                moveSnake(rowPosition, columnPosition);
            }, 175);
            break;
        case 'ArrowDown':
            clearInterval(snakeDirection);
            ++rowPosition;
            if (moveSnake(rowPosition, columnPosition) === 'gameLost') {
                return;
            }
            snakeDirection = setInterval(() => {
                ++rowPosition;
                moveSnake(rowPosition, columnPosition);
            }, 175);
            break;
        case 'ArrowLeft':
            clearInterval(snakeDirection);
            --columnPosition;
            if (moveSnake(rowPosition, columnPosition) === 'gameLost') {
                return;
            }
            snakeDirection = setInterval(() => {
                --columnPosition;
                moveSnake(rowPosition, columnPosition);
            }, 175);
            break;
        case 'ArrowRight':
            clearInterval(snakeDirection);
            ++columnPosition;
            if (moveSnake(rowPosition, columnPosition) === 'gameLost') {
                return;
            }
            snakeDirection = setInterval(() => {
                ++columnPosition;
                moveSnake(rowPosition, columnPosition);
            }, 175);
            break;
        default:
            break;
    }
}

//Function for moving the snake
function moveSnake(rowPosition, columnPosition) {
    //If the snake hits "the wall" or his own tail 
    if ((rowPosition < 0 || rowPosition > 19) || (columnPosition < 0 || columnPosition > 19) || (document.getElementById('row' + rowPosition + 'C' + columnPosition).style.backgroundColor === 'black')) {
        gameLost();
        return 'gameLost';
    } else {
        if (document.getElementById('row' + rowPosition + 'C' + columnPosition).style.backgroundColor === 'red') {
            appleEaten();
        }
        let firstPosition = snake.headPosition;
        snake.headPosition = 'row' + rowPosition + 'C' + columnPosition;
        document.getElementById(snake.headPosition).focus();
        let lastPosition = snake.tail[snake.tail.length - 1];
        for (let i = snake.tail.length - 1; i >= 0; --i) {
            if (i === 0) {
                snake.tail[i] = firstPosition;
            } else {
                snake.tail[i] = snake.tail[i - 1];
            }
        }
        designTheSnake(lastPosition);
    }
}

//Function for designing the snake
function designTheSnake(lastPosition) {
    document.getElementById(snake.headPosition).style.backgroundColor = 'gray';
    for (let i = 0; i < snake.tail.length; ++i) {
        document.getElementById(snake.tail[i]).style.backgroundColor = 'black';
    }
    //Clearing the path
    if (lastPosition !== undefined) {
        document.getElementById(lastPosition).style.background = 'white';
    }
}

//Function for generating 'the Apples"/ the points on the game table
function generateTheApples() {
    let check = false;
    while (check === false) {
        let randomRow = Math.floor(Math.random() * 20);
        let randomCol = Math.floor(Math.random() * 20);
        if (document.getElementById('row' + randomRow + 'C' + randomCol).style.backgroundColor == 'white') {
            document.getElementById('row' + randomRow + 'C' + randomCol).style.backgroundColor = 'red';
            check = true;
        }
    }
}

//If the generated apple has been eaten the tail length needs to grow + score table
function appleEaten() {
    ++snake.tail.length;
    generateTheApples();
    document.getElementById('scoreTable').innerText = "Score: " + (snake.tail.length - 2);
}

//Function for 'stoping' the game if the snake hits the wrong spot
function gameLost() {
    clearInterval(snakeDirection);
    document.getElementById(snake.headPosition).removeAttribute('tabindex');
    document.getElementById('scoreTable').innerText = "You Lost!";
    setTimeout(() => {
        document.getElementById('theGameBox').remove();
        createRsButton();
    }, 1.0 * 2000);
}

//Function for creating and displaying the restart button
function createRsButton() {
    const restartButton = document.createElement('button');
    restartButton.className = 'btn btn-dark ';
    restartButton.innerText = 'Restart Game';
    restartButton.id = 'restartButton';
    document.getElementById('scoreTable').appendChild(restartButton);
    restartButton.addEventListener('click', restartGame);
}

//Function for restarting the game 
function restartGame() {
    document.getElementById('restartButton').remove();
    document.getElementById('scoreTable').innerText = 'Score: 0';
    //Clearing the previous game 'stats'
    for (let key in lastPressed) {
        delete lastPressed[key];
    }
    for (let key in snake) {
        delete snake[key];
    }
    playTheGame();
}