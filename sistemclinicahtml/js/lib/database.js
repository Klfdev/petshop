class Database {
    constructor() {
        this.loadData();
    }

    loadData() {
        this.clients = JSON.parse(localStorage.getItem('vet_clients')) || [];
        this.pets = JSON.parse(localStorage.getItem('vet_pets')) || [];
        this.appointments = JSON.parse(localStorage.getItem('vet_appointments')) || [];
        this.vaccines = JSON.parse(localStorage.getItem('vet_vaccines')) || [];
    }

    saveData() {
        localStorage.setItem('vet_clients', JSON.stringify(this.clients));
        localStorage.setItem('vet_pets', JSON.stringify(this.pets));
        localStorage.setItem('vet_appointments', JSON.stringify(this.appointments));
        localStorage.setItem('vet_vaccines', JSON.stringify(this.vaccines));
    }

    // ... outros métodos do seu Database
}

export default Database;