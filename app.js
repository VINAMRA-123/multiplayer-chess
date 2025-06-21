// ---- Updated app.js ----
const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();
let players = {};
let currentPlayer = "w";
let gameStarted = false;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { title: "Chess game" });
});

io.on("connection", function (uniquesocket) {
  console.log("connected");

  if (!players.white) {
    players.white = uniquesocket.id;
    uniquesocket.emit("playerRole", "w");
  } else if (!players.black) {
    players.black = uniquesocket.id;
    uniquesocket.emit("playerRole", "b");
  } else {
    uniquesocket.emit("spectatorRole");
  }

  uniquesocket.on("disconnect", function () {
    if (uniquesocket.id === players.white) {
      delete players.white;
    } else if (uniquesocket.id === players.black) {
      delete players.black;
    }

    if (Object.keys(players).length === 0) {
      gameStarted = false;
      chess.reset();
    }
  });

  uniquesocket.on("move", (move) => {
    try {
      if (!gameStarted) return;
      if (chess.turn() === "w" && uniquesocket.id !== players.white) return;
      if (chess.turn() === "b" && uniquesocket.id !== players.black) return;

      const result = chess.move(move);
      if (result) {
        currentPlayer = chess.turn();
        io.emit("move", move);
        io.emit("boardState", chess.fen());

        if (chess.isCheckmate()) {
          io.emit("gameOver", {
            winner: chess.turn() === "w" ? "Black" : "White",
            reason: "checkmate",
          });
        } else if (chess.isDraw()) {
          io.emit("gameOver", { winner: null, reason: "draw" });
        } else if (chess.isCheck()) {
          io.emit("check", chess.turn());
        }
      } else {
        uniquesocket.emit("invalidMove", move);
      }x    
    } catch (err) {
      console.log(err);
    //   uniquesocket.emit("invalidMove", move);
    }
  });

  uniquesocket.on("restartGame", () => {
    if (Object.values(players).includes(uniquesocket.id)) {
      chess.reset();
      gameStarted = true;
      io.emit("boardState", chess.fen());
      io.emit("gameStarted");
    }
  });

  if (Object.keys(players).length === 2 && !gameStarted) {
    gameStarted = true;
    io.emit("gameStarted");
    io.emit("boardState", chess.fen());
  }
});

server.listen(4000, function () {
  console.log("listening on 4000");
});
