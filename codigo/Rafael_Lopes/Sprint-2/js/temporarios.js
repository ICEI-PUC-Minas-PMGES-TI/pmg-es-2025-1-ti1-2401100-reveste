const dadosIniciaisDoJSON = [
  {
    "id": 1,
    "nome": "Paróquia São Jorge",
    "endereco": "R. Corcovado, 425 - Jardim América, Belo Horizonte - MG, 30421-389",
    "inicio": "2025-06-15",
    "fim": "2025-07-15",
    "imagem": "imagens/igreja.avif"
  }
];

let pontos = [];

const pontosSalvos = localStorage.getItem('pontosApoio');

if (pontosSalvos) {
  pontos = JSON.parse(pontosSalvos);
} else {
  pontos = dadosIniciaisDoJSON;

  salvarLocal();
}

renderizarPontos(); 

function salvarLocal() {
  localStorage.setItem('pontosApoio', JSON.stringify(pontos));
}

function renderizarPontos() {
  const container = document.getElementById('grid');
  container.innerHTML = '';

  pontos.forEach(ponto => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${ponto.imagem}" alt="Imagem do ponto">
      <div class="card-body">
        <h3 class="card-title">${ponto.nome}</h3>
      </div>
      <ul>
        <li><strong>Endereço:</strong> ${ponto.endereco}</li>
        <li><strong>Início:</strong> ${ponto.inicio}</li>
        <li><strong>Fim:</strong> ${ponto.fim}</li>
      </ul>
      <div class="card-body">
        <button onclick="editarPonto(${ponto.id})">Alterar</button>
        <button onclick="excluirPonto(${ponto.id})" style="background-color:red;color:white;">Excluir</button>
      </div>
    `;
    container.appendChild(card);
  });

  const botaoAdicionar = document.createElement('div');
  botaoAdicionar.className = 'add-item';
  botaoAdicionar.textContent = '+';
  botaoAdicionar.onclick = abrirModal;
  container.appendChild(botaoAdicionar);
}

function abrirModal() {
  document.getElementById('modal').style.display = 'flex';
}

function salvarPonto() {
  const nome = document.getElementById('nome').value;
  const endereco = document.getElementById('endereco').value;
  const inicio = document.getElementById('inicio').value;
  const fim = document.getElementById('fim').value;
  const imagemInput = document.getElementById('imagem');
  const imagem = imagemInput.files[0];

  if (!nome || !endereco || !inicio || !fim || !imagem) {
    alert('Preencha todos os campos e selecione uma imagem.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const novoPonto = {
      id: Date.now(),
      nome,
      endereco,
      inicio,
      fim,
      imagem: e.target.result
    };

    pontos.push(novoPonto);
    salvarLocal();  
    renderizarPontos(); 
    document.getElementById('modal').style.display = 'none';
    document.getElementById('nome').value = '';
    document.getElementById('endereco').value = '';
    document.getElementById('inicio').value = '';
    document.getElementById('fim').value = '';
    imagemInput.value = '';
  };

  reader.readAsDataURL(imagem);
}

function excluirPonto(id) {
  if (confirm('Deseja excluir este ponto?')) {
    pontos = pontos.filter(ponto => ponto.id !== id);
    salvarLocal();
    renderizarPontos();
  }
}

function editarPonto(id) {
  localStorage.setItem('pontoParaEditar', id);
  window.location.href = 'editar-temporario.html';
}

document.getElementById('cancelButton').addEventListener('click', () => {
  if (confirm('Deseja cancelar e fechar o cadastro?')) {
    document.getElementById('modal').style.display = 'none';
  }
});