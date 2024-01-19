var numberNode;
var operationNode;
var blankNode;
var equalsNode;
var targetNode;
var numberBoxes;
var operationBoxes;
var solveButton;
var board;

function init() {
    //document.querySelector("h2").innerHTML = "Configure Math Square [A]";
    board = document.querySelector(".board");
    solveButton = document.querySelector(".solve");
    initNumberNode();
    initOperationNode();
    initBlankNode();
    initEqualsNode();
    initTargetNode();
    generateBoard();
    debugLog("Project loaded!");
}

function initNumberNode() {
    numberNode = document.createElement("div");
    numberNode.setAttribute("class", "number-box");

    const text = document.createElement("p");
    text.setAttribute("class", "number-label");
    text.innerHTML = "?";
    numberNode.appendChild(text);
}

function initOperationNode() {
    operationNode = document.createElement("div");
    operationNode.setAttribute("class", "operation-box");

    const button = document.createElement("button");
    button.setAttribute("class", "operation-button");
    button.setAttribute("onclick", "changeOperationButton(this)");
    operationNode.appendChild(button);

    const text = document.createElement("p");
    text.setAttribute("class", "operation-label");
    text.innerHTML = "+";
    button.appendChild(text);
}

function initBlankNode() {
    blankNode = document.createElement("div");
    blankNode.setAttribute("id", "blank-box");
}

function initEqualsNode() {
    equalsNode = document.createElement("div");
    equalsNode.setAttribute("class", "equals-box");

    const text = document.createElement("p");
    text.setAttribute("class", "operation-label");
    text.innerHTML = "=";
    equalsNode.appendChild(text);
}

function initTargetNode() {
    targetNode = document.createElement("div");
    targetNode.setAttribute("class", "target-box");

    const field = document.createElement("input");
    field.setAttribute("class", "target-field");
    field.setAttribute("type", "number");
    field.setAttribute("onchange", "updateTargetField(this)");
    targetNode.appendChild(field);
}

function updateSelector(n) {
    document.getElementById(n + "_label").innerHTML = document.getElementById(n + "_selector").value;
}

function generateBoard() {
    width = Number(document.getElementById("x_selector").value);
    height = Number(document.getElementById("y_selector").value);
    boardlength = width * height;
    board.style.gridTemplateColumns = "repeat(" + (width * 2 + 1) + ", 50px)";
    generateOperationArrays(width, height);
    document.getElementById("pvalues_label").innerHTML = "1-" + boardlength;
    board.replaceChildren();

    let index = 0;
    let isNumberRow = true;
    for (let y = 0; y < height * 2 - 1; y++) {
        isNumberRow = y % 2 == 0;
        for (let x = 0; x < width; x++) {
            if (isNumberRow) {
                board.appendChild(makeNumberNode(index++));
                if (x < width - 1) {
                    board.appendChild(makeOperationNode(x.toString(), (y / 2).toString(), true));
                }
            } else if (y < height * 2 - 1) {
                board.appendChild(makeOperationNode(x.toString(), Math.floor(y / 2).toString(), false));
                if (x < width - 1) {
                    board.appendChild(blankNode.cloneNode(true));
                }
            }
        }
        if (isNumberRow) {
            board.appendChild(makeEqualsNode(true));
            board.appendChild(makeTargetNode(y / 2, true));
        } else {
            board.appendChild(blankNode.cloneNode(true));
            board.appendChild(blankNode.cloneNode(true));
        }
    }

    for (let y = 0; y < 2; y++) {
        for (let x = 0; x < width * 2 - 1; x++) {
            if (x % 2 == 0) {
                if (y == 0) {
                    board.appendChild(makeEqualsNode(false));
                } else {
                    board.appendChild(makeTargetNode(x / 2, false));
                }
            } else {
                board.appendChild(blankNode.cloneNode(true));
            }
        }
        board.appendChild(blankNode.cloneNode(true));
        board.appendChild(blankNode.cloneNode(true));
    }
    
    numberBoxes = document.querySelectorAll(".number-box");
    operationBoxes = document.querySelectorAll(".operation-box");
    solveButton.setAttribute("id", "off");
    solveButton.innerHTML = "Solve";
    for (let k = 0; k < operationBoxes.length; k++) {
        operationBoxes[k].removeAttribute("disabled");
    }
}

function generateOperationArrays(width, height) {
    operationColumns = [];
    for (let x = 0; x < width; x++) {
        operationColumns.push([]);
        for (let y = 0; y < height - 1; y++) {
            operationColumns[x].push(Operation.Add);
        }
    }

    operationRows = [];
    for (let y = 0; y < height; y++) {
        operationRows.push([]);
        for (let x = 0; x < width - 1; x++) {
            operationRows[y].push(Operation.Add);
        }
    }
}

