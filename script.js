const mainInputPanel = document.querySelector('#mainInputPanel');
let expressionSpan = document.querySelector('#expressionSpan');
expressionSpan.textContent = '';
let rawExpression = '';

function operate(a, operator, b) {
    let ans = (operator === '+') ? a + b :
                (operator === '-') ? a - b :
                (operator === 'x') ? a * b :
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
  
  function processExpression(array){
    if (array.length>0) {
     array.forEach((item,index, array) =>{
        if (item === 'x' || item === '/'){
            evaluateSingleOperation(item, index, array)
            processExpression(array)
          
        } else if (item === '+' || item === '-'){
            evaluateSingleOperation(item, index, array)
            processExpression(array)
        }
      })
          return array[0]
    }    
  }
  
function getInput(e) {
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
        expressionSpan.textContent = ''
        rawExpression = ''
    }
    console.log(rawExpression)
}

mainInputPanel.addEventListener('click', getInput)