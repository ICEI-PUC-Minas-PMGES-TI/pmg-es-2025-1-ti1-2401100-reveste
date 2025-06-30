const API_URL = 'http://localhost:3000';
let organizations = [];
let editingOrgId = null;

// --- Funções do Modal de Cadastro/Edição de ONG ---

// Abre o modal para cadastrar uma nova ONG ou editar uma existente
function openONGForm(orgId = null) {
    const modal = document.getElementById('ongFormModal');
    const modalTitle = document.getElementById('modalTitle');
    const ongNameInput = document.getElementById('ongName');
    const itemsContainer = document.getElementById('itemsContainer');

    itemsContainer.innerHTML = ''; // Limpa os campos de itens

    if (orgId) {
        // Modo de edição
        editingOrgId = orgId;
        modalTitle.textContent = 'Editar Necessidades da ONG';
        const orgToEdit = organizations.find(org => org.id === orgId);
        if (orgToEdit) {
            ongNameInput.value = orgToEdit.name;
            orgToEdit.needs.forEach(item => addNewItemField(item)); // Preenche os itens existentes
        }
    } else {
        // Modo de cadastro
        editingOrgId = null;
        modalTitle.textContent = 'Cadastrar Necessidades da ONG';
        ongNameInput.value = '';
        addNewItemField(); // Adiciona um campo de item vazio para começar
    }
    modal.style.display = 'flex'; // Exibe o modal
}

// Fecha o modal
function closeONGFormModal() {
    document.getElementById('ongFormModal').style.display = 'none';
}

// Adiciona um novo campo para item de necessidade no formulário do modal
function addNewItemField(itemData = null) {
    const itemsContainer = document.getElementById('itemsContainer');
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item-field');

    itemDiv.innerHTML = `
        <input type="text" placeholder="Nome do Item (Ex: Calça Jeans)" class="itemName" value="${itemData ? itemData.name : ''}" required />
        <input type="text" placeholder="Tamanho (Ex: M, 40)" class="itemSize" value="${itemData ? itemData.size : ''}" />
        <input type="number" placeholder="Quantidade" class="itemQuantity" min="1" value="${itemData ? itemData.quantity : '1'}" required />
        <select class="itemPriority">
            <option value="Alta" ${itemData && itemData.priority === 'Alta' ? 'selected' : ''}>Alta</option>
            <option value="Média" ${itemData && itemData.priority === 'Média' ? 'selected' : ''}>Média</option>
            <option value="Baixa" ${itemData && itemData.priority === 'Baixa' ? 'selected' : ''}>Baixa</option>
        </select>
        <button class="remove-item-btn" onclick="removeItemField(this)">&times;</button>
    `;
    itemsContainer.appendChild(itemDiv);
}

// Remove um campo de item do formulário do modal
function removeItemField(button) {
    button.closest('.item-field').remove();
}

// Salva (cadastra ou edita) a ONG e suas necessidades
function saveONG() {
    const ongName = document.getElementById('ongName').value.trim();
    if (!ongName) {
        alert('Por favor, preencha o nome da ONG.');
        return;
    }

    const itemFields = document.querySelectorAll('.item-field');
    const needs = [];
    let isValid = true;

    if (itemFields.length === 0) {
        alert('Adicione ao menos um item de necessidade.');
        return;
    }

    itemFields.forEach(field => {
        const itemName = field.querySelector('.itemName').value.trim();
        const itemSize = field.querySelector('.itemSize').value.trim();
        const itemQuantity = parseInt(field.querySelector('.itemQuantity').value.trim());
        const itemPriority = field.querySelector('.itemPriority').value;

        if (!itemName || isNaN(itemQuantity) || itemQuantity <= 0) {
            alert('Por favor, preencha todos os campos do item corretamente (Nome e Quantidade válida).');
            isValid = false;
            return;
        }
        needs.push({ name: itemName, size: itemSize, quantity: itemQuantity, priority: itemPriority });
    });

    if (!isValid) return;

    if (editingOrgId) {
        // Atualiza ONG existente
        const index = organizations.findIndex(org => org.id === editingOrgId);
        if (index !== -1) {
            organizations[index] = { id: editingOrgId, name: ongName, needs: needs };
            alert('Necessidades da ONG atualizadas com sucesso!');
        }
    } else {
        // Cadastra nova ONG
        const newOrg = { id: 'org_' + Date.now(), name: ongName, needs: needs };
        organizations.push(newOrg);
        alert('ONG cadastrada com sucesso!');
    }

    saveToLocalStorage();
    renderONGList();
    closeONGFormModal();
}

// --- Funções de Gerenciamento de Dados e Exibição ---

async function saveToDatabase() {
    try {
        const response = await fetch(`${API_URL}/necessidadesOngs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(organizations)
        });
        return response.ok;
    } catch (error) {
        console.error('Erro ao salvar organizações:', error);
        return false;
    }
}

async function loadOrganizations() {
    try {
        const response = await fetch(`${API_URL}/necessidadesOngs`);
        organizations = await response.json();
        renderONGList();
    } catch (error) {
        console.error('Erro ao carregar organizações:', error);
        organizations = [];
        renderONGList();
    }
}

// Renderiza a lista de ONGs e suas necessidades na página
function renderONGList() {
    const ongListDisplay = document.getElementById('ongListDisplay');
    const needsTextToCopy = document.getElementById('needsTextToCopy');
    
    ongListDisplay.innerHTML = '';
    needsTextToCopy.value = '';

    if (organizations.length === 0) {
        ongListDisplay.innerHTML = '<p style="text-align: center;">Nenhuma ONG cadastrada ainda. Clique em "+ Cadastrar Nova ONG" para começar!</p>';
        return;
    }

    organizations.forEach(org => {
        // Renderiza no display visual
        const orgCard = document.createElement('div');
        orgCard.classList.add('ong-card');
        orgCard.innerHTML = `
            <h4>${org.name}</h4>
            <div class="card-actions">
                <button class="edit-btn" onclick="openONGForm('${org.id}')">Editar</button>
                <button class="delete-btn" onclick="deleteONG('${org.id}')">Excluir</button>
            </div>
            <ul>
                ${org.needs.map(item => `
                    <li>${item.quantity}x ${item.name} (${item.size ? `Tam: ${item.size}, ` : ''}Prioridade: ${item.priority})</li>
                `).join('')}
            </ul>
        `;
        ongListDisplay.appendChild(orgCard);

        // Gera texto para copiar
        needsTextToCopy.value += `ONG: ${org.name}\n`;
        org.needs.forEach(item => {
            needsTextToCopy.value += `- ${item.quantity}x ${item.name} (Tam: ${item.size || 'N/A'}, Prioridade: ${item.priority})\n`;
        });
        needsTextToCopy.value += '\n';
    });
}

// Exclui uma ONG da lista
function deleteONG(orgId) {
    if (confirm('Tem certeza que deseja excluir esta ONG e todas as suas necessidades?')) {
        organizations = organizations.filter(org => org.id !== orgId);
        saveToLocalStorage();
        renderONGList();
        alert('ONG excluída com sucesso!');
    }
}

// Copia o texto das necessidades para a área de transferência
function copyNeedsText() {
    const needsTextToCopy = document.getElementById('needsTextToCopy');
    needsTextToCopy.select();
    document.execCommand('copy');
    alert('Texto das necessidades copiado para a área de transferência!');
}

// --- Inicialização ---

// Carrega as ONGs e renderiza a lista ao carregar a página
window.onload = () => {
    renderONGList();
};

// Fechar o modal ao clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById('ongFormModal');
    if (event.target == modal) {
        closeONGFormModal();
    }
};