function makeNumberNode(index) {
    const node = numberNode.cloneNode(true);
    node.setAttribute("value", index);
    return node;
}

function makeOperationNode(x, y, row = false) {
    const node = operationNode.cloneNode(true);
    if (row) {
        node.setAttribute("class", "operation-box operation-row");
    } else {
        node.setAttribute("class", "operation-box operation-column");
    }
    node.setAttribute("data-x", x);
    node.setAttribute("data-y", y);
    return node;
}

function makeEqualsNode(row = false) {
    if (row) {
        return equalsNode.cloneNode(true);
    } else {
        const node = equalsNode.cloneNode(true);
        node.firstChild.innerHTML = "||";
        return node;
    }
}

function makeTargetNode(i, row = false) {
    const node = targetNode.cloneNode(true);
    if (row) {
        node.setAttribute("class", "target-box target-row");
    } else {
        node.setAttribute("class", "target-box target-column");
    }
    node.setAttribute("data-i", i);
    return node;
}

function changeOperationButton(button) {
    if (isSolving) {
        return;
    }

    const box = button.parentElement;
    const x = parseInt(box.dataset.x);
    const y = parseInt(box.dataset.y);

    if (box.classList.contains("operation-row")) {
        const op = operationRows[y][x].nextOperation();
        operationRows[y][x] = op;
        button.firstChild.innerHTML = op.symbol();
    } else if (box.classList.contains("operation-column")) {
        const op = operationColumns[x][y].nextOperation();
        operationColumns[x][y] = op;
        button.firstChild.innerHTML = op.symbol();
    }
}

function updateTargetField(field) {
    const box = field.parentElement;
    const i = Number(box.dataset.i);
    const num = Number(field.value);
    if (box.classList.contains("target-row")) {
        targetRows[i] = num;
    } else if (box.classList.contains("target-column")) {
        targetColumns[i] = num;
    }
}

function onSolveClicked() {
    if (isSolving) {
        return;
    }

    for (let x = 0; x < width; x++) {
        if (targetColumns[x] == null) {
            window.alert("Missing target number in column " + x + ".");
            return;
        }
    }
    for (let y = 0; y < height; y++) {
        if (targetRows[y] == null) {
            window.alert("Missing target number in row " + y + ".");
            return;
        }
    }

    for (let k = 0; k < numberBoxes.length; k++) {
        numberBoxes[k].firstChild.setAttribute("class", "number-label-solving");
    }
    solveButton.setAttribute("id", "on");
    isSolving = true;
    solveButton.innerHTML = "Solving...";
    document.getElementById("x_selector").setAttribute("disabled", "");
    document.getElementById("y_selector").setAttribute("disabled", "");
    const operationsBoxes = document.querySelectorAll("operation-box");
    for (let k = 0; k < operationsBoxes.length; k++) {
        operationsBoxes[k].setAttribute("disabled", "");
    }

    const possibleNumbers = [];
    for (let k = 1; k <= boardlength; k++) {
        possibleNumbers.push(k);
    }
    startSolveLoop(possibleNumbers);
}

function showBoardNumbers(boardNumbers) {
    for (let k = 0; k < numberBoxes.length; k++) {
        i = parseInt(numberBoxes[k].getAttribute("value"));
        if (boardNumbers[i] == null) {
            numberBoxes[k].firstChild.innerHTML = "";
        } else {
            numberBoxes[k].firstChild.innerHTML = boardNumbers[i];
        }
    }
}

function setBoardSolved(boardNumbers) {
    isSolving = false;
    showBoardNumbers(boardNumbers);
    for (let k = 0; k < numberBoxes.length; k++) {
        numberBoxes[k].firstChild.setAttribute("class", "number-label");
    }
    solveButton.innerHTML = "Solved!";
    document.getElementById("x_selector").removeAttribute("disabled");
    document.getElementById("y_selector").removeAttribute("disabled");
}

function debugLog(message) {
    log = document.querySelector(".log");
    log.innerHTML += " [" + message + "] ";
}

function debugSolveRound(board, boards, option, options, solveRound) {
    debug = document.querySelector(".debug");
    element = document.createElement("p");
    element.innerHTML = "<b>-- ROUND " + solveRound + " -- </b> <br>Current Board: " + board;
    /*element.innerHTML = "<b>-- NEW ROUND -- </b> <br>Current Board: " + board + " <br>Next Boards: ";
    for (i = 0; i < boards.length; i++) {
        element.innerHTML += "[" + boards[i] + "] ";
    }
    element.innerHTML += "<br>Current Options: " + option + " <br>Next Options: ";
    for (i = 0; i < options.length; i++) {
        element.innerHTML += "[" + options[i] + "] ";
    }*/
    debug.appendChild(element);
}