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
        } else {
            nomePontoApoioElement.textContent = 'Ponto de Apoio não encontrado';
        }
    } else {
        // Se nenhum ID for fornecido, mostrar uma mensagem padrão
        nomePontoApoioElement.textContent = 'Selecione um Ponto de Apoio';
    }
}

// Chamar a função quando a página carregar
window.onload = definirPontoApoio;