var prevNum, nextNum, operator;

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
    if (nextNum.startsWith("0") || nextNum.startsWith("-0")) {
        if (value == 0) return;
        nextNum = nextNum.replace("0", "");
    }
    nextNum += value;
    updateDisplay(nextNum);
}

function pressDot(e) {
    if (nextNum.includes(".")) return;
    if (nextNum === "") nextNum = "0.";
    updateDisplay(nextNum);
}

function pressPlusMinus(e) {
    if (nextNum !== "") {
        nextNum = getInvertedSignAsString(nextNum);
        updateDisplay(nextNum);
    }
    else {
        if (prevNum === null || operator !== "=") {
            nextNum = "-0";
            updateDisplay(nextNum);
        }
        else {
            prevNum = +getInvertedSignAsString(prevNum);
            updateDisplay(prevNum);
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
