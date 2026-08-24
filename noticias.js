const noticiaSlides = document.querySelectorAll('.noticia-slide');
const noticiaPrev = document.querySelector('.noticias-prev');
const noticiaNext = document.querySelector('.noticias-next');

let noticiaActual = 0;
let noticiaInterval;

function mostrarNoticia(index) {
    noticiaSlides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
}

function siguienteNoticia() {
    noticiaActual = (noticiaActual + 1) % noticiaSlides.length;
    mostrarNoticia(noticiaActual);
}

function anteriorNoticia() {
    noticiaActual =
        (noticiaActual - 1 + noticiaSlides.length) %
        noticiaSlides.length;

    mostrarNoticia(noticiaActual);
}

function iniciarNoticias() {
    clearInterval(noticiaInterval);

    noticiaInterval = setInterval(() => {
        siguienteNoticia();
    }, 5000);
}

noticiaNext.addEventListener('click', () => {
    siguienteNoticia();
    iniciarNoticias();
});

noticiaPrev.addEventListener('click', () => {
    anteriorNoticia();
    iniciarNoticias();
});

mostrarNoticia(noticiaActual);
iniciarNoticias();