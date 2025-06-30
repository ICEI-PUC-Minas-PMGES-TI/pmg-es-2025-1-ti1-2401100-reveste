function formatarDataBR(dataISO) {
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
}

function renderDetalhesDoacao() {
    const urlParams = new URLSearchParams(window.location.search);
    const ongId = parseInt(urlParams.get('ongId'));
    const doacaoId = urlParams.get('doacaoId');
    const container = document.getElementById('detalhes-doacao-container');

    if (!doacoes || !Array.isArray(doacoes)) {
        if (container) {
            container.innerHTML = "<p>Nenhum dado de doação encontrado.</p>";
        }
        return;
    }

    const ong = doacoes.find(o => o.ongId === ongId);

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
                        <p><strong>Data da doação:</strong> ${formatarDataBR(doacao.data)}</p>
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
        const doacoesOrdenadas = [...ong.doacoes].sort((a, b) => b.data.localeCompare(a.data));
        container.innerHTML = `
            <img src="${ong.ongImagem}" alt="${ong.ongNome}" class="detalhes-doacao-img">
            <div class="detalhes-doacao-content">
                <span class="detalhes-doacao-badge">Doações para ${ong.ongNome}</span>
                <h1>${ong.ongNome}</h1>
                <div>
                    ${doacoesOrdenadas.map(doacao => `
                        <div class="detalhes-doacao-info">
                            <p><strong>Data da doação:</strong> ${formatarDataBR(doacao.data)}</p>
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
