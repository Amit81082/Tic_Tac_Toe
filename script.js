document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    const restartBtn = document.getElementById("restartBtn");
    const statusText = document.getElementById("statusText");
    const themeToggle = document.getElementById("themeToggle");
    const scoreboard = document.getElementById("scoreboard");

    let currentPlayer = "X";
    let cells = Array(9).fill(null);
    let clickSound = new Audio("click.mp3");
    let winSound = new Audio("win.mp3");
    let drawSound = new Audio("draw.mp3");

    let scores = JSON.parse(localStorage.getItem("ticTacToeScores")) || { X: 0, O: 0 };

    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    function createBoard() {
        board.innerHTML = "";
        cells.forEach((_, index) => {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.index = index;
            cell.addEventListener("click", () => makeMove(index, cell));
            board.appendChild(cell);
        });
    }

    function playSound(sound) {
        sound.currentTime = 0; // 🔥 Instant play without delay
        sound.play();
    }

    function makeMove(index, cell) {
        if (cells[index] || checkWinner()) return;
        cells[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());

        playSound(clickSound); // ✅ Click sound fix

        if (checkWinner()) {
            statusText.textContent = `${currentPlayer} Wins! 🎉`;
            highlightWinningCells();
            handleWin(currentPlayer);
        } else if (!cells.includes(null)) {
            statusText.textContent = "Draw! 😐";
            playSound(drawSound);
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
        }
    }

    function checkWinner() {
        return winPatterns.find(comb =>
            cells[comb[0]] &&
            cells[comb[0]] === cells[comb[1]] &&
            cells[comb[1]] === cells[comb[2]]
        );
    }

    function highlightWinningCells() {
        const winningPattern = checkWinner();
        if (winningPattern) {
            winningPattern.forEach(index => {
                board.children[index].classList.add("win");
            });
        }
    }

    function restartGame() {
        cells.fill(null);
        currentPlayer = "X";
        statusText.textContent = "Tic-Tac-Toe";
        createBoard();
        playSound(clickSound); // ✅ Restart Button Sound
    }

    function handleWin(winner) {
        playSound(winSound); // ✅ Winning Sound
        updateScore(winner);

        const victoryGif = document.getElementById("victoryGif");
        victoryGif.classList.add("show");

        setTimeout(() => {
            victoryGif.classList.remove("show");
        }, 3000);
    }

    function updateScore(winner) {
        if (winner) {
            scores[winner]++;
            localStorage.setItem("ticTacToeScores", JSON.stringify(scores));
        }
        scoreboard.innerHTML = `X: ${scores.X} | O: ${scores.O}`;
    }

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        playSound(clickSound); // ✅ Theme Toggle Sound
    });

    restartBtn.addEventListener("click", restartGame);

    createBoard();
    updateScore();
});
