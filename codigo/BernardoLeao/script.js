$(document).ready(function () {
    $('.inputCNPJ').mask('00.000.000/0000-00', { reverse: true });
    $('.inputTelefone').mask('(00) 0000-0000');
    $('.inputCNPJCadastrar').mask('00.000.000/0000-00', { reverse: true });
    $('.inputInicio').mask('00/00/0000');
    $('.inputFinal').mask('00/00/0000');
});


document.querySelectorAll('.inputs div input, .inputsCadastrar div input').forEach(input => {
    input.addEventListener('focus', () => {
        input.classList.add('not-empty');
    });

    input.addEventListener('blur', () => {
        if (input.value.trim() === '') {
            input.classList.remove('not-empty');
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const sr = ScrollReveal({
        reset: true,
        distance: '60px',
        duration: 1000,
        delay: 400
    });

    sr.reveal('.container', { origin: 'bottom' });
});


const checkbox = document.querySelector('.checkbox');
const divData = document.querySelector('.divDataPA');
const containerPATemporario = document.querySelector('.divTemporario');

checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
        divData.classList.add('mostrarInputsData');
    } else {
        divData.classList.remove('mostrarInputsData');
    }
});

const containerLogin = document.querySelector('.containerLogin');
const containerCadastrar = document.querySelector('.containerCadastrar');

document.querySelector('.buttomCadastrar').addEventListener('click', () => {
    containerLogin.classList.add('movimentoContainerLogin');
    setTimeout(() => {
        containerCadastrar.style.display = 'flex';
    }, 200);
    setTimeout(() => {
        containerCadastrar.classList.add('movimentoContainerCadastrar')
    }, 700);
});

document.querySelector('.buttomEntrar').addEventListener('click', () => {
    setTimeout(() => {
        containerLogin.classList.remove('movimentoContainerLogin');
    }, 600)
    containerCadastrar.classList.remove('movimentoContainerCadastrar')
    setTimeout(() => {
        containerCadastrar.style.display = 'none';
    }, 600)
});