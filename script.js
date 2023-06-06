var storage, input, operator;

const dom = {};
dom.display = document.querySelector(".display");
dom.leftButtons = document.querySelector(".left");
dom.rightButtons = document.querySelector(".right");

buildDOM();
pressAC();

function buildDOM() {
    addLeftButtons();
    addRightButtons();

    function addLeftButtons() {
        for (let i = 9; i >= 1; i--) {
            placeButton(i, i, pressDigit, dom.leftButtons);
        }
        placeButton('+/-', '+/-', pressPlusMinus, dom.leftButtons);
        placeButton('.', '.', pressDot, dom.leftButtons);
        placeButton(0, 0, pressDigit, dom.leftButtons);
    }

    function addRightButtons() {
        placeButton("Del", "del", pressDigit, dom.rightButtons);
        placeButton("AC", "ac", pressAC, dom.rightButtons);
    
        const operators = ["+", "-", "*", "/"];
        const operatorSymbols = ["+", "-", "×", "÷"];
        operators.forEach((operator, index) => {
            placeButton(operatorSymbols[index], operator, pressOperator, dom.rightButtons)
        });
        placeButton("%", "%", pressDigit, dom.rightButtons);
        placeButton("=", "=", pressOperator, dom.rightButtons);
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
    if (input.startsWith("0") || input.startsWith("-0")) {
        if (value == 0) return;
        input = input.replace("0", "");
    }
    input += value;
    updateDisplay(input);
}

function pressDot(e) {
    if (input.includes(".")) return;
    if (isEmptyString(input)) input = "0.";
    updateDisplay(input);
}

function pressPlusMinus(e) {
    if (!isEmptyString(content)) {
        input = getInvertedSignAsString(input);
        updateDisplay(input);
    }
    else {
        if (storage === null || operator !== "=") {
            input = "-0";
            updateDisplay(input);
        }
        else {
            storage = +getInvertedSignAsString(storage);
            updateDisplay(storage);
        }
    }

    function getInvertedSignAsString(num) {
        num = num.toString();
        if (num === "0") return "-0";
        return (+num * -1).toString();
        // Because (-0).toString -> "0"
    }
}

function pressOperator(e) {
    if (storage === null) {
        storage = +input;
    }
    else if (!isEmptyString(input)) {
        storage = getOperationResult(operator, storage, +input);
    }
    input = "";

    operator = e.currentTarget.getAttribute("data-value");
    updateDisplay(storage);
}

function pressAC() {
    storage = null;
    input = "";
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
    if (isEmptyString(content)) content = "0";
    if (isNaN(content)) content = "nope";
    dom.display.textContent = content;
}

function isEmptyString(string) {
    return string === "";
}