const numericButton = document.querySelectorAll('.numericButton');
const point = document.querySelector('#point');
const PI = document.querySelector('#pi');

function getNumber(e){
    let num = Number(e.target.dataset.value);
    console.log(num);
}

function getPi(e){
    const PI = Math.PI;
    console.log(PI);
}

function getPoint(e){
    const PI = Math.PI;
    console.log(PI);
}


numericButton.forEach((button) => {
    button.addEventListener('click', getNumber);
})