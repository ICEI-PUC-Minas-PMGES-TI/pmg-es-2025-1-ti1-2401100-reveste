// Verificar se o usuário é um ponto de apoio logado
function verificarSessaoPontoDeApoio() {
    const pontoDeApoioLogado = sessionStorage.getItem('pontoDeApoioLogado');
    console.log('Verificando sessão de ponto de apoio no estoque:', pontoDeApoioLogado);
    
    if (!pontoDeApoioLogado) {
        console.log('Acesso negado - redirecionando para login');
        alert('Acesso restrito! Você precisa estar logado como ponto de apoio para acessar esta área.');
        window.location.href = '../../index.html';
        return false;
    }
    return true;
}

// Verificar acesso antes de executar qualquer funcionalidade
if (!verificarSessaoPontoDeApoio()) {
    throw new Error('Acesso não autorizado');
}

const API_URL = 'http://localhost:3000';
let roupas = [];
let editandoId = null;

let filtrosAtivos = {
  tamanhos: [],
  cor: ''
};

async function carregarEstoque() {
  try {
    const response = await fetch(`${API_URL}/estoque`);
    roupas = await response.json();
    renderizarRoupas();
  } catch (error) {
    console.error('Erro ao carregar estoque:', error);
    roupas = [
      {
        id: 1,
        nome: "Camiseta Básica",
        tamanho: "M",
        cor: "Branco",
        quantidade: 5,
        imagem: ""
      },
      {
        id: 2,
        nome: "Calça Jeans",
        tamanho: "G",
        cor: "Azul",
        quantidade: 3,
        imagem: ""
      },
      {
        id: 3,
        nome: "Blusa de Frio",
        tamanho: "P",
        cor: "Preto",
        quantidade: 2,
        imagem: ""
      }
    ];
    renderizarRoupas();
  }
}

function openModal(id = null) {
  document.getElementById('modal').style.display = 'flex';
  document.getElementById('modal-title').textContent = id === null ? 'Cadastrar Roupa' : 'Editar Roupa';
  
  if (id !== null) {
    editandoId = id;
    const roupa = roupas.find(r => r.id === id);
    if (roupa) {
      document.getElementById('nome').value = roupa.nome;
      document.getElementById('tamanho').value = roupa.tamanho;
      document.getElementById('cor').value = roupa.cor;
      document.getElementById('quantidade').value = roupa.quantidade;
    }
  } else {
    editandoId = null;
    document.querySelectorAll('#modal input').forEach(input => input.value = '');
    document.querySelectorAll('#modal select').forEach(select => select.value = '');
  }
}

function fecharModal() {
  document.getElementById('modal').style.display = 'none';
}

async function salvarRoupa() {
  const nome = document.getElementById('nome').value.trim();
  const tamanho = document.getElementById('tamanho').value;
  const cor = document.getElementById('cor').value;
  const quantidade = parseInt(document.getElementById('quantidade').value);
  const foto = document.getElementById('foto').files[0];

  if (!nome || !tamanho || !cor || !quantidade) {
    alert('Preencha todos os campos obrigatórios');
    return;
  }

  let imagem = '';
  if (foto) {
    const reader = new FileReader();
    reader.onloadend = async function () {
      imagem = reader.result;
      await enviarDados({ nome, tamanho, cor, quantidade, imagem });
    };
    reader.readAsDataURL(foto);
  } else {
    if (editandoId !== null) {
      const roupaExistente = roupas.find(r => r.id === editandoId);
      imagem = roupaExistente ? roupaExistente.imagem : '';
    }
    await enviarDados({ nome, tamanho, cor, quantidade, imagem });
  }
}

