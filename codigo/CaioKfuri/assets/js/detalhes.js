const ONG_STORAGE_KEY = "favoriteOngs";
const defaultOngs = [
    {
        id: 1,
        nome: "Roupa Para Todos",
        imagem: "./imgs/ong1.png",
        descricao: "Distribui roupas para famílias carentes em áreas urbanas.",
        detalhes: "A ONG coleta doações de roupas usadas e novas e entrega em comunidades com vulnerabilidade social.",
        favorited: true
    },
    {
        id: 2,
        nome: "Aquecendo Vidas",
        imagem: "./imgs/ong2.jpg",
        descricao: "Ajuda moradores de rua com roupas de frio e kits de higiene.",
        detalhes: "Campanhas de arrecadação de agasalhos e ações nas ruas durante o inverno para proteção das pessoas em situação de rua.",
        favorited: true
    },
    {
        id: 3,
        nome: "Roupas Que Abraçam",
        imagem: "./imgs/ong3.jpg",
        descricao: "Oferece roupas dignas para mulheres em recomeço.",
        detalhes: "Atende vítimas de violência doméstica com doações personalizadas de roupas e apoio à autoestima.",
        favorited: true
    }
];

function loadOngs() {
    try {
        const data = localStorage.getItem(ONG_STORAGE_KEY);
        if (data) {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch (e) {
        console.error("Erro ao carregar ONGs:", e);
    }
    
    localStorage.setItem(ONG_STORAGE_KEY, JSON.stringify(defaultOngs));
    return [...defaultOngs];
}

function saveOngs(ongs) {
    localStorage.setItem(ONG_STORAGE_KEY, JSON.stringify(ongs));
}

function renderDetalhes() {
    const favoriteOngs = loadOngs();
    const urlParams = new URLSearchParams(window.location.search);
    const ongId = parseInt(urlParams.get('id'));
    
    if (!ongId || isNaN(ongId)) {
        window.location.href = 'index.html';
        return;
    }
    
    const ong = favoriteOngs.find(o => parseInt(o.id) === ongId);
    
    if (!ong) {
        window.location.href = 'index.html';
        return;
    }
    
    const container = document.getElementById('detalhes-container');
    if (!container) return;
    
    const heartSrc = ong.favorited ? './imgs/heart-solid.svg' : './imgs/heart-regular.svg';
    const cardClass = ong.favorited ? 'detalhes-card' : 'detalhes-card nao-favoritada';
    
    container.className = cardClass;
    container.innerHTML = `
        <img src="${ong.imagem}" alt="${ong.nome}" class="detalhes-img">
        <div class="detalhes-content">
            <span class="detalhes-badge">ONG</span>
            <h1>${ong.nome}</h1>
            <p><strong>Descrição:</strong> ${ong.descricao}</p>
            <p><strong>Detalhes:</strong> ${ong.detalhes}</p>
            <div class="acoes-container">
                <button class="btn-favoritar" onclick="toggleFavorito(${ong.id})">
                    <img src="${heartSrc}" alt="Favoritar">
                    ${ong.favorited ? 'Favoritado' : 'Favoritar'}
                </button>
                <button class="btn-contato">Entre em contato</button>
            </div>
        </div>
    `;
    document.title = `${ong.nome} - Detalhes`;
}

function toggleFavorito(id) {
    const favoriteOngs = loadOngs();
    const ong = favoriteOngs.find(o => parseInt(o.id) === parseInt(id));
    if (!ong) return;
    
    ong.favorited = !ong.favorited;
    saveOngs(favoriteOngs);
    
    const container = document.getElementById('detalhes-container');
    const heartImg = document.querySelector('.btn-favoritar img');
    const buttonText = document.querySelector('.btn-favoritar');
    
    if (ong.favorited) {
        heartImg.src = './imgs/heart-solid.svg';
        buttonText.innerHTML = `<img src="./imgs/heart-solid.svg" alt="Favoritar"> Favoritado`;
        container.classList.remove('nao-favoritada');
    } else {
        heartImg.src = './imgs/heart-regular.svg';
        buttonText.innerHTML = `<img src="./imgs/heart-regular.svg" alt="Favoritar"> Favoritar`;
        container.classList.add('nao-favoritada');
    }
}

document.addEventListener('DOMContentLoaded', renderDetalhes);