const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
const slider = document.querySelector('.slider');

prev.addEventListener('click', () => {
    let slides = document.querySelectorAll('.slides');
    slider.prepend(slides[slides.length - 1]);
});
next.addEventListener('click', () => {
    let slides = document.querySelectorAll('.slides');
    slider.appendChild(slides[0]);
});