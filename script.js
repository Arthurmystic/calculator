const numberPanel = document.querySelector('#numberPanel'); // Number buttons panel
const operatorPanel = document.querySelector('#operatorPanel'); // Operator buttons panel

let expressionSpan = document.querySelector('#expressionSpan');
expressionSpan.textContent = ' '; // Initialize the expression display

let resultSpan = document.querySelector('#resultSpan');
resultSpan.textContent = ' '; // Initialize the result display

let rawExpression = ''; // Stores the current input expression
let expressionTracker = ''; // Tracks the entire expression for display
let arrayMat = []; // Array to store raw expression components for evaluation

// Function to perform basic arithmetic operations
function operate(a, operator, b) {
    let ans = (operator === '+') ? a + b :
                (operator === '-') ? a - b :
                (operator === '*') ? a * b :
                (operator === '/') ? a / b :
                undefined;
    return ans;
}

// Function to evaluate a single operation within the expression
function evaluateSingleOperation(operator, operatorIndex, array) {
    const valBefore = array[operatorIndex - 1]; // Left operand
    const valAfter = array[operatorIndex + 1]; // Right operand
    const result = operate(valBefore, operator, valAfter); // Calculate the result
    array.splice(operatorIndex - 1, 3, result); // Replace the operation in the array with the result
    return result;
}

// Function to process the full expression by handling operator precedence
function processExpression(array) {
    if (array.length > 0) {
        // Process multiplication and division first
        array.forEach((item, index, array) => {
            if (item === '*' || item === '/') {
                evaluateSingleOperation(item, index, array);
                processExpression(array); // Recurse to handle remaining operations
            }
        });

        // Process addition and subtraction
        array.forEach((item, index, array) => {
            if (item === '+' || item === '-') {
                evaluateSingleOperation(item, index, array);
                processExpression(array); // Recurse to handle remaining operations
            }
        });

        return array[0]; // Return the final result after all operations
    }
}

// Function to handle numeric input and update the expression
function getNumericInput(e) {
    let dataValue = e.target.dataset.value;
    
    // If the input is a number or a decimal point (and no decimal already entered)
    if (!isNaN(dataValue) || ((dataValue === '.') && (!rawExpression.includes('.')))) {
        const textVal = document.createTextNode(dataValue); // Convert input to text node
        expressionSpan.appendChild(textVal); // Update expression display
        rawExpression += dataValue; // Append to raw expression

    } else if (dataValue === 'DEL') { // Handle delete action
        (rawExpression.length !== 0) ? 
        expressionSpan.removeChild(expressionSpan.lastChild) : {}; // Remove last character
        rawExpression = rawExpression.slice(0, -1); // Update raw expression

    } else if (dataValue === 'Clear') { // Handle clear action
        expressionSpan.textContent = ''; // Clear the display
        rawExpression = ''; // Reset raw expression
        resultSpan.textContent = ''; // Clear the result display
        console.log(rawExpression); // Log for debugging
    }
}

// Function to handle operator input and calculate result on pressing '='
function processOperatorAction(e) {
    let dataValue = e.target.dataset.value;
    
    if (rawExpression.length !== 0) {
        expressionTracker += rawExpression; // Add current input to tracker
        arrayMat.push(rawExpression); // Add current input to array for evaluation

        if (['+', '-', '*', '/'].includes(dataValue)) { // Handle operator input
            expressionTracker += dataValue; // Update tracker with operator
            arrayMat.push(dataValue); // Add operator to array
            rawExpression = ''; // Reset raw expression
            expressionSpan.textContent = expressionTracker; // Update display

        } else if (dataValue === '=') { // Handle equality ('=') for evaluation
            // Convert array values to numbers (if applicable)
            arrayMat = arrayMat.map((val) => (isNaN(Number(val)) ? val : Number(val)));
            let result = processExpression(arrayMat); // Process and calculate result
            resultSpan.textContent = result; // Display result
        }
    }
};

// Add event listeners for numeric and operator input
numberPanel.addEventListener('click', getNumericInput);
operatorPanel.addEventListener('click', processOperatorAction);
