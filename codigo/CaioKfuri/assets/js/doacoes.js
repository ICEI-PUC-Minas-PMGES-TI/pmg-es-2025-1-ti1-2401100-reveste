const doacoes = [
    {
        id: 1,
        ong: "Roupa Para Todos",
        imagem: "./imgs/ong1.png",
        data: "2024-06-01",
        item: "10 camisetas"
    },
    {
        id: 2,
        ong: "Aquecendo Vidas",
        imagem: "./imgs/ong2.jpg",
        data: "2024-05-15",
        item: "5 cobertores"
    },
    {
        id: 3,
        ong: "Roupas Que Abraçam",
        imagem: "./imgs/ong3.jpg",
        data: "2024-04-20",
        item: "3 calças jeans"
    }
];

function verDetalhesDoacao(id) {
    window.location.href = `detalhes-doacao.html?id=${id}`;
}

function renderDoacoes() {
    const container = document.getElementById("doacoes-container");
    container.innerHTML = "";
    if (doacoes.length === 0) {
        container.innerHTML = "<p>Você ainda não fez nenhuma doação.</p>";
        return;
    }
    doacoes.forEach(doacao => {
        const card = document.createElement("div");
        card.className = "doacao-card";
        card.innerHTML = `
            <img src="${doacao.imagem}" alt="${doacao.ong}" style="width:100%;height:140px;object-fit:cover;border-radius:8px 8px 0 0;margin-bottom:12px;">
            <h3>${doacao.ong}</h3>
            <p><strong>Item:</strong> ${doacao.item}</p>
            <p class="doacao-data"><strong>Data:</strong> ${doacao.data}</p>
            <button class="btn-detalhes-doacao" onclick="verDetalhesDoacao(${doacao.id})">Ver detalhes</button>
        `;
        container.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", renderDoacoes);
