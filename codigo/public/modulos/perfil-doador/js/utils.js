let doadorLogado = null;
let doacoesDoUsuario = [];
let pontosDeApoio = [];
let agendamentosDoUsuario = [];

function obterIdDoadorDaURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const doadorId = urlParams.get('doadorId');
    return doadorId ? parseInt(doadorId) : null;
}

async function verificarEBuscarDoador() {
    const doadorId = obterIdDoadorDaURL();
    if (!doadorId) {
        window.location.href = '../../index.html';
        return false;
    }

    try {
        const response = await fetch('http://localhost:3000/doadores');
        const doadores = await response.json();
        
        doadorLogado = doadores.find(doador => doador.id === doadorId);
        
        if (!doadorLogado) {
            window.location.href = '../../index.html';
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Erro ao buscar dados do doador:', error);
        window.location.href = '../../index.html';
        return false;
    }
}

async function buscarTodosDados() {
    try {
        const doacoesResponse = await fetch('http://localhost:3000/doacoes');
        const todasDoacoes = await doacoesResponse.json();
        doacoesDoUsuario = todasDoacoes.filter(doacao => doacao.idDoador === doadorLogado.id);

        const pontosResponse = await fetch('http://localhost:3000/pontosDeApoio');
        pontosDeApoio = await pontosResponse.json();

        const agendamentosResponse = await fetch('http://localhost:3000/agendamentos');
        const todosAgendamentos = await agendamentosResponse.json();
        const cpfLimpo = doadorLogado.cpf.replace(/\D/g, '');
        agendamentosDoUsuario = todosAgendamentos.filter(agendamento => 
            agendamento.cpf.replace(/\D/g, '') === cpfLimpo
        );

    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        doacoesDoUsuario = [];
        pontosDeApoio = [];
        agendamentosDoUsuario = [];
    }
}

function irParaInicio() {
    const doadorId = obterIdDoadorDaURL();
    window.location.href = `index.html?doadorId=${doadorId}`;
}

function irParaFavoritos() {
    const doadorId = obterIdDoadorDaURL();
    window.location.href = `favoritos.html?doadorId=${doadorId}`;
}

function irParaDoacoes() {
    const doadorId = obterIdDoadorDaURL();
    window.location.href = `doacoes.html?doadorId=${doadorId}`;
}

function irParaAgendamento() {
    const doadorId = obterIdDoadorDaURL();
    window.location.href = `../formulario-doacao/index.html?doadorId=${doadorId}`;
}

function logout() {
    window.location.href = '../../index.html';
}

function irParaEstatisticas() {
    const doadorId = obterIdDoadorDaURL();
    window.location.href = `index.html?doadorId=${doadorId}`;
}
