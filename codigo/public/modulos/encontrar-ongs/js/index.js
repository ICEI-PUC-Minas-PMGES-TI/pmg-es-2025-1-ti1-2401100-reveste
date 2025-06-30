import Apoio from "./model/Apoio.js";

const apiKey = "AIzaSyB8L8PfjgbIApcO6BdEVXptWBjRp0WnZBM";
let map;
let directionsService;
let directionsRenderer;
let rotaUnica;

let todosOsDados = [];

function configurarBotaoVoltar() {
    const btnVoltar = document.getElementById('btn-voltar');
    if (btnVoltar) {
        btnVoltar.addEventListener('click', function() {
            const urlParams = new URLSearchParams(window.location.search);
            const doadorId = urlParams.get('doadorId');
            
            if (doadorId) {
                window.location.href = `../../index.html?doadorId=${doadorId}`;
            } else {
                window.location.href = '../../index.html';
            }
        });
    }
}

function atualizarLinkPerfil() {
    const urlParams = new URLSearchParams(window.location.search);
    const doadorId = urlParams.get('doadorId');
    
    const perfilLink = document.getElementById('link-meu-perfil');
    
    if (doadorId && perfilLink) {
        perfilLink.href = `../perfil-doador/index.html?doadorId=${doadorId}`;
        perfilLink.style.display = 'inline-block';
        
        const queroDoarLink = document.querySelector('nav a[href*="index.html"]:not([id])');
        if (queroDoarLink && queroDoarLink.textContent.includes('Quero doar')) {
            queroDoarLink.style.display = 'none';
        }
    } else if (perfilLink) {
        perfilLink.style.display = 'none';
    }
}

function configurarFiltro() {
    const filtroInput = document.querySelector('.filter-locale');
    if (filtroInput) {
        filtroInput.addEventListener('input', function(e) {
            const termoBusca = e.target.value.toLowerCase().trim();
            filtrarCards(termoBusca);
        });
    }
}

function filtrarCards(termoBusca) {
    console.log('Filtrando por:', termoBusca);
    const section = document.getElementById("section-cards");
    section.innerHTML = '';
    
    const dadosFiltrados = termoBusca === '' ? todosOsDados : 
        todosOsDados.filter(dado => {
            const apoio = new Apoio(dado);
            const match = apoio.nome.toLowerCase().includes(termoBusca) ||
                         apoio.endereço.toLowerCase().includes(termoBusca);
            if (match) console.log('Match encontrado:', apoio.nome, apoio.endereço);
            return match;
        });
    
    console.log('Dados filtrados:', dadosFiltrados.length, 'de', todosOsDados.length);
    dadosFiltrados.forEach(dado => {
        setCards(dado);
    });
}

function onInit() {
    atualizarLinkPerfil();
    configurarFiltro();
    configurarBotaoVoltar();
    
    fetch('./utils/dados.json')
        .then(response => response.json())
        .then(dadosResponse => {
            let dados = dadosResponse;
            todosOsDados = dados;
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
    buttonDetail.style.background = "linear-gradient(135deg, #4a90e2 0%, #357abd 100%)";
    buttonDetail.style.width = "100px";
    buttonDetail.style.borderRadius = "10px";
    buttonDetail.style.border = "none";
    buttonDetail.style.color = "white";
    buttonDetail.style.fontWeight = "600";
    buttonDetail.style.cursor = "pointer";
    buttonDetail.style.transition = "all 0.3s ease";
    
    // Adicionar efeito hover
    buttonDetail.addEventListener('mouseenter', () => {
        buttonDetail.style.background = "linear-gradient(135deg, #357abd 0%, #2968a3 100%)";
        buttonDetail.style.transform = "translateY(-2px)";
        buttonDetail.style.boxShadow = "0 8px 25px rgba(74, 144, 226, 0.3)";
    });
    
    buttonDetail.addEventListener('mouseleave', () => {
        buttonDetail.style.background = "linear-gradient(135deg, #4a90e2 0%, #357abd 100%)";
        buttonDetail.style.transform = "translateY(0)";
        buttonDetail.style.boxShadow = "none";
    });

    buttonDetail.addEventListener('click', () => {
        window.location.href = "../formulario-doacao/index.html";
    })

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
        .then(data => {
            
            if (rotaUnica) {
                rotaUnica.setMap(null);
            }

            const rota = data.routes[0];
            drawPolyline(rota.polyline.encodedPolyline);
        })
        .catch(error => console.error('Erro:', error));
}

function drawPolyline(encoded) {
    const decodedPath = google.maps.geometry.encoding.decodePath(encoded);

    rotaUnica = new google.maps.Polyline({
        path: decodedPath,
        geodesic: true,
        strokeColor: "#4285F4",
        strokeOpacity: 1.0,
        strokeWeight: 4
    });

    rotaUnica.setMap(map);
}

function setAdvancedMapMarker(card) {
    const apoio = new Apoio(card);

    const marker = new google.maps.Marker({
        position: { lat: parseFloat(apoio.local.x), lng: parseFloat(apoio.local.y) },
        map: map,
        title: card.nome
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
    atualizarLinkPerfil();
});
