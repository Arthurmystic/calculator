const numberPanel = document.querySelector('#numberPanel'); // Panel containing numeric and special keys (like DEL and Clear)
const operatorPanel = document.querySelector('#operatorPanel'); // Panel containing operator keys

const expressionSpan = document.querySelector('#expressionSpan');
expressionSpan.textContent = ''; // Initializes the display for the expression being entered

const resultSpan = document.querySelector('#resultSpan');
resultSpan.textContent = ''; // Initializes the result display

const toggleSign = document.querySelector('#toggleSign');

let currentNumberHolder = ''; // Holds the current number being entered (e.g., "25.3")
let expressionTracker = ''; // Tracks the entire expression for evaluation and display

let finalResult;   // Stores the result of the evaluated expression
let equalSignClicked = false;  // Tracks if the equal sign has been pressed
let postEqualReset = false;  // Indicates if the calculator is ready for a new input after pressing '='

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
function evaluateSingleOperation(operator, operatorIndex, array) {
    const valBefore = array[operatorIndex - 1]; // Operand before the operator
    const valAfter = array[operatorIndex + 1]; // Operand after the operator
    const answer = operate(valBefore, operator, valAfter); // Compute result
    array.splice(operatorIndex - 1, 3, answer); // Replace the operation and operands with the result
    return answer;
}

// Function to process the entire expression, respecting operator precedence
function processExpression(array) {
    if (array.length > 0) {
        // Handle multiplication and division first
        array.forEach((item, index, array) => {
            if (item === '*' || item === '/') {
                evaluateSingleOperation(item, index, array);
                processExpression(array); // Recursively process remaining operations
            }
        });

        // Handle addition and subtraction
        array.forEach((item, index, array) => {
            if (item === '+' || item === '-') {
                evaluateSingleOperation(item, index, array);
                processExpression(array); // Recursively process remaining operations
            }
        });

        return array[0]; // Return the final computed result
    }
}

// Function to handle numeric input and update the display
function getNumericInput(e) {
    let dataValue = e.target.dataset.value;

    // Reset the calculator if '=' was pressed before entering a new number
    if (equalSignClicked && postEqualReset) ResetCalcOnEquals('', '', '');

    // Handle numeric and decimal inputs
    if (!isNaN(dataValue) || ((dataValue === '.') && (!currentNumberHolder.includes('.')))) {
        expressionSpan.textContent += dataValue; // Append to the display
        currentNumberHolder += dataValue; // Update the current number holder
        expressionTracker += dataValue; // Append to the expression tracker

    } else if (dataValue === 'DEL') { // Handle delete action
        currentNumberHolder = currentNumberHolder.slice(0, -1); // Remove last character from the current number
        expressionTracker = expressionTracker.slice(0, -1); // Remove last character from the expression tracker
        expressionSpan.textContent = expressionTracker; // Update the display
        resultSpan.textContent = ''; // Clear the result display

    } else if (dataValue === 'Clear') { // Handle clear action
        expressionSpan.textContent = ''; // Clear the expression display
        currentNumberHolder = ''; // Reset the current number holder
        resultSpan.textContent = ''; // Clear the result display
        expressionTracker = ''; // Reset the expression tracker

    } else if (dataValue === '+/-') {
        toggleSignValue();
    }
}

// Function to handle operator input and process the expression when '=' is pressed
function processOperatorAction(e) {
    let dataValue = e.target.dataset.value;
    numCounter = 0;

    // Reset the calculator if '=' was pressed before entering a new operator
    if (equalSignClicked && postEqualReset) ResetCalcOnEquals(finalResult, '', finalResult + dataValue)
    // Update expressionTracker with the last finalResult as the starting point and Append the new operator (dataValue) to the expression

    // Handle operator input
    if (['+', '-', '*', '/'].includes(dataValue) && !postEqualReset) {
        if (['+', '-', '*', '/'].includes(expressionTracker.slice(-1))) {
            // Replace the last operator if an operator is already at the end
            expressionTracker = expressionTracker.slice(0, -1) + dataValue;
        } else {
            expressionTracker += dataValue; // Append the operator to the expression
        }
        currentNumberHolder = ''; // Reset the current number holder
        expressionSpan.textContent = expressionTracker; // Update the display

    } else if (dataValue === '=' && !equalSignClicked) { // Handle '=' for evaluation
        let expressionTrackerArray = expressionTracker.split(/([-/+*])/); // Split the expression into operators and operands
        expressionTrackerArray = expressionTrackerArray.map((val) => (isNaN(Number(val)) ? val : Number(val))); // Convert operands to numbers
        finalResult = processExpression(expressionTrackerArray); // Compute the result
        finalResult = finalResult.toFixed(2); // round off to 4 decimals
        resultSpan.textContent = finalResult; // Display the result
        equalSignClicked = true; // Mark that '=' has been pressed
        postEqualReset = true; // Allow resetting after '=' is pressed
    }
}

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

function ResetCalcOnEquals(expSpanText, resultText, expTrackerUpdate) {
    expressionSpan.textContent = expSpanText;
    resultSpan.textContent = resultText;
    expressionTracker = expTrackerUpdate;
    postEqualReset = false;
    equalSignClicked = false;
}

// Add event listeners for numeric and operator inputs
numberPanel.addEventListener('click', getNumericInput);
operatorPanel.addEventListener('click', processOperatorAction);

// toggleSign.addEventListener('click',toggleSignValue);
