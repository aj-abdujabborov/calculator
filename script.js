var prevNum, nextNum, operator;

const dom = {};
dom.numbers = document.querySelector(".numbers");
dom.display = document.querySelector(".display");
dom.operators = document.querySelector(".operators");

buildDOM();
pressAC();

function buildDOM() {
    placeNumbers();
    placeDot();
    placeOperators();
    placeAC();

    function placeNumbers() {
        for (let i = 0; i <= 9; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            button.setAttribute("data-value", i);
            button.addEventListener("click", pressDigit);
            dom.numbers.appendChild(button);
        }
    }

    function placeDot() {
        const button = document.createElement("button");
        button.textContent = ".";
        button.setAttribute("data-value", ".");
        button.addEventListener("click", pressDigit);
        dom.numbers.appendChild(button);
    }

    function placeOperators() {
        const operators = ["+", "-", "*", "/", "="];
        const operatorSymbols = ["+", "-", "×", "÷", "="];
        operators.forEach((operator, index) => {
            const button = document.createElement("button");
            button.textContent = operatorSymbols[index];
            button.setAttribute("data-value", operator);
            button.addEventListener("click", pressOperator);
            dom.operators.appendChild(button);
        })
    }

    function placeAC() {
        const button = document.createElement("button");
        button.textContent = "AC";
        button.setAttribute("data-value", "ac");
        button.addEventListener("click", pressAC);
        dom.operators.appendChild(button);
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
