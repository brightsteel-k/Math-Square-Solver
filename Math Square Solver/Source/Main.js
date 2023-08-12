var numberNode;
var operationNode;

function init() {
    initNumberNode();
    initOperationNode();
    generateBoard();
}

function initNumberNode() {
    numberNode = document.createElement("div");
    numberNode.setAttribute("id", "number-box");

    var text = document.createElement("p");
    text.setAttribute("id", "number-label");
    text.innerHTML = "X";
    numberNode.appendChild(text);
}

function initOperationNode() {
    operationNode = document.createElement("button");
    operationNode.setAttribute("id", "operation-button");

    var text = document.createElement("p");
    text.setAttribute("id", "operation-label");
    text.innerHTML = "+";
    operationNode.appendChild(text);
}

function updateSelector(n) {
    document.getElementById(n + "_label").innerHTML = document.getElementById(n + "_selector").value;
}

function generateBoard() {
    const width = document.getElementById("x_selector").value;
    const height = document.getElementById("y_selector").value;
    const board = document.querySelector(".board");
    board.replaceChildren();
    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            board.appendChild(numberNode.cloneNode(true));
            if (x < width - 1) {
                board.appendChild(operationNode.cloneNode(true));
            }
        }
        const lineBreak = document.createElement("br");
        board.appendChild(lineBreak);
    }
}