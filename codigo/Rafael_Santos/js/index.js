import Apoio from "./model/Apoio.js";

function onInit() {
    fetch('./utils/dados.json')
    .then(response => response.json())
    .then(dadosResponse => {
      let dados = dadosResponse;
      for (let dado of dados) {
        setCards(dado);
      }
    })
    .catch(error => console.error('Erro ao carregar os dados:', error));

}


function setCards(card) {
    let apoio = new Apoio(card);

    let section = document.getElementById("section-cards");
    let container = document.createElement("div");
    let header = document.createElement("div");
    let title = document.createElement("p");
    let body = document.createElement("div");
    let img = document.createElement("img");
    let address = document.createElement("p");

    body.append(img);
    body.append(address);
    header.append(title);
    container.append(header);
    container.append(body);
    section.append(container);

    title.innerText = apoio.nome;
    img.src = apoio.imagem;
    address.innerText = apoio.endereço;

    container.classList.add("card");
    container.style.width = "191px";

    title.style.fontSize = "large"
    
    img.style.width = "156px";
    img.style.height = "65px";

    address.style.fontSize = "x-small";
}


document.addEventListener('DOMContentLoaded', function () {
    onInit();
});