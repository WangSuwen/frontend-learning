const numberHours = document.querySelector('.number-hours');
const barSeconds = document.querySelector('.bar-seconds');

const numberElements = [];
const barElements = [];

for(let i = 1; i <= 12; i++) {
    numberElements.push(
        `<span style="--index:${i}"><p>${i}</p></span>`
    );
}
numberHours.insertAdjacentHTML('afterbegin', numberElements.join(''));

for(let i = 1; i <= 60; i++) {
    barElements.push(
        `<span style="--index:${i}"><p></p></span>`
    );
}
barSeconds.insertAdjacentHTML('afterbegin', barElements.join(''));

const handHours = document.querySelector('.hand.hours');
const handMinutes = document.querySelector('.hand.minutes');
const handSeconds = document.querySelector('.hand.seconds');

function getCurrentTime () {
    const date = new Date();
    const currentHours = date.getHours();
    const currentMinutes = date.getMinutes();
    const currentSeconds = date.getSeconds();

    handHours.style.transform = `rotate(${currentHours * 30 + currentMinutes / 2}deg)`;
    handMinutes.style.transform = `rotate(${currentMinutes * 6}deg)`;
    handSeconds.style.transform = `rotate(${currentSeconds * 6}deg)`;
}
getCurrentTime();

setInterval(getCurrentTime, 1000);