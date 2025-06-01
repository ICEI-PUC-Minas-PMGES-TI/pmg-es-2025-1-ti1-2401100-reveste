let firstChart;
let secondChart;
let currentChart; 

function createFirstChart(data) {
    const ctx = document.getElementById('first-graph').getContext('2d');
    if (firstChart) firstChart.destroy();

    firstChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            responsive: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true }
            }
        }
    });
}

function createSecondChart(data) {
    const ctx = document.getElementById('second-graph').getContext('2d');
    if (secondChart) secondChart.destroy();

    secondChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            responsive: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true }
            }
        }
    });
}

function initCharts() {
    fetch('./js/json/graph-data.json')
        .then(response => {
            if (!response.ok) throw new Error('Erro ao carregar JSON');
            return response.json();
        })
        .then(data => {
            createFirstChart(data);
            createSecondChart(data);
        })
        .catch(error => console.error(error));
}

function setupFilterMenu() {
    const filterAppearBtn = document.querySelector("#filter-appear-btn");
    const listMenuImg = document.querySelector('#list-menu-img');
    const filterMenu = document.querySelector("#menu");

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

    filterAppearBtn.addEventListener("click", () => {
        if (filterMenu.classList.contains('active')) {
            closeFilterMenu();
        } else {
            openFilterMenu();
        }
    });
}




document.addEventListener("DOMContentLoaded", () => {
    initCharts();
    setupFilterMenu();
    setupCheckboxFilters();
});
