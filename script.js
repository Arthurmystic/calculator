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

// Function to perform basic arithmetic operations
function operate(a, operator, b) {
    let ans = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => a / b,
    };
    return ans[operator](a, b); // Dynamically calls the corresponding operation
}

// Function to evaluate a single operation in the expression
function evaluateSingleOperation(operator, operatorIndex, array, isMinusAfterOperator) {
    // Operands before & after the operator
    let valBefore = array[operatorIndex - 1];
    let valAfter = array[operatorIndex + 1];;
    
    if (isMinusAfterOperator===true) valAfter = Number('-' + array[operatorIndex + 2]); 
    
    const answer = operate(valBefore, operator, valAfter); // Compute result
    array.splice(operatorIndex - 1, 3, answer); // Replace the operation and operands with the result
    return answer;
}

// Function to process the entire expression, respecting operator precedence
function processExpression(array) {
    if (array.length > 0) {
        // Handle multiplication and division first
        console.log(array);
        array.forEach((item, index, array) => {
            
            if (item === '*' || item === '/') {
                console.log(`array[index + 1] : ${array[index + 1]}, ${typeof array[index + 1]}, ${array[index]},${array}`)

               isMinusAfterOperator = (array[index + 1] === '-')? true: false;

                evaluateSingleOperation(item, index, array, isMinusAfterOperator);
                processExpression(array); // Recursively process remaining operations
            }
        });

        // Handle addition and subtraction
        array.forEach((item, index, array) => {
            if (item === '+' || item === '-') {
                isMinusAfterOperator = (array[index + 1] === '-')? true: false;
                evaluateSingleOperation(item, index, array, isMinusAfterOperator);
                processExpression(array); 
            }
        });
        return array[0]; 
    }
}

// Function to handle numeric input and update the display
function getNumericInput(e) {
    let dataValue = e.target.dataset.value;

    // Reset the calculator if '=' was pressed before entering a new number
    if (equalSignClicked) ResetCalcOnEquals('', '');

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

    } else if (dataValue === '+/-' && !equalSignClicked) {
        toggleSignValue();

    } else if (dataValue === '+/-' && equalSignClicked) {
        console.log(dataValue)
        ResetCalcOnEquals('-', '')
    }
}

// Function to handle operator input and process the expression when '=' is pressed
function processOperatorAction(e) {
    let dataValue = e.target.dataset.value;
    numCounter = 0;

    // Reset the calculator if '=' was pressed before entering a new operator. DataValue here is an operator
    if (equalSignClicked) ResetCalcOnEquals(finalResult, dataValue)

    // Handle operator input
    if (['+', '-', '*', '/'].includes(dataValue) && !equalSignClicked) {
        if (['+', '-', '*', '/'].includes(expressionTracker.slice(-1))) {
            // Replace the last operator if an operator is already at the end
            expressionTracker = expressionTracker.slice(0, -1) + dataValue;
        } else {
            expressionTracker += dataValue; // Append the operator to the expression
        }
        currentNumberHolder = ''; // Reset the current number holder
        expressionSpan.textContent = expressionTracker; // Update the display

    } else if (dataValue === '=' && !equalSignClicked) {
        evaluateEntireExpression();
    }
}


function evaluateEntireExpression() {
    let exprTrackerArray = expressionTracker.split(/([-/+*])/); // Split the expression into operators and operands
    exprTrackerArray = exprTrackerArray.filter((val, index) => (val !== '' || index === 0)) //remove all '' except if they are at index 0. the ones at index 0 are to be converted to 0 in next step (map)
        .map((val) => (isNaN(Number(val)) ? val : Number(val))); // Convert operands to numbers
    finalResult = processExpression(exprTrackerArray); // Compute the result
    removeEqualSignFromFinalResult();
    finalResult = finalResult.toFixed(2); // round off to 4 decimals
    resultSpan.textContent = finalResult; // Display the result
    equalSignClicked = true; // Mark that '=' has been pressed
}

// Function to toggle the sign (+/-) of the current input number
function toggleSignValue() {
    expressionTracker = expressionTracker.slice(0, -currentNumberHolder.length);
    if (currentNumberHolder.at(0) !== '-') {
        currentNumberHolder = '-'.concat(currentNumberHolder);
    } else if (currentNumberHolder.at(0) === '-') {
        currentNumberHolder = currentNumberHolder.slice(1);
    }
    expressionTracker += currentNumberHolder;
    expressionSpan.textContent = expressionTracker;
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
