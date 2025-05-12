document.getElementById('cadastroForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const formData = new FormData(event.target);

  const email = formData.get('email');

  // Validação simples de e-mail com expressão regular
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailValido) {
    alert("Por favor, insira um email válido.");
    return;
  }

  const dados = {
    nome: formData.get('nome'),
    email: email,
    senha: formData.get('senha'),
    cnpj: formData.get('cnpj'),
    telefone: formData.get('telefone')
  };

  console.log("JSON de cadastro:", JSON.stringify(dados));
});

// Máscara de formatação para o campo de CNPJ
const cnpjInput = document.querySelector('#cnpj');

cnpjInput.addEventListener('input', () => {
  let value = cnpjInput.value.replace(/\D/g, ''); // Remove tudo que não for número

  if (value.length > 14) value = value.slice(0, 14);

  // Aplica a máscara de CNPJ: 00.000.000/0000-00
  value = value
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');

  cnpjInput.value = value;
});

// Máscara para o campo de telefone
const telefoneInput = document.querySelector('#telefone');

telefoneInput.addEventListener('input', () => {
  let value = telefoneInput.value.replace(/\D/g, ''); // Remove tudo que não for número

  if (value.length > 11) value = value.slice(0, 11); 

  if (value.length <= 10) {
    // Formato fixo: (00) 0000-0000
    value = value
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    // Formato celular: (00) 00000-0000
    value = value
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }

  telefoneInput.value = value;
});
