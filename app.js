// Declare global variables
const grid = document.querySelectorAll('.grid-item');
const gridState = {one: null, two: null, three: null, four: null, five: null, six: null, seven: null, eight: null, nine: null,};
const text = document.getElementById('turn');
const playerX = document.getElementById('player-x');
const playerO = document.getElementById('player-o');
const winnerDisplay = document.getElementById('winner');
const restartBtn = document.getElementById('restart');
//Set default turn to 0
let turn = 0;

// Toggle from 'VS Computer' to 'VS Friend'
let computer = true;
const setting = document.getElementById('setting');
const changeSetting = () => {
    if (setting.value == 'VS Friend') {
        computer = false;
        text.innerHTML = "X's Turn";
        playerO.disabled = true;
    } else {
        computer = true;
        text.innerHTML = 'Start game or select player';
        playerO.disabled = false;
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
    playerX.disabled = true;
    playerO.disabled = true;
    setting.disabled = true;
    restartBtn.disabled = false;
    // Algorithm to determine which square to claim (i.e. what move to make)
    let num;
    if (gridState.five == null) {
        num = 'five';
    } else if (((gridState.three == gridState.two && gridState.three != null) || (gridState.five == gridState.nine && gridState.five != null) || (gridState.four == gridState.seven && gridState.four != null)) && gridState.one == null) {
        num = 'one'; 
    } else if (((gridState.one == gridState.three && gridState.one != null) || (gridState.five == gridState.eight && gridState.five != null)) && gridState.two == null) {
        num = 'two'; 
    } else if (((gridState.one == gridState.two && gridState.one != null) || (gridState.five == gridState.seven && gridState.five != null) || (gridState.six == gridState.nine && gridState.six != null)) && gridState.three == null) {
        num = 'three';
    } else if (((gridState.one == gridState.seven && gridState.one != null) || (gridState.five == gridState.six && gridState.five != null)) && gridState.four == null) {
        num = 'four'; 
    } else if (((gridState.four == gridState.five && gridState.four != null) || (gridState.three == gridState.nine && gridState.three != null)) && gridState.six == null) {
        num = 'six'; 
    } else if (((gridState.three == gridState.five && gridState.three != null) || (gridState.one == gridState.four && gridState.one != null) || (gridState.eight == gridState.nine && gridState.eight != null)) && gridState.seven == null) {
        num = 'seven'; 
    } else if (((gridState.seven == gridState.nine && gridState.seven != null) || (gridState.five == gridState.two && gridState.five != null)) && gridState.eight == null) {
        num = 'eight'; 
    } else if (((gridState.seven == gridState.eight && gridState.seven != null) || (gridState.five == gridState.one && gridState.five != null) || (gridState.three == gridState.six && gridState.three != null)) && gridState.nine == null) {
        num = 'nine'; 
    } else if (turn <= 3 && (gridState.one != null || gridState.seven != null) && gridState.nine == null) {
        num = 'nine';
    } else if (turn <= 3 && (gridState.three != null || gridState.nine != null) && gridState.one == null) {
        num = 'one'; 
    } else {
        const keysArray = Object.keys(gridState).filter(value => gridState[value] == null);
        const randomIndex = Math.floor(Math.random() * keysArray.length);
        num = keysArray[randomIndex];
    }
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
playerO.addEventListener('click', computerMove);


const move = (square, num) => {
    turn++
    playerX.disabled = true;
    playerO.disabled = true;
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
        playerX.disabled = true;
        playerO.disabled = false;
    }
    turn = 0;
    text.innerHTML = "X's Turn";
    setting.disabled = false;
    winnerDisplay.innerHTML = '';
    restartBtn.disabled = true;
};
restartBtn.addEventListener('click', restart);