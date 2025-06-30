function getDoacoesUltimoMes() {
  if (!doacoes || !Array.isArray(doacoes)) {
    return { total: 0, ongMaisDoada: null, maxDoacoes: 0, totalItens: 0, ongsAjudadas: 0 };
  }

  const hoje = new Date();
  const umMesAtras = new Date();
  umMesAtras.setMonth(hoje.getMonth() - 1);

  let total = 0;
  let ongsContagem = {};
  let totalItens = 0;

  doacoes.forEach(ong => {
    if (ong.doacoes && Array.isArray(ong.doacoes)) {
      ong.doacoes.forEach(doacao => {
        const data = new Date(doacao.data);
        if (data >= umMesAtras && data <= hoje) {
          total++;
          ongsContagem[ong.ongNome] = (ongsContagem[ong.ongNome] || 0) + 1;
          
          const match = doacao.item.match(/^(\d+)/);
          if (match) {
            totalItens += parseInt(match[1]);
          }
        }
      });
    }
  });

  let ongMaisDoada = null;
  let maxDoacoes = 0;
  for (const [nome, qtd] of Object.entries(ongsContagem)) {
    if (qtd > maxDoacoes) {
      maxDoacoes = qtd;
      ongMaisDoada = nome;
    }
  }

  return {
    total,
    ongMaisDoada,
    maxDoacoes,
    totalItens,
    ongsAjudadas: Object.keys(ongsContagem).length
  };
}

function getTotalDoacoes() {
  if (!doacoes || !Array.isArray(doacoes)) {
    return { total: 0, totalItens: 0 };
  }

  let total = 0;
  let totalItens = 0;
  
  doacoes.forEach(ong => {
    if (ong.doacoes && Array.isArray(ong.doacoes)) {
      total += ong.doacoes.length;
      ong.doacoes.forEach(doacao => {
        const match = doacao.item.match(/^(\d+)/);
        if (match) {
          totalItens += parseInt(match[1]);
        }
      });
    }
  });
  
  return { total, totalItens };
}

function getOngMaisAjudadaGeral() {
  if (!doacoes || !Array.isArray(doacoes)) {
    return { ongMaisDoada: null, maxDoacoes: 0, totalItens: 0 };
  }

  let ongsContagem = {};
  let ongsItens = {};
  
  doacoes.forEach(ong => {
    if (ong.doacoes && Array.isArray(ong.doacoes)) {
      ongsContagem[ong.ongNome] = ong.doacoes.length;
      ongsItens[ong.ongNome] = 0;
      
      ong.doacoes.forEach(doacao => {
        const match = doacao.item.match(/^(\d+)/);
        if (match) {
          ongsItens[ong.ongNome] += parseInt(match[1]);
        }
      });
    }
  });

  let ongMaisDoada = null;
  let maxDoacoes = 0;
  let totalItens = 0;
  
  for (const [nome, qtd] of Object.entries(ongsContagem)) {
    if (qtd > maxDoacoes) {
      maxDoacoes = qtd;
      ongMaisDoada = nome;
      totalItens = ongsItens[nome];
    }
  }

  return { ongMaisDoada, maxDoacoes, totalItens };
}

function getDoacoesRecentes(limite = 5) {
  if (!doacoes || !Array.isArray(doacoes)) {
    return [];
  }

  const todasDoacoes = [];
  
  doacoes.forEach(ong => {
    if (ong.doacoes && Array.isArray(ong.doacoes)) {
      ong.doacoes.forEach(doacao => {
        todasDoacoes.push({
          ...doacao,
          ongNome: ong.ongNome,
          ongImagem: ong.ongImagem
        });
      });
    }
  });
  
  return todasDoacoes
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .slice(0, limite);
}

function formatarData(dataString) {
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function calcularTempoRelativo(dataString) {
  const data = new Date(dataString);
  const agora = new Date();
  const diffMs = agora - data;
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDias === 0) return 'Hoje';
  if (diffDias === 1) return 'Ontem';
  if (diffDias < 7) return `${diffDias} dias atrás`;
  if (diffDias < 30) return `${Math.floor(diffDias / 7)} semanas atrás`;
  return `${Math.floor(diffDias / 30)} meses atrás`;
}

