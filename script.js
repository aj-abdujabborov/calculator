var prevNum, nextNum, operator;

const dom = {};
dom.numbers = document.querySelector(".numbers");
dom.display = document.querySelector(".display");
dom.operators = document.querySelector(".operators");

buildDOM();
pressAC();

function buildDOM() {
    placeNumbers();
    placeOperators();
    placeAC();

    function placeNumbers() {
        for (let i = 9; i >= 1; i--) {
            placeButton(i, i, pressDigit, dom.numbers);
        }
        placeButton('+/-', '+/-', pressDigit, dom.numbers);
        placeButton('.', '.', pressDigit, dom.numbers);
        placeButton(0, 0, pressDigit, dom.numbers);
    }

    function placeOperators() {
        const operators = ["+", "-", "*", "/", "="];
        const operatorSymbols = ["+", "-", "×", "÷", "="];
        operators.forEach((operator, index) => {
            placeButton(operatorSymbols[index], operator, pressOperator, dom.operators)
        });
    }

    function placeAC() {
        const button = document.createElement("button");
        button.textContent = "AC";
        button.setAttribute("data-value", "ac");
        button.addEventListener("click", pressAC);
        dom.operators.appendChild(button);
    }

    function placeButton(text, data, callback, parent) {
        const button = document.createElement("button");
        button.textContent = text;
        button.setAttribute("data-value", data);
        button.addEventListener("click", callback);
        parent.appendChild(button);
    }
}

function pressDigit(e) {
    const value = e.currentTarget.getAttribute("data-value");
    if (value === ".") {
        if (nextNum.includes(".")) return;
        if (nextNum === "") nextNum = "0";
    }
    nextNum += value;
    updateDisplay(nextNum);
}

function pressOperator(e) {
    if (prevNum === null) {
        prevNum = +nextNum;
    }
    else if (nextNum !== "") {
        prevNum = getOperationResult(operator, prevNum, +nextNum);
    }
    nextNum = "";

    operator = e.currentTarget.getAttribute("data-value");
    updateDisplay(prevNum);
}

function pressAC() {
    prevNum = null;
    nextNum = "";
    operator = null;
    updateDisplay(0);
}

function getOperationResult(operator, a, b) {
    this["+"] = (a,b) => (a + b);
    this["-"] = (a,b) => (a - b);
    this["*"] = (a,b) => (a * b);
    this["/"] = (a, b) => (b === 0 ? NaN : a / b);
    this["="] = (a, b) => (b);
    return this[operator](a, b);
}

function updateDisplay(content) {
    if (content === "") content = "0";
    if (isNaN(content)) content = "nope";
    dom.display.textContent = content;
}
