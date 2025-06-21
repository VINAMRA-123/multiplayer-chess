♟ Real-Time Multiplayer Chess Game

Chess Game Preview
📌 Table of Contents

    Introduction

    Features

    Tech Stack

    Setup & Installation

    Usage Guide

    Project Structure

    Contributing


🧠 Introduction

A real-time multiplayer chess application built with Node.js, Socket.IO, and Chess.js. Two players can compete in real time with synchronized boards, countdown timers, move validation, and support for spectators.
🚀 Features

    ♟ Real-time multiplayer gameplay with socket synchronization

    ✅ Legal move validation and highlighting

    🔁 Live board updates for both players and spectators

    ⏱ Blitz-style countdown timers for each player

    🔄 Restart game functionality

    💡 Visual indicators for check, checkmate, and game over

    👥 Spectator mode for additional clients

    📱 Responsive UI built using Tailwind CSS

🛠 Tech Stack

    Node.js

    Express.js

    Socket.IO

    Chess.js

    Tailwind CSS

    EJS — for rendering dynamic HTML

⚙️ Setup & Installation

# 1. Clone the repository
git clone https://github.com/VINAMRA-123/multiplayer-chess.git
cd multiplayer-chess

# 2. Install server dependencies
npm install

# 3. Run the server
npm start

The app will be accessible at http://localhost:4000
🎮 Usage Guide

    Open the app in two separate tabs or devices.

    The first two users to connect are assigned as White and Black.

    Additional users will join as Spectators.

    Players drag and drop pieces to make legal moves.

    The game ends on checkmate, draw, or timeout.

    Use the Restart button to reset the game.

📁 Project Structure

multiplayer-chess/
├── public/
│   ├── js/
│   │   └── chessgame.js       # Frontend logic
├── views/
│   └── index.ejs              # Main HTML view
├── app.js                     # Server logic with Socket.IO
├── package.json
└── README.md

🙌 Contributing

Feel free to fork this repo, suggest features, or open a PR!

# Fork, clone, and contribute
git checkout -b your-feature
git commit -m "Added a new feature"
git push origin your-feature
