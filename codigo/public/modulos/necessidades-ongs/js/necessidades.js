// Verificar se o usuário é um ponto de apoio logado
function verificarSessaoPontoDeApoio() {
    const pontoDeApoioLogado = sessionStorage.getItem('pontoDeApoioLogado');
    console.log('Verificando sessão de ponto de apoio nas necessidades-ongs:', pontoDeApoioLogado);
    
    if (!pontoDeApoioLogado) {
        console.log('Acesso negado - redirecionando para login');
        alert('Acesso restrito! Você precisa estar logado como ponto de apoio para acessar esta área.');
        window.location.href = '../../index.html';
        return false;
    }
    return true;
}

// Verificar acesso antes de executar qualquer funcionalidade
if (!verificarSessaoPontoDeApoio()) {
    throw new Error('Acesso não autorizado');
}

const API_URL = 'http://localhost:3000';
let organizations = [];
let editingOrgId = null;

// Função para voltar para a área de gestão
function voltarParaAreaGestao() {
    window.location.href = '../area-gestao/area-gestao.html';
}

// Função para configurar o menu de filtros
function setupFilterMenu() {
    const filterAppearBtn = document.querySelector("#filter-appear-btn");
    const listMenuImg = document.querySelector('#list-menu-img');
    const filterMenu = document.querySelector("#menu");

    if (filterAppearBtn && filterMenu) {
        filterAppearBtn.addEventListener("click", () => {
            filterMenu.classList.toggle('active');
        });
    }
}

// Função para atualizar estatísticas
function updateStats() {
    const totalOngsElement = document.getElementById('total-ongs');
    const totalNeedsElement = document.getElementById('total-needs');
    
    if (totalOngsElement) {
        totalOngsElement.textContent = organizations.length;
    }
    
    if (totalNeedsElement) {
        const totalNeeds = organizations.reduce((acc, org) => {
            return acc + (org.necessidades ? org.necessidades.length : 0);
        }, 0);
        totalNeedsElement.textContent = totalNeeds;
    }
}

// Função para carregar necessidades
async function carregarNecessidades() {
  try {
    const response = await fetch(`${API_URL}/necessidadesOngs`);
    organizations = await response.json();
    displayOrganizations();
    updateNeedsTextToCopy();
  } catch (error) {
    console.error('Erro ao carregar necessidades:', error);
    alert('Erro ao carregar dados das ONGs');
  }
}

function openONGForm(orgId = null) {
    const modal = document.getElementById('ongFormModal');
    const modalTitle = document.getElementById('modalTitle');
    const ongNameInput = document.getElementById('ongName');
    const itemsContainer = document.getElementById('itemsContainer');

    itemsContainer.innerHTML = '';

    if (orgId) {
        editingOrgId = orgId;
        modalTitle.textContent = 'Editar Necessidades da ONG';
        const orgToEdit = organizations.find(org => org.id === orgId);
        if (orgToEdit) {
            ongNameInput.value = orgToEdit.nome;
            if (orgToEdit.necessidades) {
                orgToEdit.necessidades.forEach(item => addNewItemField(item));
            }
        }
    } else {
        editingOrgId = null;
        modalTitle.textContent = 'Cadastrar Necessidades da ONG';
        ongNameInput.value = '';
        addNewItemField();
    }
    modal.style.display = 'flex';
}

function closeONGFormModal() {
    document.getElementById('ongFormModal').style.display = 'none';
}

function addNewItemField(itemData = null) {
    const itemsContainer = document.getElementById('itemsContainer');
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item-field');

    itemDiv.innerHTML = `
        <input type="text" placeholder="Tipo (Ex: Roupas, Alimentos)" class="itemName" value="${itemData ? itemData.tipo : ''}" required />
        <input type="text" placeholder="Descrição" class="itemDescription" value="${itemData ? itemData.descricao : ''}" />
        <input type="number" placeholder="Quantidade" class="itemQuantity" min="1" value="${itemData ? itemData.quantidade : '1'}" required />
        <select class="itemPriority">
            <option value="Baixa" ${itemData && itemData.urgencia === 'Baixa' ? 'selected' : ''}>Baixa</option>
            <option value="Média" ${itemData && itemData.urgencia === 'Média' ? 'selected' : ''}>Média</option>
            <option value="Alta" ${itemData && itemData.urgencia === 'Alta' ? 'selected' : ''}>Alta</option>
        </select>
        <button type="button" class="remove-item-btn" onclick="removeItemField(this)">Remover</button>
    `;

    itemsContainer.appendChild(itemDiv);
}

function removeItemField(button) {
    button.parentElement.remove();
}

