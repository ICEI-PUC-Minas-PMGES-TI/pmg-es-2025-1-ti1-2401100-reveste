$(document).ready(function () {
    $('#inputCNPJ').mask('00.000.000/0000-00', { reverse: true });
    $('#inputCPFDoador').mask('000.000.000-00', { reverse: true });
    $('.inputCPFCadastroDoador').mask('000.000.000-00', { reverse: true });
    $('.inputTelefone').mask('(00) 0000-0000');
    $('.inputTelefoneDoador').mask('(00) 0000-0000');
    $('.inputCNPJCadastro').mask('00.000.000/0000-00', { reverse: true });
    $('.inputInicio').mask('00/00/0000');
    $('.inputFinal').mask('00/00/0000');
});

const papeisDeUsuario = document.querySelectorAll('.container nav>div');
const nav = document.querySelector('.container nav');
const botao = document.querySelector('#btnProsseguir');

let selecionado = null;

papeisDeUsuario.forEach(div => {
    div.addEventListener('click', (e) => {
        e.stopPropagation();

        if (selecionado === div) {
            div.classList.remove('papelEscolhido', 'divPraCima');
            papeisDeUsuario.forEach(d => d.classList.remove('efeitoBlur'));
            nav.classList.remove('clicado');
            botao.disabled = true;
            selecionado = null;
        } else {
            papeisDeUsuario.forEach(d => d.classList.remove('papelEscolhido', 'efeitoBlur', 'divPraCima'));
            div.classList.add('papelEscolhido', 'divPraCima');
            papeisDeUsuario.forEach(d => {
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
    if (!e.target.closest('.container nav div')) {
        papeisDeUsuario.forEach(d => d.classList.remove('papelEscolhido', 'efeitoBlur', 'divPraCima'));
        nav.classList.remove('clicado');
        botao.disabled = true;
        selecionado = null;
    }
});

let QueroRoupa = false;
let Doador = false;
let PA = false;

document.querySelector('#divPapel1').addEventListener('click', () => {
    QueroRoupa = true;
});

document.querySelector('#divPapel2').addEventListener('click', () => {
    Doador = true;
});

document.querySelector('#divPapel3').addEventListener('click', () => {
    PA = true;
});

const logo = document.querySelector('#logo');
const desc = document.querySelector('#desc');
const navPapeis = document.querySelector('.container nav')
const btnProsseguir = document.querySelector('#btnProsseguir');
const containerPA = document.querySelector('.containerPA');
const containerDoador = document.querySelector('.containerDoador');
const imgIgreja = document.querySelector('.imgIgreja');

document.querySelector('#btnProsseguir').addEventListener('click', () => {
    if (PA == true) {
        logo.classList.add('MovimentoLogoPA');
        requestAnimationFrame(() => {
            setTimeout(() => {
                desc.classList.add('MovimentoDescPA');
            }, 100);
            setTimeout(() => {
                navPapeis.classList.add('MovimentoNavPapeisPA');
            }, 200);
            setTimeout(() => {
                btnProsseguir.classList.add('MovimentoBtnProsseguirPA');
            }, 300);
            setTimeout(() => {
                containerPA.classList.add('MovimentoContainerPA');
            }, 600);
            setTimeout(() => {
                imgIgreja.classList.add('MovimentoImgIgrejaPA');
            }, 1000);
        });
    }
    if (Doador === true) {
        logo.classList.add('MovimentoLogoDO');

        requestAnimationFrame(() => {
            setTimeout(() => {
                desc.classList.add('DescExpandir');
                desc.classList.add('MovimentoDescDO');
            }, 100);

            setTimeout(() => {
                navPapeis.classList.add('MovimentoNavPapeisDO');
            }, 200);

            setTimeout(() => {
                btnProsseguir.classList.add('MovimentoBtnProsseguirDO');
            }, 300);

            setTimeout(() => {
                containerDoador.classList.add('MovimentoContainerDO');
            }, 600);
        });
    }
});

document.querySelector('.btnVoltar1').addEventListener('click', () => {
    containerPA.classList.remove('MovimentoContainerPA');
    document.querySelector('.divLoginPA').classList.remove('divLoginParaEsquerda');
    document.querySelector('.divCadastrarPA').classList.remove('divCadastroParaEsquerda');
    imgIgreja.classList.remove('MovimentoImgIgrejaPA');

    const inputCNPJ = document.getElementById('inputCNPJ');
    const inputSenha = document.getElementById('inputSenha');
    inputCNPJ.value = '';
    inputSenha.value = '';
    inputCNPJ.classList.remove('inputPreenchido', 'not-empty');
    inputSenha.classList.remove('inputPreenchido', 'not-empty');
    document.getElementById('btnEntrar').disabled = true;

    const camposCadastroPA = [
        'nome', 'endereco', 'telefone', 'cnpjCadastro',
        'email', 'senhaCadastro', 'inicio', 'final'
    ];

    camposCadastroPA.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.value = '';
            input.classList.remove('inputPreenchido', 'not-empty');
        }
    });

    const checkbox = document.querySelector('.checkbox');
    const divData = document.querySelector('.divDataPA');
    checkbox.checked = false;
    divData.classList.remove('mostrarInputsData');

    document.getElementById('btnCadastrar').disabled = true;

    setTimeout(() => {
        logo.classList.remove('MovimentoLogoPA');
        desc.classList.remove('MovimentoDescPA');
        navPapeis.classList.remove('MovimentoNavPapeisPA');
        btnProsseguir.classList.remove('MovimentoBtnProsseguirPA');
    }, 700);

    PA = false;
});


document.querySelector('.btnVoltar2').addEventListener('click', () => {
    containerDoador.classList.remove('MovimentoContainerDO');
    document.querySelector('.divLoginDoador').classList.remove('divLoginParaDireita');
    document.querySelector('.divCadastrarDO').classList.remove('divCadastroParaDireita');
    setTimeout(() => {
        logo.classList.remove('MovimentoLogoDO');
        desc.classList.remove('MovimentoDescDO');
        navPapeis.classList.remove('MovimentoNavPapeisDO');
        btnProsseguir.classList.remove('MovimentoBtnProsseguirDO');
    }, 700);

    const cpfInput = document.getElementById('inputCPFDoador');
    const senhaInput = document.getElementById('inputSenhaDoador');
    cpfInput.value = '';
    senhaInput.value = '';
    cpfInput.classList.remove('inputPreenchido', 'not-empty');
    senhaInput.classList.remove('inputPreenchido', 'not-empty');
    document.getElementById('btnEntrarDoador').disabled = true;

    const containerCadastrar = document.querySelector('.containerCadastrarDO');
    if (containerCadastrar) {
        const inputsCadastro = containerCadastrar.querySelectorAll('input');
        inputsCadastro.forEach(input => {
            input.value = '';
            input.classList.remove('inputPreenchido', 'not-empty');
        });
    }

    const btnCadastrarDoador = document.getElementById('btnCadastrarDoador');
    if (btnCadastrarDoador) btnCadastrarDoador.disabled = true;

    Doador = false;
});


document.querySelectorAll('.divInputsLogin input, .divInputsCadastrar input, .divInputsLoginDoador input, .divInputsCadastrarDO input').forEach(input => {
    input.addEventListener('focus', () => {
        input.classList.add('not-empty');
    });

    input.addEventListener('blur', () => {
        if (input.value.trim() === '') {
            input.classList.remove('not-empty');
        }
    });
});

const inputCNPJ = document.getElementById('inputCNPJ');
const inputSenha = document.getElementById('inputSenha');
const btnEntrar = document.getElementById('btnEntrar');

function verificarCamposLogin() {
    const cnpj = inputCNPJ.value.trim();
    const senha = inputSenha.value.trim();

    btnEntrar.disabled = !(validarCNPJ(cnpj) && senha !== '');
}

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

inputCNPJ.addEventListener('input', verificarCamposLogin);
inputSenha.addEventListener('input', verificarCamposLogin);

btnEntrar.addEventListener('click', () => {
    const cnpj = inputCNPJ.value.trim().replace(/\D/g, '');
    const senha = inputSenha.value.trim();
    const listaUsuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const usuarioEncontrado = listaUsuarios.find(usuario => {
        const cnpjLimpo = usuario.cnpj.replace(/\D/g, '');
        return cnpjLimpo === cnpj && usuario.senha === senha;
    });

    if (usuarioEncontrado) {
        document.querySelector('.LoginBemSucedido').style.display = 'flex';
        setTimeout(() => {
            document.querySelector('.LoginBemSucedido').classList.add('aparecerMensagemLBS');
        }, 200);
        document.querySelector('.sombra').classList.add('sombrear');
    } else {
        document.querySelector('.sombra').classList.add('sombrear');
        document.querySelector('.PontoDeApoioNaoEncontrado').style.display = 'flex';
        setTimeout(() => {
            document.querySelector('.PontoDeApoioNaoEncontrado').classList.add('aparecerMensagemPDANE');
        }, 300);
    }
});

document.querySelector('.PontoDeApoioNaoEncontrado header svg').addEventListener('click', () => {
    document.querySelector('.sombra').classList.remove('sombrear');
    document.querySelector('.PontoDeApoioNaoEncontrado').classList.remove('aparecerMensagemPDANE');
});

const camposCadastro = [
    'nome', 'endereco', 'telefone', 'cnpjCadastro',
    'email', 'senhaCadastro', 'inicio', 'final'
];

function validarTelefone(telefone) {
    const limpo = telefone.replace(/\D/g, '');
    return limpo.length === 10 || limpo.length === 11;
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function verificarCamposCadastro() {
    const checkboxTemporario = document.querySelector('.checkbox').checked;

    let camposObrigatorios = [
        'nome', 'endereco', 'telefone',
        'cnpjCadastro', 'email', 'senhaCadastro'
    ];

    if (checkboxTemporario) {
        camposObrigatorios.push('inicio', 'final');
    }

    const todosPreenchidos = camposObrigatorios
        .every(id => document.getElementById(id).value.trim() !== '');

    if (!todosPreenchidos) {
        document.querySelector('#btnCadastrar').disabled = true;
        return;
    }

    const telefoneValido = validarTelefone(document.getElementById('telefone').value);
    const cnpjValido = validarCNPJ(document.getElementById('cnpjCadastro').value);
    const emailValido = validarEmail(document.getElementById('email').value);

    document.querySelector('#btnCadastrar').disabled = !(telefoneValido && cnpjValido && emailValido);
}

camposCadastro.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
        input.addEventListener('input', verificarCamposCadastro);
    }
});

