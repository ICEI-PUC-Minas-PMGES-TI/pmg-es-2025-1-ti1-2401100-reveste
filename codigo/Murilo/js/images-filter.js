fetch('./assets/datas.json')
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => console.error('Erro ao carregar JSON:', error));

fetch('./assets/graph.json')
.then(response => response.json())
.then(data => {
  console.log(data);
})
.catch(error => console.error('Erro ao carregar JSON:', error));

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
