
(function() {

    function verificarDoadorLogado() {
        const urlParams = new URLSearchParams(window.location.search);
        const doadorId = urlParams.get('doadorId');
        
        if (!doadorId) {
            return null;
        }
        
        return fetch('http://localhost:3000/doadores')
            .then(response => response.json())
            .then(doadores => {
                const doador = doadores.find(d => d.id === parseInt(doadorId));
                return doador || null;
            })
            .catch(error => {
                console.error('Erro ao buscar dados do doador:', error);
                return null;
            });
    }

    async function adicionarLinkPerfil() {
        const doadorLogado = await verificarDoadorLogado();
        if (!doadorLogado) return;

        const urlParams = new URLSearchParams(window.location.search);
        const doadorId = urlParams.get('doadorId');
        const navLinks = document.querySelector('.header-nav .d-flex:last-child');
        if (navLinks) {
            const perfilLink = document.createElement('a');
            perfilLink.href = `../perfil-doador/index.html?doadorId=${doadorId}`;
            perfilLink.className = 'nav-link';
            perfilLink.textContent = `Perfil (${doadorLogado.nome.split(' ')[0]})`;
            perfilLink.style.color = '#74b9ff';
            perfilLink.style.fontWeight = 'bold';
            
            navLinks.insertBefore(perfilLink, navLinks.firstChild);
        }

        const customNavLinks = document.querySelector('#nav-links');
        if (customNavLinks) {
            const perfilLink = document.createElement('a');
            perfilLink.href = `../perfil-doador/index.html?doadorId=${doadorId}`;
            perfilLink.textContent = `Perfil (${doadorLogado.nome.split(' ')[0]})`;
            perfilLink.style.color = '#74b9ff';
            perfilLink.style.textDecoration = 'none';
            perfilLink.style.fontWeight = 'bold';
            
            customNavLinks.insertBefore(perfilLink, customNavLinks.firstChild);
        }

        const altMenu = document.querySelector('nav .d-flex');
        if (altMenu && !navLinks && !customNavLinks) {
            const perfilLink = document.createElement('a');
            perfilLink.href = `../perfil-doador/index.html?doadorId=${doadorId}`;
            perfilLink.className = 'nav-link';
            perfilLink.textContent = `Perfil (${doadorLogado.nome.split(' ')[0]})`;
            perfilLink.style.color = '#74b9ff';
            perfilLink.style.fontWeight = 'bold';
            perfilLink.style.marginRight = '15px';
            
            altMenu.insertBefore(perfilLink, altMenu.firstChild);
        }
    }

    document.addEventListener('DOMContentLoaded', adicionarLinkPerfil);
})();
