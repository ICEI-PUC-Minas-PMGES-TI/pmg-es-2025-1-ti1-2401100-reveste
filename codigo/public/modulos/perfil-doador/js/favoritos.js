let doadorLogado = null;
let favoritos = [];

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

async function buscarFavoritos() {
    try {
        const pontosResponse = await fetch('http://localhost:3000/pontosDeApoio');
        const pontosDeApoio = await pontosResponse.json();
        
        favoritos = pontosDeApoio.slice(0, 2);
    } catch (error) {
        console.error('Erro ao buscar favoritos:', error);
        favoritos = [];
    }
}

function carregarFavoritos() {
    const container = document.getElementById('favorites-grid');
    if (!container) return;

    if (favoritos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>Nenhum favorito ainda</h3>
                <p>Você ainda não marcou nenhuma ONG como favorita</p>
                <a href="../necessidades-ongs/index.html" class="btn-primary">Encontrar ONGs</a>
            </div>
        `;
        return;
    }

    container.innerHTML = favoritos.map(favorito => `
        <div class="favorite-card">
            <h3>${favorito.nome}</h3>
            <p><strong>Endereço:</strong> ${favorito.endereco}</p>
            <p><strong>Telefone:</strong> ${favorito.telefone}</p>
            <p><strong>Email:</strong> ${favorito.email}</p>
            <div class="card-actions">
                <button class="btn-primary" onclick="agendarDoacao(${favorito.id})">
                    Agendar Doação
                </button>
                <button class="btn-secondary" onclick="removerFavorito(${favorito.id})">
                    Remover dos Favoritos
                </button>
            </div>
        </div>
    `).join('');
}

function agendarDoacao(pontoId) {
    const doadorId = obterIdDoadorDaURL();
    window.location.href = `../formulario-doacao/index.html?ponto=${pontoId}&doadorId=${doadorId}`;
}

function removerFavorito(pontoId) {
    favoritos = favoritos.filter(f => f.id !== pontoId);
    carregarFavoritos();
}

function logout() {
    window.location.href = '../encontrar-ongs/index.html';
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

async function inicializarPagina() {
    if (!(await verificarEBuscarDoador())) return;
    
    await buscarFavoritos();
    carregarFavoritos();
}

document.addEventListener('DOMContentLoaded', inicializarPagina);