document.querySelector('#btnCadastrar').addEventListener('click', () => {
    const temporario = document.querySelector('.checkbox').checked;

    const novoUsuario = {
        nome: document.querySelector('.inputNome').value.trim(),
        endereco: document.querySelector('.inputEndereco').value.trim(),
        telefone: document.querySelector('.inputTelefone').value.trim(),
        cnpj: document.querySelector('.inputCNPJCadastro').value.trim(),
        email: document.querySelector('.inputEmail').value.trim(),
        senha: document.querySelector('.inputSenhaCadastro').value.trim(),
        temporario: temporario
    };

    if (temporario) {
        novoUsuario.inicio = document.getElementById('inicio').value.trim();
        novoUsuario.final = document.getElementById('final').value.trim();
    }

    const lista = JSON.parse(localStorage.getItem('usuarios')) || [];
    lista.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(lista));

    camposCadastro.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.value = '';
            input.classList.remove('inputPreenchido');
            input.classList.remove('not-empty');
        }
    });

    document.querySelector('.checkbox').checked = false;
    document.querySelector('#btnCadastrar').disabled = true;

    document.querySelector(".CadastroBemSucedido").style.display = 'flex';
    setTimeout(() => {
        document.querySelector(".CadastroBemSucedido").classList.add("aparecerMensagemCBS");
    }, 200);
    document.querySelector(".sombra").classList.add("sombrear");
});

