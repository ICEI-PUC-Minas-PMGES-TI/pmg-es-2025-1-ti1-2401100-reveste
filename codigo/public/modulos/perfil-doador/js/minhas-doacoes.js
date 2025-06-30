function carregarDoacoes() {
    const container = document.getElementById('donations-list');
    if (!container) return;

    if (doacoesDoUsuario.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>Nenhuma doação realizada ainda</h3>
                <p>Você ainda não fez nenhuma doação confirmada</p>
                <a href="../formulario-doacao/index.html" class="btn-primary">Fazer primeira doação</a>
            </div>
        `;
        return;
    }

    const doacoesOrdenadas = [...doacoesDoUsuario].sort((a, b) => new Date(b.data) - new Date(a.data));

    container.innerHTML = doacoesOrdenadas.map(doacao => {
        const pontoApoio = pontosDeApoio.find(ponto => ponto.id === doacao.idPontoApoio);
        const nomeOng = pontoApoio ? pontoApoio.nome : 'Ponto de Apoio';
        
        const resumoItens = doacao.itens.map(item => 
            `${item.quantidade} ${item.tipo}${item.quantidade > 1 ? 's' : ''} (${item.tamanho})`
        ).join(', ');

        const dataFormatada = new Date(doacao.data).toLocaleDateString('pt-BR');

        return `
            <div class="donation-card">
                <div class="donation-header">
                    <h3>Doação para ${nomeOng}</h3>
                    <span class="donation-date">${dataFormatada}</span>
                </div>
                <div class="donation-content">
                    <p><strong>Itens doados:</strong> ${resumoItens}</p>
                    ${doacao.observacao ? `<p><strong>Observação:</strong> ${doacao.observacao}</p>` : ''}
                    <span class="status-badge status-${doacao.status}">${doacao.status.toUpperCase()}</span>
                </div>
                <div class="donation-actions">
                    <button class="btn-secondary" onclick="verDetalhes(${doacao.id})">
                        Ver Detalhes
                    </button>
                    <button class="btn-primary" onclick="doarNovamente(${doacao.idPontoApoio})">
                        Doar Novamente
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function verDetalhes(doacaoId) {
    const doacao = doacoesDoUsuario.find(d => d.id === doacaoId);
    if (doacao) {
        const pontoApoio = pontosDeApoio.find(ponto => ponto.id === doacao.idPontoApoio);
        alert(`Detalhes da doação:\n\nData: ${new Date(doacao.data).toLocaleDateString('pt-BR')}\nPonto: ${pontoApoio?.nome || 'N/A'}\nStatus: ${doacao.status}\nObservação: ${doacao.observacao || 'Nenhuma'}`);
    }
}

function doarNovamente(pontoId) {
    const doadorId = obterIdDoadorDaURL();
    window.location.href = `../formulario-doacao/index.html?ponto=${pontoId}&doadorId=${doadorId}`;
}

function atualizarLinksComDoadorId() {
    const doadorId = obterIdDoadorDaURL();
    
    if (doadorId) {
        const linkAgendamento = document.getElementById('link-agendamento');
        if (linkAgendamento) {
            linkAgendamento.href = `../formulario-doacao/index.html?doadorId=${doadorId}`;
        }
    }
}

async function inicializarPagina() {
    atualizarLinksComDoadorId();
    
    if (!(await verificarEBuscarDoador())) return;
    
    await buscarTodosDados();
    carregarDoacoes();
}

document.addEventListener('DOMContentLoaded', function() {
    atualizarLinksComDoadorId();
    inicializarPagina();
});
