const dados = {
  locais: {
    ongs: [
      {
        nome: "Roupa que Abraça",
        endereco: "Rua 123",
        pecas: ["camiseta", "calça"],
        favorito: false,
        imagem: "/img/ondRoupa.jpg"
      },
      {
        nome: "Coração Solidário",
        endereco: "Av. Brasil, 456",
        pecas: ["blusa", "meias"],
        favorito: true,
        imagem: "/img/dom-quixote-campanha-agasalho.jpg"
      }
    ],
    pontosApoio: [
      {
        nome: "Centro de Apoio",
        endereco: "Praça Central, 789",
        pecas: ["casaco"],
        favorito: false,
        imagem: "/img/roupaLivre.png"
      },

      {
        nome: "Vestir com Amor",
        endereco: "Praça Matriz, 712",
        pecas: ["casaco"],
        favorito: false,
        imagem: "/img/vestirAmor.jpg"
      }


    ]
  }
}


//Carrega as imagens ao carregar a página
window.addEventListener('DOMContentLoaded', () =>{
    let container = document.getElementById("images-container");
    
    const todosLocais = [...dados.locais.ongs, ...dados.locais.pontosApoio];
    todosLocais.forEach(local => {
        const img = document.createElement("img");
        img.src = local.imagem;
        img.alt = local.nome;
        img.style.width = "200px";
        img.style.marginTop = "20px";
        img.style.marginRight = "20px";
        container.appendChild(img);
    })

})

//Range Button
var rangeInput = document.getElementById("distancia");
var rangeText = document.getElementById("rangeText");

rangeText.innerText = rangeInput.value + " km";
rangeText.setAttribute('class', 'bg-light p-2 mt-4 rounded-1');

rangeInput.addEventListener("input", function () {
    rangeText.innerText = rangeInput.value + " km";
});

function aplicarFiltro() {
    let selectRoupas = document.getElementById("peca");
    let favoritosButao = document.getElementById("favoritos");

    const selectRoupasValor = selectRoupas.value;
    const rangeInputFiltro = rangeInput.value;
    const favoritosButaoValor = favoritosButao.checked;

    console.log("Roupas:", selectRoupasValor);
    console.log("Distância:", rangeInputFiltro);
    console.log("Favoritos:", favoritosButaoValor);
}



var butaoAplicarFiltro = document.getElementById("butaoAplicarFiltro");
butaoAplicarFiltro.addEventListener("click", aplicarFiltro);

//Aplicar filtro
document.querySelector(".button-filter").addEventListener("click", function () {
    let containerImages = document.getElementById("images-container")
    containerImages.innerHTML = '';

    let images = document.createElement('img');
    images.src = '/img/62a8c2db1865d.jpg'
    images.style.width = '200px';
    images.style.borderRadius = '5px';
    containerImages.appendChild(images);


});
