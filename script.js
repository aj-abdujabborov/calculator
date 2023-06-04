var cache = null;
var num = "0";
var operator = null;
// var display = "0";

const dom = {};
dom.numbers = document.querySelector(".numbers");
dom.display = document.querySelector(".display");
dom.operators = document.querySelector(".operators");

updateDisplay(0);
populateOperatorsInDOM();

for (let i = 0; i <= 9; i++) {
    const number = document.createElement("button");
    number.textContent = i;
    number.addEventListener("click", pressDigit);

    dom.numbers.appendChild(number);
}


function populateOperatorsInDOM() {
    const operators = ["+", "-", "*", "/"];
    for (const operator of operators) {
        const button = document.createElement("button");
        button.textContent = operator;
        button.addEventListener("click", pressOperator);
        button.setAttribute("data-value", operator);
        dom.operators.appendChild(button);
    }
}

function pressDigit(e) {
    const value = e.currentTarget.textContent;
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

    operator = e.currentTarget.getAttribute("data-value");
    updateDisplay(cache);
    num = "0";
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
