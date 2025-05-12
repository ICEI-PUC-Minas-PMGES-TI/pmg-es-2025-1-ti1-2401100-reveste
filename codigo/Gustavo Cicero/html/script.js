document.getElementById('supportPointForm').addEventListener('submit', function(event) {
    const nome = document.getElementById('nome').value.trim();
    const local = document.getElementById('local').value.trim();
    const contato = document.getElementById('contato').value.trim();
    const tipo = document.getElementById('tipo').value;

    if (!nome || !local || !contato || !tipo) {
        event.preventDefault(); // Impede o envio do formulário
        alert('Por favor, preencha todos os campos antes de registrar.');
    } else {
        alert('Ponto de apoio registrado com sucesso!');
    }
});