function renderizarDashboard() {
  const estatisticasMes = getDoacoesUltimoMes();
  const estatisticasGerais = getTotalDoacoes();
  const dashCards = document.getElementById("dashboard-cards");
  
  dashCards.innerHTML = `
    <div class="dashboard-card primary">
      <h3>Doações este mês</h3>
      <div class="number">${estatisticasMes.total}</div>
      <div class="subtitle">Total de doações realizadas</div>
    </div>
    
    <div class="dashboard-card success">
      <h3>Itens doados este mês</h3>
      <div class="number">${estatisticasMes.totalItens}</div>
      <div class="subtitle">Peças de roupa doadas</div>
    </div>
    
    <div class="dashboard-card info">
      <h3>ONGs ajudadas</h3>
      <div class="number">${estatisticasMes.ongsAjudadas}</div>
      <div class="subtitle">Organizações beneficiadas</div>
    </div>
    
    <div class="dashboard-card warning">
      <h3>Total geral</h3>
      <div class="number">${estatisticasGerais.total}</div>
      <div class="subtitle">Doações realizadas ao todo</div>
    </div>
  `;
}

function renderizarAtividadeRecente() {
  const doacoesRecentes = getDoacoesRecentes();
  const container = document.getElementById("recent-donations");
  
  if (doacoesRecentes.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>Nenhuma doação recente</h3>
        <p>Suas doações mais recentes aparecerão aqui</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = doacoesRecentes.map(doacao => `
    <div class="recent-item">
      <div class="recent-icon">📦</div>
      <div class="recent-content">
        <h4>${doacao.item}</h4>
        <p>Doado para: ${doacao.ongNome}</p>
      </div>
      <div class="recent-date">${calcularTempoRelativo(doacao.data)}</div>
    </div>
  `).join('');
}

function renderizarImpacto() {
  const estatisticasMes = getDoacoesUltimoMes();
  const estatisticasGerais = getTotalDoacoes();
  const ongMaisAjudadaGeral = getOngMaisAjudadaGeral();
  const container = document.getElementById("impact-cards");
  
  container.innerHTML = `
    <div class="impact-card">
      <h3>📊 Resumo do Mês</h3>
      <div class="impact-stat">
        <span>Doações realizadas:</span>
        <span>${estatisticasMes.total}</span>
      </div>
      <div class="impact-stat">
        <span>Itens doados:</span>
        <span>${estatisticasMes.totalItens} peças</span>
      </div>
      <div class="impact-stat">
        <span>ONGs beneficiadas:</span>
        <span>${estatisticasMes.ongsAjudadas}</span>
      </div>
    </div>
    
    <div class="impact-card">
      <h3>🎯 ONG Mais Ajudada (Geral)</h3>
      ${ongMaisAjudadaGeral.ongMaisDoada ? `
        <div class="impact-stat">
          <span>Organização:</span>
          <span>${ongMaisAjudadaGeral.ongMaisDoada}</span>
        </div>
        <div class="impact-stat">
          <span>Total de doações:</span>
          <span>${ongMaisAjudadaGeral.maxDoacoes}</span>
        </div>
        <div class="impact-stat">
          <span>Itens doados:</span>
          <span>${ongMaisAjudadaGeral.totalItens} peças</span>
        </div>
        <div class="impact-stat">
          <span>Status:</span>
          <span>⭐ Favorita</span>
        </div>
      ` : `
        <div class="empty-state">
          <p>Nenhuma doação registrada</p>
        </div>
      `}
    </div>
    
    <div class="impact-card">
      <h3>🌟 Seu Impacto Total</h3>
      <div class="impact-stat">
        <span>Total de doações:</span>
        <span>${estatisticasGerais.total}</span>
      </div>
      <div class="impact-stat">
        <span>Itens doados:</span>
        <span>${estatisticasGerais.totalItens} peças</span>
      </div>
      <div class="impact-stat">
        <span>ONGs cadastradas:</span>
        <span>${doacoes ? doacoes.length : 0}</span>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", function() {
  renderizarDashboard();
  renderizarAtividadeRecente();
  renderizarImpacto();
});