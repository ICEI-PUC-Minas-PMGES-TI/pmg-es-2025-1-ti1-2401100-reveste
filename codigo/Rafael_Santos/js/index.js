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

    getLocation();
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

// function getLocation() {

//            if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const userLocation = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         };

//         const gmpMapElement = document.querySelector('gmp-map');
//         if (!gmpMapElement) {
//           console.error('gmp-map não encontrado!');
//           return;
//         }

//         // Espera o mapa carregar (caso ainda não tenha carregado)
//         await gmpMapElement.ready;

//         // Cria o marcador com a nova API
//         const marker = new google.maps.marker.AdvancedMarkerElement({
//           map: gmpMapElement,
//           position: userLocation,
//           title: 'Sua Localização',
//         });

//         // Centraliza e aplica o zoom no mapa
//         gmpMapElement.zoom = 15;
//         gmpMapElement.center = userLocation;
//       },
//       () => {
//         alert("Erro ao obter sua localização.");
//       }
//     );
//   } else {
//     alert("Geolocalização não é suportada por este navegador.");
//   }
// }


document.addEventListener('DOMContentLoaded', function () {
    onInit();
});