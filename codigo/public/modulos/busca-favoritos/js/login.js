// Sistema de autenticação para usuários que querem roupas
const USUARIOS_KEY = 'usuarios-quero-roupa';
const USUARIO_LOGADO_KEY = 'usuario-quero-roupa-logado';

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se já está logado
    const usuarioLogado = getUsuarioLogado();
    if (usuarioLogado) {
        // Redirecionar para a página principal
        window.location.href = 'index.html?usuarioId=' + usuarioLogado.id;
        return;
    }

    // Configurar eventos dos formulários
    setupFormEvents();
});

// Configurar eventos dos formulários
function setupFormEvents() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

// Gerenciar login
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const nome = formData.get('nome').trim();
    const senha = formData.get('senha');

    // Validação básica
    if (!nome || !senha) {
        showNotification('Por favor, preencha todos os campos', 'error');
        return;
    }

    // Verificar credenciais
    const usuarios = getUsuarios();
    const usuario = usuarios.find(u => 
        u.nome.toLowerCase() === nome.toLowerCase() && u.senha === senha
    );

    if (!usuario) {
        showNotification('Nome ou senha incorretos', 'error');
        return;
    }

    // Fazer login
    fazerLogin(usuario);
}

// Gerenciar cadastro
async function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const nome = formData.get('nome').trim();
    const senha = formData.get('senha');
    const confirmSenha = formData.get('confirmSenha');

    // Validação básica
    if (!nome || !senha || !confirmSenha) {
        showNotification('Por favor, preencha todos os campos', 'error');
        return;
    }

    if (senha !== confirmSenha) {
        showNotification('As senhas não coincidem', 'error');
        return;
    }

    if (senha.length < 4) {
        showNotification('A senha deve ter pelo menos 4 caracteres', 'error');
        return;
    }

    // Verificar se o usuário já existe
    const usuarios = getUsuarios();
    const usuarioExistente = usuarios.find(u => 
        u.nome.toLowerCase() === nome.toLowerCase()
    );

    if (usuarioExistente) {
        showNotification('Já existe um usuário com este nome', 'error');
        return;
    }

    // Criar novo usuário
    const novoUsuario = {
        id: Date.now().toString(),
        nome: nome,
        senha: senha,
        dataCadastro: new Date().toISOString()
    };

    // Salvar usuário
    usuarios.push(novoUsuario);
    salvarUsuarios(usuarios);

    showNotification('Cadastro realizado com sucesso!', 'success');
    
    // Fazer login automaticamente
    setTimeout(() => {
        fazerLogin(novoUsuario);
    }, 1500);
}

// Fazer login
function fazerLogin(usuario) {
    // Salvar usuário logado (sem a senha por segurança)
    const usuarioLogado = {
        id: usuario.id,
        nome: usuario.nome,
        dataCadastro: usuario.dataCadastro
    };

    sessionStorage.setItem(USUARIO_LOGADO_KEY, JSON.stringify(usuarioLogado));
    
    showNotification(`Bem-vindo(a), ${usuario.nome}!`, 'success');
    
    // Redirecionar para a página principal
    setTimeout(() => {
        window.location.href = 'index.html?usuarioId=' + usuario.id;
    }, 1500);
}

// Funções de armazenamento
function getUsuarios() {
    try {
        const usuarios = localStorage.getItem(USUARIOS_KEY);
        return usuarios ? JSON.parse(usuarios) : [];
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        return [];
    }
}

function salvarUsuarios(usuarios) {
    try {
        localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
    } catch (error) {
        console.error('Erro ao salvar usuários:', error);
    }
}

function getUsuarioLogado() {
    try {
        const usuario = sessionStorage.getItem(USUARIO_LOGADO_KEY);
        return usuario ? JSON.parse(usuario) : null;
    } catch (error) {
        console.error('Erro ao carregar usuário logado:', error);
        return null;
    }
}

// Alternar entre formulários
function showLoginForm() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
}

function showRegisterForm() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
}

// Mostrar notificações
function showNotification(message, type = 'success') {
    // Remover notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remover após 4 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 4000);
}

// Função para logout (para ser usada em outras páginas)
function fazerLogout() {
    sessionStorage.removeItem(USUARIO_LOGADO_KEY);
    window.location.href = 'login.html';
}
