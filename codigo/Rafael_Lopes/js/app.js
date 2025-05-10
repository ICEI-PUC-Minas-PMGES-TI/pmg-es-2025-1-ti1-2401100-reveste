document.getElementById('cadastroForm').addEventListener('submit', function(event) {
  event.preventDefault();

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

const cnpjInput = document.querySelector('#cnpj');

cnpjInput.addEventListener('input', () => {
  let value = cnpjInput.value.replace(/\D/g, '');

  if (value.length > 14) value = value.slice(0, 14);

  value = value
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');

  cnpjInput.value = value;
});

const telefoneInput = document.querySelector('#telefone');

telefoneInput.addEventListener('input', () => {
  let value = telefoneInput.value.replace(/\D/g, ''); 

  if (value.length > 11) value = value.slice(0, 11);

  if (value.length <= 10) {
    value = value
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    value = value
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }

  telefoneInput.value = value;
});
