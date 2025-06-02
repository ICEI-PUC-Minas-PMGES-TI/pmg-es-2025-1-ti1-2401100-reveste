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

let filtroDataInicio = null;
let filtroDataFim = null;
let filtroOngId = "";

function getOngsOptions() {
    return doacoes.map(ong => ({ id: ong.ongId, nome: ong.ongNome }));
}

function filtrarDoacoesPorData(doacoesArr, dataInicio, dataFim) {
    if (!dataInicio && !dataFim) return doacoesArr;
    return doacoesArr.map(ong => {
        const filtradas = ong.doacoes.filter(d => {
            const data = d.data;
            if (dataInicio && data < dataInicio) return false;
            if (dataFim && data > dataFim) return false;
            return true;
        });
        return {...ong, doacoes: filtradas};
    }).filter(ong => ong.doacoes.length > 0);
}

function filtrarPorOng(doacoesArr, ongId) {
    if (!ongId) return doacoesArr;
    return doacoesArr.filter(ong => String(ong.ongId) === String(ongId));
}

function renderOngsDoacoes() {
    const container = document.getElementById("ongs-doacoes-container");
    container.innerHTML = "";

    let lista = doacoes;
    lista = filtrarPorOng(lista, filtroOngId);
    lista = filtrarDoacoesPorData(lista, filtroDataInicio, filtroDataFim);

    if (lista.length === 0) {
        container.innerHTML = "<p>Você ainda não fez nenhuma doação.</p>";
        return;
    }

    lista.forEach(ong => {
        const ongSection = document.createElement("section");
        ongSection.style.marginBottom = "40px";
        const titulo = document.createElement("div");
        titulo.style.display = "flex";
        titulo.style.alignItems = "center";
        titulo.style.justifyContent = "space-between";
        titulo.innerHTML = `
            <h2 style="margin-bottom:18px;">${ong.ongNome}</h2>
            <button class="btn-detalhes-doacao" style="margin-bottom:18px;" onclick="verTodasDoacoesOng(${ong.ongId})">Ver todos</button>
        `;
        ongSection.appendChild(titulo);

        const carrossel = document.createElement("div");
        carrossel.className = "doacoes-card-grid";
        carrossel.style.overflowX = "auto";
        carrossel.style.display = "flex";
        carrossel.style.gap = "32px";

        ong.doacoes.slice(0, 5).forEach(doacao => {
            const card = document.createElement("div");
            card.className = "doacao-card";
            card.style.minWidth = "320px";
            card.innerHTML = `
                <img src="${ong.ongImagem}" alt="${ong.ongNome}">
                <h3>${ong.ongNome}</h3>
                <p><strong>Data:</strong> ${doacao.data}</p>
                <p><strong>Conteúdo:</strong> ${doacao.item}</p>
                <button class="btn-detalhes-doacao" onclick="verDetalhesDoacao(${ong.ongId},${doacao.id})">Ver detalhes</button>
            `;
            carrossel.appendChild(card);
        });

        ongSection.appendChild(carrossel);
        container.appendChild(ongSection);
    });
}

function verDetalhesDoacao(ongId, doacaoId) {
    window.location.href = `detalhes-doacao.html?ongId=${ongId}&doacaoId=${doacaoId}`;
}

function verTodasDoacoesOng(ongId) {
    window.location.href = `detalhes-doacao.html?ongId=${ongId}`;
}

function popularFiltroOng() {
    const select = document.getElementById("filtro-ong");
    select.innerHTML = `<option value="">Todas</option>`;
    getOngsOptions().forEach(ong => {
        const opt = document.createElement("option");
        opt.value = ong.id;
        opt.textContent = ong.nome;
        select.appendChild(opt);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    popularFiltroOng();
    renderOngsDoacoes();
    const btnFiltrar = document.getElementById("btn-filtrar-doacoes");
    const btnLimpar = document.getElementById("btn-limpar-filtro");
    const inputInicio = document.getElementById("data-inicio");
    const inputFim = document.getElementById("data-fim");
    const selectOng = document.getElementById("filtro-ong");

    btnFiltrar.addEventListener("click", () => {
        const inicio = inputInicio.value ? inputInicio.value : null;
        const fim = inputFim.value ? inputFim.value : null;
        if (inicio && fim && inicio > fim) {
            alert("A data de início não pode ser maior que a data final.");
            return;
        }
        filtroDataInicio = inicio;
        filtroDataFim = fim;
        filtroOngId = selectOng.value;
        renderOngsDoacoes();
    });

    btnLimpar.addEventListener("click", () => {
        filtroDataInicio = null;
        filtroDataFim = null;
        filtroOngId = "";
        inputInicio.value = "";
        inputFim.value = "";
        selectOng.value = "";
        renderOngsDoacoes();
    });
});
