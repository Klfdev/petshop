export default class PetsView {
    constructor(controller) {
        this.controller = controller;
        this.tableBody = document.getElementById('pets-list');
    }

    renderPetsList(pets) {
        this.tableBody.innerHTML = '';
        
        if (pets.length === 0) {
            this.tableBody.innerHTML = '<tr><td colspan="6">Nenhum pet encontrado</td></tr>';
            return;
        }

        pets.forEach(pet => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${pet.name}</td>
                <td>${pet.species}</td>
                <td>${pet.breed || '-'}</td>
                <td>${this.calculateAge(pet.birthdate)}</td>
                <td>${this.getClientName(pet.clientId)}</td>
                <td>
                    <button class="btn-icon edit-btn" data-id="${pet.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete-btn" data-id="${pet.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            this.tableBody.appendChild(row);
        });
    }

    calculateAge(birthdate) {
        if (!birthdate) return '-';
        // ... implementação do cálculo de idade
    }

    getClientName(clientId) {
        const client = this.controller.db.getClient(clientId);
        return client ? client.name : 'Sem dono';
    }
}