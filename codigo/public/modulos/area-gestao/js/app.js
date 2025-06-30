
let dados = {
  locais: {
    ongs: [],
    pontosApoio: []
  }
};


async function carregarDadosReais() {
  try {

    const responsePontos = await fetch('http://localhost:3000/pontosDeApoio');
    const pontosDeApoio = await responsePontos.json();
    

    const responseNecessidades = await fetch('http://localhost:3000/necessidadesOngs');
    const necessidadesOngs = await responseNecessidades.json();
    

    dados.locais.pontosApoio = pontosDeApoio.map(ponto => ({
      nome: ponto.nome,
      endereco: ponto.endereco,
      pecas: ["roupas"], 
      favorito: false,
      imagem: "./img/roupaLivre.png" 
    }));
    

    dados.locais.ongs = necessidadesOngs.map(ong => ({
      nome: ong.nome,
      endereco: ong.endereco,
      pecas: ong.necessidades ? ong.necessidades.map(n => n.tipo.toLowerCase()) : ["roupas"],
      favorito: false,
      imagem: "./img/ondRoupa.jpg" 
    }));
    
  } catch (error) {
    console.error('Erro ao carregar dados reais:', error);

    dados.locais.ongs = [];
    dados.locais.pontosApoio = [];
  }
}

window.addEventListener('DOMContentLoaded', async () => {

  await carregarDadosReais();
  
  const container = document.getElementById("images-container");
  const todosLocais = [...dados.locais.ongs, ...dados.locais.pontosApoio];


  renderizarImagens(todosLocais);

  const rangeInput = document.getElementById("distancia");
  const rangeText = document.getElementById("rangeText");
  if (rangeInput && rangeText) {
    rangeText.innerText = rangeInput.value + " km";

    rangeInput.addEventListener("input", () => {
      rangeText.innerText = rangeInput.value + " km";
    });
  }

  const filterButton = document.querySelector(".button-filter");
  if (filterButton) {
    filterButton.addEventListener("click", () => {
      const containerImages = document.getElementById("images-container");
      containerImages.innerHTML = '';

      const selectRoupasValor = document.getElementById("peca")?.value || "todas";
      const favoritosButaoValor = document.getElementById("favoritos")?.checked || false;

      const filtrados = todosLocais.filter(local =>
        (!favoritosButaoValor || local.favorito) &&
        (selectRoupasValor === "todas" || local.pecas.includes(selectRoupasValor))
      );

      renderizarImagens(filtrados);
    });
  }
});

function renderizarImagens(lista) {
  const container = document.getElementById("images-container");
  if (!container) return;
  
  container.innerHTML = ''; 
  
  if (lista.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #666; margin: 20px;">Nenhum resultado encontrado.</p>';
    return;
  }
  
  lista.forEach(local => {
    const img = document.createElement("img");
    img.src = local.imagem;
    img.alt = local.nome;
    img.style.width = "200px";
    img.style.height = "200px";
    img.style.margin = "10px";
    img.style.objectFit = "cover";
    img.onerror = function() {

      this.src = "../../assets/images/Logo.svg";
    };
    container.appendChild(img);
  });
}

document.getElementById("removerFiltro")?.addEventListener('click', () => {
  const pecaSelect = document.getElementById("peca");
  const favoritosCheck = document.getElementById("favoritos");
  const distanciaRange = document.getElementById("distancia");
  const rangeText = document.getElementById("rangeText");
  
  if (pecaSelect) pecaSelect.value = "todas";
  if (favoritosCheck) favoritosCheck.checked = false;
  if (distanciaRange) distanciaRange.value = 0;
  if (rangeText) rangeText.innerText = "0 km";

  const todosLocais = [...dados.locais.ongs, ...dados.locais.pontosApoio];
  const container = document.getElementById("images-container");
  if (container) {
    container.innerHTML = "";
    renderizarImagens(todosLocais);
  }
});
