function calcularEstatisticas() {
    const totalDoacoes = doacoesDoUsuario.length;
    const agendamentosPendentes = agendamentosDoUsuario.length;
    const pontosAtendidos = new Set(doacoesDoUsuario.map(doacao => doacao.idPontoApoio)).size;
    const roupasDoadas = doacoesDoUsuario.reduce((total, doacao) => {
        return total + doacao.itens.reduce((totalItens, item) => totalItens + item.quantidade, 0);
    }, 0);

    return { totalDoacoes, agendamentosPendentes, pontosAtendidos, roupasDoadas };
}

function carregarEstatisticas() {
    const estatisticas = calcularEstatisticas();
    const cards = [
        { titulo: "Total de Doações", numero: estatisticas.totalDoacoes, classe: "primary", subtitulo: "Doações realizadas" },
        { titulo: "Agendamentos Pendentes", numero: estatisticas.agendamentosPendentes, classe: "warning", subtitulo: "Para confirmar" },
        { titulo: "Pontos Atendidos", numero: estatisticas.pontosAtendidos, classe: "success", subtitulo: "Diferentes locais" },
        { titulo: "Roupas Doadas", numero: estatisticas.roupasDoadas, classe: "info", subtitulo: "Total de peças" }
    ];

    const container = document.getElementById('dashboard-cards');
    if (container) {
        container.innerHTML = cards.map(card => `
            <div class="dashboard-card ${card.classe}">
                <h3>${card.titulo}</h3>
                <div class="number">${card.numero}</div>
                <div class="subtitle">${card.subtitulo}</div>
            </div>
        `).join('');
    }
}

function carregarAtividadesRecentes() {
    const container = document.getElementById('recent-donations');
    if (!container) return;

    if (doacoesDoUsuario.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>Nenhuma doação realizada ainda</h3>
                <p>Suas doações aparecerão aqui após serem confirmadas</p>
                <a href="../formulario-doacao/index.html" class="btn-primary">Fazer primeira doação</a>
            </div>
        `;
        return;
    }

    const doacoesRecentes = [...doacoesDoUsuario]
        .sort((a, b) => new Date(b.data) - new Date(a.data))
        .slice(0, 5);

    container.innerHTML = doacoesRecentes.map(doacao => {
        const pontoApoio = pontosDeApoio.find(ponto => ponto.id === doacao.idPontoApoio);
        const nomeOng = pontoApoio ? pontoApoio.nome : 'Ponto de Apoio';
        const resumoItens = doacao.itens.map(item => 
            `${item.quantidade} ${item.tipo}${item.quantidade > 1 ? 's' : ''}`
        ).join(', ');

        return `
            <div class="recent-item">
                <div class="recent-icon">📦</div>
                <div class="recent-content">
                    <h4>Doação para ${nomeOng}</h4>
                    <p>${resumoItens}</p>
                    <span class="recent-date">${new Date(doacao.data).toLocaleDateString('pt-BR')}</span>
                </div>
            </div>
        `;
    }).join('');
}

function carregarImpacto() {
    const container = document.getElementById('impact-cards');
    if (!container) return;

    const estatisticas = calcularEstatisticas();
    const proximoAgendamento = agendamentosDoUsuario.length > 0 ? 
        agendamentosDoUsuario.sort((a, b) => new Date(a.dataHoraAgendamento) - new Date(b.dataHoraAgendamento))[0] : null;

    const impactoData = [
        {
            titulo: "Seu Impacto Total",
            stats: [
                { label: "Pessoas potencialmente ajudadas", valor: `~${estatisticas.roupasDoadas * 2}` },
                { label: "Roupas doadas", valor: estatisticas.roupasDoadas },
                { label: "Pontos atendidos", valor: estatisticas.pontosAtendidos }
            ]
        },
        {
            titulo: "Próximas Ações",
            stats: [
                { label: "Agendamentos pendentes", valor: estatisticas.agendamentosPendentes },
                { 
                    label: "Próximo agendamento", 
                    valor: proximoAgendamento ? 
                        new Date(proximoAgendamento.dataHoraAgendamento).toLocaleDateString('pt-BR') : 
                        "Nenhum agendado"
                },
                { 
                    label: "Local do próximo", 
                    valor: proximoAgendamento ? 
                        (pontosDeApoio.find(p => p.id === proximoAgendamento.idPontoApoio)?.nome || "A definir") : 
                        "N/A"
                }
            ]
        }
    ];

    container.innerHTML = impactoData.map(card => `
        <div class="impact-card">
            <h3>${card.titulo}</h3>
            ${card.stats.map(stat => `
                <div class="impact-stat">
                    <span>${stat.label}:</span>
                    <span>${stat.valor}</span>
                </div>
            `).join('')}
        </div>
    `).join('');
}

function atualizarNomeUsuario() {
    const welcomeSection = document.querySelector('.welcome-section h1');
    if (welcomeSection && doadorLogado) {
        welcomeSection.textContent = `Bem-vindo, ${doadorLogado.nome.split(' ')[0]}!`;
    }
}

async function inicializarPagina() {
    if (!(await verificarEBuscarDoador())) {
        return;
    }

    atualizarNomeUsuario();
    await buscarTodosDados();
    carregarEstatisticas();
    carregarAtividadesRecentes();
    carregarImpacto();
}

document.addEventListener('DOMContentLoaded', inicializarPagina);
