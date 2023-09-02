var numberNode;
var operationNode;
var blankNode;

function init() {
    document.querySelector("h2").innerHTML = "Configure Math Square [A]";
    initNumberNode();
    initOperationNode();
    initBlankNode();
    generateBoard();
}

function initNumberNode() {
    numberNode = document.createElement("div");
    numberNode.setAttribute("class", "number-box");

    const text = document.createElement("p");
    text.setAttribute("class", "number-label");
    text.innerHTML = "2";
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

function initBoardLine() {
    boardLine = document.createElement("div");
    boardLine.setAttribute("id", "board-line");
}

function updateSelector(n) {
    document.getElementById(n + "_label").innerHTML = document.getElementById(n + "_selector").value;
}

function generateBoard() {
    width = document.getElementById("x_selector").value;
    height = document.getElementById("y_selector").value;
    const board = document.querySelector(".board");
    board.style.gridTemplateColumns = "repeat(" + (width * 2 - 1) + ", 50px)";
    generateOperationArrays(width, height);
    board.replaceChildren();

    let index = 0;
    for (y = 0; y < height * 2; y++) {
        for (x = 0; x < width; x++) {
            if (y % 2 == 0) {
                board.appendChild(makeNumberNode(index));
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
    }
}

function generateOperationArrays(width, height) {
    operationColumns = [];
    for (x = 0; x < width; x++) {
        operationColumns.push([]);
        for (y = 0; y < height; y++) {
            operationColumns[x].push(Operation.Add);
        }
    }

    operationRows = [];
    for (y = 0; y < height; y++) {
        operationRows.push([]);
        for (x = 0; x < width; x++) {
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

function changeOperationButton(button) {
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