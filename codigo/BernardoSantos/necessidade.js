let listaOngs = JSON.parse(localStorage.getItem('necessidades')) || [];

function adicionarPeca() {
  const container = document.getElementById('pecasContainer');

  const div = document.createElement('div');
  div.classList.add('peca-form');

  div.innerHTML = `
    <input type="text" placeholder="Nome da peça" class="nomePeca" />
    <input type="text" placeholder="Tamanho" class="tamanhoPeca" />
    <input type="number" placeholder="Quantidade" class="quantidadePeca" />
    <select class="prioridadePeca">
      <option value="Alta">Alta</option>
      <option value="Média">Média</option>
      <option value="Baixa">Baixa</option>
    </select>
  `;

  container.appendChild(div);
}

function salvarONG() {
  const nome = document.getElementById('nomeONG').value.trim();
  if (!nome) {
    alert("Preencha o nome da ONG.");
    return;
  }

  const pecas = [];
  const pecasDivs = document.querySelectorAll('.peca-form');

  pecasDivs.forEach(div => {
    const nomePeca = div.querySelector('.nomePeca').value.trim();
    const tamanho = div.querySelector('.tamanhoPeca').value.trim();
    const quantidade = parseInt(div.querySelector('.quantidadePeca').value.trim());
    const prioridade = div.querySelector('.prioridadePeca').value;

    if (nomePeca && tamanho && !isNaN(quantidade)) {
      pecas.push({ nomePeca, tamanho, quantidade, prioridade });
    }
  });

  if (pecas.length === 0) {
    alert("Adicione ao menos uma peça válida.");
    return;
  }

  const novaONG = {
    idONG: "ong" + (listaOngs.length + 1),
    nomeONG: nome,
    pecasNecessarias: pecas
  };

  listaOngs.push(novaONG);
  salvarLocal();
  atualizarLista();
  limparFormulario();
}

function salvarLocal() {
  localStorage.setItem('necessidades', JSON.stringify(listaOngs));
}

function atualizarLista() {
  const lista = document.getElementById('listaNecessidades');
  const texto = document.getElementById('textoCopiar');

  lista.innerHTML = "";
  texto.value = "";

  listaOngs.forEach(ong => {
    const ongDiv = document.createElement('div');
    ongDiv.innerHTML = `<strong>${ong.nomeONG}</strong><ul>` +
      ong.pecasNecessarias.map(p => `
        <li>${p.quantidade}x ${p.nomePeca} (Tam: ${p.tamanho}, Prioridade: ${p.prioridade})</li>
      `).join('') + '</ul>';

    lista.appendChild(ongDiv);
  });

  texto.value = JSON.stringify(listaOngs, null, 2);
}

function limparFormulario() {
  document.getElementById('nomeONG').value = '';
  document.getElementById('pecasContainer').innerHTML = '';
}

window.onload = () => {
  atualizarLista();
};
