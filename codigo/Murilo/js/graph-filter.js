const filterAppearBtn = document.querySelector("#filter-appear-btn");
const listMenuImg = document.querySelector('#list-menu-img');
let aside = document.querySelector("#filter");


function openFilterMenu() {
    aside.classList.add('active');
    listMenuImg.src = './assets/img/close.png';
    listMenuImg.style.width = '30px';
    listMenuImg.style.height = '30px';
}

function closeFilterMenu() {
    aside.classList.remove('active');
    listMenuImg.src = './assets/img/menu.png';
    listMenuImg.style.width = '40px';
    listMenuImg.style.height = '40px';
}
filterAppearBtn.addEventListener("click", ()=> {
    if (aside.classList.contains('active')){
        closeFilterMenu();
    }else{
        openFilterMenu();
    } 

});