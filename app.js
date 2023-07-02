// Declare global variables
const grid = document.querySelectorAll('.grid-item');
const gridState = {one: null, two: null, three: null, four: null, five: null, six: null, seven: null, eight: null, nine: null,};
const text = document.getElementById('turn');
const player = document.getElementById('player');
const winnerDisplay = document.getElementById('winner');
const restartBtn = document.getElementById('restart');
const popup = document.getElementById('popup');
//Set default turn to 0
let turn = 0;

// Toggle from 'VS Computer' to 'VS Friend'
let computer = true;
const setting = document.getElementById('setting');
const changeSetting = () => {
    if (setting.value == 'VS Friend') {
        computer = false;
        text.innerHTML = "Start game";
        player.disabled = true;
    } else {
        computer = true;
        text.innerHTML = 'Start game or select player';
        player.disabled = false;
    }
};
setting.addEventListener('change', changeSetting);

// What to do when the game ends...
const endGame = (win, winner) => {
    text.innerHTML = 'Game Over';
    if (win) {
        winnerDisplay.innerHTML = `${gridState[winner]} wins!`;
    } else {
        winnerDisplay.innerHTML = 'Draw';
    }
    grid.forEach(item => {
        item.disabled = true;
    });
};

// Check if the game has been won or if there is a draw by looking at the gridState object
const checkWin = () => {
    if (gridState.one != null && 
        ((gridState.one == gridState.two && 
        gridState.two == gridState.three) ||
        (gridState.one == gridState.four && 
        gridState.four == gridState.seven))) {
        endGame(true, 'one');
        return true;
    } else if (gridState.nine != null && 
        ((gridState.nine == gridState.eight && 
        gridState.eight == gridState.seven) ||
        (gridState.nine == gridState.six && 
        gridState.six == gridState.three))) {
        endGame(true, 'nine');
        return true;
    } else if (gridState.five != null && 
        ((gridState.five == gridState.one && 
        gridState.one == gridState.nine) ||
        (gridState.five == gridState.three && 
        gridState.three == gridState.seven) ||
        (gridState.five == gridState.two && 
        gridState.two == gridState.eight) ||
        (gridState.five == gridState.four && 
        gridState.four == gridState.six))) {
        endGame(true, 'five');
        return true;
    } else if (Object.values(gridState).every(value => value != null)) {
        endGame(false);
        return true;
    } else {
        return false;
    }
}

// Mark the square that has been claimed in HTML and in the gridState object
const claimSquare = (square, num) => {
    if (turn % 2 === 0) {
        gridState[num] = 'O';
        square.innerHTML = 'O';
        text.innerHTML = "X's Turn";
    } else {
        gridState[num] = 'X';
        square.innerHTML = 'X';
        text.innerHTML = "O's Turn";
    }
}

// The computer makes a move...
const computerMove = () => {
    turn++
    player.disabled = true;
    setting.disabled = true;
    restartBtn.disabled = false;
    // Algorithm to determine which square to claim (i.e. what move to make)
    const keysArray = Object.keys(gridState).filter(value => gridState[value] == null);
    let index;
    if (turn == 1) {
        index = 4;
    } else if (turn == 2) {
        const turnTwoMoves = [1,1,1,3,3,6,7];
        index = turnTwoMoves[Math.floor(Math.random() * 7)];
    } else if (turn ==3) {
        const turnThreeMoves = [1,1,1,3,3,6];
        index = turnThreeMoves[Math.floor(Math.random() * 6)];
    } else {
        index = Math.floor(Math.random() * keysArray.length);
    }
    console.log(index);
    const num = keysArray[index];
    console.log(num);
    const square = document.getElementById(num);
    square.disabled = true;
    claimSquare(square, num);
    // Enable all empty squares (i.e. squares where the corresponding gridState key is set to null)
    grid.forEach(square => {
        if (gridState[square.id] == null) {
            square.disabled = false;
        }
    });
    checkWin();
}
// Computer makes the first move if you change your player (X's or O's)
player.addEventListener('change', computerMove);

const move = (square, num) => {
    turn++
    player.disabled = true;
    setting.disabled = true;
    restartBtn.disabled = false;
    square.disabled = true;
    claimSquare(square, num);
    checkWin();
    // Stop if someone wins or there is a draw
    if (checkWin() == false && computer) {
        // Prevent user from clicking on square while the computer makes a move
        grid.forEach(item => {
            item.disabled = true;
        });
        // Wait half a second before the computer makes its move
        setTimeout(computerMove, 500);
    }
};

// Add click event listener to each square so that they are marked when clicked
grid.forEach(item => {
    item.addEventListener('click', () => move(item, item.id));
});

// Reseting everything to restart the game...
const restart = () => {
    // Reset every value in the gridState object to null
    for (const key in gridState) {
        if (gridState.hasOwnProperty(key)) {
            gridState[key] = null;
        }
    }
    // Reset the HTML of every square
    grid.forEach(item => {
        item.innerHTML = '';
        item.disabled = false;
    });
    if (computer) {
        player.disabled = false;
    }
    turn = 0;
    player.checked = false;
    text.innerHTML = "X's Turn";
    setting.disabled = false;
    winnerDisplay.innerHTML = '';
    restartBtn.disabled = true;
};
restartBtn.addEventListener('click', restart);