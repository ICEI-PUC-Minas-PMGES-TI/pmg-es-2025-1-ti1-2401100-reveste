var rangeInput = document.getElementById("distancia");
var rangeText = document.getElementById("rangeText");

rangeText.innerText = rangeInput.value + " km";

rangeInput.addEventListener("input", function () {
    rangeText.innerText = rangeInput.value + " km";
});