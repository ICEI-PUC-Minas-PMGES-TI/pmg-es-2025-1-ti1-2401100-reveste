const filterAppearBtn = document.querySelector("#filter-appear-btn");
const listMenuImg = document.querySelector('#list-menu-img');
const filterMenu = document.querySelector("#menu");
const graphType = document.querySelector("#graph-type-select");


function openFilterMenu() {
    filterMenu.classList.add('active');
    listMenuImg.src = './assets/img/close.png';
    listMenuImg.style.width = '30px';
    listMenuImg.style.height = '30px';
}
function closeFilterMenu() {
    filterMenu.classList.remove('active');
    listMenuImg.src = './assets/img/menu.png';
    listMenuImg.style.width = '40px';
    listMenuImg.style.height = '40px';
}


filterAppearBtn.addEventListener("click", ()=> {
    if (filterMenu.classList.contains('active')){
        closeFilterMenu();
    }else{
        openFilterMenu();
    } 

});