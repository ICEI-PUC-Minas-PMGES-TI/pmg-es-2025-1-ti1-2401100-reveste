import Apoio from "./model/Apoio.js";

function onInit() {
    fetch('./utils/dados.json')
        .then(response => response.json())
        .then(dadosResponse => {
            let dados = dadosResponse;
            for (let dado of dados) {
                setCards(dado);
                setAdvancedMapMarker(dado);
            }
        })
        .catch(error => console.error('Erro ao carregar os dados:', error));

    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const map = document.getElementById('map');
                const gMapAdvancedMarker = document.createElement('gmp-advanced-marker');
                gMapAdvancedMarker.setAttribute('position', `${position.coords.latitude}, ${position.coords.longitude}`);
                gMapAdvancedMarker.content = createCustomUserMarker();
                map.appendChild(gMapAdvancedMarker);
            }
        ), (error) => {
            console.error(`Erro: ${error.message}`);
        }
    }
}

function createCustomUserMarker() {
    const marker = document.createElement('div');
    marker.style.width = '20px';
    marker.style.height = '20px';
    marker.style.backgroundColor = 'blue';
    marker.style.border = '3px solid white';
    marker.style.borderRadius = '50%';
    marker.style.boxShadow = '0 0 6px rgba(0,0,0,0.5)';
    return marker;
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
    let buttonDetail = document.createElement('button');

    body.append(img);
    body.append(address);
    body.append(buttonDetail);
    header.append(title);
    container.append(header);
    container.append(body);
    section.append(container);

    title.innerText = apoio.nome;
    img.src = apoio.imagem;
    address.innerText = apoio.endereço;

    container.classList.add("card");
    container.style.width = "191px";

    title.style.fontSize = "large";
    title.style.whiteSpace = "nowrap";

    img.style.width = "156px";
    img.style.height = "65px";

    buttonDetail.innerText = "Quero doar";
    buttonDetail.style.backgroundColor = "#6DA34D";
    buttonDetail.style.width = "100px";
    buttonDetail.style.borderRadius = "10px";
    buttonDetail.style.border = "none";

    address.style.fontSize = "x-small";

    container.addEventListener('click', () => {
        const map = document.getElementById('map');
        map.setAttribute('center', `${apoio.local.x},${apoio.local.y}`);
    });
}

function setAdvancedMapMarker(card) {
    const apoio = new Apoio(card);
    const map = document.getElementById('map');

    const gMapAdvancedMarker = document.createElement('gmp-advanced-marker');
    gMapAdvancedMarker.setAttribute('position', `${apoio.local.x},${apoio.local.y}`);
    map.appendChild(gMapAdvancedMarker);
}



document.addEventListener('DOMContentLoaded', function () {
    onInit();
});