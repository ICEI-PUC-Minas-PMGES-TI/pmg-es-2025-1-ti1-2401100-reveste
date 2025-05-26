const doacoes = [
    {
        id: 1,
        ong: "Roupa Para Todos",
        imagem: "./imgs/ong1.png",
        data: "2024-06-01",
        item: "10 camisetas",
        agendamento: "2024-05-30 14:00",
        endereco: "Rua das Flores, 123, Centro, Cidade X",
        observacao: "Deixar na portaria"
    },
    {
        id: 2,
        ong: "Aquecendo Vidas",
        imagem: "./imgs/ong2.jpg",
        data: "2024-05-15",
        item: "5 cobertores",
        agendamento: "2024-05-13 09:30",
        endereco: "Av. Brasil, 456, Bairro Y",
        observacao: ""
    },
    {
        id: 3,
        ong: "Roupas Que Abraçam",
        imagem: "./imgs/ong3.jpg",
        data: "2024-04-20",
        item: "3 calças jeans",
        agendamento: "2024-04-18 16:00",
        endereco: "Rua Esperança, 789, Bairro Z",
        observacao: "Entregar para a responsável"
    }
];

function renderDetalhesDoacao() {
    const urlParams = new URLSearchParams(window.location.search);
    const doacaoId = parseInt(urlParams.get('id'));
    const doacao = doacoes.find(d => d.id === doacaoId);

    const container = document.getElementById('detalhes-doacao-container');
    if (!doacao || !container) {
        container.innerHTML = "<p>Doação não encontrada.</p>";
        return;
    }

    container.innerHTML = `
        <img src="${doacao.imagem}" alt="${doacao.ong}" class="detalhes-doacao-img">
        <div class="detalhes-doacao-content">
            <span class="detalhes-doacao-badge">Doação</span>
            <h1>${doacao.ong}</h1>
            <p><strong>Data da doação:</strong> ${doacao.data}</p>
            <p><strong>Agendamento:</strong> ${doacao.agendamento}</p>
            <p><strong>Conteúdo:</strong> ${doacao.item}</p>
            <p><strong>Endereço de entrega:</strong> ${doacao.endereco}</p>
            ${doacao.observacao ? `<p><strong>Observação:</strong> ${doacao.observacao}</p>` : ""}
        </div>
    `;
    document.title = `${doacao.ong} - Detalhes da Doação`;
}

document.addEventListener("DOMContentLoaded", renderDetalhesDoacao);
