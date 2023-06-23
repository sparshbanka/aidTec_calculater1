
const topScreen = document.getElementById("nums-top");
const bottomScreen = document.getElementById("nums-bottom");
const calculator = document.getElementById("calculator");
const calculatorInterface = document.getElementById("calculator-interface");
const calculatorScreen = document.getElementById("calculator-screen");
const calcValues = {
    num1: "1", num2: "2", num3: "3", num4: "4", num5: "5", num6: "6",
    num7: "7", num8: "8", num9: "9", num0: "0", comma: ",", sum: "+",
    substract: "-", divide: "÷", multiply: "x", factorial: "!", overX: "1/",
    equalTo: "=", squareRoot: "√", cubeRoot: "∛", squarePower: "²",
    pi: "3,1415926535897932384", euler: "2,7182818284590452353"};
const keyboardSymbols = {
    "1": "num1", "2": "num2", "3": "num3", "4": "num4", "5": "num5",
    "6": "num6", "7": "num7", "8": "num8", "9": "num9", "0": "num0",
    "Backspace": "del1", "Delete": "clear", ",": "comma",
    "+": "sum", "-": "substract", "/": "divide", "*": "multiply",
    "Enter": "equalTo", "=": "equalTo", "e": "euler"
}
var givenResult = false;
var resultValue = "0";
var colorNum = 0;
var record = [];


function setUp() {
   


    for (idName of document.getElementsByClassName("button")) {
        buttonAction(idName);
    }
    document.addEventListener("keydown", keyboardButtons, false);
}


function multiColor(title) {
    if (colorNum > colors.length - 1) {colorNum = 0}
    title.style.background = colors[colorNum];
    colorNum += 1;
}


function buttonAction(input) {
   
    let specialValues = [
        "equalTo", "overX", "factorial", "squareRoot", "cubeRoot",
        "squarePower", "divide", "multiply", "sum", "substract"];

    if (specialValues.includes(input.id)) {
        input.addEventListener(
            "click", () => processValue(input.id), false);
    }
    else if (specialValues.includes(input.id) === false) {
        
        input.addEventListener(
            "click", () => bottomScreenPrint(input.id), false);
    }
}


function arithmeticSection(total, symbol, number) {
   
    switch (symbol) {
        case "+": return total + parseFloat(number);
        case "-": return total - parseFloat(number);
        case "x": return total * parseFloat(number);
        case "÷": return total / parseFloat(number);
    }
}


function scientificSection(symbol) {
   
    let number = parseFloat(bottomScreen.innerHTML.replace(",", "."));

    if (wrongInput(number, symbol)) {
        bottomScreen.innerHTML = wrongInput(number, symbol);
        return "error"
    }

    switch (symbol) {
        case "1/": return 1 / number;
        case "√":  return Math.sqrt(number);
        case "∛":  return Math.cbrt(number);
        case "²":  return Math.pow(number, 2);

        case "!":
            if (number === 0) {return 1}
            let inputNumber = number;

            for (num=1; num < inputNumber; num++) {number *= num}
            return number;
    }
}


function calculateValues(history) {
   
    if (Number.isNaN(parseFloat(history[0]))) {history.unshift("0")}
    let result = parseFloat(history[0]);
    
    for (value in history) {
        let numberAndSymbol = [history[value -1], history[value]];

        if (["+", "-", "x", "÷"].includes(history[value - 1])) {
            result = arithmeticSection(result, ...numberAndSymbol);
        }

        
        else if (["1/", "!", "√", "∛", "²"].includes(history[value])) {
            result = scientificSection(numberAndSymbol[1]);
        }
    }

    if (result === "error") {record = [], resultValue = "0"}
    return result;
}


function wrongInput(number, symbol) {
    
    number = number.toString()
    console.log(number);
    let factorialError    = symbol === "!"  && number.includes("-", ".");
    let rootError         = symbol === "√"  && number[0] === "-";
    let zeroDivisionError = symbol === "1/" && number === undefined;

    if      (factorialError || rootError)  {return "Invalid Input"}
    else if (zeroDivisionError) {return "You can't divide by zero"}
}


