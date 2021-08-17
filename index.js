const sudoku = {
    board: null,

    setBoard: function (newBoard) {
        this.board = newBoard;
    },

    getBoard: function () {
        return this.board;
    },

    checkRow: function (currentCell, num) {
        for (let i = 0; i < 9; i++) {
            if (this.board[currentCell.x][i] === num && i !== currentCell.y) {
                return false;
            }
        }
        return true;
    },

    checkCol: function (currentCell, num) {
        for (let i = 0; i < 9; i++) {
            if (this.board[i][currentCell.y] === num && i !== currentCell.x) {
                return false;
            }
        }
        return true;
    },

    checkSquare: function (currentCell, num) {
        const innerSquares = [
            { start: 0, end: 2 },
            { start: 3, end: 5 },
            { start: 6, end: 8 },
        ];
        const squareRange = {
            x: innerSquares.find((element) => element.end >= currentCell.x),
            y: innerSquares.find((element) => element.end >= currentCell.y),
        };
        for (let i = squareRange.x.start; i <= squareRange.x.end; i++) {
            for (let j = squareRange.y.start; j <= squareRange.y.end; j++) {
                if (
                    this.board[i][j] === num &&
                    (i !== currentCell.x || j !== currentCell.y)
                ) {
                    return false;
                }
            }
        }
        return true;
    },

    validateCell: function (currentCell, num) {
        return (
            this.checkRow(currentCell, num) &&
            this.checkCol(currentCell, num) &&
            this.checkSquare(currentCell, num)
        );
    },

    solve: function () {
        const emptyCell = this.findEmptyCell();
        if (!emptyCell) return true;

        for (let num = 1; num <= 9; num++) {
            if (this.validateCell(emptyCell, num)) {
                this.board[emptyCell.x][emptyCell.y] = num;
                if (this.solve()) return true;
            }
            this.board[emptyCell.x][emptyCell.y] = 0;
        }
        return false;
    },

    findEmptyCell: function () {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (!this.board[x][y]) {
                    return { x, y };
                }
            }
        }
        return false;
    },
};

const HTMLGame = {
    solveBtn: document.querySelector('.solve-btn'),

    buildGridBoard: function () {
        const board = document.querySelector('.board');
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('input');
                cell.classList.add('cell', `x-${i + 1}`, `y-${j + 1}`);
                cell.setAttribute('type', 'number');
                cell.setAttribute('min', '0');
                cell.setAttribute('max', '9');
                cell.dataset.x = i;
                cell.dataset.y = j;
                board.append(cell);
            }
        }
    },

    get2DArray: function () {
        const board = [...new Array(9)].map((el) => new Array(9));
        const cells = document.querySelectorAll('.cell');
        cells.forEach(
            (cell) =>
                (board[cell.dataset.x][cell.dataset.y] = parseInt(cell.value))
        );
        return board;
    },

    solvePuzzle: function () {
        const board = this.get2DArray();
        sudoku.setBoard(board);
        sudoku.solve();
        return sudoku.getBoard();
    },

    showSolution: function (board) {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(
            (cell) => (cell.value = board[cell.dataset.x][cell.dataset.y])
        );
    },
};

const main = (function () {
    window.addEventListener('load', HTMLGame.buildGridBoard);

    HTMLGame.solveBtn.addEventListener('click', function (e) {
        const solvedBoard = HTMLGame.solvePuzzle();
        HTMLGame.showSolution(solvedBoard);
    });
})();
