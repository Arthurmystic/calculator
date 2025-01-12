const numberPanel = document.querySelector('#numberPanel');
let expressionSpan = document.querySelector('#expressionSpan');
expressionSpan.textContent = '';
let rawExpression = '';

function getNumber(e) {
    let dataValue = e.target.dataset.value;
    if (!isNaN(dataValue) || ((dataValue === '.') && (!rawExpression.includes('.')))) {
        const textVal = document.createTextNode(dataValue)
        expressionSpan.appendChild(textVal);
        rawExpression += dataValue
    }else if (dataValue === 'DEL'){
        (rawExpression.length!==0)?expressionSpan.removeChild(expressionSpan.lastChild):
        {};
        rawExpression = rawExpression.slice(0,-1);  
    }else if (dataValue === 'Clear'){
        expressionSpan.textContent = ''
        rawExpression = ''
    }
    console.log(rawExpression)
}

numberPanel.addEventListener('click', getNumber)
// console.log(rawExpression)



// const point = document.querySelector('#point');
// const PI = document.querySelector('#pi');

// function getNumber(e){
//     let num = Number(e.target.dataset.value);
//     console.log(num);
// }

// function getPi(e){
//     const PI = Math.PI;
//     console.log(PI);
// }

// function getPoint(e){
//     const PI = Math.PI;
//     console.log(PI);
// }


// numericButton.forEach((button) => {
//     button.addEventListener('click', getNumber);
// })