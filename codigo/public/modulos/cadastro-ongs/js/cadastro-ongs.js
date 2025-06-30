// Verificar se o usuário é um ponto de apoio logado
function verificarSessaoPontoDeApoio() {
    const pontoDeApoioLogado = sessionStorage.getItem('pontoDeApoioLogado');
    console.log('Verificando sessão de ponto de apoio no cadastro-ongs:', pontoDeApoioLogado);
    
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
let ongsCadastradas = [];

document.addEventListener('DOMContentLoaded', function() {
    loadONGs();
    setupEventListeners();
});

async function loadONGs() {
    try {
        const response = await fetch(`${API_URL}/pontosDeApoio`);
        ongsCadastradas = await response.json();
        updateStats();
        renderONGs();
    } catch (error) {
        console.error('Erro ao carregar ONGs:', error);
        ongsCadastradas = [];
        updateStats();
        renderONGs();
    }
}

async function saveONG(novaONG) {
    try {
        const response = await fetch(`${API_URL}/pontosDeApoio`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novaONG)
        });
        
        if (response.ok) {
            const ongSalva = await response.json();
            ongsCadastradas.push(ongSalva);
            updateStats();
            renderONGs();
            return true;
        }
        return false;
    } catch (error) {
        console.error('Erro ao salvar ONG:', error);
        return false;
    }
}
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ongsCadastradas));
    } catch (error) {
        console.error('Erro ao salvar ONGs:', error);
    }
}

// Atualização das estatísticas
function updateStats() {
    const totalONGs = ongsCadastradas.length;
    const activeONGs = ongsCadastradas.filter(ong => ong.ativo).length;
    
    document.getElementById('total-ongs').textContent = totalONGs;
    document.getElementById('active-ongs').textContent = activeONGs;
}

// Renderização da lista de ONGs
function renderONGs() {
    const container = document.getElementById('ongsList');
    
    if (ongsCadastradas.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #a0aec0;">
                <div style="font-size: 48px; margin-bottom: 20px;">🏢</div>
                <h3>Nenhuma ONG cadastrada</h3>
                <p>Cadastre a primeira ONG usando o formulário ao lado.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    ongsCadastradas.forEach(ong => {
        const item = document.createElement('div');
        item.className = 'ong-item';
        
        item.innerHTML = `
            <div class="ong-name">${ong.nome}</div>
            <div class="ong-details">
                ${ong.email}<br>
                CNPJ: ${ong.cnpj}<br>
                Área: ${getAreaName(ong.areaAtuacao)}<br>
                Status: <span style="color: ${ong.ativo ? '#48bb78' : '#f56565'};">
                    ${ong.ativo ? 'Ativo' : 'Inativo'}
                </span>
            </div>
        `;
        
        container.appendChild(item);
    });
}

// Função auxiliar para obter o nome da área
function getAreaName(area) {
    const areas = {
        'assistencia-social': 'Assistência Social',
        'educacao': 'Educação',
        'saude': 'Saúde',
        'meio-ambiente': 'Meio Ambiente',
        'direitos-humanos': 'Direitos Humanos',
        'cultura': 'Cultura',
        'outros': 'Outros'
    };
    return areas[area] || 'Não informado';
}

// Configuração dos event listeners
function setupEventListeners() {
    // Formulário principal
    document.getElementById('cadastroForm').addEventListener('submit', handleFormSubmit);
    
    // Toggle de senha
    document.getElementById('toggleSenha').addEventListener('click', togglePassword);
    
    // Formatação automática
    document.getElementById('cnpj').addEventListener('input', formatCNPJ);
    document.getElementById('telefone').addEventListener('input', formatTelefone);
    
    // Menu de filtros
    document.getElementById('filter-appear-btn').addEventListener('click', toggleFilterMenu);
    document.getElementById('area-filter').addEventListener('change', filterByArea);
    
    // Validação de confirmação de senha
    document.getElementById('confirmarSenha').addEventListener('blur', validatePassword);
}

// Manipulação do formulário
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    // Validações
    if (!validateForm(formData)) {
        return;
    }
    
    const novaONG = {
        id: ongsCadastradas.length > 0 ? Math.max(...ongsCadastradas.map(o => o.id)) + 1 : 1,
        nome: formData.get('nome'),
        email: formData.get('email'),
        cnpj: formData.get('cnpj'),
        telefone: formData.get('telefone') || '',
        endereco: formData.get('endereco') || '',
        responsavel: formData.get('responsavel') || '',
        areaAtuacao: formData.get('areaAtuacao') || '',
        descricao: formData.get('descricao') || '',
        ativo: true,
        dataCadastro: new Date().toISOString()
    };
    
    try {
        // Tentar salvar na API (manter compatibilidade)
        await saveToAPI(novaONG);
        
        // Salvar localmente
        ongsCadastradas.push(novaONG);
        saveONGs();
        updateStats();
        renderONGs();
        
        // Limpar o formulário
        event.target.reset();
        
        // Mostrar modal de sucesso
        showSuccessModal();
        
        // Notificação
        showNotification('ONG cadastrada com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao salvar ONG:', error);
        
        // Salvar apenas localmente em caso de erro na API
        ongsCadastradas.push(novaONG);
        saveONGs();
        updateStats();
        renderONGs();
        
        event.target.reset();
        showSuccessModal();
        showNotification('ONG cadastrada localmente (API indisponível)', 'warning');
    }
}

