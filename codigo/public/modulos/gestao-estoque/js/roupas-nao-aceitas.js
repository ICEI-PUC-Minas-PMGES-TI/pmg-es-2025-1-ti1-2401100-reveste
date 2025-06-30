const API_URL = 'http://localhost:3000';
let naoAceitas = [];

async function carregarRoupasNaoAceitas() {
  try {
    const response = await fetch(`${API_URL}/roupasNaoAceitas`);
    naoAceitas = await response.json();
    renderizarLista();
  } catch (error) {
    console.error('Erro ao carregar roupas não aceitas:', error);
    alert('Erro ao carregar dados');
  }
}

async function adicionarRoupaNaoAceita() {
  const nome = document.getElementById('nome').value.trim();
  const tamanho = document.getElementById('tamanho').value;
  const motivo = document.getElementById('motivo').value.trim();

  if (!nome || !tamanho || !motivo) {
    alert('Preencha todos os campos.');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/roupasNaoAceitas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, tamanho, motivo })
    });

    if (response.ok) {
      document.getElementById('nome').value = '';
      document.getElementById('tamanho').value = '';
      document.getElementById('motivo').value = '';
      await carregarRoupasNaoAceitas();
    } else {
      throw new Error('Erro na requisição');
    }
  } catch (error) {
    console.error('Erro ao adicionar roupa não aceita:', error);
    alert('Erro ao salvar dados');
  }
}

async function excluirRoupa(id) {
  if (confirm('Tem certeza que deseja remover esta roupa da lista?')) {
    try {
      const response = await fetch(`${API_URL}/roupasNaoAceitas/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await carregarRoupasNaoAceitas();
      } else {
        throw new Error('Erro na requisição');
      }
    } catch (error) {
      console.error('Erro ao excluir roupa:', error);
      alert('Erro ao excluir roupa');
    }
  }
}

function renderizarLista() {
  const lista = document.getElementById('lista');
  lista.innerHTML = '';

  naoAceitas.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-details">
        <strong>${item.nome}</strong><br>
        Tamanho: ${item.tamanho}<br>
        Motivo: ${item.motivo}
      </div>
      <div class="card-buttons">
        <button onclick="excluirRoupa(${item.id})">Excluir</button>
      </div>
    `;
    lista.appendChild(card);
  });
}

window.onload = () => {
  carregarRoupasNaoAceitas();
};
