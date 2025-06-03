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
    fetch('./js/json/graph-filter.json')
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
    const masculineCheck = document.querySelector("#masculine-genre-checkbox");
    const feminineCheck = document.querySelector("#feminine-genre-checkbox");
    
    if (!childishCheck || !adultCheck || !masculineCheck || !feminineCheck) return;

    function updateChartsByGenresFilters() {
        if (!loadedData) return;

        const allLabels = loadedData.labels;
        const allValues = loadedData.datasets[0].data;
        const allColors = loadedData.datasets[0].backgroundColor;

        const filteredLabels = [];
        const filteredData = [];
        const filteredColors = [];

        if (
            !childishCheck.checked &&
            !adultCheck.checked &&
            !masculineCheck.checked &&
            !feminineCheck.checked
        ) {
            createFirstChart(loadedData);
            createSecondChart(loadedData);
            return;
        }

        allLabels.forEach((label, index) => {
            const isChildish = label.includes("Infantil");
            const isMasculine = label.includes("Masculino");
            const isFeminine = label.includes("Feminino");
            const isAdult = !isChildish;

            let include = false;


            if (childishCheck.checked && isChildish) {
                if (!masculineCheck.checked && !feminineCheck.checked) {
                    include = true;
                } else {
                    if ((masculineCheck.checked && isMasculine) || (feminineCheck.checked && isFeminine)) {
                        include = true;
                    }
                }
            }

            if (adultCheck.checked && isAdult) {
                if (!masculineCheck.checked && !feminineCheck.checked) {
                    include = true;
                } else {
                    if ((masculineCheck.checked && isMasculine) || (feminineCheck.checked && isFeminine)) {
                        include = true;
                    }
                }
            }

            if (!childishCheck.checked && !adultCheck.checked) {
                if ((masculineCheck.checked && isMasculine) || (feminineCheck.checked && isFeminine)) {
                    include = true;
                }
            }

            if (include) {
                filteredLabels.push(label);
                filteredData.push(allValues[index]);
                filteredColors.push(allColors[index]);
            }
        });

        if (filteredLabels.length === 0) {
            createFirstChart(loadedData);
            createSecondChart(loadedData);
            return;
        }

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

    childishCheck.addEventListener("change", updateChartsByGenresFilters);
    adultCheck.addEventListener("change", updateChartsByGenresFilters);
    masculineCheck.addEventListener("change", updateChartsByGenresFilters);
    feminineCheck.addEventListener("change", updateChartsByGenresFilters);
}

function setupCloseSizeForms() {
    const clothesInput = document.querySelector("#clothes-size-forms-select");

    function updateChartsBySizeFilters() {
        if (!loadedData) return;    

        const allLabels = loadedData.labels;
        const allValues = loadedData.datasets[0].data;
        const allColors = loadedData.datasets[0].backgroundColor;

        const filteredLabels = [];
        const filteredData = [];
        const filteredColors = [];

        const clothesInputValue = clothesInput.value;

        allLabels.forEach((label, index) => {
            const parts = label.trim().split(" ");
            const size = parts[parts.length - 1];

            if (size === clothesInputValue) {
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

    clothesInput.addEventListener("change", updateChartsBySizeFilters);
}




document.addEventListener("DOMContentLoaded", () => {
    initCharts();
    setupFilterMenu();
    setupCheckboxFilters();
    setupCloseSizeForms();
});
