const doacoes = [
    {
        ongId: 1,
        ongNome: "Roupa Para Todos",
        ongImagem: "./imgs/ong1.png",
        doacoes: [
            {
                id: 1,
                data: "2024-06-01",
                item: "10 camisetas",
                endereco: "Rua das Flores, 123, Centro, Cidade X",
                observacao: "Deixar na portaria"
            },
            {
                id: 2,
                data: "2024-06-10",
                item: "2 calças jeans",
                endereco: "Rua das Flores, 123, Centro, Cidade X",
                observacao: ""
            }
        ]
    }
];

function renderDetalhesDoacao() {
    const urlParams = new URLSearchParams(window.location.search);
    const ongId = parseInt(urlParams.get('ongId'));
    const doacaoId = urlParams.get('doacaoId');
    const ong = doacoes.find(o => o.ongId === ongId);
    const container = document.getElementById('detalhes-doacao-container');

    if (!ong || !container) {
        container.innerHTML = "<p>Doação não encontrada.</p>";
        return;
    }

    if (doacaoId) {
        const doacao = ong.doacoes.find(d => String(d.id) === String(doacaoId));
        if (!doacao) {
            container.innerHTML = "<p>Doação não encontrada.</p>";
            return;
        }
        container.innerHTML = `
            <img src="${ong.ongImagem}" alt="${ong.ongNome}" class="detalhes-doacao-img">
            <div class="detalhes-doacao-content">
                <span class="detalhes-doacao-badge">Doação para ${ong.ongNome}</span>
                <h1>${ong.ongNome}</h1>
                <div>
                    <div class="detalhes-doacao-info">
                        <p><strong>Data da doação:</strong> ${doacao.data}</p>
                        <p><strong>Conteúdo:</strong> ${doacao.item}</p>
                        <p><strong>Endereço de entrega:</strong> ${doacao.endereco}</p>
                        ${doacao.observacao ? `<p><strong>Observação:</strong> ${doacao.observacao}</p>` : ""}
                        <a href="doacoes.html" class="btn-detalhes-doacao voltar-btn">Voltar</a>
                    </div>
                </div>
            </div>
        `;
        document.title = `${ong.ongNome} - Detalhes da Doação`;
    } else {
        container.innerHTML = `
            <img src="${ong.ongImagem}" alt="${ong.ongNome}" class="detalhes-doacao-img">
            <div class="detalhes-doacao-content">
                <span class="detalhes-doacao-badge">Doações para ${ong.ongNome}</span>
                <h1>${ong.ongNome}</h1>
                <div>
                    ${ong.doacoes.map(doacao => `
                        <div class="detalhes-doacao-info">
                            <p><strong>Data da doação:</strong> ${doacao.data}</p>
                            <p><strong>Conteúdo:</strong> ${doacao.item}</p>
                            <p><strong>Endereço de entrega:</strong> ${doacao.endereco}</p>
                            ${doacao.observacao ? `<p><strong>Observação:</strong> ${doacao.observacao}</p>` : ""}
                            <a href="detalhes-doacao.html?ongId=${ong.ongId}&doacaoId=${doacao.id}" class="btn-detalhes-doacao">Ver detalhes</a>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        document.title = `${ong.ongNome} - Detalhes das Doações`;
    }
}

document.addEventListener("DOMContentLoaded", renderDetalhesDoacao);
