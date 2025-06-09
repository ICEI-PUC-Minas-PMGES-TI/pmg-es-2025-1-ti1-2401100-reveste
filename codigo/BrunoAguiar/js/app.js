const pontoApoio = [{ 
    id: 1, 
    nome: "Igreja Batista"
  },
  { 
    id: 2, 
    nome: "ONG Reveste"
  },
    { 
    id: 3, 
    nome: "Teste"
  }
];

const arrayName = "agendamentos-v2"
const agendamento = [];

let agendamentos = JSON.parse(localStorage.getItem(arrayName)) || [];

        function getQueryParam(param) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(param);
        }
        function definirPontoApoio() {
            const idPontoApoio = getQueryParam('id');
            const nomePontoApoioElement = document.getElementById('nomePontoApoio');

            if (idPontoApoio) {
                const pontoApoioEncontrado = pontoApoio.find(ponto => ponto.id === parseInt(idPontoApoio));

                if (pontoApoioEncontrado) {
                    nomePontoApoioElement.textContent = pontoApoioEncontrado.nome;
                    document.getElementById('idPontoApoio').value = pontoApoioEncontrado.id;
                } else {
                    nomePontoApoioElement.textContent = 'Ponto de Apoio não encontrado';
                    blockCampos();
                }
            } else {
                nomePontoApoioElement.textContent = 'Selecione um Ponto de Apoio';
                blockCampos();
            }
        }

        function blockCampos()
        {
            document.getElementById('nome').disabled = true;
            document.getElementById('email').disabled = true;
            document.getElementById('cpf').disabled = true;
            document.getElementById('horario').disabled = true;
            document.getElementById('numero').disabled = true;
        }


        function criarAgendamento(event) {
            event.preventDefault();
            agendamentos = JSON.parse(localStorage.getItem(arrayName)) || [];
            
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const cpf = document.getElementById('cpf').value;
            const horario = document.getElementById('horario').value;
            const numero = document.getElementById('numero').value;
            const idPontoApoio = document.getElementById('idPontoApoio').value;


            if (!nome || !email || !cpf || !horario || !numero || !idPontoApoio) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            const maxId = agendamentos.length > 0 
                ? Math.max(...agendamentos.map(a => a.id)) 
                : 0;
                
            const novoAgendamento = {
                id: maxId + 1,
                idPontoApoio: parseInt(idPontoApoio),
                nome: nome,
                email: email,
                numero: numero.replace(/[^\d]/g, ''),
                cpf: cpf.replace(/[^\d]/g, ''), 
                status: "pending",
                data_horario_doacao: horario
            };

            agendamentos.push(novoAgendamento);
            
            localStorage.setItem(arrayName, JSON.stringify(agendamentos));

            event.target.reset();

            alert(`Agendamento criado com sucesso para ${nome} no ponto de apoio ${pontoApoio.find(p => p.id === novoAgendamento.idPontoApoio).nome}`);

            console.log('Agendamentos:', agendamentos);
        }


        document.addEventListener('DOMContentLoaded', () => {
            console.log('Agendamentos carregados do localStorage:', agendamentos);
            
            definirPontoApoio();

            const form = document.querySelector('form');
            form.addEventListener('submit', criarAgendamento);
        });

document.addEventListener('DOMContentLoaded', function() {

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
    const telefoneInput = document.querySelector('input[placeholder="(31) 9723-7293"]');

    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            const value = e.target.value;
            e.target.value = mascaraCPF(value);
        });
    }

    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            const value = e.target.value;
            e.target.value = mascaraTelefone(value);
        });
    }

    cpfInput?.addEventListener('keypress', function(e) {
        if (e.target.value.length >= 14) {
            e.preventDefault();
        }
    });

    telefoneInput?.addEventListener('keypress', function(e) {
        if (e.target.value.length >= 15) {
            e.preventDefault();
        }
    });
});