// Salvar na API (mantém compatibilidade)
async function saveToAPI(ongData) {
    const response = await fetch(`${API_URL}/pontosDeApoio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...ongData,
            senha: ongData.senha,
            temporario: false
        })
    });
    
    if (!response.ok) {
        throw new Error('Erro na requisição da API');
    }
    
    return response.json();
}

// Validação do formulário
function validateForm(formData) {
    const email = formData.get('email');
    const senha = formData.get('senha');
    const confirmarSenha = formData.get('confirmarSenha');
    const cnpj = formData.get('cnpj');
    
    // Validação de e-mail
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValido) {
        showNotification('Por favor, insira um email válido.', 'error');
        return false;
    }
    
    // Validação de senha
    if (senha.length < 6) {
        showNotification('A senha deve ter pelo menos 6 caracteres.', 'error');
        return false;
    }
    
    if (senha !== confirmarSenha) {
        showNotification('As senhas não coincidem.', 'error');
        return false;
    }
    
    // Validação de CNPJ
    if (!isValidCNPJ(cnpj)) {
        showNotification('Por favor, insira um CNPJ válido.', 'error');
        return false;
    }
    
    // Verificar se já existe ONG com mesmo CNPJ
    const cnpjExiste = ongsCadastradas.some(ong => ong.cnpj === cnpj);
    if (cnpjExiste) {
        showNotification('Já existe uma ONG cadastrada com este CNPJ.', 'error');
        return false;
    }
    
    return true;
}

// Validação simples de CNPJ
function isValidCNPJ(cnpj) {
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    return cleanCNPJ.length === 14;
}

// Formatação de CNPJ
function formatCNPJ(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 14) {
        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }
    
    e.target.value = value;
}

// Formatação de telefone
function formatTelefone(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
        value = value.replace(/^(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    
    e.target.value = value;
}

// Toggle de senha
function togglePassword() {
    const senhaInput = document.getElementById('senha');
    const toggleButton = document.getElementById('toggleSenha');
    
    if (senhaInput.type === 'password') {
        senhaInput.type = 'text';
        toggleButton.textContent = '🙈';
    } else {
        senhaInput.type = 'password';
        toggleButton.textContent = '👁️';
    }
}

// Validação de confirmação de senha
function validatePassword() {
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    
    if (confirmarSenha && senha !== confirmarSenha) {
        document.getElementById('confirmarSenha').style.borderColor = '#f56565';
    } else {
        document.getElementById('confirmarSenha').style.borderColor = '#4a5568';
    }
}

// Reset do formulário
function resetForm() {
    document.getElementById('cadastroForm').reset();
    document.getElementById('confirmarSenha').style.borderColor = '#4a5568';
}

// Toggle do menu de filtros
function toggleFilterMenu() {
    const menu = document.getElementById('menu');
    const img = document.getElementById('list-menu-img');
    
    menu.classList.toggle('active');
    img.classList.toggle('active');
}

// Filtro por área
function filterByArea() {
    const areaFilter = document.getElementById('area-filter').value;
    
    let filteredONGs = [...ongsCadastradas];
    
    if (areaFilter) {
        filteredONGs = filteredONGs.filter(ong => ong.areaAtuacao === areaFilter);
    }
    
    renderFilteredONGs(filteredONGs);
}

// Renderização com filtro
function renderFilteredONGs(ongs) {
    const container = document.getElementById('ongsList');
    
    if (ongs.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #a0aec0;">
                <div style="font-size: 48px; margin-bottom: 20px;">🔍</div>
                <h3>Nenhuma ONG encontrada</h3>
                <p>Tente ajustar os filtros.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    ongs.forEach(ong => {
        const item = document.createElement('div');
        item.className = 'ong-item';
        
        item.innerHTML = `
            <div class="ong-name">${ong.nome}</div>
            <div class="ong-details">
                ${ong.email}<br>
                CNPJ: ${ong.cnpj}<br>
                Área: ${getAreaName(ong.areaAtuacao)}<br>
                Status: <span style="color: ${ong.ativo ? '#48bb78' : '#f56565'};">
                    ${ong.ativo ? 'Ativo' : 'Inativo'}
                </span>
            </div>
        `;
        
        container.appendChild(item);
    });
}

// Exportar ONGs
function exportONGs() {
    let texto = "LISTA DE ONGS CADASTRADAS\n";
    texto += "========================\n\n";
    
    ongsCadastradas.forEach((ong, index) => {
        texto += `${index + 1}. ${ong.nome}\n`;
        texto += `   Email: ${ong.email}\n`;
        texto += `   CNPJ: ${ong.cnpj}\n`;
        texto += `   Telefone: ${ong.telefone}\n`;
        texto += `   Área: ${getAreaName(ong.areaAtuacao)}\n`;
        texto += `   Responsável: ${ong.responsavel}\n`;
        texto += `   Status: ${ong.ativo ? 'Ativo' : 'Inativo'}\n\n`;
    });
    
    // Copiar para clipboard
    navigator.clipboard.writeText(texto).then(() => {
        showNotification('Lista de ONGs copiada para a área de transferência!', 'success');
    }).catch(() => {
        // Fallback para navegadores mais antigos
        const textarea = document.createElement('textarea');
        textarea.value = texto;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('Lista de ONGs copiada para a área de transferência!', 'success');
    });
}

// Modal de sucesso
function showSuccessModal() {
    document.getElementById('successModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Sistema de notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : type === 'warning' ? '#ed8936' : '#4a90e2'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animação de entrada
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após 4 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Event listeners para modal
document.addEventListener('click', function(e) {
    if (e.target.id === 'successModal') {
        closeSuccessModal();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSuccessModal();
    }
});
