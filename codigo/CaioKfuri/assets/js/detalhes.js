document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const ongId = parseInt(urlParams.get('id'));
    
    if (!ongId) {
        window.location.href = 'index.html';
        return;
    }
    
    const ong = favoriteOngs.find(o => o.id === ongId);
    
    if (!ong) {
        window.location.href = 'index.html';
        return;
    }
    
    const container = document.getElementById('detalhes-container');
    const heartSrc = ong.favorited ? './imgs/heart-solid.svg' : './imgs/heart-regular.svg';
    
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
});

function toggleFavorito(id) {
    const ong = favoriteOngs.find(o => o.id === id);
    
    if (!ong) return;
    
    ong.favorited = !ong.favorited;
    
    const heartImg = document.querySelector('.btn-favoritar img');
    const buttonText = document.querySelector('.btn-favoritar');
    
    if (ong.favorited) {
        heartImg.src = './imgs/heart-solid.svg';
        buttonText.innerHTML = `<img src="./imgs/heart-solid.svg" alt="Favoritar"> Favoritado`;
    } else {
        heartImg.src = './imgs/heart-regular.svg';
        buttonText.innerHTML = `<img src="./imgs/heart-regular.svg" alt="Favoritar"> Favoritar`;
    }
}