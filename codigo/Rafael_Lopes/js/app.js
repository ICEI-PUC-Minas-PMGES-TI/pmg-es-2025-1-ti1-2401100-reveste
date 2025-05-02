document.getElementById('cadastroForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário
  
    const formData = new FormData(event.target);
  
    const dados = {
      nome: formData.get('nome'),
      email: formData.get('email'),
      senha: formData.get('senha'),
      cnpj: formData.get('cnpj'),
      telefone: formData.get('telefone')
    };
  
    console.log("JSON de cadastro:", JSON.stringify(dados));
  });
  