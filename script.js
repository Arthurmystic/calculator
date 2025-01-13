const numberPanel = document.querySelector('#numberPanel');

const operatorPanel = document.querySelector('#operatorPanel');

let expressionSpan = document.querySelector('#expressionSpan');
expressionSpan.textContent = ' ';

let resultSpan = document.querySelector('#resultSpan');
resultSpan.textContent = ' ';

let rawExpression = '';
let expressionTracker = '';

let arrayMat = [];


function operate(a, operator, b) {
    let ans = (operator === '+') ? a + b :
                (operator === '-') ? a - b :
                (operator === '*') ? a * b :
                (operator === '/') ? a / b :
                undefined;
    return ans;
}
  
  function evaluateSingleOperation(operator, operatorIndex, array) {
    valBefore = array[operatorIndex - 1];
    valAfter = array[operatorIndex + 1];
    result = operate(valBefore, operator, valAfter);
    array.splice(operatorIndex - 1, 3,result);
    return result;
  }
  
  function processExpression(array) {
    if (array.length > 0) {
        array.forEach((item, index, array) => {
            if (item === '*' || item === '/') {
                evaluateSingleOperation(item, index, array);
                processExpression(array);
            }
        });
        array.forEach((item, index, array) => {
            if (item === '+' || item === '-') {
                evaluateSingleOperation(item, index, array);
                processExpression(array);
            }
        });

        return array[0];
    }
}

  
function getNumericInput(e) {
    let dataValue = e.target.dataset.value;
    if (!isNaN(dataValue) || ((dataValue === '.') && (!rawExpression.includes('.')))) {
        const textVal = document.createTextNode(dataValue)
        expressionSpan.appendChild(textVal);
        rawExpression += dataValue

    } else if (dataValue === 'DEL') {
        (rawExpression.length !== 0) ? expressionSpan.removeChild(expressionSpan.lastChild) :
            {};
        rawExpression = rawExpression.slice(0, -1);
    } else if (dataValue === 'Clear') {
        expressionSpan.textContent = '';
        rawExpression = '';
        resultSpan.textContent='';
    console.log(rawExpression);
    }
}

function processOperatorAction(e){
    let dataValue = e.target.dataset.value;
    if (rawExpression.length !== 0) {
        expressionTracker += rawExpression;
        arrayMat.push(rawExpression);

        if (dataValue === '+' || dataValue === '-' || dataValue === '*' || dataValue == '/'){
            expressionTracker += dataValue;
            arrayMat.push(dataValue);
            rawExpression = '';
            expressionSpan.textContent = expressionTracker;

        }else if (dataValue === '='){
            expressionTrackerArray = expressionTracker.split();
            console.log(expressionTrackerArray);
            console.log(arrayMat);
            arrayMat= arrayMat.map((val) => (isNaN(Number(val))?val:Number(val)));
            let result = processExpression(arrayMat);
            resultSpan.textContent = result;
        }
    }  
}

numberPanel.addEventListener('click', getNumericInput);

operatorPanel.addEventListener('click', processOperatorAction);