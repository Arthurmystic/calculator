const numberPanel = document.querySelector('#numberPanel'); // Contains numeric and special keys (like DEL and Clear)
const operatorPanel = document.querySelector('#operatorPanel'); // Contains operator keys

const expressionSpan = document.querySelector('#expressionSpan');
expressionSpan.textContent = ''; // display equation being entered in realtime

const resultSpan = document.querySelector('#resultSpan');
resultSpan.textContent = ''; // resultDisplay displays results

const toggleSign = document.querySelector('#toggleSign');

let currentNumberHolder = ''; // Holds the current number being entered (e.g., "25.3")
let expressionTracker = ''; // Tracks the entire expression for evaluation and display

let finalResult;   // Stores the result of the evaluated expression
let equalSignClicked = false;  // Tracks if the equal sign has been pressed
let isMinusAfterOperator;
let isToggleAfterEquals;
let tempResultHolder = [];

// Function to perform basic arithmetic operations
function operate(a, operator, b) {
    let ans = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '÷': (a, b) => a / b,
        '%': (a, b) => (b === undefined) ? a / 100 : a % b,
        '^':(a,b) => Math.pow(a,b),  
    };

    return ans[operator](a, b); // Dynamically calls the corresponding operation
}

function handleSymbols(array, symbolArray){
    array.forEach((item, index, array) => {
        if (symbolArray.includes(item)){
            isMinusAfterOperator = (array[index + 1] === '-') ? true : false;

            // Operands before & after the operator
            let valBefore = array[index - 1];
            let valAfter = array[index + 1];;

            if (isMinusAfterOperator) valAfter = Number('-' + array[index + 2]);

            const answer = operate(valBefore, item, valAfter); // Compute result
            array.splice(index - 1, 3, answer); // Replace the operation and operands with the result

            processExpression(array); // Recursively process remaining operations
        }
    });
}

// Function to process the entire expression, based on operator precedence
function processExpression(array) {
    if (array.length > 0) {
        highPrecedenceOperators = ['^'] // Exponential (Power)
        handleSymbols (array, highPrecedenceOperators)
    
        midPrecedenceOperators = ['*','÷','%']
        handleSymbols (array, midPrecedenceOperators)
    
        lowPrecedenceOperators = ['+','-']
        handleSymbols (array, lowPrecedenceOperators)
        return array[0];
    }
}

// Function to handle numeric input and update the display
function getNumericInput(e) {
    let dataValue = e.target.dataset.value;

    // Reset the calculator if '=' was pressed before entering a new number
    if (equalSignClicked && dataValue !== '+/-') {
        ResetCalcOnEquals('', '');
        currentNumberHolder = '';
    }

    // Handle numeric and decimal inputs
    if (!isNaN(dataValue) || ((dataValue === '.') && (!currentNumberHolder.includes('.')))) {
        expressionSpan.textContent += dataValue;
        currentNumberHolder += dataValue;
        expressionTracker += dataValue;

    } else if (dataValue === 'DEL') {
        currentNumberHolder = currentNumberHolder.slice(0, -1); // Remove last characte
        expressionTracker = expressionTracker.slice(0, -1);
        expressionSpan.textContent = expressionTracker;
        resultSpan.textContent = '';

    } else if (dataValue === 'Clear') {
        expressionSpan.textContent = '';
        currentNumberHolder = '';
        resultSpan.textContent = '';
        expressionTracker = '';
        console.clear();

    } else if (dataValue === '+/-' && !equalSignClicked) {
       isToggleAfterEquals = false;
       toggleSignValue();
       //flipSign(currentNumberHolder);

    } else if (dataValue === '+/-' && equalSignClicked) {
       isToggleAfterEquals = true;
       toggleSignValue()
    }
}

// Function to handle operator input and process the expression when '=' is pressed
function processOperatorAction(e) {
    let dataValue = e.target.dataset.value;
    numCounter = 0;

    // Reset the calculator if '=' was pressed before entering a new operator. DataValue here is an operator
    if (equalSignClicked) ResetCalcOnEquals(finalResult, dataValue)

    // Handle operator input
    if (['+', '-', '*', '÷','%','^'].includes(dataValue)) {
        if (['+', '-', '*', '÷','%','^'].includes(expressionTracker.slice(-1))) {
            // Replace the last operator if an operator is already at the end
            expressionTracker = expressionTracker.slice(0, -1) + dataValue;
        } else {
            expressionTracker += dataValue; // Append the operator to the expression
        }
        currentNumberHolder = ''; // Reset the current number holder
        expressionSpan.textContent = expressionTracker; // Update the display

    } else if (dataValue === '=') {
        evaluateEntireExpression();
    }
}

function evaluateEntireExpression() {
    let exprTrackerArray = expressionTracker.split(/([-÷+*%^])/); // Split the expression into operators and operands
    exprTrackerArray = exprTrackerArray.filter((val, index) => (val !== '' || index === 0)) //remove all '' except if they are at index 0, which are to be converted to 0 in next step (map)
        .map((val) => (isNaN(Number(val)) ? val : Number(val))); // Convert operands to numbers
    finalResult = processExpression(exprTrackerArray); // Compute the result
    removeEqualSignFromFinalResult();
    // finalResult = finalResult.toFixed(2);
    // resultSpan.textContent = finalResult; 
    finalResult = String(finalResult);


    //  tempResultHolder.push(finalResult);
    // console.log(tempResultHolder);
    // tempResultHolder.splice(1);
    // finalResult = tempResultHolder[0];
    // console.log(finalResult);

    /* if (tempResultHolder.some((val=>isNaN(val)))) {
        tempResultHolder.splice(1);
        finalResult = tempResultHolder[0];
        console.log(finalResult);
    }*/ 
    

    resultSpan.textContent = Number(finalResult).toFixed(2);
    //resultSpan.textContent = isNaN(finalResult)?'': finalResult;  
    equalSignClicked = true;

}

// Function to toggle the sign (+/-) of the current input number
function toggleSignValue() {
    if (isToggleAfterEquals) {       
        currentNumberHolder = finalResult;
        currentNumberHolder = flipSign(currentNumberHolder);
        expressionTracker = currentNumberHolder;
        finalResult = expressionTracker;
        resultSpan.textContent = '';

    } else {
        expressionTracker = expressionTracker.slice(0, -currentNumberHolder.length);
        currentNumberHolder = flipSign(currentNumberHolder);
        expressionTracker += currentNumberHolder;
    }
    expressionSpan.textContent = expressionTracker;
}

function flipSign(numberString){
    return (numberString.at(0) !== '-')? '-'.concat(numberString): numberString.slice(1);
}

function ResetCalcOnEquals(expSpanText, expTrackerUpdate) {
    expressionSpan.textContent = expSpanText;
    resultSpan.textContent = '';
    expressionTracker = expSpanText + expTrackerUpdate;
    equalSignClicked = false;
}

function removeEqualSignFromFinalResult() {
    if (typeof finalResult === 'string' && finalResult.includes('=')) {
        finalResult = Number(finalResult.replaceAll(/=/g, ''));
        /*converts it back to number after removing '=' since 
          addition of '=' had converted it into a string.*/
    }
}


numberPanel.addEventListener('click', getNumericInput);
operatorPanel.addEventListener('click', processOperatorAction);

// toggleSign.addEventListener('click',toggleSignValue);
