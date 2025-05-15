const dados = {
  locais: {
    ongs: [
      {
        nome: "Roupa que Abraça",
        endereco: "Rua 123",
        pecas: ["camiseta", "calça"],
        favorito: false,
        imagem: "./img/ondRoupa.jpg"
      },
      {
        nome: "Coração Solidário",
        endereco: "Av. Brasil, 456",
        pecas: ["camiseta", "jaqueta"],
        favorito: true,
        imagem: "./img/dom-quixote-campanha-agasalho.jpg"
      }
    ],
    pontosApoio: [
      {
        nome: "Centro de Apoio",
        endereco: "Praça Central, 789",
        pecas: ["casaco"],
        favorito: false,
        imagem: "./img/roupaLivre.png"
      },
      {
        nome: "Vestir com Amor",
        endereco: "Praça Matriz, 712",
        pecas: ["tenis"],
        favorito: false,
        imagem: "./img/vestirAmor.jpg"
      }
    ]
  }
};

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById("images-container");
  const todosLocais = [...dados.locais.ongs, ...dados.locais.pontosApoio];

  // Mostrar todos ao iniciar
  renderizarImagens(todosLocais);

  document.querySelector(".button-filter").addEventListener("click", () => {
    const containerImages = document.getElementById("images-container");
    containerImages.innerHTML = '';

    const selectRoupasValor = document.getElementById("peca").value;
    const favoritosButaoValor = document.getElementById("favoritos").checked;

    const filtrados = todosLocais.filter(local =>
      (!favoritosButaoValor || local.favorito) &&
      (selectRoupasValor === "todas" || local.pecas.includes(selectRoupasValor))
    );

    renderizarImagens(filtrados);
  });
});

function renderizarImagens(lista) {
  const container = document.getElementById("images-container");
  lista.forEach(local => {
    const img = document.createElement("img");
    img.src = local.imagem;
    img.alt = local.nome;
    img.style.width = "200px";
    img.style.height = "200px";
    img.style.margin = "10px";
    container.appendChild(img);
  });
}
document.getElementById("removerFiltro").addEventListener('click', () => {
    
  document.getElementById("peca").value = "todas";
  document.getElementById("favoritos").checked = false;
  document.getElementById("distancia").value = 0;
  document.getElementById("rangeText").innerText = "0 km";

  const todosLocais = [...dados.locais.ongs, ...dados.locais.pontosApoio];
  const container = document.getElementById("images-container");
  container.innerHTML = "";
  renderizarImagens(todosLocais);
});
