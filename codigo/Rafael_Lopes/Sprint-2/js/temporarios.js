let pontos = JSON.parse(localStorage.getItem('pontosApoio'));

if (!pontos || pontos.length === 0) {
  fetch('temporarios.json')
    .then(response => response.json())
    .then(data => {
      pontos = data;
      salvarLocal();
      renderizarPontos();
    })
    .catch(error => {
      console.error('Erro ao carregar os dados:', error);
    });
} else {
  renderizarPontos();
}

function salvarLocal() {
  localStorage.setItem('pontosApoio', JSON.stringify(pontos));
}

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
        <button onclick="excluirPonto(${ponto.id})" style="background-color: red; color: white;">Excluir</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function editarPonto(id) {
  localStorage.setItem('pontoParaEditar', id);
  window.location.href = 'editar-temporario.html';
}

function excluirPonto(id) {
  if (confirm('Tem certeza que deseja excluir este ponto de apoio?')) {
    pontos = pontos.filter(ponto => ponto.id !== id);
    salvarLocal();
    renderizarPontos();
  }
}
