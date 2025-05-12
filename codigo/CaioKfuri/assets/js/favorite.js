const favoriteOngs = [
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
    imagem: "./imgs/ong1.png",
    descricao: "Ajuda moradores de rua com roupas de frio e kits de higiene.",
    detalhes: "Campanhas de arrecadação de agasalhos e ações nas ruas durante o inverno para proteção das pessoas em situação de rua.",
    favorited: true
  },
  {
    id: 3,
    nome: "Roupas Que Abraçam",
    imagem: "./imgs/ong1.png",
    descricao: "Oferece roupas dignas para mulheres em recomeço.",
    detalhes: "Atende vítimas de violência doméstica com doações personalizadas de roupas e apoio à autoestima.",
    favorited: true
  }
];

function renderFavorites() {
  const container = document.getElementById("favorites-container");
  container.innerHTML = "";

  favoriteOngs.forEach(ong => {
    const card = document.createElement("div");
    card.classList.add("card");
    if (!ong.favorited) {
      card.classList.add("nao-favoritada");
    }

    const heartSrc = ong.favorited ? './imgs/heart-solid.svg' : './imgs/heart-regular.svg';
    const heartClass = ong.favorited ? 'heart-icon favoritado' : 'heart-icon';

    card.innerHTML = `
      <img src="${ong.imagem}" alt="${ong.nome}">
      <div class="card-body">
        <h3>${ong.nome}</h3>
        <p>${ong.descricao}</p>
        <div class="actions">
          <button onclick="verDetalhes(${ong.id})">Ver detalhes</button>
          <img 
            src="${heartSrc}" 
            alt="Favorito" 
            class="${heartClass}" 
            data-id="${ong.id}" 
            onclick="alternarFavorito(this)">
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

function verDetalhes(id) {
  window.location.href = `detalhes.html?id=${id}`;
}

function alternarFavorito(icone) {
  const id = parseInt(icone.getAttribute("data-id"));
  const ong = favoriteOngs.find(o => o.id === id);

  if (!ong) return;

  ong.favorited = !ong.favorited;
  renderFavorites();
}

renderFavorites();
