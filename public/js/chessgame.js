// ---- Updated chessgame.js ----
const socket = io(); 
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");
const whiteMovesElement = document.getElementById("whiteMoves");
const blackMovesElement = document.getElementById("blackMoves");
const statusMessage = document.getElementById("statusMessage");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const renderBoard = () => {
    const board = chess.board();
    boardElement.innerHTML = "";
    board.forEach((row, rowIndex) => {
        row.forEach((square, squareIndex) => {
            const squareElement = document.createElement("div");
            squareElement.classList.add("square", (rowIndex + squareIndex) % 2 === 0 ? "light" : "dark");
            squareElement.dataset.row = rowIndex;
            squareElement.dataset.col = squareIndex;

            if (square) {
                const pieceElement = document.createElement("div");
                pieceElement.classList.add("piece", square.color === "w" ? "white" : "black");
                pieceElement.innerText = getPieceUnicode(square);
                pieceElement.draggable = playerRole === square.color;

                pieceElement.addEventListener("dragstart", (e) => {
                    if (pieceElement.draggable) {
                        draggedPiece = pieceElement;
                        sourceSquare = { row: rowIndex, col: squareIndex };
                        e.dataTransfer.setData("text/plain", "");
                    }
                });

                pieceElement.addEventListener("dragend", () => {
                    draggedPiece = null;
                    sourceSquare = null;
                });

                squareElement.appendChild(pieceElement);
            }

            squareElement.addEventListener("dragover", function (e) {
                e.preventDefault();
            });

            squareElement.addEventListener("drop", function (e) {
                e.preventDefault();
                if (draggedPiece) {
                    const targetSquare = {
                        row: parseInt(squareElement.dataset.row),
                        col: parseInt(squareElement.dataset.col),
                    };
                    handleMove(sourceSquare, targetSquare);
                }
            });

            boardElement.appendChild(squareElement);
        });
    });

    boardElement.classList.toggle("flipped", playerRole === 'b');
};

const handleMove = (source, target) => {
    const move = {
        from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
        to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
        promotion: "q"
    };
    socket.emit("move", move);
};

const getPieceUnicode = (piece) => {
    const unicodePieces = {
        p: "♙", r: "♖", n: "♘", b: "♗", q: "♕", k: "♔",
        P: "♟", R: "♜", N: "♞", B: "♝", Q: "♛", K: "♚"
    };
    return unicodePieces[piece.type] || "";
};

socket.on("playerRole", function (role) {
    playerRole = role;
    statusMessage.textContent = role === 'w' ? 'Waiting for the opponent...' : 'Game Started! Enjoy the game!';
    renderBoard();
});

socket.on("spectatorRole", function () {
    playerRole = null;
    renderBoard();
    statusMessage.textContent = 'Spectators cannot participate in the game.';
});

socket.on("boardState", function (fen) {
    chess.load(fen);
    renderBoard();
});

socket.on("move", function (move) {
    updateMoveLogs(move);
});

socket.on("invalidMove", function (move) {
    alert(`Invalid move: ${move.from} to ${move.to}`);
});

socket.on("check", function (turn) {
    statusMessage.textContent = `${turn === 'w' ? 'White' : 'Black'} is in check!`;
});

socket.on("gameOver", function (data) {
    if (data.reason === "checkmate") {
        statusMessage.textContent = `${data.winner} has won by checkmate!`;
    } else if (data.reason === "draw") {
        statusMessage.textContent = `Game ended in a draw.`;
    }

    // Disable further dragging after game is over
    playerRole = null;
    renderBoard();
});

socket.on("gameStarted", function () {
    statusMessage.textContent = 'Enjoy the game!';
});

const updateMoveLogs = (move) => {
    const piece = chess.get(move.to);
    const moveText = `${getPieceUnicode(piece)} ${move.from} to ${move.to}`;
    const listItem = document.createElement("li");
    listItem.textContent = moveText;
    if (chess.turn() === 'w') {
        whiteMovesElement.appendChild(listItem);
    } else {
        blackMovesElement.appendChild(listItem);
    }
};

// Restart button functionality
const restartBtn = document.createElement("button");
restartBtn.textContent = "Restart Game";
restartBtn.className = "mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600";
restartBtn.addEventListener("click", () => {
    socket.emit("restartGame");
});
document.body.appendChild(restartBtn);

renderBoard();
