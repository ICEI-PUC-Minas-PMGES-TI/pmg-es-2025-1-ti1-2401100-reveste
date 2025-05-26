let naoAceitas = JSON.parse(localStorage.getItem('naoAceitas')) || [];

function salvarLista() {
  localStorage.setItem('naoAceitas', JSON.stringify(naoAceitas));
}

function adicionarRoupaNaoAceita() {
  const nome = document.getElementById('nome').value.trim();
  const tamanho = document.getElementById('tamanho').value;
  const motivo = document.getElementById('motivo').value.trim();

  if (!nome || !tamanho || !motivo) {
    alert('Preencha todos os campos.');
    return;
  }

  naoAceitas.push({ nome, tamanho, motivo });
  salvarLista();
  renderizarLista();

  document.getElementById('nome').value = '';
  document.getElementById('tamanho').value = '';
  document.getElementById('motivo').value = '';
}

function excluirRoupa(index) {
  naoAceitas.splice(index, 1);
  salvarLista();
  renderizarLista();
}

function renderizarLista() {
  const lista = document.getElementById('lista');
  lista.innerHTML = '';

  naoAceitas.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-details">
        <strong>${item.nome}</strong><br>
        Tamanho: ${item.tamanho}<br>
        Motivo: ${item.motivo}
      </div>
      <div class="card-buttons">
        <button onclick="excluirRoupa(${index})">Excluir</button>
      </div>
    `;
    lista.appendChild(card);
  });
}

window.onload = () => {
  renderizarLista();
};
