var rangeInput = document.getElementById("distancia");
var rangeText = document.getElementById("rangeText");

rangeText.innerText = rangeInput.value + " km";

rangeInput.addEventListener("input", function () {
    rangeText.innerText = rangeInput.value + " km";
});

function salvarFiltro() {
    let selectRoupas = document.getElementById("peca");
    let favoritosButao = document.getElementById("favoritos");

    const selectRoupasValor = selectRoupas.value;
    const rangeInputFiltro = rangeInput.value;
    const favoritosButaoValor = favoritosButao.checked;

    console.log("Roupas:", selectRoupasValor);
    console.log("Distância:", rangeInputFiltro);
    console.log("Favoritos:", favoritosButaoValor);
}
window.addEventListener('DOMContentLoaded', () =>{
    let container = document.getElementById("images-container");
    
    let imagesUrls = [
    "/img/62a8c2db1865d.jpg",
    "/img/62a8c2db1865d.jpg",
    "/img/62a8c2db1865d.jpg",
    "/img/62a8c2db1865d.jpg",
    "/img/62a8c2db1865d.jpg",
    "/img/62a8c2db1865d.jpg",
    "/img/62a8c2db1865d.jpg",
    "/img/62a8c2db1865d.jpg",
    ]

    imagesUrls.forEach(url => {
        let img = document.createElement("img");
        img.src = url;
        img.alt = "Pontos";
        img.style.width = "200px";
        img.style.margin = "10px";
        container.appendChild(img);
    })

})



var butaoSalvarFiltro = document.getElementById("butaoSalvarFiltro");
butaoSalvarFiltro.addEventListener("click", salvarFiltro);

//Aplicar filtro
document.querySelector(".button-filter").addEventListener("click", function () {
    let containerImages = document.getElementById("images-container")
    containerImages.innerHTML = '';

    let images = document.createElement('img');
    images.src = '/img/62a8c2db1865d.jpg'
    images.style.width = '200px';
    images.style
    containerImages.appendChild(images);


});
