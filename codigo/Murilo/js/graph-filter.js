const filterAppearBtn = document.querySelector("#filter-appear-btn");
const listMenuImg = document.querySelector('#list-menu-img');
let aside = document.querySelector("#filter");


function openFilterMenu() {
    aside.classList.add('active');
    aside.style.display = 'flex';
    aside.style.width = '20%';

    listMenuImg.src = './assets/img/close.png';
    listMenuImg.style.width = '25px';
    listMenuImg.style.height = '25px';
    listMenuImg.classList.add('active');
}

function closeFilterMenu() {
    aside.style.display = 'none';
    aside.classList.remove('active');

    listMenuImg.src = './assets/img/menu.png';
    listMenuImg.style.width = '40px';
    listMenuImg.style.height = '40px';
    listMenuImg.classList.remove('active');
}

filterAppearBtn.addEventListener("click", ()=> {
    if (aside.classList.contains('active')){
        closeFilterMenu();
    }else{
        openFilterMenu();
    } 

});