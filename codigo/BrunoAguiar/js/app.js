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

const agendamento = { 
    id: 2, 
    idPontoApoio: 1, 
    nome: "João Silva", 
    email: "joao.silva@example.com", 
    cpf: "15221451678", 
    numero:"31984097103",
    data_horario_doacao: "2025-05-10T14:30:00" 
};

// Função para obter o parâmetro da query string
let agendamentos = [];

        // Função para obter o parâmetro da query string
        function getQueryParam(param) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(param);
        }

        // Função para definir o nome do ponto de apoio
        function definirPontoApoio() {
            const idPontoApoio = getQueryParam('id');
            const nomePontoApoioElement = document.getElementById('nomePontoApoio');

            if (idPontoApoio) {
                // Encontrar o ponto de apoio correspondente no array
                const pontoApoioEncontrado = pontoApoio.find(ponto => ponto.id === parseInt(idPontoApoio));

                if (pontoApoioEncontrado) {
                    nomePontoApoioElement.textContent = pontoApoioEncontrado.nome;
                    // Salvar o ID do ponto de apoio em um atributo do formulário
                    document.getElementById('idPontoApoio').value = pontoApoioEncontrado.id;
                } else {
                    nomePontoApoioElement.textContent = 'Ponto de Apoio não encontrado';
                }
            } else {
                // Se nenhum ID for fornecido, mostrar uma mensagem padrão
                nomePontoApoioElement.textContent = 'Selecione um Ponto de Apoio';
            }
        }


        function criarAgendamento(event) {
            event.preventDefault();

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

            const novoAgendamento = {
                id: agendamentos.length + 1, // Gera um novo ID
                idPontoApoio: parseInt(idPontoApoio),
                nome: nome,
                email: email,
                numero: numero.replace(/[^\d]/g, ''),
                cpf: cpf.replace(/[^\d]/g, ''), // Remove caracteres não numéricos
                data_horario_doacao: horario
            };

            agendamentos.push(novoAgendamento);

            event.target.reset();

            alert(`Agendamento criado com sucesso para ${nome} no ponto de apoio ${pontoApoio.find(p => p.id === novoAgendamento.idPontoApoio).nome}`);

            console.log('Agendamentos:', agendamentos);
        }


        document.addEventListener('DOMContentLoaded', () => {

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
        telefone = telefone.replace(/\D/g, ''); // Remove caracteres não numéricos
        
        // Aplicar formatação progressiva
        if (telefone.length > 0) {
            telefone = '(' + telefone;
        }
        if (telefone.length > 3) {
            telefone = telefone.substring(0, 3) + ') ' + telefone.substring(3);
        }
        if (telefone.length > 10) {
            // Para celular (11 dígitos)
            if (telefone.length > 10) {
                telefone = telefone.substring(0, 10) + '-' + telefone.substring(10);
            }
        } else if (telefone.length > 9) {
            // Para telefone fixo (10 dígitos)
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