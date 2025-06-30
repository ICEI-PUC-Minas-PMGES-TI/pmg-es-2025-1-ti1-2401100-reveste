// Verificação de segurança - apenas pontos de apoio logados podem acessar
function verificarAcessoAutorizado() {
    // Verificar se há um ponto de apoio logado
    const pontoApoioLogado = sessionStorage.getItem('pontoApoioLogado') || localStorage.getItem('pontoApoioLogado');
    
    if (!pontoApoioLogado) {
        // Se não há ponto de apoio logado, redirecionar para login
        alert('Acesso negado! Apenas pontos de apoio autorizados podem acessar este painel.');
        window.location.href = '../../index.html';
        return false;
    }
    
    return true;
}

// Verificar acesso antes de carregar a página
if (!verificarAcessoAutorizado()) {
    // Se não autorizado, parar execução do script
    throw new Error('Acesso não autorizado');
}

let firstChart;
let secondChart;
let donatedData = null;
let availableData = null;
let selectedChartType = "pie";

// Função para fazer logout
function fazerLogout() {
    // Limpar dados da sessão
    sessionStorage.removeItem('pontoApoioLogado');
    localStorage.removeItem('pontoApoioLogado');
    
    // Redirecionar para página inicial
    window.location.href = '../../index.html';
}

// Função para processar dados das doações
function processarDadosDoacoes(doacoes) {
    const stats = {};
    
    doacoes.forEach(doacao => {
        if (doacao.itens) {
            doacao.itens.forEach(item => {
                const categoria = `${item.tipo} - ${item.tamanho}`.toUpperCase();
                stats[categoria] = (stats[categoria] || 0) + item.quantidade;
            });
        }
    });
    
    return {
        labels: Object.keys(stats),
        data: Object.values(stats)
    };
}

// Função para processar dados do estoque
function processarDadosEstoque(estoque) {
    const stats = {};
    
    estoque.forEach(item => {
        const categoria = `${item.nome} - ${item.tamanho}`.toUpperCase();
        stats[categoria] = (stats[categoria] || 0) + item.quantidade;
    });
    
    return {
        labels: Object.keys(stats),
        data: Object.values(stats)
    };
}

