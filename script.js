const numberPanel = document.querySelector('#numberPanel'); // Number buttons panel
const operatorPanel = document.querySelector('#operatorPanel'); // Operator buttons panel

const expressionSpan = document.querySelector('#expressionSpan');
expressionSpan.textContent = ''; // Initialize the expression display

const resultSpan = document.querySelector('#resultSpan');
resultSpan.textContent = ''; // Initialize the result display

const equalsButton = document.querySelector('#equals'); 

let rawExpression = ''; // Stores the current input expression
let expressionTracker = ''; // Tracks the entire expression for display
let arrayMat = []; // Array to store raw expression components for evaluation

let numberPanelClicked;
let equalSignClicked;
let result;

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
    const answer = operate(valBefore, operator, valAfter); // Calculate the result
    array.splice(operatorIndex - 1, 3, answer); // Replace the operation in the array with the result
    return answer;
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
        console.log(`typeof datavale=ue ${!isNaN(dataValue)}`);
        expressionSpan.textContent += dataValue; // Append to raw expression
        rawExpression += dataValue; // Append to raw expression
        expressionTracker += dataValue; 

    } else if (dataValue === 'DEL') { // Handle delete action
        rawExpression = rawExpression.slice(0, -1);
        expressionTracker = expressionTracker.slice(0, -1);
        expressionSpan.textContent = expressionTracker;

    } else if (dataValue === 'Clear') { // Handle clear action
        expressionSpan.textContent = ''; // Clear the display
        rawExpression = ''; // Reset raw expression
        resultSpan.textContent = ''; // Clear the result display
        console.log(rawExpression); // Log for debugging
        expressionTracker = '';
    } 
}

// Function to handle operator input and calculate result on pressing '='
function processOperatorAction(e) {
    let dataValue = e.target.dataset.value;

    console.log(`RE ${rawExpression}`)
    // expressionTracker += rawExpression; // Add current input to tracker
    //arrayMat.push(rawExpression); // Add current input to array for evaluation

    if (['+', '-', '*', '/'].includes(dataValue)) { // Handle operator input
    expressionTracker += dataValue; // Update tracker with operator
    
    arrayMat.push(rawExpression);
    arrayMat.push(dataValue); // Add operator to array
    rawExpression = ''; // Reset raw expression
    expressionSpan.textContent = expressionTracker; // Update display
    
    
    }else if (dataValue === '=') { // Handle equality ('=') for evaluation
        let expressionTrackerArray = expressionTracker.split(/([-/+*])/)
        expressionTrackerArray = expressionTrackerArray.map((val) => (isNaN(Number(val)) ? val : Number(val)));
        console.log(`final xpression: ${expressionTrackerArray}`)
        let ans2 = processExpression(expressionTrackerArray);
        
        console.log(`finAns ${ans2}`);

           /* // Convert array values to numbers (if applicable)
            arrayMat = arrayMat.map((val) => (isNaN(Number(val)) ? val : Number(val)));
            result = processExpression(arrayMat); // Process and calculate result
            console.log(`result type ${typeof result}`);
            
            resultSpan.textContent = result; // Display result
            equalSignClicked = true;
            arrayMat = [];
            result = '';
            // numberPanelClicked = false;
            */
            
        }
    // console.log(`arraymat in operator ${arrayMat}`);
    // console.log(`rawExpression in operator ${rawExpression}`);
    // console.log(expressionTracker);
};

function checkEqualsPressed (e) {
    // Convert array values to numbers (if applicable)
    console.log(`arraymat in equals ${arrayMat}`)
    arrayMat = arrayMat.map((val) => (isNaN(Number(val)) ? val : Number(val)));
    result = processExpression(arrayMat); // Process and calculate result
    console.log(`result type ${typeof result}`);
    
    resultSpan.textContent = result; // Display result
    equalSignClicked = true;
    arrayMat = [];
   // result = '';
    // numberPanelClicked = false;
}

function checkIfNumberPressedAfterEquals(e){
    if (equalSignClicked === true & numberPanelClicked === true){
        console.log('now eval...');
        let dataValue = e.target.dataset.value;
        expressionTracker = '';
        rawExpression = result;
        result= '';
        expressionSpan.innerHTML = '';
        resultSpan.innerHTML = '';
        equalSignClicked = false;
        numberPanelClicked = false;

    }
   /* if eq pressed is true and a numberpanel pressed, reset all. and seteuql
    presed to false. wen i click equ, numberpanel set to false, when click number pane, it is set to true
    if equ pressed is true, and operator panel pressed, empty everything but
    set rawExpression to be equal to result. */
 }

//console.log(expressionSpan);
// Add event listeners for numeric and operator input
numberPanel.addEventListener('click', (e) => {
   // checkIfNumberPressedAfterEquals(e);
    getNumericInput(e);
    console.log (expressionTracker);
    numberPanelClicked = true;
});

operatorPanel.addEventListener('click', processOperatorAction);

equalsButton.addEventListener('click', ()=>{
   // equalSignClicked = true;
    //checkEqualsPressed();
});
