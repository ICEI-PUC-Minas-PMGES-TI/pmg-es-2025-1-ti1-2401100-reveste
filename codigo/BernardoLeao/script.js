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

    sr.reveal('.container', {  origin: 'bottom'});
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
    containerCadastrar.classList.add('movimentoContainerCadastrar')
});

document.querySelector('.buttomEntrar').addEventListener('click', () => {
    containerLogin.classList.remove('movimentoContainerLogin');
    containerCadastrar.classList.remove('movimentoContainerCadastrar')
});

const divs = document.querySelectorAll('.divsPapeis');
const nav = document.querySelector('nav');
const botao = document.querySelector('.btnProsseguir');
const main = document.querySelector('main')

let selecionado = null;

divs.forEach(div => {
    div.addEventListener('click', (e) => {
        e.stopPropagation();

        if (selecionado === div) {
            div.classList.remove('papelEscolhido', 'divPraCima');
            divs.forEach(d => d.classList.remove('efeitoBlur'));
            nav.classList.remove('clicado');
            botao.disabled = true;
            selecionado = null;
        } else {
            divs.forEach(d => d.classList.remove('papelEscolhido', 'efeitoBlur', 'divPraCima'));
            div.classList.add('papelEscolhido', 'divPraCima');
            divs.forEach(d => {
                if (d !== div) d.classList.add('efeitoBlur');
            });
            nav.classList.add('clicado');
            botao.disabled = false;
            selecionado = div;
        }
    });

    div.addEventListener('mouseenter', () => {
        if (selecionado && div !== selecionado) {
            div.classList.remove('efeitoBlur');
        }
    });

    div.addEventListener('mouseleave', () => {
        if (selecionado && div !== selecionado) {
            div.classList.add('efeitoBlur');
        }
    });
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.divsPapeis')) {
        divs.forEach(d => d.classList.remove('papelEscolhido', 'efeitoBlur', 'divPraCima'));
        nav.classList.remove('clicado');
        botao.disabled = true;
        selecionado = null;
    }
});

let divQueroRoupaClicada = false;
let divQueroDoarClicada = false;
let divSouPAClicada = false;

document.querySelector("#divPapel").addEventListener('click', () => {
    divQueroRoupaClicada = true;
})

document.querySelector("#divPapel2").addEventListener('click', () => {
    divQueroDoarClicada = true;
})

document.querySelector("#divPapel3").addEventListener('click', () => {
    divSouPAClicada = true;
})



botao.addEventListener("click", function () {
    if (divSouPAClicada) {
        document.querySelector('.logo').classList.add('MovimentarLogoParaAEsquerdaESumir');
        document.querySelector('main h2').classList.add('Movimentarh2ParaAEsquerdaESumir');
        document.querySelector("main nav").classList.add('MovimentarNavDePapeisParaAEsquerdaESumir');
        botao.classList.add('MovimentarBotaoDeProsseguirParaAEsquerdaESumir');
        document.querySelector('.imagemIgreja').classList.add('MostrarImagemDaIgrejaDeLoginECadastroParaOUsuario')
        document.querySelector('.containerLoginECadastrar').classList.add('MostrarTelaDeLoginECadastroParaOUsuario')
    }
});

document.querySelector('.btnVoltarLoginECadastro').addEventListener('click', () => {
    setTimeout(() => {
        document.querySelector('.logo').classList.remove('MovimentarLogoParaAEsquerdaESumir');
        document.querySelector('main h2').classList.remove('Movimentarh2ParaAEsquerdaESumir');
        document.querySelector("main nav").classList.remove('MovimentarNavDePapeisParaAEsquerdaESumir');
        botao.classList.remove('MovimentarBotaoDeProsseguirParaAEsquerdaESumir');
    }, 600);
    document.querySelector('.imagemIgreja').classList.remove('MostrarImagemDaIgrejaDeLoginECadastroParaOUsuario')
    document.querySelector('.containerLoginECadastrar').classList.remove('MostrarTelaDeLoginECadastroParaOUsuario')
    containerLogin.classList.remove('movimentoContainerLogin');
    containerCadastrar.classList.remove('movimentoContainerCadastrar')
})

/*-------------------------------------------------------------------------- JS Login E Cadastro --------------------------------------------------------------------------*/

$(document).ready(function () {
    $('.inputCNPJ').mask('00.000.000/0000-00', { reverse: true });
    $('.inputTelefone').mask('(00) 0000-0000');
    $('.inputCNPJCadastrar').mask('00.000.000/0000-00', { reverse: true });
    $('.inputInicio').mask('00/00/0000');
    $('.inputFinal').mask('00/00/0000');
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