function createFirstChart(data, type = selectedChartType) {
    const ctx = document.getElementById('first-graph').getContext('2d');
    if (firstChart) firstChart.destroy();

    firstChart = new Chart(ctx, {
        type: type,
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

function createSecondChart(data, type = selectedChartType) {
    const ctx = document.getElementById('second-graph').getContext('2d');
    if (secondChart) secondChart.destroy();

    secondChart = new Chart(ctx, {
        type: type,
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
    // Buscar dados reais das doações e estoque
    Promise.all([
        fetch('http://localhost:3000/doacoes').catch(() => ({ json: () => [] })),
        fetch('http://localhost:3000/estoque').catch(() => ({ json: () => [] }))
    ]).then(async ([doacoesRes, estoqueRes]) => {
        const doacoes = await doacoesRes.json();
        const estoque = await estoqueRes.json();
        
        // Processar dados das doações
        const donatedStats = processarDadosDoacoes(doacoes);
        donatedData = {
            labels: donatedStats.labels,
            datasets: [{
                data: donatedStats.data,
                backgroundColor: [
                    "#FFD700", "#FFC300", "#FFB000", "#FFA000", "#FF8C00",
                    "#1E90FF", "#1C86EE", "#1874CD", "#104E8B", "#0B3D91", "#08306B",
                    "#FF69B4", "#FF6EB4", "#FF85B5", "#FF9ABA", "#FFADC1", "#FFC0CB"
                ],
                hoverOffset: 4
            }]
        };
        
        // Processar dados do estoque
        const estoqueStats = processarDadosEstoque(estoque);
        availableData = {
            labels: estoqueStats.labels,
            datasets: [{
                data: estoqueStats.data,
                backgroundColor: [
                    "#FFD700", "#FFC300", "#FFB000", "#FFA000", "#FF8C00",
                    "#1E90FF", "#1C86EE", "#1874CD", "#104E8B", "#0B3D91", "#08306B",
                    "#FF69B4", "#FF6EB4", "#FF85B5", "#FF9ABA", "#FFADC1", "#FFC0CB"
                ],
                hoverOffset: 4
            }]
        };
        
        createFirstChart(donatedData, selectedChartType);
        createSecondChart(availableData, selectedChartType);
    }).catch(error => {
        console.error('Erro ao carregar dados:', error);
        // Fallback para dados vazios
        const emptyData = {
            labels: ['Sem dados'],
            datasets: [{
                data: [1],
                backgroundColor: ['#cccccc'],
                hoverOffset: 4
            }]
        };
        donatedData = emptyData;
        availableData = emptyData;
        createFirstChart(donatedData, selectedChartType);
        createSecondChart(availableData, selectedChartType);
    });
}

function setupFilterMenu() {
    const filterAppearBtn = document.querySelector("#filter-appear-btn");
    const listMenuImg = document.querySelector('#list-menu-img');
    const filterMenu = document.querySelector("#menu");

    function openFilterMenu() {
        filterMenu.classList.add('active');
        listMenuImg.src = 'images/close.png';
        listMenuImg.style.width = '30px';
        listMenuImg.style.height = '30px';
    }
    function closeFilterMenu() {
        filterMenu.classList.remove('active');
        listMenuImg.src = 'images/menu.png';
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

    function filterData(data) {
        const allLabels = data.labels;
        const allValues = data.datasets[0].data;
        const allColors = data.datasets[0].backgroundColor;

        if (
            !childishCheck.checked &&
            !adultCheck.checked &&
            !masculineCheck.checked &&
            !feminineCheck.checked
        ) {
            return data;
        }

        const filteredLabels = [];
        const filteredData = [];
        const filteredColors = [];

        allLabels.forEach((label, index) => {
            const isChildish = label.includes("Infantil");
            const isMasculine = label.includes("Masculino");
            const isFeminine = label.includes("Feminino");
            const isAdult = !isChildish;

            let include = false;

            if (childishCheck.checked && isChildish) {
                if (!masculineCheck.checked && !feminineCheck.checked) {
                    include = true;
                } else if ((masculineCheck.checked && isMasculine) || (feminineCheck.checked && isFeminine)) {
                    include = true;
                }
            }

            if (adultCheck.checked && isAdult) {
                if (!masculineCheck.checked && !feminineCheck.checked) {
                    include = true;
                } else if ((masculineCheck.checked && isMasculine) || (feminineCheck.checked && isFeminine)) {
                    include = true;
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
            return data;
        }

        return {
            labels: filteredLabels,
            datasets: [{
                data: filteredData,
                backgroundColor: filteredColors
            }]
        };
    }

    function updateChartsByGenresFilters() {
        if (!donatedData || !availableData) return;

        const filteredDonated = filterData(donatedData);
        const filteredAvailable = filterData(availableData);

        createFirstChart(filteredDonated, selectedChartType);
        createSecondChart(filteredAvailable, selectedChartType);
    }

    childishCheck.addEventListener("change", updateChartsByGenresFilters);
    adultCheck.addEventListener("change", updateChartsByGenresFilters);
    masculineCheck.addEventListener("change", updateChartsByGenresFilters);
    feminineCheck.addEventListener("change", updateChartsByGenresFilters);
}

function setupCloseSizeForms() {
    const clothesInput = document.querySelector("#clothes-size-forms-select");

    function filterDataBySize(data, sizeValue) {
        const allLabels = data.labels;
        const allValues = data.datasets[0].data;
        const allColors = data.datasets[0].backgroundColor;

        if (!sizeValue) return data;

        const filteredLabels = [];
        const filteredData = [];
        const filteredColors = [];

        allLabels.forEach((label, index) => {
            const parts = label.trim().split(" ");
            const size = parts[parts.length - 1];

            if (size === sizeValue) {
                filteredLabels.push(label);
                filteredData.push(allValues[index]);
                filteredColors.push(allColors[index]);
            }
        });

        if (filteredLabels.length === 0) {
            return data;
        }

        return {
            labels: filteredLabels,
            datasets: [{
                data: filteredData,
                backgroundColor: filteredColors
            }]
        };
    }

    function updateChartsBySizeFilters() {
        if (!donatedData || !availableData) return;

        const sizeValue = clothesInput.value;

        const filteredDonated = filterDataBySize(donatedData, sizeValue);
        const filteredAvailable = filterDataBySize(availableData, sizeValue);

        createFirstChart(filteredDonated, selectedChartType);
        createSecondChart(filteredAvailable, selectedChartType);
    }

    clothesInput.addEventListener("change", updateChartsBySizeFilters);
}

function setupTypeGraph() {
    const typeGraph = document.querySelector("#graph-type-select");

    if (!typeGraph) {
        console.error("Elemento #graph-type-select não encontrado!");
        return;
    }

    function updateChartsByTypeGraphFilters() {
        selectedChartType = typeGraph.value;

        if (firstChart) firstChart.destroy();
        if (secondChart) secondChart.destroy();

        createFirstChart(donatedData, selectedChartType);
        createSecondChart(availableData, selectedChartType);
    }

    typeGraph.addEventListener("change", updateChartsByTypeGraphFilters);
}

// Função para inicializar todas as funcionalidades
function initializeApp() {
    initCharts();
    setupFilterMenu();
    setupChartTypeSelector();
    setupCheckboxFilters();
    setupSizeFilter();
    setupMobileMenu();
}

// Setup para dispositivos móveis
function setupMobileMenu() {
    const sidebar = document.querySelector('#sidebar');
    const mainHeader = document.querySelector('main header');
    
    // Adicionar botão de menu mobile
    if (window.innerWidth <= 768) {
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.innerHTML = '☰';
        mobileMenuBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 10px;
            display: block;
        `;
        
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-active');
        });
        
        mainHeader.appendChild(mobileMenuBtn);
    }
}

// Melhorar a funcionalidade do seletor de tipo de gráfico
function setupChartTypeSelector() {
    const graphTypeSelect = document.querySelector('#graph-type-select');
    if (!graphTypeSelect) return;
    
    graphTypeSelect.addEventListener('change', (e) => {
        selectedChartType = e.target.value;
        if (donatedData) createFirstChart(donatedData, selectedChartType);
        if (availableData) createSecondChart(availableData, selectedChartType);
    });
}

// Melhorar filtro por tamanho
function setupSizeFilter() {
    const sizeSelect = document.querySelector('#clothes-size-forms-select');
    if (!sizeSelect) return;
    
    sizeSelect.addEventListener('change', (e) => {
        const selectedSize = e.target.value;
        filterBySize(selectedSize);
    });
}

function filterBySize(size) {
    // Implementar filtro por tamanho
    console.log('Filtrando por tamanho:', size);
}

// Adicionar event listener para redimensionamento da tela
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        const sidebar = document.querySelector('#sidebar');
        sidebar.classList.remove('mobile-active');
    }
});

// Inicialização quando a página carrega
document.addEventListener("DOMContentLoaded", () => {
    initializeApp();
});
