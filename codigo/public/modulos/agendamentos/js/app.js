const API_BASE = 'http://localhost:3000';

let pontosDeApoio = [];


function verificarSessaoPontoDeApoio() {
    const pontoDeApoioLogado = sessionStorage.getItem('pontoDeApoioLogado');
    console.log('Verificando sessão de ponto de apoio:', pontoDeApoioLogado);
    
    if (!pontoDeApoioLogado) {
        console.log('Acesso negado - redirecionando para login');
        alert('Acesso restrito! Você precisa estar logado como ponto de apoio para acessar esta área.');
        window.location.href = '../../index.html';
        return false;
    }
    return true;
}


async function carregarPontosDeApoio() {
    try {
        const response = await fetch(`${API_BASE}/pontosDeApoio`);
        pontosDeApoio = await response.json();
        popularSelectPontoApoio();
    } catch (error) {
        console.error('Erro ao carregar pontos de apoio:', error);

        pontosDeApoio = [
            { id: 1, nome: "Igreja São José" },
            { id: 2, nome: "Igreja Batista" },
            { id: 3, nome: "ONG Reveste" }
        ];
        popularSelectPontoApoio();
    }
}


function popularSelectPontoApoio() {
    const selectPontoApoio = document.getElementById('pontoApoio');
    if (selectPontoApoio) {
        selectPontoApoio.innerHTML = '<option value="">Selecione um ponto de apoio</option>';
        pontosDeApoio.forEach(ponto => {
            const option = document.createElement('option');
            option.value = ponto.id;
            option.textContent = ponto.nome;
            selectPontoApoio.appendChild(option);
        });
    }
}



async function criarAgendamento(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const cpf = document.getElementById('cpf').value;
    const horario = document.getElementById('horario').value;
    const numero = document.getElementById('numero').value;
    const pontoApoioId = document.getElementById('pontoApoio').value;

    if (!nome || !email || !cpf || !horario || !numero || !pontoApoioId) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const novoAgendamento = {
        idPontoApoio: parseInt(pontoApoioId),
        nome: nome,
        email: email,
        telefone: numero.replace(/[^\d]/g, ''),
        cpf: cpf.replace(/[^\d]/g, ''),
        dataHoraAgendamento: horario
    };

    try {
        const response = await fetch(`${API_BASE}/agendamentos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoAgendamento)
        });

        if (response.ok) {
            const agendamentoCriado = await response.json();
            const pontoApoioNome = pontosDeApoio.find(p => p.id === parseInt(pontoApoioId))?.nome || 'Ponto de Apoio';
            
            alert(`Agendamento criado com sucesso para ${nome} no ponto de apoio ${pontoApoioNome}!`);
            event.target.reset();
        } else {
            throw new Error('Erro ao criar agendamento');
        }
    } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        alert('Erro ao criar agendamento. Tente novamente.');
    }
}


document.addEventListener('DOMContentLoaded', function() {

    if (!verificarSessaoPontoDeApoio()) {
        return; 
    }
    
    carregarPontosDeApoio();
    aplicarMascaras();
});


function aplicarMascaras() {
    function mascaraCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); 
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        return cpf;
    }

    function mascaraTelefone(telefone) {
        telefone = telefone.replace(/\D/g, '');
        
        if (telefone.length > 0) {
            telefone = '(' + telefone;
        }
        if (telefone.length > 3) {
            telefone = telefone.substring(0, 3) + ') ' + telefone.substring(3);
        }
        if (telefone.length > 10) {
            if (telefone.length > 10) {
                telefone = telefone.substring(0, 10) + '-' + telefone.substring(10);
            }
        } else if (telefone.length > 9) {
            telefone = telefone.substring(0, 9) + '-' + telefone.substring(9);
        }
        
        return telefone;
    }

    const cpfInput = document.querySelector('input#cpf');
    const telefoneInput = document.querySelector('input#numero');

    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            const value = e.target.value;
            e.target.value = mascaraCPF(value);
        });
        
        cpfInput.addEventListener('keypress', function(e) {
            if (e.target.value.length >= 14) {
                e.preventDefault();
            }
        });
    }

    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            const value = e.target.value;
            e.target.value = mascaraTelefone(value);
        });
        
        telefoneInput.addEventListener('keypress', function(e) {
            if (e.target.value.length >= 15) {
                e.preventDefault();
            }
        });
    }
}