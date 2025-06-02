let firstChart;
let secondChart;
let loadedData = null;

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
            loadedData = data;
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

function setupCheckboxFilters() {
    const childishCheck = document.querySelector("#childish");
    const adultCheck = document.querySelector("#adult");

    if (!childishCheck || !adultCheck) return;

    function updateChartsByFilters() {
        if (!loadedData) return;

        const allLabels = loadedData.labels;
        const allValues = loadedData.datasets[0].data;
        const allColors = loadedData.datasets[0].backgroundColor;

        const filteredLabels = [];
        const filteredData = [];
        const filteredColors = [];

        if (!childishCheck.checked && !adultCheck.checked) {
            createFirstChart(loadedData);
            createSecondChart(loadedData);
            return;
        }

        allLabels.forEach((label, index) => {
            const isChildish = label.includes("Infantil");
            const isAdult = label.includes("Masculino") || label.includes("Feminino");

            if ((childishCheck.checked && isChildish) || (adultCheck.checked && isAdult)) {
                filteredLabels.push(label);
                filteredData.push(allValues[index]);
                filteredColors.push(allColors[index]);
            }
        });

        const newData = {
            labels: filteredLabels,
            datasets: [{
                data: filteredData,
                backgroundColor: filteredColors
            }]
        };

        createFirstChart(newData);
        createSecondChart(newData);
    }

    childishCheck.addEventListener("change", updateChartsByFilters);
    adultCheck.addEventListener("change", updateChartsByFilters);
}


document.addEventListener("DOMContentLoaded", () => {
    initCharts();
    setupFilterMenu();
    setupCheckboxFilters();
});