document.querySelector('.LoginBemSucedido header svg').addEventListener('click', () => {
    document.querySelector('.sombra').classList.remove('sombrear');
    document.querySelector('.LoginBemSucedido').classList.remove('aparecerMensagemLBS');
});

document.querySelector('.CadastroBemSucedido header svg').addEventListener('click', () => {
    document.querySelector('.sombra').classList.remove('sombrear');
    document.querySelector('.CadastroBemSucedido').classList.remove('aparecerMensagemCBS');
});

document.querySelector('.DoadorNaoEncontrado header svg').addEventListener('click', () => {
    document.querySelector('.sombra').classList.remove('sombrear');
    document.querySelector('.DoadorNaoEncontrado').classList.remove('aparecerMensagemDNE');
});

const checkbox = document.querySelector('.checkbox');
const divData = document.querySelector('.divDataPA');

checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
        divData.classList.add('mostrarInputsData');
    } else {
        divData.classList.remove('mostrarInputsData');
    }
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

document.querySelector('.divLoginPA>span button').addEventListener('click', () => {
    document.querySelector('.divLoginPA').classList.add('divLoginParaEsquerda');
    document.querySelector('.divCadastrarPA').classList.add('divCadastroParaEsquerda');
});

document.querySelector('.divLoginDoador>span button').addEventListener('click', () => {
    document.querySelector('.divLoginDoador').classList.add('divLoginParaDireita');
    document.querySelector('.divCadastrarDO').classList.add('divCadastroParaDireita');
});

document.querySelector('.divCadastrarDO>span button').addEventListener('click', () => {
    document.querySelector('.divLoginDoador').classList.remove('divLoginParaDireita');
    document.querySelector('.divCadastrarDO').classList.remove('divCadastroParaDireita');
});

document.querySelector('.divCadastrarPA>span button').addEventListener('click', () => {
    document.querySelector('.divLoginPA').classList.remove('divLoginParaEsquerda');
    document.querySelector('.divCadastrarPA').classList.remove('divCadastroParaEsquerda');
});

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.charAt(10));
}

