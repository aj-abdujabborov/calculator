let storage, input, operator, lastButton;
const LAST_IS_DIGIT = 1;
const LAST_IS_OPERATOR = 2;
const LAST_IS_EQUALS = 3;

const dom = {};
dom.display = document.querySelector(".display");
dom.leftButtons = document.querySelector(".left");
dom.rightButtons = document.querySelector(".right");
dom.audios = document.querySelectorAll("#clickAudio");

buildDOM();
pressAC();

function buildDOM() {
    addLeftButtons();
    addRightButtons();

    function addLeftButtons() {
        for (let i = 7; i <= 9; i++) {
            placeButton(i, i, pressDigit, dom.leftButtons);
        }
        for (let i = 4; i <= 6; i++) {
            placeButton(i, i, pressDigit, dom.leftButtons);
        }
        for (let i = 1; i <= 3; i++) {
            placeButton(i, i, pressDigit, dom.leftButtons);
        }
        placeButton(0, 0, pressDigit, dom.leftButtons);
        placeButton('.', '.', pressDot, dom.leftButtons);
        placeButton('±', '+/-', pressPlusMinus, dom.leftButtons);
    }

    function addRightButtons() {
        placeButton("del", "del", pressDelete, dom.rightButtons);
        placeButton("AC", "ac", pressAC, dom.rightButtons);
    
        const operators = ["+", "-", "*", "/"];
        const operatorSymbols = ["+", "−", "×", "÷"];
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
        button.addEventListener("click", playButtonClick);
        parent.appendChild(button);
    }
}

function pressDigit(e) {
    if (lastButton === LAST_IS_EQUALS) {
        storage = "";
    }

    const value = e.currentTarget.getAttribute("data-value");
    input += value;
    input = sanitizeNumber(input);
    updateDisplay(input);

    lastButton = LAST_IS_DIGIT;
}

function pressDot(e) {
    if (input.includes(".")) return;
    input += "."
    input = sanitizeNumber(input);
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

function pressDelete(e) {
    if (lastButton === LAST_IS_DIGIT) {
        input = input.slice(0, -1);
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
    if (isNaN(content)) {
        content = "nope";
    }
    else {
        [content, dot] = getTrailingDot(content);
        [content, negative] = getPrefixedNegative(content);
        if (content.length > 10) {
            content = (+content).toPrecision(10);
        }
        content = negative + content + dot;
    }
    dom.display.textContent = content;
}

function sanitizeNumber(string) {
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

    [num, dot] = getTrailingDot(num);
    if (num === "0" || isEmptyString(num)) return "-0" + dot;
    // Because (-0).toString -> "0"
    
    return (+num * -1).toString() + dot;
}

function getPercentedAsString(num) {
    num = num.toString();

    [num, dot] = getTrailingDot(num);
    if (num === "0" || isEmptyString(num)) return "0" + dot;
    else if (num === "-0") return "-0" + dot;

    return (+num / 100).toString();
}

function isEmptyString(string) {
    return string === "";
}

function getTrailingDot(string) {
    string = string.toString();
    let dot = ""; 
    if (string.slice(-1) === ".") {
        dot = ".";
        string = string.slice(0, -1);
    }
    return [string, dot];
}

function getPrefixedNegative(string) {
    string = string.toString();
    let negative = ""; 
    if (string.at(0) === "-") {
        negative = "-";
        string = string.slice(1);
    }
    return [string, negative];
}

function playButtonClick() {
    let soundInd = Math.floor(Math.random() * 6);
    const audio = dom.audios[soundInd];
    audio.currentTime = 0;
    audio.play();
}

