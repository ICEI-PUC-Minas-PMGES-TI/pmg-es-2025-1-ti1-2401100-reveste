

const pontoApoio = [
    { id: 1, nome: "Igreja Batista" },
    { id: 2, nome: "ONG Reveste" },
    { id: 3, nome: "Teste" }
];

const arrayName = "agendamentos-v2"
let currentPontoApoioId = null;
let agendamentos = [];

function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function loadAgendamentos() {
    try {
        const savedAgendamentos = localStorage.getItem(arrayName);
        if (savedAgendamentos) {
            agendamentos = JSON.parse(savedAgendamentos);
        } else {
            agendamentos = [];
        }
    } catch (error) {
        console.error('Erro ao carregar agendamentos do localStorage:', error);
        agendamentos = [];
    }
}

function saveAgendamentos() {
    try {
        localStorage.setItem(arrayName, JSON.stringify(agendamentos));
    } catch (error) {
        console.error('Erro ao salvar agendamentos no localStorage:', error);
    }
}

function getAgendamentosByPontoApoio(pontoApoioId) {
    
    return agendamentos.filter(agendamento => agendamento.idPontoApoio == pontoApoioId);
}
function renderAgendamentos() {
    const grid = document.getElementById('appointments-grid');
    const filteredAgendamentos = getAgendamentosByPontoApoio(currentPontoApoioId);
    if (currentPontoApoioId == null) 
    {
        grid.innerHTML = `
            <div class="no-appointments">
                <i class="fas fa-calendar-times"></i>
                <h3>Selecione um ponto de apoio (query string "?id=")</h3>
            </div>
        `;
        return;
    }
    if (filteredAgendamentos.length === 0) {
        grid.innerHTML = `
            <div class="no-appointments">
                <i class="fas fa-calendar-times"></i>
                <h3>Nenhum agendamento encontrado</h3>
                <p>Não há agendamentos para este ponto de apoio.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = '';
    
    filteredAgendamentos.forEach((agendamento, index) => {
        const card = document.createElement('div');
        card.className = 'appointment-card';
        card.onclick = () => openAppointmentModal(agendamento.id);
        
        card.innerHTML = `
            <div class="appointment-title">Agendamento #${agendamento.id}</div>
            <div class="appointment-status ${agendamento.status}">${getStatusText(agendamento.status)}</div>
            <div class="appointment-details">
                <strong>${agendamento.nome}</strong><br>
                ${formatDateTime(agendamento.data_horario_doacao)}<br>
                CPF ${formatCPF(agendamento.cpf)}<br>
                ${agendamento.email}
            </div>
        `;
        
        grid.appendChild(card);
    });
}

function updatePontoApoioTitle() {
    const titleElement = document.getElementById('ponto-apoio-nome');
    
    if (currentPontoApoioId) {
        const ponto = pontoApoio.find(p => p.id == currentPontoApoioId);
        titleElement.textContent = ponto ? ponto.nome : 'Ponto de Apoio Não Encontrado';
    } else {
        titleElement.textContent = 'Ponto de Apoio Não Encontrado ';
    }
}

function initializePage() {
    currentPontoApoioId = getUrlParameter('id');
    
    loadAgendamentos();
    
    updatePontoApoioTitle();
    
    renderAgendamentos();
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('show');
}

function toggleSubmenu(menuId) {
    const submenu = document.getElementById(menuId + '-submenu');
    const chevron = document.getElementById(menuId + '-chevron');
    
    // Close other submenus
    document.querySelectorAll('.submenu').forEach(menu => {
        if (menu.id !== menuId + '-submenu') {
            menu.classList.remove('show');
        }
    });
    
    document.querySelectorAll('.chevron').forEach(ch => {
        if (ch.id !== menuId + '-chevron') {
            ch.classList.remove('rotate');
        }
    });
    
    // Toggle current submenu
    submenu.classList.toggle('show');
    chevron.classList.toggle('rotate');
}

function openAppointmentModal(appointmentId) {
    const appointment = agendamentos.find(a => a.id == appointmentId);
    
    if (!appointment) {
        showNotification('Agendamento não encontrado!', 'warning');
        return;
    }

    const pontoApoioObj = pontoApoio.find(p => p.id == appointment.idPontoApoio);
    
    document.getElementById('modal-id').textContent = appointment.id;
    document.getElementById('modal-nome').textContent = appointment.nome;
    document.getElementById('modal-cpf').textContent = formatCPF(appointment.cpf);
    document.getElementById('modal-email').textContent = appointment.email;
    document.getElementById('modal-data-hora').textContent = formatDateTime(appointment.data_horario_doacao);
    document.getElementById('modal-ponto-apoio').textContent = pontoApoioObj ? pontoApoioObj.nome : 'Não informado';
    
    // Status
    const statusElement = document.getElementById('modal-status');
    const statusText = getStatusText(appointment.status);
    statusElement.textContent = statusText;
    statusElement.className = `status-badge ${appointment.status}`;
    
    updateModalFooter(appointment);
    
    document.getElementById('appointmentModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function updateModalFooter(appointment) {
    const footer = document.getElementById('modal-footer');
    
    if (appointment.status === 'pending') {
        footer.innerHTML = `
            <button class="btn-secondary" onclick="closeModal()">Fechar</button>
            <button class="btn-danger" onclick="rejectAppointment(${appointment.id})">Recusar</button>
            <button class="btn-success" onclick="acceptAppointment(${appointment.id})">Aceitar</button>
        `;
    } else {
        footer.innerHTML = `
            <button class="btn-secondary" onclick="closeModal()">Fechar</button>
        `;
    }
}

function acceptAppointment(appointmentId) {
    const appointmentIndex = agendamentos.findIndex(a => a.id == appointmentId);
    if (appointmentIndex !== -1) {
        agendamentos[appointmentIndex].status = 'accepted';
        saveAgendamentos();
        
        const statusElement = document.getElementById('modal-status');
        statusElement.textContent = 'Aceito';
        statusElement.className = 'status-badge accepted';
        updateModalFooter(agendamentos[appointmentIndex]);
        renderAgendamentos();
    }
}

function rejectAppointment(appointmentId) {
    const appointmentIndex = agendamentos.findIndex(a => a.id == appointmentId);
    if (appointmentIndex !== -1) {
        agendamentos[appointmentIndex].status = 'declined';
        saveAgendamentos();
        
        const statusElement = document.getElementById('modal-status');
        statusElement.textContent = 'Recusado';
        statusElement.className = 'status-badge declined';
        
        updateModalFooter(agendamentos[appointmentIndex]);

        renderAgendamentos();
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function closeModal(event) {
    if (!event || event.target === document.getElementById('appointmentModal') || event.type === 'click') {
        document.getElementById('appointmentModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function formatCPF(cpf) {
    if (!cpf) return '';
    const cleanCpf = cpf.replace(/\D/g, '');
    return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatDateTime(dateTime) {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getStatusText(status) {
    const statusMap = {
        'accepted': 'Aceito',
        'pending': 'Pendente',
        'declined': 'Recusado'
    };
    return statusMap[status] || 'Desconhecido';
}

document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    toggleSubmenu('gestao');
});


document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (window.innerWidth <= 768 && 
        !sidebar.contains(event.target) && 
        !menuToggle.contains(event.target)) {
        sidebar.classList.remove('show');
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});