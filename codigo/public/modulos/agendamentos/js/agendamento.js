
const pontoApoio = [
    { id: 1, nome: "Igreja Batista" },
    { id: 2, nome: "ONG Reveste" },
    { id: 3, nome: "Instituto Criança Feliz" }
];

const API_URL = 'http://localhost:3000';
let agendamentos = [];

document.addEventListener('DOMContentLoaded', function() {
    loadAgendamentos();
    setupFilterEvents();
    setupModalEvents();
});

async function loadAgendamentos() {
    try {
        const response = await fetch(`${API_URL}/agendamentos`);
        agendamentos = await response.json();
        updateStats();
        renderSchedules();
    } catch (error) {
        console.error('Erro ao carregar agendamentos:', error);
        agendamentos = [];
        updateStats();
        renderSchedules();
    }
}

async function saveAgendamento(novoAgendamento) {
    try {
        const response = await fetch(`${API_URL}/agendamentos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoAgendamento)
        });
        
        if (response.ok) {
            const agendamentoSalvo = await response.json();
            agendamentos.push(agendamentoSalvo);
            updateStats();
            renderSchedules();
            return true;
        }
        return false;
    } catch (error) {
        console.error('Erro ao salvar agendamento:', error);
        return false;
    }
}
                    id: 3,
                    nome: "Pedro Oliveira",
                    email: "pedro@email.com",
                    cpf: "11122233344",
                    telefone: "(31) 77777-7777",
                    dataHora: "2024-01-10T16:00",
                    observacoes: "Livros e material escolar",
                    pontoApoio: "ong3",
                    status: "concluido"
                }
            ];
            saveAgendamentos();
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

function updateStats() {
    const totalSchedules = agendamentos.length;
    const pendingSchedules = agendamentos.filter(a => a.status === 'pendente').length;
    const completedSchedules = agendamentos.filter(a => a.status === 'concluido').length;
    
    document.getElementById('total-schedules').textContent = totalSchedules;
    document.getElementById('pending-schedules').textContent = pendingSchedules;
    document.getElementById('completed-schedules').textContent = completedSchedules;
}


function renderSchedules() {
    const grid = document.getElementById('schedulesGrid');
    
    if (agendamentos.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #a0aec0;">
                <div style="font-size: 48px; margin-bottom: 20px;">📅</div>
                <h3>Nenhum agendamento encontrado</h3>
                <p>Crie o primeiro agendamento clicando no botão "Novo Agendamento".</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = '';
    
    agendamentos.forEach(agendamento => {
        const card = document.createElement('div');
        card.className = 'schedule-card';
        card.onclick = () => openScheduleDetails(agendamento.id);
        
        const pontoNome = getPontoApoioName(agendamento.pontoApoio);
        
        card.innerHTML = `
            <div class="schedule-header">
                <div class="schedule-title">Agendamento #${agendamento.id}</div>
                <div class="schedule-status ${agendamento.status}">${getStatusText(agendamento.status)}</div>
            </div>
            <div class="schedule-details">
                <strong>${agendamento.nome}</strong><br>
                ${agendamento.email}<br>
                CPF: ${formatCPF(agendamento.cpf)}<br>
                Telefone: ${agendamento.telefone}<br>
                <strong>Ponto:</strong> ${pontoNome}
            </div>
            <div class="schedule-date">
                📅 ${formatDateTime(agendamento.dataHora)}
            </div>
        `;
        
        grid.appendChild(card);
    });
}

function getPontoApoioName(pontoId) {
    const ponto = pontoApoio.find(p => p.id == pontoId.replace('ong', ''));
    return ponto ? ponto.nome : 'Ponto não encontrado';
}

function formatCPF(cpf) {
    if (!cpf) return '';
    const cleanCpf = cpf.toString().replace(/\D/g, '');
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
        'pendente': 'Pendente',
        'confirmado': 'Confirmado',
        'concluido': 'Concluído',
        'cancelado': 'Cancelado'
    };
    return statusMap[status] || 'Desconhecido';
}


function openScheduleForm() {
    document.getElementById('modalTitle').textContent = 'Novo Agendamento de Doação';
    document.getElementById('scheduleForm').reset();
    document.getElementById('scheduleFormModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeScheduleModal() {
    document.getElementById('scheduleFormModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openScheduleDetails(scheduleId) {
    const schedule = agendamentos.find(a => a.id == scheduleId);
    if (!schedule) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'scheduleDetailsModal';
    
    const pontoNome = getPontoApoioName(schedule.pontoApoio);
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h2>Detalhes do Agendamento #${schedule.id}</h2>
                <button class="close-modal" onclick="closeScheduleDetailsModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="schedule-info">
                    <div class="info-row">
                        <strong>Nome:</strong> ${schedule.nome}
                    </div>
                    <div class="info-row">
                        <strong>Email:</strong> ${schedule.email}
                    </div>
                    <div class="info-row">
                        <strong>CPF:</strong> ${formatCPF(schedule.cpf)}
                    </div>
                    <div class="info-row">
                        <strong>Telefone:</strong> ${schedule.telefone}
                    </div>
                    <div class="info-row">
                        <strong>Data/Hora:</strong> ${formatDateTime(schedule.dataHora)}
                    </div>
                    <div class="info-row">
                        <strong>Ponto de Apoio:</strong> ${pontoNome}
                    </div>
                    <div class="info-row">
                        <strong>Observações:</strong> ${schedule.observacoes || 'Nenhuma observação'}
                    </div>
                    <div class="info-row">
                        <strong>Status Atual:</strong> 
                        <span class="status-badge ${schedule.status}">${getStatusText(schedule.status)}</span>
                    </div>
                </div>
                
                <div class="status-actions">
                    <h3>Atualizar Status:</h3>
                    <div class="status-buttons">
                        <button class="status-btn pendente ${schedule.status === 'pendente' ? 'active' : ''}" 
                                onclick="updateScheduleStatus(${schedule.id}, 'pendente')">
                            📋 Pendente
                        </button>
                        <button class="status-btn confirmado ${schedule.status === 'confirmado' ? 'active' : ''}" 
                                onclick="updateScheduleStatus(${schedule.id}, 'confirmado')">
                            ✅ Confirmado
                        </button>
                        <button class="status-btn concluido ${schedule.status === 'concluido' ? 'active' : ''}" 
                                onclick="updateScheduleStatus(${schedule.id}, 'concluido')">
                            🎉 Concluído
                        </button>
                        <button class="status-btn cancelado ${schedule.status === 'cancelado' ? 'active' : ''}" 
                                onclick="updateScheduleStatus(${schedule.id}, 'cancelado')">
                            ❌ Cancelado
                        </button>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="closeScheduleDetailsModal()">Fechar</button>
                <button class="btn-danger" onclick="deleteSchedule(${schedule.id})">Excluir Agendamento</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function saveSchedule() {
    const form = document.getElementById('scheduleForm');
    const formData = new FormData(form);
    
    // Validação básica
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const newSchedule = {
        id: agendamentos.length > 0 ? Math.max(...agendamentos.map(a => a.id)) + 1 : 1,
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        cpf: document.getElementById('cpf').value,
        telefone: document.getElementById('telefone').value,
        dataHora: document.getElementById('dataHora').value,
        observacoes: document.getElementById('observacoes').value,
        pontoApoio: document.getElementById('pontoApoio').value,
        status: 'pendente'
    };
    
    agendamentos.push(newSchedule);
    saveAgendamentos();
    updateStats();
    renderSchedules();
    closeScheduleModal();
    
    showNotification('Agendamento criado com sucesso!', 'success');
}

function closeScheduleDetailsModal() {
    const modal = document.getElementById('scheduleDetailsModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}


function updateScheduleStatus(scheduleId, newStatus) {
    const scheduleIndex = agendamentos.findIndex(a => a.id == scheduleId);
    if (scheduleIndex === -1) {
        alert('Agendamento não encontrado!');
        return;
    }
    
    agendamentos[scheduleIndex].status = newStatus;
    

    saveAgendamentos();
    

    renderSchedules();
    updateStats();
    
    closeScheduleDetailsModal();
    

    showSuccessMessage(`Status atualizado para: ${getStatusText(newStatus)}`);
    

    setTimeout(() => {
        openScheduleDetails(scheduleId);
    }, 1000);
}


function deleteSchedule(scheduleId) {
    if (!confirm('Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.')) {
        return;
    }
    
    const scheduleIndex = agendamentos.findIndex(a => a.id == scheduleId);
    if (scheduleIndex === -1) {
        alert('Agendamento não encontrado!');
        return;
    }
    

    agendamentos.splice(scheduleIndex, 1);
    

    saveAgendamentos();
    

    renderSchedules();
    updateStats();
    

    closeScheduleDetailsModal();
    

    showSuccessMessage('Agendamento excluído com sucesso!');
}


function showSuccessMessage(message) {

    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">✅</span>
            <span class="notification-text">${message}</span>
        </div>
    `;
    

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}


function setupFilterEvents() {

    document.getElementById('filter-appear-btn').addEventListener('click', function() {
        const menu = document.getElementById('menu');
        const img = document.getElementById('list-menu-img');
        
        menu.classList.toggle('active');
        img.classList.toggle('active');
    });
    

    const statusCheckboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    statusCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    document.getElementById('date-filter').addEventListener('change', applyFilters);
}

function applyFilters() {
    const statusFilters = Array.from(document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    const dateFilter = document.getElementById('date-filter').value;
    
    let filteredSchedules = [...agendamentos];
    

    if (statusFilters.length > 0) {
        filteredSchedules = filteredSchedules.filter(schedule => 
            statusFilters.includes(schedule.status)
        );
    }
    

    if (dateFilter) {
        const now = new Date();
        filteredSchedules = filteredSchedules.filter(schedule => {
            const scheduleDate = new Date(schedule.dataHora);
            
            switch (dateFilter) {
                case 'hoje':
                    return scheduleDate.toDateString() === now.toDateString();
                case 'semana':
                    const weekStart = new Date(now);
                    weekStart.setDate(now.getDate() - now.getDay());
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 6);
                    return scheduleDate >= weekStart && scheduleDate <= weekEnd;
                case 'mes':
                    return scheduleDate.getMonth() === now.getMonth() && 
                           scheduleDate.getFullYear() === now.getFullYear();
                default:
                    return true;
            }
        });
    }
    
    renderFilteredSchedules(filteredSchedules);
}

function renderFilteredSchedules(schedules) {
    const grid = document.getElementById('schedulesGrid');
    
    if (schedules.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #a0aec0;">
                <div style="font-size: 48px; margin-bottom: 20px;">🔍</div>
                <h3>Nenhum agendamento encontrado</h3>
                <p>Tente ajustar os filtros para ver mais resultados.</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = '';
    
    schedules.forEach(agendamento => {
        const card = document.createElement('div');
        card.className = 'schedule-card';
        card.onclick = () => openScheduleDetails(agendamento.id);
        
        const pontoNome = getPontoApoioName(agendamento.pontoApoio);
        
        card.innerHTML = `
            <div class="schedule-header">
                <div class="schedule-title">Agendamento #${agendamento.id}</div>
                <div class="schedule-status ${agendamento.status}">${getStatusText(agendamento.status)}</div>
            </div>
            <div class="schedule-details">
                <strong>${agendamento.nome}</strong><br>
                ${agendamento.email}<br>
                CPF: ${formatCPF(agendamento.cpf)}<br>
                Telefone: ${agendamento.telefone}<br>
                <strong>Ponto:</strong> ${pontoNome}
            </div>
            <div class="schedule-date">
                📅 ${formatDateTime(agendamento.dataHora)}
            </div>
        `;
        
        grid.appendChild(card);
    });
}


function setupModalEvents() {

    document.getElementById('scheduleFormModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeScheduleModal();
        }
    });
    

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeScheduleModal();
        }
    });
    

    document.getElementById('cpf').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        e.target.value = value;
    });
    

    document.getElementById('telefone').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        e.target.value = value;
    });
}


function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4a90e2'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}


function verificarSessaoPontoDeApoio() {
    const pontoDeApoioLogado = sessionStorage.getItem('pontoDeApoioLogado');
    console.log('Verificando sessão de ponto de apoio nos agendamentos:', pontoDeApoioLogado);
    
    if (!pontoDeApoioLogado) {
        console.log('Acesso negado - redirecionando para login');
        alert('Acesso restrito! Você precisa estar logado como ponto de apoio para acessar esta área.');
        window.location.href = '../../index.html';
        return false;
    }
    return true;
}


if (!verificarSessaoPontoDeApoio()) {
    throw new Error('Acesso não autorizado');
}