document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('donationForm');
    const cpfInput = document.getElementById('cpf');
    const telefoneInput = document.getElementById('telefone');

    // Máscara para CPF
    cpfInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value;
    });

    // Máscara para telefone
    telefoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
        e.target.value = value;
    });

    // Definir data mínima como hoje
    const dataInput = document.getElementById('dataDoacao');
    const hoje = new Date().toISOString().split('T')[0];
    dataInput.min = hoje;

    // Submissão do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const dadosDoacao = {};
        
        formData.forEach((value, key) => {
            dadosDoacao[key] = value;
        });
        
        // Aqui você pode implementar a lógica para salvar os dados
        // Por enquanto, vamos apenas mostrar uma mensagem de sucesso
        
        if (validarFormulario(dadosDoacao)) {
            salvarAgendamento(dadosDoacao);
        }
    });

    function validarFormulario(dados) {
        // Validação do CPF
        if (!validarCPF(dados.cpf)) {
            alert('Por favor, insira um CPF válido.');
            return false;
        }

        // Validação do telefone
        if (dados.telefone.replace(/\D/g, '').length < 10) {
            alert('Por favor, insira um telefone válido.');
            return false;
        }

        // Validação da data
        const dataDoacao = new Date(dados.dataDoacao);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        
        if (dataDoacao < hoje) {
            alert('A data da doação não pode ser anterior a hoje.');
            return false;
        }

        return true;
    }

    function validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        
        if (cpf.length !== 11) return false;
        
        // Verifica se todos os dígitos são iguais
        if (/^(\d)\1{10}$/.test(cpf)) return false;
        
        // Validação do primeiro dígito verificador
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = 11 - (soma % 11);
        let digito1 = resto < 2 ? 0 : resto;
        
        if (parseInt(cpf.charAt(9)) !== digito1) return false;
        
        // Validação do segundo dígito verificador
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = 11 - (soma % 11);
        let digito2 = resto < 2 ? 0 : resto;
        
        return parseInt(cpf.charAt(10)) === digito2;
    }

    async function salvarAgendamento(dados) {
        try {
            const response = await fetch('http://localhost:3000/agendamentos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...dados,
                    status: 'agendado',
                    dataAgendamento: new Date().toISOString()
                })
            });
            
            if (response.ok) {
                alert('Agendamento realizado com sucesso! Você receberá uma confirmação em breve.');
                return true;
            } else {
                alert('Erro ao salvar agendamento. Tente novamente.');
                return false;
            }
        } catch (error) {
            console.error('Erro ao salvar agendamento:', error);
            alert('Erro ao salvar agendamento. Tente novamente.');
            return false;
        }
    }
        // Redirecionar para a página de perfil do doador
        window.location.href = '../perfil-doador/index.html';
    }

    // Função para obter doadorId da URL
    function obterDoadorIdDaURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('doadorId');
    }
    
    // Atualizar links de navegação com doadorId
    function atualizarLinksNavegacao() {
        const doadorId = obterDoadorIdDaURL();
        if (doadorId) {
            const perfilLink = document.querySelector('a[href*="perfil-doador"]');
            if (perfilLink) {
                perfilLink.href = `../perfil-doador/index.html?doadorId=${doadorId}`;
            }
            
            const voltarLink = document.querySelector('a[href*="encontrar-ongs"]');
            if (voltarLink) {
                voltarLink.href = `../encontrar-ongs/index.html?doadorId=${doadorId}`;
            }
        }
    }
    
    // Chamar função para atualizar links
    atualizarLinksNavegacao();
});
