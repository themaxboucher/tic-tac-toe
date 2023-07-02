const grid = document.querySelectorAll('.grid-item');
const gridState = {
    one: null,
    two: null,
    three: null,
    four: null,
    five: null,
    six: null,
    seven: null,
    eight: null,
    nine: null,
};
const text = document.getElementById('turn');
const player = document.getElementById('player');
const winnerDisplay = document.getElementById('winner');
const restartBtn = document.getElementById('restart');
const popup = document.getElementById('popup');

// Toggle from 'VS Computer' to 'VS Friend'
let computer = true;
const setting = document.getElementById('setting');
const changeSetting = () => {
    if (setting.value == 'VS Friend') {
        computer = false;
        text.innerHTML = "X's Turn";
        player.disabled = true;
    } else {
        computer = true;
        text.innerHTML = 'Start game or select player';
        player.disabled = false;
    }
};
setting.addEventListener('change', changeSetting);

let turn = 0;

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

const computerMove = () => {
    turn++
    player.disabled = true;
    setting.disabled = true;
    restartBtn.disabled = false;
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
    const key = keysArray[index];
    console.log(key);
    const square = document.getElementById(key);
    square.disabled = true;
    if (turn % 2 === 0) {
        gridState[key] = 'O';
        text.innerHTML = "X's Turn";
        square.innerHTML = 'O';
    } else {
        gridState[key] = 'X';
        text.innerHTML = "O's Turn";
        square.innerHTML = 'X';
    }
    grid.forEach(square => {
        if (gridState[square.id] == null) {
            square.disabled = false;
        }
    });
    checkWin();
}

player.addEventListener('change', computerMove);

const move = (square, num) => {
    turn++
    player.disabled = true;
    setting.disabled = true;
    square.disabled = true;
    restartBtn.disabled = false;
    if (turn % 2 === 0) {
        gridState[num] = 'O';
        square.innerHTML = 'O';
        text.innerHTML = "X's Turn";
    } else {
        gridState[num] = 'X';
        square.innerHTML = 'X';
        text.innerHTML = "O's Turn";
    }
    checkWin();

    if (checkWin() == false && computer) {
        grid.forEach(item => {
            item.disabled = true;
        });
        setTimeout(computerMove, 500);
    }
};


grid.forEach(item => {
    item.addEventListener('click', () => move(item, item.id));
});

const restart = () => {
    for (const key in gridState) {
        if (gridState.hasOwnProperty(key)) {
            gridState[key] = null;
        }
    }
    grid.forEach(item => {
        item.innerHTML = '';
        item.disabled = false;
    });
    turn = 0;
    if (computer) {
        player.disabled = false;
    }
    player.checked = false;
    text.innerHTML = "X's Turn";
    setting.disabled = false;
    winnerDisplay.innerHTML = '';
    restartBtn.disabled = true;
};

restartBtn.addEventListener('click', restart);