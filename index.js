const sudoku = (function () {
    let board;

    function checkRow(currentCell, num) {
        for (let y = 0; y < 9; y++) {
            if (board[currentCell.x][y] === num && y !== currentCell.y) {
                return false;
            }
        }
        return true;
    }

    function checkCol(currentCell, num) {
        for (let x = 0; x < 9; x++) {
            if (board[x][currentCell.y] === num && x !== currentCell.x) {
                return false;
            }
        }
        return true;
    }

    function checkSquare(currentCell, num) {
        const innerSquares = [
            { start: 0, end: 2 },
            { start: 3, end: 5 },
            { start: 6, end: 8 },
        ];
        const squareRange = {
            x: innerSquares.find((element) => element.end >= currentCell.x),
            y: innerSquares.find((element) => element.end >= currentCell.y),
        };
        for (let x = squareRange.x.start; x <= squareRange.x.end; x++) {
            for (let y = squareRange.y.start; y <= squareRange.y.end; y++) {
                if (board[x][y] === num && (x !== currentCell.x || y !== currentCell.y)) {
                    return false;
                }
            }
        }
        return true;
    }

    function validateCell(currentCell, num) {
        return checkRow(currentCell, num) && checkCol(currentCell, num) && checkSquare(currentCell, num);
    }

    function findEmptyCell() {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (!board[x][y]) {
                    return { x, y };
                }
            }
        }
        return false;
    }

    function solve() {
        const firstEmptyCell = { ...findEmptyCell(), iterations: 0 };

        function solvePuzzle() {
            const emptyCell = findEmptyCell();
            if (!emptyCell) return true;
            for (let num = 1; num <= 9; num++) {
                if (emptyCell.x === firstEmptyCell.x && emptyCell.y === firstEmptyCell.y) {
                    firstEmptyCell.iterations++;
                }
                if (validateCell(emptyCell, num)) {
                    board[emptyCell.x][emptyCell.y] = num;
                    if (solvePuzzle()) {
                        return true;
                    }
                }
                board[emptyCell.x][emptyCell.y] = "";
                if (firstEmptyCell.iterations > 9) return false;
            }
            return false;
        }
        return solvePuzzle();
    }

    function setBoard(newBoard) {
        if (Array.isArray(newBoard)) {
            board = newBoard;
        }
    }

    function getBoard() {
        return board;
    }

    return { validateCell, setBoard, solve, getBoard };
})();

const htmlGame = {
    buildGridBoard: function () {
        const board = document.querySelector(".board");
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement("input");
                cell.classList.add("cell", `x-${i + 1}`, `y-${j + 1}`);
                cell.setAttribute("type", "text");
                cell.setAttribute("maxlength", "1");
                cell.setAttribute("inputmode", "numeric");
                cell.dataset.x = i;
                cell.dataset.y = j;
                cell.dataset.solution = 0;
                cell.dataset.boardValue = 0;
                board.append(cell);
            }
        }
    },

    // validateInput: function (input) {
    //     if (typeof input == "number") {
    //         return true;
    //     }
    //     return false;
    // },

    get2DArray: function () {
        const board = [...Array(9)].map((e) => Array(9));
        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell) => (board[cell.dataset.x][cell.dataset.y] = parseInt(cell.value) || ""));
        return board;
    },

    setBoard: function () {
        const board = this.get2DArray();
        sudoku.setBoard(board);
    },

    solve: function () {
        this.setBoard();
        if (sudoku.solve()) {
            const solvedBoard = sudoku.getBoard();
            this.updateSolution(solvedBoard);
            return true;
        } else {
            alert("Unsolavable Puzzle!");
            return false;
        }
    },

    updateSolution: function (board) {
        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell) => (cell.dataset.solution = board[cell.dataset.x][cell.dataset.y]));
        this.setBoard();
    },

    boardValue: function () {
        let boardValue = 0;
        const cells = document.querySelectorAll(".cell");
        for (cell of cells) {
            if (cell.value == 0) {
                let cellCoords = { x: parseInt(cell.dataset.x), y: parseInt(cell.dataset.y) };
                for (let num = 1; num <= 9; num++) {
                    if (sudoku.validateCell(cellCoords, num)) {
                        boardValue++;
                    }
                }
            }
        }
        return boardValue;
    },

    showHint: function () {
        console.log(this.boardValue());
    },

    showSolution: function () {
        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell) => (cell.value = cell.dataset.solution));
    },

    clearBoard: function () {
        const cells = document.querySelectorAll(".cell");

        cells.forEach((cell) => (cell.value = ""));
        cells.forEach((cell) => (cell.dataset.solution = 0));
    },

    solveBtn: document.querySelector(".solve-btn"),
    hintBtn: document.querySelector(".hint-btn"),
    clearBtn: document.querySelector(".clear-btn"),
};

const main = (function () {
    window.addEventListener("load", htmlGame.buildGridBoard);

    htmlGame.solveBtn.addEventListener("click", function (e) {
        if (htmlGame.solve()) {
            htmlGame.showSolution();
        }
    });

    htmlGame.hintBtn.addEventListener("click", function (e) {
        if (htmlGame.solve()) {
            htmlGame.showHint();
        }
    });

    htmlGame.clearBtn.addEventListener("click", htmlGame.clearBoard);
})();
