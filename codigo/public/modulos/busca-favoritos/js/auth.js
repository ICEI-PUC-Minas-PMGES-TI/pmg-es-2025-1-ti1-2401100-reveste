// Gerenciamento de autenticação na página principal
const USUARIO_LOGADO_KEY = 'usuario-quero-roupa-logado';

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacao();
});

// Verificar se o usuário está logado
function verificarAutenticacao() {
    const usuario = getUsuarioLogado();
    const urlParams = new URLSearchParams(window.location.search);
    const usuarioId = urlParams.get('usuarioId');
    
    if (!usuario && !usuarioId) {
        // Usuário não logado - mostrar interface de login sem redirecionamento forçado
        console.log('Usuário não logado, mantendo na página atual');
        return;
    }
    
    if (usuario) {
        // Usuário logado - configurar interface
        configurarInterfaceLogada(usuario);
    }
}

// Configurar interface para usuário logado
function configurarInterfaceLogada(usuario) {
    // Mostrar nome do usuário
    const userNameElement = document.getElementById('user-name');
    const userMenuElement = document.getElementById('user-menu');
    const loginLinkElement = document.getElementById('login-link');
    const logoutLinkElement = document.getElementById('logout-link');
    
    if (userNameElement && userMenuElement && loginLinkElement && logoutLinkElement) {
        userNameElement.textContent = usuario.nome;
        userMenuElement.style.display = 'block';
        loginLinkElement.style.display = 'none';
        logoutLinkElement.style.display = 'block';
    }
    
    // Adicionar mensagem de boas-vindas
    const welcomeSection = document.querySelector('.welcome-section');
    if (welcomeSection) {
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'welcome-user';
        welcomeMessage.innerHTML = `
            <p style="color: #4a90e2; font-weight: 500; margin-bottom: 10px;">
                Olá, ${usuario.nome}! 👋 Encontre roupas disponíveis para você.
            </p>
        `;
        welcomeSection.insertBefore(welcomeMessage, welcomeSection.querySelector('h1'));
    }
}

// Função para logout
function fazerLogout() {
    sessionStorage.removeItem(USUARIO_LOGADO_KEY);
    window.location.href = 'login.html';
}

// Função para obter usuário logado
function getUsuarioLogado() {
    try {
        const usuario = sessionStorage.getItem(USUARIO_LOGADO_KEY);
        return usuario ? JSON.parse(usuario) : null;
    } catch (error) {
        console.error('Erro ao carregar usuário logado:', error);
        return null;
    }
}
