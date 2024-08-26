# Turn-based Chess-like Game

## Overview

This project is a simple turn-based chess-like game implemented with a server-client architecture using WebSockets. The game is played on a 5x5 grid between two players, each controlling a team of characters. The server handles game logic and state, while the client provides an interactive user interface.

## Prerequisites

- Node.js and npm
- A modern web browser

## Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/ryuzen6/CharlesHitwicket_21BAI1188.git
   cd CharlesHitwicket_21BAI1188

2. **Install Server Dependencies: Navigate to the server directory:**
   ```bash
   cd server
   npm install

3. **Start the Server:**
   ```bash
   node server.js

4. **Open the Client: Open client/index.html in two separate browser tabs or windows.**

## How to Play

* Each player controls a team of characters on a 5x5 grid.
* Players take turns to move their characters.
* Use the prompt to input moves, such as F (forward), B (backward), L (left), R (right), and combinations like FL (forward-left).

## Gameplay Screenshots

Game Display

![Screenshot (614)](https://github.com/user-attachments/assets/ad47095c-a4c9-4b40-ace2-d08139f14f3f)

Input Move

![Screenshot (615)](https://github.com/user-attachments/assets/a30fae5b-0f2f-4753-ac92-3a6c2bf89c92)
![Screenshot (616)](https://github.com/user-attachments/assets/519da2f8-e1a4-48da-929b-0d8a956b3529)
![Screenshot (619)](https://github.com/user-attachments/assets/0f9a2df7-3381-4835-85b6-d2e64a6132ee)

Invalid Move

![Screenshot (621)](https://github.com/user-attachments/assets/bb34d8da-f365-4a98-a4d4-fba53fd6a399)
![Screenshot (622)](https://github.com/user-attachments/assets/5ad7a778-977f-48a8-8285-026bf9ea7063)

Not your Turn

![Screenshot (618)](https://github.com/user-attachments/assets/aa9c5b96-8504-41fe-9a0e-17aeac5abfa9)

## Folder Structure

1. **Folder Structure:**
   ```bash
   /CharlesHitwicket_21BAI1188
   ├── client/
   │   ├── index.html         # Main HTML file
   │   ├── style.css          # CSS for the game
   │   └── app.js             # Client-side JavaScript
   ├── server/
   │   └── server.js          # WebSocket server
   ├── README.md              # Project documentation
   └── package.json           # Node.js dependencies

## License 

This project is licensed under the MIT License.