async function enviarDados(dadosRoupa) {
  try {
    let response;
    if (editandoId !== null) {
      response = await fetch(`${API_URL}/estoque/${editandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...dadosRoupa, id: editandoId })
      });
      
      if (response.ok) {
        await carregarEstoque();
        showNotification('Item atualizado com sucesso!', 'success');
      } else {
        throw new Error('Erro na API');
      }
    } else {
      response = await fetch(`${API_URL}/estoque`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosRoupa)
      });
      
      if (response.ok) {
        await carregarEstoque();
        showNotification('Item adicionado com sucesso!', 'success');
      } else {
        throw new Error('Erro na API');
      }
    }
    
    closeModal();
  } catch (error) {
    console.error('Erro ao salvar roupa:', error);
    
    if (editandoId !== null) {
      const index = roupas.findIndex(r => r.id === editandoId);
      if (index !== -1) {
        roupas[index] = { ...dadosRoupa, id: editandoId };
        showNotification('Item atualizado localmente (API indisponível)', 'success');
      }
    } else {
      const novoId = roupas.length > 0 ? Math.max(...roupas.map(r => r.id)) + 1 : 1;
      roupas.push({ ...dadosRoupa, id: novoId });
      showNotification('Item adicionado localmente (API indisponível)', 'success');
    }
    
    renderizarRoupas();
    closeModal();
  }
}

function renderizarRoupas(roupasFiltradas = null) {
  const roupasParaRender = roupasFiltradas || roupas;
  const grid = document.getElementById('grid');
  
  grid.innerHTML = '';
  
  const addButton = document.createElement('div');
  addButton.className = 'add-item';
  addButton.onclick = () => openModal();
  addButton.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #4a90e2; font-size: 48px;">
      +
      <span style="font-size: 14px; margin-top: 10px;">Adicionar Item</span>
    </div>
  `;
  grid.appendChild(addButton);

  updateStats(roupasParaRender);
  
  if (roupasFiltradas && roupasFiltradas.length !== roupas.length) {
    showFilterFeedback(roupasFiltradas.length, roupas.length);
  }

  if (roupasParaRender.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.style.cssText = `
      grid-column: 1/-1; 
      text-align: center; 
      padding: 40px; 
      color: #a0aec0;
      background-color: #2d3748;
      border-radius: 12px;
      margin: 20px 0;
    `;
    emptyMessage.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 20px;">📦</div>
      <h3>Nenhum item encontrado</h3>
      <p>${roupasFiltradas ? 'Tente ajustar os filtros para ver mais resultados.' : 'Adicione o primeiro item ao estoque.'}</p>
    `;
    grid.appendChild(emptyMessage);
    return;
  }

  roupasParaRender.forEach((roupa) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div onclick="mostrarDetalhes(${roupa.id})">
        <img src="${roupa.imagem || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5lbmh1bWEgSW1hZ2VtPC90ZXh0Pjwvc3ZnPg=='}" alt="Imagem da peça" />
        <div class="card-details">
          <strong>${roupa.nome}</strong><br>
          Tamanho: ${roupa.tamanho}<br>
          Cor: ${roupa.cor}<br>
          Qtde: ${roupa.quantidade}
        </div>
      </div>
      <div class="card-buttons">
        <button onclick="event.stopPropagation(); openModal(${roupa.id})">Editar</button>
        <button onclick="event.stopPropagation(); excluirRoupa(${roupa.id})">Excluir</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function updateStats(roupasParaContar = null) {
  const roupasStats = roupasParaContar || roupas;
  const totalItems = roupasStats.reduce((sum, roupa) => sum + roupa.quantidade, 0);
  const totalCategories = new Set(roupasStats.map(roupa => roupa.tamanho + roupa.cor)).size;
  
  document.getElementById('total-items').textContent = totalItems;
  document.getElementById('total-categories').textContent = totalCategories;
}

function aplicarFiltros() {
  let roupasFiltradas = [...roupas];
  
  if (filtrosAtivos.tamanhos.length > 0) {
    roupasFiltradas = roupasFiltradas.filter(roupa => 
      filtrosAtivos.tamanhos.includes(roupa.tamanho)
    );
  }
  
  if (filtrosAtivos.cor) {
    roupasFiltradas = roupasFiltradas.filter(roupa => 
      roupa.cor === filtrosAtivos.cor
    );
  }
  
  renderizarRoupas(roupasFiltradas);
}

function setupFilters() {
  document.getElementById('filter-appear-btn').addEventListener('click', function() {
    const menu = document.getElementById('menu');
    const img = document.getElementById('list-menu-img');
    
    menu.classList.toggle('active');
    img.classList.toggle('active');
  });
  
  const sizeCheckboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
  sizeCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      if (this.checked) {
        filtrosAtivos.tamanhos.push(this.value);
      } else {
        filtrosAtivos.tamanhos = filtrosAtivos.tamanhos.filter(size => size !== this.value);
      }
      aplicarFiltros();
    });
  });
  
  document.getElementById('color-filter').addEventListener('change', function() {
    filtrosAtivos.cor = this.value;
    aplicarFiltros();
  });
}

function limparFiltros() {
  filtrosAtivos = {
    tamanhos: [],
    cor: ''
  };
  
  document.querySelectorAll('.checkbox-group input[type="checkbox"]').forEach(cb => {
    cb.checked = false;
  });
  
  document.getElementById('color-filter').value = '';
  
  const existingFeedback = document.querySelector('.filter-feedback');
  if (existingFeedback) {
    existingFeedback.remove();
  }
  
  renderizarRoupas();
  
  showNotification('Filtros limpos!', 'success');
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

async function excluirRoupa(id) {
  if (confirm('Tem certeza que deseja excluir este item?')) {
    try {
      const response = await fetch(`${API_URL}/estoque/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await carregarEstoque();
        showNotification('Item excluído com sucesso!', 'success');
      } else {
        throw new Error('Erro na API');
      }
    } catch (error) {
      console.error('Erro ao excluir roupa:', error);
      
      const index = roupas.findIndex(r => r.id === id);
      if (index !== -1) {
        roupas.splice(index, 1);
        renderizarRoupas();
        showNotification('Item excluído localmente (API indisponível)', 'success');
      } else {
        showNotification('Erro ao excluir item', 'error');
      }
    }
  }
}

function mostrarDetalhes(id) {
  const roupa = roupas.find(r => r.id === id);
  if (roupa) {
    alert(`Nome: ${roupa.nome}\nTamanho: ${roupa.tamanho}\nCor: ${roupa.cor}\nQuantidade: ${roupa.quantidade}`);
  }
}

function showFilterFeedback(filteredCount, totalCount) {
  const existingFeedback = document.querySelector('.filter-feedback');
  if (existingFeedback) {
    existingFeedback.remove();
  }
  
  const feedback = document.createElement('div');
  feedback.className = 'filter-feedback';
  feedback.style.cssText = `
    background-color: #4a90e2;
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    margin: 10px 20px;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
  `;
  feedback.textContent = `Mostrando ${filteredCount} de ${totalCount} itens`;
  
  const main = document.querySelector('main');
  const grid = document.getElementById('grid');
  main.insertBefore(feedback, grid);
  
  setTimeout(() => {
    if (feedback.parentNode) {
      feedback.remove();
    }
  }, 5000);
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4a90e2'};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    font-weight: 500;
    z-index: 10000;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

window.onload = () => {
  carregarEstoque();
  setupFilters();
};

window.onclick = function(event) {
  if (event.target == document.getElementById('modal')) {
    fecharModal();
  }
};
