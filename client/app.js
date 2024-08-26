const socket = new WebSocket('ws://localhost:8081');

let playerId = null;
let gameState = null;

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch (data.type) {
        case 'playerId':
            playerId = data.playerId;
            break;
        case 'gameStart':
        case 'gameState':
            gameState = data.gameState;
            renderBoard();
            break;
        case 'error':
            alert(data.message);
            break;
        case 'gameReset':
            alert('Game has been reset');
            break;
    }
};

const renderBoard = () => {
    const boardElement = document.getElementById('game-board');
    boardElement.innerHTML = '';
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            const character = gameState.board[row][col];
            if (character) {
                cell.textContent = character;
                cell.classList.add(character.startsWith('A') ? 'playerA' : 'playerB');
                cell.onclick = () => handleClick(character, row, col);
            }
            boardElement.appendChild(cell);
        }
    }
};

const handleClick = (character, row, col) => {
    if (!playerId || !gameState || gameState.turn !== playerId) return;
    const move = prompt('Enter move (e.g., F2 for 2 steps forward)');
    if (move) {
        sendMove(character, move);
    }
};

const sendMove = (character, move) => {
    socket.send(JSON.stringify({ type: 'move', playerId, character, move }));
};
