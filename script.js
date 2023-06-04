var cache = null;
var num = "0";
var operator = null;
// var display = "0";

const dom = {};
dom.numbers = document.querySelector(".numbers");
dom.display = document.querySelector(".display");
dom.operators = document.querySelector(".operators");

buildDOM();
updateDisplay(0);

function buildDOM() {
    placeNumbers();
    placeOperators();

    function placeNumbers() {
        for (let i = 0; i <= 9; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            button.setAttribute("data-value", i);
            button.addEventListener("click", pressDigit);
            dom.numbers.appendChild(button);
        }
    }

    function placeOperators() {
        const operators = ["+", "-", "*", "/"];
        const operatorSymbols = ["+", "-", "×", "÷"];
        operators.forEach((operator, index) => {
            const button = document.createElement("button");
            button.textContent = operatorSymbols[index];
            button.setAttribute("data-value", operator);
            button.addEventListener("click", pressOperator);
            dom.operators.appendChild(button);
        })
    }
}

function pressDigit(e) {
    const value = e.currentTarget.getAttribute("data-value");
    if (num == "0") {
        num = value;
    }
    else {
        num += value;
    }

    updateDisplay(num);
}

function pressOperator(e) {
    if (cache === null) {
        cache = +num;
    }
    else {
        cache = doOperation(operator, cache, +num);
    }
    num = "0";

    operator = e.currentTarget.getAttribute("data-value");
    updateDisplay(cache);
}

function doOperation(operator, a, b) {
    this["+"] = (a,b) => (a + b);
    this["-"] = (a,b) => (a - b);
    this["*"] = (a,b) => (a * b);
    this["/"] = (a, b) => (b === 0 ? "nope" : a / b);
    return this[operator](a, b);
}

function updateDisplay(content) {
    dom.display.textContent = content;
}