function topScreenPrint(total) {
   
    let symbol = record.slice(-1)[0];
    let preSymbol
    let preTotal
    let preProcess

    if (record.length >= 4 && symbol) {
        preTotal = calculateValues(record.slice(0, -2)).toString();
        preSymbol = record.slice(-3)[0];
        preProcess = `${preTotal} ${preSymbol}`;
    }

    else if (record.length < 4 && symbol !== "=") {preProcess = ""}
    let screenNumber = bottomScreen.innerHTML;

    switch (symbol) {
        case "!":
        case "²":
            topScreen.innerHTML =
                `${preProcess} (${screenNumber})${symbol}`;
            break;

        case "1/":
        case "√":
        case "∛":
            topScreen.innerHTML =
                `${preProcess} ${symbol}(${screenNumber})`;
            break;

        case "=":
            topScreen.innerHTML += " =";
            break
    }

    
    if (symbol !== "=" && record.length >= 4) {record = [preTotal, preSymbol]}
    else if (symbol === "=" || record.length < 4) {record = []}

    resultValue = total;
    givenResult = true;
}


function screenModification(total) {
   
    topScreen.innerHTML = "";
    total = total.toString();

    if (total === "Infinity") {
        bottomScreenPrint("clear");
        return bottomScreen.innerHTML = "You can't divide by zero";
    }

    for (value in record) {
       
        if (["1/", "!", "√", "∛", "²", "="].includes(record[value])) {
            topScreenPrint(total);
            break;
        }

        
        topScreen.innerHTML += ` ${record[value].replace(".", ",")}`;
    }

    if (total !== "error") {bottomScreen.innerHTML = total.replace(".", ",")}
}


function processValue(sym) {

    if (resultValue.slice(-1) === ",") {resultValue = resultValue.slice(0, -1)}
    record.push(resultValue.replace(",", "."), calcValues[sym]);

    if (record.slice(-2)[0] === "0" && record.slice(-1)[0] !== "=" && record.length === 2) {
        record = record.slice(0, -3);
        record.push(calcValues[sym]);
    }
    screenModification(calculateValues(record));

    if (["1/", "!", "√", "∛", "²", "="].includes(calcValues[sym]) === false) {
        resultValue = "0"}
    skullPosition();
}


function givenResultCheck(sym) {
   
    if (givenResult && sym !== "negate" && [0, 3].includes(record.length)) {
        givenResult = false;
        resultValue = "0";
        record = [];
        topScreen.innerHTML = "";
    }
}


function bottomScreenPrint(sym) {
   
    givenResultCheck(sym);

    if (["clear", "ce"].includes(sym) || ["del1", "del2"].includes(sym)
    && resultValue.length === 1 || sym === "num0"
    && (resultValue === "" || resultValue === "0")) {
        resultValue = "0";
    }

    if (sym === "clear") {
        topScreen.innerHTML = "";
        record = [];
    }

    else if (sym.includes("num") || sym === "comma"
    && resultValue.includes(",") === false) {
        if (resultValue === "0" && sym !== "comma") {resultValue = ""}
        resultValue += calcValues[sym];
    }

    else if (["pi", "euler"].includes(sym)) {
        resultValue = calcValues[sym];
    }

    else if (sym === "negate" && resultValue !== "0") {
        if      (resultValue[0] !== "-") {resultValue = "-" + resultValue}
        else if (resultValue[0] === "-") {resultValue = resultValue.slice(1)}
    }

    else if (["del1", "del2"].includes(sym) && resultValue.length > 1) {
        resultValue = resultValue.slice(0, -1);
    }

    bottomScreen.innerHTML = resultValue;
    skullPosition();
}

function keyboardButtons(event) {

    let bottomValues = Object.keys(keyboardSymbols).slice(0, 13);
    let topValues = Object.keys(keyboardSymbols).slice(13);

    if (bottomValues.includes(event.key)) {
        bottomScreenPrint(keyboardSymbols[event.key]);
    }
    
    else if (topValues.includes(event.key)) {
        processValue(keyboardSymbols[event.key]);
    }

}

window.addEventListener('load', setUp, false);  