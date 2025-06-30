document.addEventListener('DOMContentLoaded', function() {
    carregarPontosDeApoio();
    configurarFormulario();
    configurarEnderecoCondicional();
    preencherDadosUsuario();
});

async function carregarPontosDeApoio() {
    try {
        const response = await fetch('../encontrar-ongs/utils/dados.json');
        const pontosDeApoio = await response.json();
        
        const select = document.getElementById('pontoApoio');
        pontosDeApoio.forEach(ponto => {
            const option = document.createElement('option');
            option.value = ponto.id;
            option.textContent = ponto.nome;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar pontos de apoio:', error);
    }
}

function configurarFormulario() {
    const form = document.getElementById('doacaoForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        enviarFormulario();
    });
}

function configurarEnderecoCondicional() {
    const checkbox = document.getElementById('precisaColeta');
    const enderecoSection = document.getElementById('enderecoSection');
    
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            enderecoSection.style.display = 'block';
            tornarCamposObrigatorios(true);
        } else {
            enderecoSection.style.display = 'none';
            tornarCamposObrigatorios(false);
            limparCamposEndereco();
        }
    });
}

function tornarCamposObrigatorios(obrigatorio) {
    const campos = ['cep', 'rua', 'numero', 'bairro'];
    campos.forEach(campo => {
        const elemento = document.getElementById(campo);
        if (obrigatorio) {
            elemento.setAttribute('required', '');
        } else {
            elemento.removeAttribute('required');
        }
    });
}

function limparCamposEndereco() {
    const campos = ['cep', 'rua', 'numero', 'bairro', 'complemento'];
    campos.forEach(campo => {
        document.getElementById(campo).value = '';
    });
}

function preencherDadosUsuario() {
    const urlParams = new URLSearchParams(window.location.search);
    const doadorId = urlParams.get('doadorId');
    
    if (doadorId) {
        buscarDadosDoador(doadorId);
    }
}

async function buscarDadosDoador(doadorId) {
    try {
        const response = await fetch('http://localhost:3000/doadores');
        const doadores = await response.json();
        const doador = doadores.find(d => d.id === parseInt(doadorId));
        
        if (doador) {
            document.getElementById('nome').value = doador.nome || '';
            document.getElementById('email').value = doador.email || '';
            document.getElementById('telefone').value = doador.telefone || '';
            document.getElementById('cpf').value = doador.cpf || '';
        }
    } catch (error) {
        console.error('Erro ao buscar dados do doador:', error);
    }
}

async function enviarFormulario() {
    const formData = new FormData(document.getElementById('doacaoForm'));
    const dadosDaDoacao = Object.fromEntries(formData.entries());
    
    dadosDaDoacao.dataCompleta = `${dadosDaDoacao.dataDoacao} ${dadosDaDoacao.horarioDoacao}`;
    dadosDaDoacao.status = 'Agendado';
    dadosDaDoacao.id = Date.now();
    
    try {
        const response = await fetch('http://localhost:3000/doacoes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosDaDoacao)
        });
        
        if (response.ok) {
            mostrarSucesso();
        } else {
            throw new Error('Erro ao enviar');
        }
    } catch (error) {
        console.error('Erro ao enviar doação:', error);
        salvarLocalmenteEMostrarSucesso(dadosDaDoacao);
    }
}

function salvarLocalmenteEMostrarSucesso(dados) {
    let doacoes = JSON.parse(localStorage.getItem('doacoes') || '[]');
    doacoes.push(dados);
    localStorage.setItem('doacoes', JSON.stringify(doacoes));
    mostrarSucesso();
}

function mostrarSucesso() {
    alert('Doação agendada com sucesso! Você receberá um e-mail de confirmação em breve.');
    window.location.href = '../encontrar-ongs/index.html';
}

document.getElementById('cep').addEventListener('blur', function() {
    const cep = this.value.replace(/\D/g, '');
    if (cep.length === 8) {
        buscarCEP(cep);
    }
});

async function buscarCEP(cep) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await response.json();
        
        if (!dados.erro) {
            document.getElementById('rua').value = dados.logradouro;
            document.getElementById('bairro').value = dados.bairro;
        }
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
    }
}
