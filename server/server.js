const WebSocket = require('ws');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let players = [];
let gameState = {
    board: Array(5).fill(null).map(() => Array(5).fill(null)),
    turn: 'A',
};

// Initialize board with characters for both players
const initializeBoard = () => {
    gameState.board = [
        ['A1', 'A1', 'A1', 'A1', 'A1'],
        ['A2', 'A2', 'A2', 'A2', 'A2'],
        [null, null, null, null, null],
        ['B2', 'B2', 'B2', 'B2', 'B2'],
        ['B1', 'B1', 'B1', 'B1', 'B1'],
    ];
};

const characterTypes = {
    Pawn: { moves: ['L', 'R', 'F', 'B'] },
    Hero1: { moves: ['L', 'R', 'F', 'B'], range: 2 },
    Hero2: { moves: ['FL', 'FR', 'BL', 'BR'], range: 2 },
};

wss.on('connection', (ws) => {
    if (players.length < 2) {
        const playerId = players.length === 0 ? 'A' : 'B';
        players.push({ ws, playerId });
        ws.send(JSON.stringify({ type: 'playerId', playerId }));

        if (players.length === 2) {
            initializeBoard();
            startGame();
        }
    } else {
        ws.send(JSON.stringify({ type: 'error', message: 'Game is full' }));
        ws.close();
    }

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'move') {
            processMove(data);
        }
    });

    ws.on('close', () => {
        players = players.filter(player => player.ws !== ws);
        resetGame();
    });
});

const startGame = () => {
    players.forEach(player => {
        player.ws.send(JSON.stringify({ type: 'gameStart', gameState }));
    });
};

const processMove = (data) => {
    const { playerId, character, move } = data;
    if (playerId !== gameState.turn) {
        sendError(playerId, 'Not your turn');
        return;
    }

    // Validate and process move
    if (isValidMove(playerId, character, move)) {
        updateGameState(playerId, character, move);
        broadcastGameState();
        switchTurn();
    } else {
        sendError(playerId, 'Invalid move');
    }
};

const isValidMove = (playerId, character, move) => {
    const [currentRow, currentCol] = findCharacter(character);
    if (currentRow === -1) return false;

    const charType = characterTypes[character.substring(0, 5)];
    const [direction, steps] = [move.slice(0, -1), parseInt(move.slice(-1)) || 1];

    let newRow = currentRow;
    let newCol = currentCol;

    switch (direction) {
        case 'F': newRow -= steps; break;
        case 'B': newRow += steps; break;
        case 'L': newCol -= steps; break;
        case 'R': newCol += steps; break;
        case 'FL': newRow -= steps; newCol -= steps; break;
        case 'FR': newRow -= steps; newCol += steps; break;
        case 'BL': newRow += steps; newCol -= steps; break;
        case 'BR': newRow += steps; newCol += steps; break;
        default: return false;
    }

    if (newRow < 0 || newRow >= 5 || newCol < 0 || newCol >= 5) return false;
    if (gameState.board[newRow][newCol] && gameState.board[newRow][newCol][0] === playerId) return false;

    return true;
};

const findCharacter = (character) => {
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            if (gameState.board[row][col] === character) {
                return [row, col];
            }
        }
    }
    return [-1, -1];
};

const updateGameState = (playerId, character, move) => {
    const [currentRow, currentCol] = findCharacter(character);
    if (currentRow === -1) return;

    const [direction, steps] = [move.slice(0, -1), parseInt(move.slice(-1)) || 1];
    let newRow = currentRow;
    let newCol = currentCol;

    switch (direction) {
        case 'F': newRow -= steps; break;
        case 'B': newRow += steps; break;
        case 'L': newCol -= steps; break;
        case 'R': newCol += steps; break;
        case 'FL': newRow -= steps; newCol -= steps; break;
        case 'FR': newRow -= steps; newCol += steps; break;
        case 'BL': newRow += steps; newCol -= steps; break;
        case 'BR': newRow += steps; newCol += steps; break;
    }

    gameState.board[newRow][newCol] = character;
    gameState.board[currentRow][currentCol] = null;
};

const broadcastGameState = () => {
    players.forEach(player => {
        player.ws.send(JSON.stringify({ type: 'gameState', gameState }));
    });
};

const switchTurn = () => {
    gameState.turn = gameState.turn === 'A' ? 'B' : 'A';
};

const sendError = (playerId, message) => {
    const player = players.find(p => p.playerId === playerId);
    if (player) {
        player.ws.send(JSON.stringify({ type: 'error', message }));
    }
};

const resetGame = () => {
    initializeBoard();
    gameState.turn = 'A';
    players.forEach(player => {
        player.ws.send(JSON.stringify({ type: 'gameReset' }));
    });
};

server.listen(8081, () => {
    console.log('Server is listening on port 8081');
});