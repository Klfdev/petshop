class VetCareUI {
    constructor() {
        this.db = new Database();
        this.initElements();
        this.loadDashboard();
    }

    initElements() {
        this.dashboardStats = {
            totalPets: document.getElementById('total-pets'),
            totalClients: document.getElementById('total-clients')
        };
    }

    loadDashboard() {
        this.dashboardStats.totalClients.textContent = this.db.getAllClients().length;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new VetCareUI();
});