// Carrega os pontos de apoio do localStorage
let pontos = JSON.parse(localStorage.getItem('pontosApoio')) || [];

function salvarLocal() {
  localStorage.setItem('pontosApoio', JSON.stringify(pontos));
}

// Função para renderizar os cards na tela
function renderizarPontos() {
  const container = document.getElementById('grid');
  container.innerHTML = '';

  pontos.forEach(ponto => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.width = '25rem';
    card.innerHTML = `
      <img src="${ponto.imagem}" class="card-img-top" alt="Imagem do ponto">
      <div class="card-body">
        <h3 class="card-title">${ponto.nome}</h3>
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item"><strong>Endereço:</strong> ${ponto.endereco}</li>
        <li class="list-group-item"><strong>Início:</strong> ${ponto.inicio}</li>
        <li class="list-group-item"><strong>Fim:</strong> ${ponto.fim}</li>
      </ul>
      <div class="card-body">
        <button onclick="editarPonto(${ponto.id})">Alterar</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Função para redirecionar para a página de edição com o ID do ponto
function editarPonto(id) {
  localStorage.setItem('pontoParaEditar', id);
  window.location.href = 'editar-temporario.html';
}

// Executa ao carregar a página
window.onload = () => {
  renderizarPontos();
};
