import Apoio from "./model/Apoio.js";

const apiKey = "AIzaSyB8L8PfjgbIApcO6BdEVXptWBjRp0WnZBM";
let map;
let directionsService;
let directionsRenderer;

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
                addUserLocationAdvancedMarker(position);
            }
        ), (error) => {
            console.error(`Erro: ${error.message}`);
        }
    }
}

function addUserLocationAdvancedMarker(position) {
    // Verificar se Advanced Markers estão disponíveis
    if (typeof google.maps.marker !== 'undefined') {
        const marker = new google.maps.marker.AdvancedMarkerElement({
            position: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            },
            map: map,
            title: "Sua localização",
            content: createCustomUserMarker()
        });
        return marker;
    } else {
        // Fallback para marker tradicional
        return addUserLocationMarker(position);
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
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    computeRoute(position, apoio.local)
                }
            ), (error) => {
                console.error(`Erro: ${error.message}`);
            }
        }
    });
}

function computeRoute(currentPosition, destination) {
    fetch(`https://routes.googleapis.com/directions/v2:computeRoutes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline'
        },
        body: JSON.stringify({
            origin: {
                location: {
                    latLng: {
                        latitude: currentPosition.coords.latitude,
                        longitude: currentPosition.coords.longitude
                    }
                }
            },
            destination: {
                location: {
                    latLng: {
                        latitude: destination.x,
                        longitude: destination.y
                    }
                }
            },
            travelMode: 'DRIVE'
        })
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Erro:', error));
}

function drawPolyline(encoded) {
    const decodedPath = google.maps.geometry.encoding.decodePath(encoded);

    const routePolyline = new google.maps.Polyline({
        path: decodedPath,
        geodesic: true,
        strokeColor: "#4285F4",
        strokeOpacity: 1.0,
        strokeWeight: 4
    });

    routePolyline.setMap(map);
}

function setAdvancedMapMarker(card) {
    const apoio = new Apoio(card);

    const marker = new google.maps.Marker({
        position: { lat: parseFloat(apoio.local.x), lng: parseFloat(apoio.local.y) },
        map: map,
        title: card.title || "Marcador"
    });

    return marker;
}

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: { lat: -19.918914794921875, lng: -43.938743591308594 },
        mapId: "DEMO_MAP_ID"
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        strokeColor: "#4285F4",
        strokeOpacity: 1.0,
        strokeWeight: 4
    });
    directionsRenderer.setMap(map);
}


document.addEventListener('DOMContentLoaded', function () {
    initMap();
    onInit();
});