function verificarCamposLoginDoador() {
    const cpfDoador = document.getElementById('inputCPFDoador').value.trim();
    const senhaDoador = document.getElementById('inputSenhaDoador').value.trim();
    const btnEntrarDoador = document.getElementById('btnEntrarDoador');

    if (validarCPF(cpfDoador) && senhaDoador !== '') {
        btnEntrarDoador.disabled = false;
    } else {
        btnEntrarDoador.disabled = true;
    }
}

document.getElementById('inputCPFDoador').addEventListener('input', verificarCamposLoginDoador);
document.getElementById('inputSenhaDoador').addEventListener('input', verificarCamposLoginDoador);

document.getElementById('btnEntrarDoador').addEventListener('click', () => {
    const cpfD = document.getElementById('inputCPFDoador').value.trim().replace(/\D/g, '');
    const senhaD = document.getElementById('inputSenhaDoador').value.trim();
    const listaDoadores = JSON.parse(localStorage.getItem('doadores')) || [];

    const doadorEncontrado = listaDoadores.find(doador => {
        const cpfSalvo = (doador.cpf || '').replace(/\D/g, '');
        return cpfSalvo === cpfD && doador.senha === senhaD;
    });

    if (doadorEncontrado) {
        document.querySelector('.LoginBemSucedido').style.display = 'flex';
        window.location.href = "../Rafael_Santos/index.html";
        setTimeout(() => {
            document.querySelector('.LoginBemSucedido').classList.add('aparecerMensagemLBS');
        }, 200);
        document.querySelector('.sombra').classList.add('sombrear');
    } else {
        document.querySelector('.sombra').classList.add('sombrear');
        document.querySelector('.DoadorNaoEncontrado').style.display = 'flex';
        setTimeout(() => {
            document.querySelector('.DoadorNaoEncontrado').classList.add('aparecerMensagemDNE');
        }, 300);
    }
});

function verificarCamposCadastroDoador() {
    const nome = document.getElementById('nomeDoador').value.trim();
    const endereco = document.getElementById('enderecoDoador').value.trim();
    const telefone = document.getElementById('telefoneDoador').value.trim();
    const cpf = document.getElementById('cpfCadastroDoador').value.trim();
    const email = document.getElementById('emailDoador').value.trim();
    const senha = document.getElementById('senhaCadastroDoador').value.trim();

    const btnCadastrar = document.getElementById('btnCadastrarDoador');

    const todosPreenchidos = nome && endereco && telefone && cpf && email && senha;
    const telefoneValido = validarTelefone(telefone);
    const cpfValido = validarCPF(cpf);
    const emailValido = validarEmail(email);

    btnCadastrar.disabled = !(todosPreenchidos && telefoneValido && cpfValido && emailValido);
}

function cadastrarDoador() {
    const nome = document.getElementById('nomeDoador').value.trim();
    const endereco = document.getElementById('enderecoDoador').value.trim();
    const telefone = document.getElementById('telefoneDoador').value.trim();
    const cpf = document.getElementById('cpfCadastroDoador').value.trim();
    const email = document.getElementById('emailDoador').value.trim();
    const senha = document.getElementById('senhaCadastroDoador').value.trim();

    const doador = {
        nome,
        endereco,
        telefone,
        cpf,
        email,
        senha
    };

    const doadoresSalvos = JSON.parse(localStorage.getItem('doadores')) || [];
    doadoresSalvos.push(doador);

    localStorage.setItem('doadores', JSON.stringify(doadoresSalvos));

    document.querySelector(".CadastroBemSucedido").style.display = 'flex';
    setTimeout(() => {
        document.querySelector(".CadastroBemSucedido").classList.add("aparecerMensagemCBS");
    }, 200);
    document.querySelector(".sombra").classList.add("sombrear");

    document.getElementById('nomeDoador').value = '';
    document.getElementById('enderecoDoador').value = '';
    document.getElementById('telefoneDoador').value = '';
    document.getElementById('cpfCadastroDoador').value = '';
    document.getElementById('emailDoador').value = '';
    document.getElementById('senhaCadastroDoador').value = '';
    document.getElementById('btnCadastrarDoador').disabled = true;
}

[
    'nomeDoador', 'enderecoDoador', 'telefoneDoador',
    'cpfCadastroDoador', 'emailDoador', 'senhaCadastroDoador'
].forEach(id => {
    const input = document.getElementById(id);
    if (input) {
        input.addEventListener('input', verificarCamposCadastroDoador);
    }
});

document.getElementById('btnCadastrarDoador').addEventListener('click', cadastrarDoador);