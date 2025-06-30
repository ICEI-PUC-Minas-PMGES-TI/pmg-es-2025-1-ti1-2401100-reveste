let roupas = JSON.parse(localStorage.getItem('estoque')) || [];
let editandoIndex = null;

function openModal(index = null) {
  document.getElementById('modal').style.display = 'flex';
  document.getElementById('modal-title').textContent = index === null ? 'Cadastrar Roupa' : 'Editar Roupa';
  if (index !== null) {
    editandoIndex = index;
    const roupa = roupas[index];
    document.getElementById('nome').value = roupa.nome;
    document.getElementById('tamanho').value = roupa.tamanho;
    document.getElementById('cor').value = roupa.cor;
    document.getElementById('quantidade').value = roupa.quantidade;
  } else {
    editandoIndex = null;
    document.querySelectorAll('#modal input').forEach(input => input.value = '');
  }
}

function fecharModal() {
  document.getElementById('modal').style.display = 'none';
}

function salvarRoupa() {
  const nome = document.getElementById('nome').value;
  const tamanho = document.getElementById('tamanho').value;
  const cor = document.getElementById('cor').value;
  const quantidade = document.getElementById('quantidade').value;
  const foto = document.getElementById('foto').files[0];

  const reader = new FileReader();
  reader.onloadend = function () {
    const imagem = reader.result;
    const roupa = { nome, tamanho, cor, quantidade, imagem };

    if (editandoIndex !== null) {
      roupas[editandoIndex] = roupa;
    } else {
      roupas.push(roupa);
    }

    salvarLocal();
    renderizarRoupas();
    fecharModal();
  };

  if (foto) {
    reader.readAsDataURL(foto);
  } else {
    const imagem = editandoIndex !== null ? roupas[editandoIndex].imagem : '';
    const roupa = { nome, tamanho, cor, quantidade, imagem };

    if (editandoIndex !== null) {
      roupas[editandoIndex] = roupa;
    } else {
      roupas.push(roupa);
    }

    salvarLocal();
    renderizarRoupas();
    fecharModal();
  }
}

function salvarLocal() {
  localStorage.setItem('estoque', JSON.stringify(roupas));
}

function renderizarRoupas() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '<div class="add-item" onclick="openModal()">+</div>';

  roupas.forEach((roupa, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div onclick="mostrarDetalhes(${index})">
        <img src="${roupa.imagem}" alt="Imagem da peça" />
        <div class="card-details">
          <strong>${roupa.nome}</strong><br>
          Tamanho: ${roupa.tamanho}<br>
          Cor: ${roupa.cor}<br>
          Qtde: ${roupa.quantidade}
        </div>
      </div>
      <div class="card-buttons">
        <button onclick="event.stopPropagation(); openModal(${index})">Editar</button>
        <button onclick="event.stopPropagation(); excluirRoupa(${index})">Excluir</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function excluirRoupa(index) {
  roupas.splice(index, 1);
  salvarLocal();
  renderizarRoupas();
}

function mostrarDetalhes(index) {
  alert(`Nome: ${roupas[index].nome}\nTamanho: ${roupas[index].tamanho}\nCor: ${roupas[index].cor}\nQuantidade: ${roupas[index].quantidade}`);
}

window.onload = () => {
  renderizarRoupas();
};

window.onclick = function(event) {
  if (event.target == document.getElementById('modal')) {
    fecharModal();
  }
};
