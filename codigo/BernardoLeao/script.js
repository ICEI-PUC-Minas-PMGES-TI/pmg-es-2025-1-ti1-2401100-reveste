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
    document.querySelector(".imagemIgreja").classList.add("index");
    setTimeout(() => {
        containerCadastrar.style.display = 'flex';
    }, 200);
    setTimeout(() => {
        containerCadastrar.classList.add('movimentoContainerCadastrar')
    }, 700);
});

document.querySelector('.buttomEntrar').addEventListener('click', () => {
    document.querySelector(".imagemIgreja").classList.remove("index");
    setTimeout(() => {
        containerLogin.classList.remove('movimentoContainerLogin');
    }, 600)
    containerCadastrar.classList.remove('movimentoContainerCadastrar')
    setTimeout(() => {
        containerCadastrar.style.display = 'none';
    }, 600)
});

/* ------------------------------------------------------------------- Validação e localStorage ------------------------------------------------------------------- */

const inputCNPJ = document.querySelector('.inputCNPJ');
const inputSenha = document.querySelector('.inputSenha');
const btnEntrar = document.querySelector('.btnEntrar');

const camposCadastro = [
    'nome', 'endereco', 'telefone', 'cnpjCadastrar',
    'email', 'senhaCadastrar', 'inicio', 'final'
];

// VALIDAR CAMPOS DE LOGIN
function verificarCamposLogin() {
    const cnpj = inputCNPJ.value.trim();
    const senha = inputSenha.value.trim();

    btnEntrar.disabled = !(validarCNPJ(cnpj) && senha !== '');
}

// VALIDAR CNPJ
function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != parseInt(digitos.charAt(0))) return false;

    tamanho += 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return resultado == parseInt(digitos.charAt(1));
}

// VERIFICAR CAMPOS DE LOGIN
inputCNPJ.addEventListener('input', verificarCamposLogin);
inputSenha.addEventListener('input', verificarCamposLogin);

// AÇÃO DO BOTÃO "ENTRAR"
btnEntrar.addEventListener('click', () => {
    const cnpj = inputCNPJ.value.trim().replace(/\D/g, '');
    const senha = inputSenha.value.trim();
    const listaUsuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const usuarioEncontrado = listaUsuarios.find(usuario => {
        const cnpjLimpo = usuario.cnpj.replace(/\D/g, '');
        return cnpjLimpo === cnpj && usuario.senha === senha;
    });

    if (usuarioEncontrado) {
        document.querySelector(".CadastroBemSucedido").classList.add("aparecerMensagemCBS")
        document.querySelector(".sombra").classList.add("sombrear");
    } else {
        document.querySelector(".sombra").classList.add("sombrear");
        document.querySelector(".PontoDeApoioNaoEncontrado").classList.add("aparecerMensagemPDANE");
    }
});

// BOTÕES DE FECHAR MENSAGENS
document.querySelector(".fecharMensagem1").addEventListener("click", () => {
    document.querySelector(".sombra").classList.remove("sombrear");
    document.querySelector(".PontoDeApoioNaoEncontrado").classList.remove("aparecerMensagemPDANE");
});

document.querySelector(".fecharMensagem2").addEventListener("click", () => {
    document.querySelector(".sombra").classList.remove("sombrear");
    document.querySelector(".CadastroBemSucedido").classList.remove("aparecerMensagemCBS");
});

// VALIDAR TELEFONE
function validarTelefone(telefone) {
    const limpo = telefone.replace(/\D/g, '');
    return limpo.length === 10 || limpo.length === 11;
}

// VALIDAR EMAIL
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// VERIFICAR CAMPOS DO FORMULÁRIO DE CADASTRO
function verificarCamposCadastro() {
    const todosPreenchidos = camposCadastro
        .filter(id => id !== 'inicio' && id !== 'final')
        .every(id => document.getElementById(id).value.trim() !== '');

    if (!todosPreenchidos) {
        document.getElementById('btnCadastrar').disabled = true;
        return;
    }

    const telefoneValido = validarTelefone(document.getElementById('telefone').value);
    const cnpjValido = validarCNPJ(document.getElementById('cnpjCadastrar').value);
    const emailValido = validarEmail(document.getElementById('email').value);

    document.getElementById('btnCadastrar').disabled = !(telefoneValido && cnpjValido && emailValido);
}

// APLICAR A VERIFICAÇÃO EM CADA CAMPO
camposCadastro.forEach(id => {
    document.getElementById(id).addEventListener('input', verificarCamposCadastro);
});

// BOTÃO DE CADASTRO
document.getElementById('btnCadastrar').addEventListener('click', () => {
    const temporario = document.getElementById('temporario').checked;

    const novoUsuario = {
        nome: document.getElementById('nome').value.trim(),
        endereco: document.getElementById('endereco').value.trim(),
        telefone: document.getElementById('telefone').value.trim(),
        cnpj: document.getElementById('cnpjCadastrar').value.trim(),
        email: document.getElementById('email').value.trim(),
        senha: document.getElementById('senhaCadastrar').value.trim(),
        temporario: temporario
    };

    // Se for ponto de apoio temporário, salva os campos de data (se existirem)
    if (temporario) {
        novoUsuario.inicio = document.getElementById('inicio').value.trim();
        novoUsuario.final = document.getElementById('final').value.trim();
    }

    const lista = JSON.parse(localStorage.getItem('usuarios')) || [];
    lista.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(lista));

    // Limpar campos
    camposCadastro.forEach(id => {
        const input = document.getElementById(id);
        input.value = '';
        input.classList.remove('inputPreenchido');
    });
    document.getElementById('temporario').checked = false;
    document.getElementById('btnCadastrar').disabled = true;

    document.querySelector(".CadastroBemSucedido").classList.add("aparecerMensagemCBS");
    document.querySelector(".sombra").classList.add("sombrear");
});

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
        if (input.value.trim() !== '') {
            input.classList.add('inputPreenchido');
        } else {
            input.classList.remove('inputPreenchido');
        }
    });
});