var height;
var width;
var boardlength;
var operationRows;
var operationColumns;
var targetRows = [];
var targetColumns = [];
var isSolving = false;
var tick = 0;
var ticksPerUpdate = 1000;

function startSolveLoop(possibleNumbers) {
    isSolving = true;
    solveBoard([], [], possibleNumbers, []);

    /*let currentSolveState = new SolveState([], [], possibleNumbers, []);
    while (isSolving) {
        currentSolveState = solveBoard(currentSolveState.boardNumbers, currentSolveState.boardsToTest, currentSolveState.options, currentSolveState.optionsToTest);
        if (currentSolveState == null) {
            isSolving = false;
        } else if (++updateTick == ticksPerUpdate) {
            showBoardNumbers(currentSolveState.boardNumbers);
            updateTick = 0;
        }
    }*/
}

function solveBoard(boardNumbers, boardsToTest, options, optionsToTest) {
    //debugSolveRound(boardNumbers, boardsToTest, options, optionsToTest, ++solveRound);
    if (isBoardSolved(boardNumbers)) {
        setBoardSolved(boardNumbers);
        debugLog("Process ended");
    } else {
        // Calculate new boards
        let currentBoard;
        for (let i = 0; i < options.length; i++) {
            currentBoard = boardNumbers.concat([options[i]]);

            if (isBoardValid(currentBoard, currentBoard.length - 1)) {
                boardsToTest.push(currentBoard);
                const opts = options.filter((x) => x != options[i]);
                optionsToTest.push(opts);
            }
        }

        // Solve next board, if there is one
        if (boardsToTest.length == 0) {
            setBoardSolved([]);
            debugLog("Program ended, no solution found.");
        } else {
            if (++tick == ticksPerUpdate) {
                showBoardNumbers(boardNumbers);
                tick = 0;
                setTimeout(() => solveBoard(boardsToTest.shift(), boardsToTest, optionsToTest.shift(), optionsToTest), 0);
            } else {
                solveBoard(boardsToTest.shift(), boardsToTest, optionsToTest.shift(), optionsToTest);
            }
        }
    }
}

function isBoardSolved(boardNumbers) {
    for (let i = 0; i < boardlength; i++) {
        if (boardNumbers[i] == null) {
            return false;
        }
    }
    return true;
}

function isBoardValid(boardNumbers, n) {
    if (n < width - 1) {
        return true;
    }

    const row = Math.floor(n / width);
    const column = n % width;

    // Check row and column
    return isRowValid(row, boardNumbers.slice(row * width, (row + 1) * width), targetRows[row])
            && isColumnValid(column, getColumnNumbers(boardNumbers, column), targetColumns[column]);
}

function getColumnNumbers(boardNumbers, x) {
    let columnNumbers = [];
    for (let j = x; j < boardlength; j = j + width) {
        columnNumbers.push(boardNumbers[j]);
    }
    return columnNumbers;
}

function isRowValid(y, numbers, target) {
    product = numbers[0];
    for (let x = 1; x < width; x++) {
        if (numbers[x] == null) {
            return true;
        }
        switch (operationRows[y][x-1].name) {
            case "Add":
                product += numbers[x];
                break;
            case "Sub":
                product -= numbers[x];
                break;
            case "Mul":
                product *= numbers[x];
                break;
            case "Div":
                product /= numbers[x];
                break;
        }
    }
    return product == target;
}

function isColumnValid(x, numbers, target) {
    product = numbers[0];
    for (let y = 1; y < height; y++) {
        if (numbers[y] == null) {
            return true;
        }
        switch (operationColumns[x][y-1].name) {
            case "Add":
                product += numbers[y];
                break;
            case "Sub":
                product -= numbers[y];
                break;
            case "Mul":
                product *= numbers[y];
                break;
            case "Div":
                product /= numbers[y];
                break;
        }
    }
    return product == target;
}