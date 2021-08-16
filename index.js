const sudoku = {
    board: [
        [, , , , , , , ,],
        [, , , , , , , ,],
        [, , , , , , , ,],
        [, , , , , , , ,],
        [, , , , , , , ,],
        [, , , , , , , ,],
        [, , , , , , , ,],
        [, , , , , , , ,],
        [, , , , , , , ,],
    ],

    setBoard: function (newBoard) {
        this.board = newBoard;
    },

    getBoard: function () {
        return this.board;
    },

    get2DArray: function () {
        const board = [[], [], [], [], [], [], [], [], []];
        const cells = document.querySelectorAll('.cell');
        cells.forEach(
            (cell) =>
                (board[cell.dataset.x][cell.dataset.y] = parseInt(cell.value))
        );
        return board;
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
        const limits = [
            { start: 0, end: 2 },
            { start: 3, end: 5 },
            { start: 6, end: 8 },
        ];
        const squareRange = {
            x: limits.find((element) => element.end >= currentCell.x),
            y: limits.find((element) => element.end >= currentCell.y),
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

    solvePuzzle: function () {
        const emptyCell = this.findEmptyCell();
        if (!emptyCell) return true;

        for (let num = 1; num <= 9; num++) {
            if (this.validateCell(emptyCell, num)) {
                this.board[emptyCell.x][emptyCell.y] = num;
                if (this.solvePuzzle()) return true;
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

const buildGridBoard = (function () {
    const board = document.querySelector('.board');
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('input');
            cell.classList.add('cell');
            cell.classList.add(`x-${i + 1}`);
            cell.classList.add(`y-${j + 1}`);
            cell.setAttribute('type', 'number');
            cell.setAttribute('min', '0');
            cell.setAttribute('max', '9');
            cell.dataset.x = i;
            cell.dataset.y = j;
            board.append(cell);
        }
    }
})();

function solve() {
    const board = sudoku.get2DArray();
    sudoku.setBoard(board);
    sudoku.solvePuzzle();
    return sudoku.getBoard();
}

function showSolution(board) {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(
        (cell) => (cell.value = board[cell.dataset.x][cell.dataset.y])
    );
}

const solveBtn = document.querySelector('.solve-btn');
solveBtn.addEventListener('click', function (e) {
    const solvedBoard = solve();
    showSolution(solvedBoard);
});