async function saveONG() {
    const ongName = document.getElementById('ongName').value.trim();
    const endereco = document.getElementById('ongAddress') ? document.getElementById('ongAddress').value.trim() : '';
    const telefone = document.getElementById('ongPhone') ? document.getElementById('ongPhone').value.trim() : '';

    if (!ongName) {
        alert('Por favor, insira o nome da ONG.');
        return;
    }

    const itemFields = document.querySelectorAll('.item-field');
    const necessidades = [];

    itemFields.forEach(field => {
        const tipo = field.querySelector('.itemName').value.trim();
        const descricao = field.querySelector('.itemDescription').value.trim();
        const quantidade = parseInt(field.querySelector('.itemQuantity').value);
        const urgencia = field.querySelector('.itemPriority').value;

        if (tipo && quantidade > 0) {
            necessidades.push({
                tipo,
                descricao,
                quantidade,
                urgencia
            });
        }
    });

    if (necessidades.length === 0) {
        alert('Por favor, adicione pelo menos uma necessidade.');
        return;
    }

    const orgData = {
        nome: ongName,
        endereco,
        telefone,
        necessidades
    };

    try {
        let response;
        if (editingOrgId !== null) {
            response = await fetch(`${API_URL}/necessidadesOngs/${editingOrgId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...orgData, id: editingOrgId })
            });
        } else {
            response = await fetch(`${API_URL}/necessidadesOngs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orgData)
            });
        }

        if (response.ok) {
            await carregarNecessidades();
            closeONGFormModal();
        } else {
            throw new Error('Erro na requisição');
        }
    } catch (error) {
        console.error('Erro ao salvar ONG:', error);
        alert('Erro ao salvar dados da ONG');
    }
}

// Função para renderizar organizações no novo layout
function displayOrganizations() {
    const container = document.getElementById('ongListDisplay');
    if (!container) return;

    container.innerHTML = '';

    if (organizations.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #a0aec0;">
                <h3 style="margin-bottom: 10px; color: #4a90e2;">Nenhuma ONG cadastrada</h3>
                <p>Clique em "Cadastrar Nova ONG" para começar.</p>
            </div>
        `;
        return;
    }

    organizations.forEach(org => {
        const orgCard = document.createElement('div');
        orgCard.className = 'ong-card';
        
        const needsListHTML = org.necessidades && org.necessidades.length > 0 
            ? org.necessidades.map(need => `
                <div class="need-item">
                    <span class="need-item-name">${need.item || need.nome || 'Item'}</span>
                    <span class="need-item-quantity">${need.quantidade || '1'}</span>
                </div>
            `).join('')
            : '<div class="need-item"><span class="need-item-name">Nenhuma necessidade cadastrada</span><span class="need-item-quantity">-</span></div>';

        orgCard.innerHTML = `
            <h3>🏢 ${org.nome}</h3>
            <div class="needs-list">
                ${needsListHTML}
            </div>
            <div class="ong-actions">
                <button class="btn-edit" onclick="openONGForm('${org.id}')">Editar</button>
                <button class="btn-delete" onclick="deleteONG('${org.id}')">Excluir</button>
            </div>
        `;
        
        container.appendChild(orgCard);
    });
    
    updateStats();
}

async function deleteONG(orgId) {
    if (confirm('Tem certeza que deseja excluir esta ONG e todas as suas necessidades?')) {
        try {
            const response = await fetch(`${API_URL}/necessidadesOngs/${orgId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await carregarNecessidades();
            } else {
                throw new Error('Erro na requisição');
            }
        } catch (error) {
            console.error('Erro ao excluir ONG:', error);
            alert('Erro ao excluir ONG');
        }
    }
}

function updateNeedsTextToCopy() {
    const needsTextArea = document.getElementById('needsTextToCopy');
    let textToCopy = 'NECESSIDADES DAS ONGs\n\n';

    organizations.forEach(org => {
        textToCopy += `${org.nome}\n`;
        if (org.endereco) textToCopy += `Endereço: ${org.endereco}\n`;
        if (org.telefone) textToCopy += `Telefone: ${org.telefone}\n`;
        textToCopy += 'Necessidades:\n';

        if (org.necessidades && org.necessidades.length > 0) {
            org.necessidades.forEach(item => {
                textToCopy += `- ${item.tipo} ${item.descricao ? `(${item.descricao})` : ''} - Qtd: ${item.quantidade} - Urgência: ${item.urgencia}\n`;
            });
        }

        textToCopy += '\n';
    });

    needsTextArea.value = textToCopy;
}

function copyNeedsText() {
    const needsTextArea = document.getElementById('needsTextToCopy');
    needsTextArea.select();
    document.execCommand('copy');
    alert('Texto copiado para a área de transferência!');
}

window.onload = () => {
    carregarNecessidades();
    setupFilterMenu();
};
