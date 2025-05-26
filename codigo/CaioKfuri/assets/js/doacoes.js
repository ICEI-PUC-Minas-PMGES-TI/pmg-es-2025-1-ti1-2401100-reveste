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
                agendamento: "2024-06-01 14:00",
                endereco: "Rua das Flores, 123, Centro, Cidade X",
                observacao: "Deixar na portaria"
            },
            {
                id: 2,
                data: "2024-06-10",
                item: "2 calças jeans",
                agendamento: "2024-06-10 10:00",
                endereco: "Rua das Flores, 123, Centro, Cidade X",
                observacao: ""
            }
        ]
    }
];

function renderOngsDoacoes() {
    const container = document.getElementById("ongs-doacoes-container");
    container.innerHTML = "";

    if (doacoes.length === 0) {
        container.innerHTML = "<p>Você ainda não fez nenhuma doação.</p>";
        return;
    }

    doacoes.forEach(ong => {
        const card = document.createElement("div");
        card.className = "doacao-card";
        card.innerHTML = `
            <img src="${ong.ongImagem}" alt="${ong.ongNome}" style="width:100%;height:140px;object-fit:cover;border-radius:8px 8px 0 0;margin-bottom:12px;">
            <h3>${ong.ongNome}</h3>
            <p><strong>Total de doações:</strong> ${ong.doacoes.length}</p>
            <button class="btn-detalhes-doacao" onclick="verDetalhesDoacao(${ong.ongId})">Ver detalhes das doações</button>
        `;
        container.appendChild(card);
    });
}

function verDetalhesDoacao(ongId) {
    window.location.href = `detalhes-doacao.html?ongId=${ongId}`;
}

document.addEventListener("DOMContentLoaded", renderOngsDoacoes);
