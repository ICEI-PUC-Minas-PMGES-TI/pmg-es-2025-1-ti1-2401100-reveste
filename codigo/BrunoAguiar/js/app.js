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
            const idPontoApoio = document.getElementById('idPontoApoio').value;


            if (!nome || !email || !cpf || !horario || !idPontoApoio) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            const novoAgendamento = {
                id: agendamentos.length + 1, // Gera um novo ID
                idPontoApoio: parseInt(idPontoApoio),
                nome: nome,
                email: email,
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