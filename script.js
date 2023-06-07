var storage, input, operator, lastButton;
const LAST_IS_DIGIT = 1;
const LAST_IS_OPERATOR = 2;
const LAST_IS_EQUALS = 3;

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
        placeButton("%", "%", pressPercent, dom.rightButtons);
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
    if (lastButton === LAST_IS_EQUALS) {
        storage = "";
    }

    const value = e.currentTarget.getAttribute("data-value");
    input += value;
    input = sanitizeInput(input);
    updateDisplay(input);

    lastButton = LAST_IS_DIGIT;
}

function pressDot(e) {
    if (input.includes(".")) return;
    input += "."
    input = sanitizeInput(input);
    updateDisplay(input);
}

function pressPlusMinus(e) {
    if (lastButton === LAST_IS_DIGIT || lastButton == LAST_IS_OPERATOR) {
        input = getInvertedSignAsString(input);
        updateDisplay(input);
    }
    else {
        storage = getInvertedSignAsString(storage);
        updateDisplay(storage);
    }
}

function pressPercent(e) {
    if (lastButton === LAST_IS_EQUALS || lastButton === LAST_IS_OPERATOR) {
        storage = getPercentedAsString(storage);
        updateDisplay(storage);
    }
    else {
        input = getPercentedAsString(input);
        updateDisplay(input);
    }
}

function pressOperator(e) {
    if (isEmptyString(storage)) {
        storage = input;
    }
    else if (!isEmptyString(input)) {
        storage = getOperationResult(operator, +storage, +input).toString();
    }
    input = "";

    operator = e.currentTarget.getAttribute("data-value");
    updateDisplay(storage);

    lastButton = LAST_IS_OPERATOR;
    if (operator === "=") lastButton = LAST_IS_EQUALS;

    function getOperationResult(operator, a, b) {
        this["+"] = (a,b) => (a + b);
        this["-"] = (a,b) => (a - b);
        this["*"] = (a,b) => (a * b);
        this["/"] = (a, b) => (b === 0 ? NaN : a / b);
        return this[operator](a, b);
    }
}

function pressAC() {
    storage = "";
    input = "";
    operator = null;
    lastButton = LAST_IS_DIGIT;
    updateDisplay(0);
}

function updateDisplay(content) {
    if (isEmptyString(content)) content = "0";
    if (isNaN(content)) content = "nope";
    dom.display.textContent = content;
}

function sanitizeInput(string) {
    if (string[0] === "0" && string[1] && string[1] !== ".") {
        return string.replace("0", "");
    }
    else if (string.slice(0,2) === "-0" && string[2] !== ".") {
        return string.replace("-0", "-");
    }
    else if (string[0] === ".") {
        return string.replace(".", "0.");
    }
    return string;
}

function getInvertedSignAsString(num) {
    num = num.toString();

    let dot = ""; 
    if (num.slice(-1) === ".") {
        dot = ".";
        num = num.slice(0, -1);
    }
    
    if (num === "0" || isEmptyString(num)) return "-0" + dot;
    // Because (-0).toString -> "0"
    
    return (+num * -1).toString() + dot;
}

function getPercentedAsString(num) {
    num = num.toString();

    let dot = ""; 
    if (num.slice(-1) === ".") {
        dot = ".";
        num = num.slice(0, -1);
    }

    if (num === "0" || isEmptyString(num)) return "0" + dot;
    else if (num === "-0") return "-0" + dot;

    return (+num / 100).toString();
}

function isEmptyString(string) {
    return string === "";
}
