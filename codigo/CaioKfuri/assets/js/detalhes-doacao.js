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
    const ong = doacoes.find(o => o.ongId === ongId);
    const container = document.getElementById('detalhes-doacao-container');

    if (!ong || !container) {
        container.innerHTML = "<p>Doação não encontrada.</p>";
        return;
    }

    container.innerHTML = `
        <img src="${ong.ongImagem}" alt="${ong.ongNome}" class="detalhes-doacao-img">
        <div class="detalhes-doacao-content">
            <span class="detalhes-doacao-badge">Doações para ${ong.ongNome}</span>
            <h1>${ong.ongNome}</h1>
            <div style="margin-top:18px;">
                ${ong.doacoes.map(doacao => `
                    <div style="margin-bottom:22px;padding-bottom:18px;border-bottom:1px solid #22304A;">
                        <p><strong>Data da doação:</strong> ${doacao.data}</p>
                        <p><strong>Conteúdo:</strong> ${doacao.item}</p>
                        <p><strong>Endereço de entrega:</strong> ${doacao.endereco}</p>
                        ${doacao.observacao ? `<p><strong>Observação:</strong> ${doacao.observacao}</p>` : ""}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    document.title = `${ong.ongNome} - Detalhes das Doações`;
}

document.addEventListener("DOMContentLoaded", renderDetalhesDoacao);
