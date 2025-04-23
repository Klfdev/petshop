// Armazenamento Local
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

    // Métodos para Clientes
    addClient(client) {
        client.id = Date.now().toString();
        this.clients.push(client);
        this.saveData();
        return client;
    }

    updateClient(id, updatedClient) {
        const index = this.clients.findIndex(c => c.id === id);
        if (index !== -1) {
            this.clients[index] = { ...this.clients[index], ...updatedClient };
            this.saveData();
            return true;
        }
        return false;
    }

    deleteClient(id) {
        const index = this.clients.findIndex(c => c.id === id);
        if (index !== -1) {
            const hasPets = this.pets.some(p => p.clientId === id);
            if (hasPets) return false;
            
            this.clients.splice(index, 1);
            this.saveData();
            return true;
        }
        return false;
    }

    getClient(id) {
        return this.clients.find(c => c.id === id);
    }

    getAllClients() {
        return [...this.clients];
    }

    // Métodos para Pets
    addPet(pet) {
        pet.id = Date.now().toString();
        this.pets.push(pet);
        this.saveData();
        return pet;
    }

    updatePet(id, updatedPet) {
        const index = this.pets.findIndex(p => p.id === id);
        if (index !== -1) {
            this.pets[index] = { ...this.pets[index], ...updatedPet };
            this.saveData();
            return true;
        }
        return false;
    }

    deletePet(id) {
        const index = this.pets.findIndex(p => p.id === id);
        if (index !== -1) {
            const hasAppointments = this.appointments.some(a => a.petId === id);
            const hasVaccines = this.vaccines.some(v => v.petId === id);
            
            if (hasAppointments || hasVaccines) return false;
            
            this.pets.splice(index, 1);
            this.saveData();
            return true;
        }
        return false;
    }

    getPet(id) {
        return this.pets.find(p => p.id === id);
    }

    getPetsByClient(clientId) {
        return this.pets.filter(p => p.clientId === clientId);
    }

    getAllPets() {
        return [...this.pets];
    }

    // Métodos para Consultas
    addAppointment(appointment) {
        appointment.id = Date.now().toString();
        this.appointments.push(appointment);
        this.saveData();
        return appointment;
    }

    updateAppointment(id, updatedAppointment) {
        const index = this.appointments.findIndex(a => a.id === id);
        if (index !== -1) {
            this.appointments[index] = { ...this.appointments[index], ...updatedAppointment };
            this.saveData();
            return true;
        }
        return false;
    }

    deleteAppointment(id) {
        const index = this.appointments.findIndex(a => a.id === id);
        if (index !== -1) {
            this.appointments.splice(index, 1);
            this.saveData();
            return true;
        }
        return false;
    }

    getAppointment(id) {
        return this.appointments.find(a => a.id === id);
    }

    getAppointmentsByDate(date) {
        return this.appointments.filter(a => a.date === date);
    }

    getUpcomingAppointments(days = 7) {
        const today = new Date().toISOString().split('T')[0];
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + days);
        const endDateStr = endDate.toISOString().split('T')[0];
        
        return this.appointments.filter(a => {
            return a.date >= today && a.date <= endDateStr;
        }).sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
    }

    getAllAppointments() {
        return [...this.appointments];
    }

    // Métodos para Vacinas
    addVaccine(vaccine) {
        vaccine.id = Date.now().toString();
        this.vaccines.push(vaccine);
        this.saveData();
        return vaccine;
    }

    updateVaccine(id, updatedVaccine) {
        const index = this.vaccines.findIndex(v => v.id === id);
        if (index !== -1) {
            this.vaccines[index] = { ...this.vaccines[index], ...updatedVaccine };
            this.saveData();
            return true;
        }
        return false;
    }

    deleteVaccine(id) {
        const index = this.vaccines.findIndex(v => v.id === id);
        if (index !== -1) {
            this.vaccines.splice(index, 1);
            this.saveData();
            return true;
        }
        return false;
    }

    getVaccine(id) {
        return this.vaccines.find(v => v.id === id);
    }

    getVaccinesByPet(petId) {
        return this.vaccines.filter(v => v.petId === petId);
    }

    getPendingVaccines() {
        const today = new Date().toISOString().split('T')[0];
        return this.vaccines.filter(v => v.nextDate && v.nextDate <= today);
    }

    getAllVaccines() {
        return [...this.vaccines];
    }
}

// Interface do Usuário
class VetCareUI {
    constructor() {
        this.db = new Database();
        this.currentDate = new Date();
        this.initElements();
        this.initEventListeners();
        this.loadDashboard();
        this.showSection('dashboard');
        this.addSampleDataIfEmpty();
    }

    initElements() {
        // Seções
        this.sections = {
            dashboard: document.getElementById('dashboard'),
            pets: document.getElementById('pets'),
            clients: document.getElementById('clients'),
            appointments: document.getElementById('appointments'),
            vaccines: document.getElementById('vaccines'),
            reports: document.getElementById('reports')
        };

        // Botões de navegação
        this.navButtons = document.querySelectorAll('.nav-btn');

        // Modais
        this.modals = {
            pet: document.getElementById('pet-modal'),
            client: document.getElementById('client-modal'),
            appointment: document.getElementById('appointment-modal'),
            vaccine: document.getElementById('vaccine-modal')
        };

        this.modalBackdrop = document.getElementById('modal-backdrop');

        // Formulários
        this.forms = {
            pet: document.getElementById('pet-form'),
            client: document.getElementById('client-form'),
            appointment: document.getElementById('appointment-form'),
            vaccine: document.getElementById('vaccine-form')
        };

        // Elementos do Dashboard
        this.dashboardStats = {
            totalPets: document.getElementById('total-pets'),
            totalClients: document.getElementById('total-clients'),
            todayAppointments: document.getElementById('today-appointments'),
            pendingVaccines: document.getElementById('pending-vaccines')
        };

        this.upcomingList = document.getElementById('upcoming-list');

        // Elementos da seção de Pets
        this.petsList = document.getElementById('pets-list');
        this.petSearch = document.getElementById('pet-search');

        // Elementos da seção de Clientes
        this.clientsList = document.getElementById('clients-list');
        this.clientSearch = document.getElementById('client-search');

        // Elementos da seção de Agenda
        this.calendarView = document.getElementById('calendar-view');
        this.currentWeekDisplay = document.getElementById('current-week');
        this.prevWeekBtn = document.getElementById('prev-week');
        this.nextWeekBtn = document.getElementById('next-week');

        // Elementos da seção de Vacinas
        this.vaccinesList = document.getElementById('vaccines-list');
        this.vaccineFilter = document.getElementById('vaccine-filter');

        // Elementos da seção de Relatórios
        this.reportChartCanvas = document.getElementById('report-chart');
        this.reportChart = null;
    }

    initEventListeners() {
        // Navegação
        this.navButtons.forEach(button => {
            button.addEventListener('click', () => {
                const section = button.getAttribute('data-section');
                this.showSection(section);
            });
        });

        // Botões de adição
        document.getElementById('add-pet-btn').addEventListener('click', () => this.showPetModal());
        document.getElementById('add-client-btn').addEventListener('click', () => this.showClientModal());
        document.getElementById('add-appointment-btn').addEventListener('click', () => this.showAppointmentModal());
        document.getElementById('add-vaccine-btn').addEventListener('click', () => this.showVaccineModal());

        // Fechar modais
        document.querySelectorAll('.close-modal, .cancel-btn').forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });

        // Backdrop do modal
        this.modalBackdrop.addEventListener('click', () => this.closeAllModals());

        // Submissão de formulários
        this.forms.pet.addEventListener('submit', (e) => this.handlePetFormSubmit(e));
        this.forms.client.addEventListener('submit', (e) => this.handleClientFormSubmit(e));
        this.forms.appointment.addEventListener('submit', (e) => this.handleAppointmentFormSubmit(e));
        this.forms.vaccine.addEventListener('submit', (e) => this.handleVaccineFormSubmit(e));

        // Pesquisa
        this.petSearch.addEventListener('input', () => this.loadPets());
        this.clientSearch.addEventListener('input', () => this.loadClients());

        // Controles da agenda
        this.prevWeekBtn.addEventListener('click', () => this.changeWeek(-1));
        this.nextWeekBtn.addEventListener('click', () => this.changeWeek(1));

        // Filtro de vacinas
        this.vaccineFilter.addEventListener('change', () => this.loadVaccines());

        // Relatórios
        document.getElementById('pets-report').addEventListener('click', () => this.showPetsReport());
        document.getElementById('appointments-report').addEventListener('click', () => this.showAppointmentsReport());
        document.getElementById('vaccines-report').addEventListener('click', () => this.showVaccinesReport());
    }

    // Navegação entre seções
    showSection(sectionId) {
        Object.values(this.sections).forEach(section => {
            section.classList.remove('active');
        });

        this.navButtons.forEach(button => {
            button.classList.remove('active');
        });

        this.sections[sectionId].classList.add('active');
        document.querySelector(`.nav-btn[data-section="${sectionId}"]`).classList.add('active');

        switch(sectionId) {
            case 'dashboard': this.loadDashboard(); break;
            case 'pets': this.loadPets(); break;
            case 'clients': this.loadClients(); break;
            case 'appointments': this.loadCalendar(); break;
            case 'vaccines': this.loadVaccines(); break;
            case 'reports': this.showPetsReport(); break;
        }
    }

    // Modais
    showPetModal(petId = null) {
        const form = this.forms.pet;
        form.reset();
        form.querySelector('#pet-id').value = '';
        
        this.loadClientsInSelect('pet-client');
        
        if (petId) {
            document.getElementById('pet-modal-title').textContent = 'Editar Pet';
            const pet = this.db.getPet(petId);
            if (pet) {
                form.querySelector('#pet-id').value = pet.id;
                form.querySelector('#pet-name').value = pet.name;
                form.querySelector('#pet-species').value = pet.species;
                form.querySelector('#pet-breed').value = pet.breed || '';
                form.querySelector('#pet-birthdate').value = pet.birthdate || '';
                form.querySelector('#pet-weight').value = pet.weight || '';
                form.querySelector('#pet-client').value = pet.clientId;
                form.querySelector('#pet-notes').value = pet.notes || '';
            }
        } else {
            document.getElementById('pet-modal-title').textContent = 'Adicionar Novo Pet';
        }
        
        this.showModal(this.modals.pet);
    }

    showClientModal(clientId = null) {
        const form = this.forms.client;
        form.reset();
        form.querySelector('#client-id').value = '';
        
        if (clientId) {
            document.getElementById('client-modal-title').textContent = 'Editar Cliente';
            const client = this.db.getClient(clientId);
            if (client) {
                form.querySelector('#client-id').value = client.id;
                form.querySelector('#client-name').value = client.name;
                form.querySelector('#client-phone').value = client.phone;
                form.querySelector('#client-email').value = client.email || '';
                form.querySelector('#client-address').value = client.address || '';
            }
        } else {
            document.getElementById('client-modal-title').textContent = 'Adicionar Novo Cliente';
        }
        
        this.showModal(this.modals.client);
    }

    showAppointmentModal(appointmentId = null) {
        const form = this.forms.appointment;
        form.reset();
        form.querySelector('#appointment-id').value = '';
        
        this.loadPetsInSelect('appointment-pet');
        
        const today = new Date().toISOString().split('T')[0];
        form.querySelector('#appointment-date').value = today;
        
        if (appointmentId) {
            document.getElementById('appointment-modal-title').textContent = 'Editar Consulta';
            const appointment = this.db.getAppointment(appointmentId);
            if (appointment) {
                form.querySelector('#appointment-id').value = appointment.id;
                form.querySelector('#appointment-pet').value = appointment.petId;
                form.querySelector('#appointment-date').value = appointment.date;
                form.querySelector('#appointment-time').value = appointment.time;
                form.querySelector('#appointment-type').value = appointment.type;
                form.querySelector('#appointment-notes').value = appointment.notes || '';
            }
        } else {
            document.getElementById('appointment-modal-title').textContent = 'Agendar Consulta';
        }
        
        this.showModal(this.modals.appointment);
    }

    showVaccineModal(vaccineId = null) {
        const form = this.forms.vaccine;
        form.reset();
        form.querySelector('#vaccine-id').value = '';
        
        this.loadPetsInSelect('vaccine-pet');
        
        const today = new Date().toISOString().split('T')[0];
        form.querySelector('#vaccine-date').value = today;
        
        if (vaccineId) {
            document.getElementById('vaccine-modal-title').textContent = 'Editar Vacina';
            const vaccine = this.db.getVaccine(vaccineId);
            if (vaccine) {
                form.querySelector('#vaccine-id').value = vaccine.id;
                form.querySelector('#vaccine-pet').value = vaccine.petId;
                form.querySelector('#vaccine-type').value = vaccine.type;
                form.querySelector('#vaccine-date').value = vaccine.date;
                form.querySelector('#vaccine-next-date').value = vaccine.nextDate || '';
                form.querySelector('#vaccine-lote').value = vaccine.lote || '';
            }
        } else {
            document.getElementById('vaccine-modal-title').textContent = 'Registrar Vacina';
        }
        
        this.showModal(this.modals.vaccine);
    }

    showModal(modal) {
        this.closeAllModals();
        modal.classList.add('active');
        this.modalBackdrop.classList.add('active');
    }

    closeAllModals() {
        Object.values(this.modals).forEach(modal => {
            modal.classList.remove('active');
        });
        this.modalBackdrop.classList.remove('active');
    }

    // Manipulação de formulários
    handlePetFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const id = form.querySelector('#pet-id').value;
        const petData = {
            name: form.querySelector('#pet-name').value,
            species: form.querySelector('#pet-species').value,
            breed: form.querySelector('#pet-breed').value,
            birthdate: form.querySelector('#pet-birthdate').value,
            weight: form.querySelector('#pet-weight').value,
            clientId: form.querySelector('#pet-client').value,
            notes: form.querySelector('#pet-notes').value
        };

        if (id) {
            if (this.db.updatePet(id, petData)) {
                alert('Pet atualizado com sucesso!');
                this.loadPets();
                this.loadDashboard();
                this.closeAllModals();
            } else {
                alert('Erro ao atualizar pet.');
            }
        } else {
            this.db.addPet(petData);
            alert('Pet adicionado com sucesso!');
            this.loadPets();
            this.loadDashboard();
            this.closeAllModals();
        }
    }

    handleClientFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const id = form.querySelector('#client-id').value;
        const clientData = {
            name: form.querySelector('#client-name').value,
            phone: form.querySelector('#client-phone').value,
            email: form.querySelector('#client-email').value,
            address: form.querySelector('#client-address').value
        };

        if (id) {
            if (this.db.updateClient(id, clientData)) {
                alert('Cliente atualizado com sucesso!');
                this.loadClients();
                this.loadDashboard();
                this.closeAllModals();
            } else {
                alert('Erro ao atualizar cliente.');
            }
        } else {
            this.db.addClient(clientData);
            alert('Cliente adicionado com sucesso!');
            this.loadClients();
            this.loadDashboard();
            this.closeAllModals();
        }
    }

    handleAppointmentFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const id = form.querySelector('#appointment-id').value;
        const appointmentData = {
            petId: form.querySelector('#appointment-pet').value,
            date: form.querySelector('#appointment-date').value,
            time: form.querySelector('#appointment-time').value,
            type: form.querySelector('#appointment-type').value,
            notes: form.querySelector('#appointment-notes').value,
            status: 'agendado'
        };

        if (id) {
            if (this.db.updateAppointment(id, appointmentData)) {
                alert('Consulta atualizada com sucesso!');
                this.loadCalendar();
                this.loadDashboard();
                this.closeAllModals();
            } else {
                alert('Erro ao atualizar consulta.');
            }
        } else {
            this.db.addAppointment(appointmentData);
            alert('Consulta agendada com sucesso!');
            this.loadCalendar();
            this.loadDashboard();
            this.closeAllModals();
        }
    }

    handleVaccineFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const id = form.querySelector('#vaccine-id').value;
        const vaccineData = {
            petId: form.querySelector('#vaccine-pet').value,
            type: form.querySelector('#vaccine-type').value,
            date: form.querySelector('#vaccine-date').value,
            nextDate: form.querySelector('#vaccine-next-date').value,
            lote: form.querySelector('#vaccine-lote').value,
            status: form.querySelector('#vaccine-next-date').value ? 'pendente' : 'completa'
        };

        if (id) {
            if (this.db.updateVaccine(id, vaccineData)) {
                alert('Vacina atualizada com sucesso!');
                this.loadVaccines();
                this.loadDashboard();
                this.closeAllModals();
            } else {
                alert('Erro ao atualizar vacina.');
            }
        } else {
            this.db.addVaccine(vaccineData);
            alert('Vacina registrada com sucesso!');
            this.loadVaccines();
            this.loadDashboard();
            this.closeAllModals();
        }
    }

    // Carregar dados em selects
    loadClientsInSelect(selectId) {
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">Selecione um cliente</option>';
        
        this.db.getAllClients().forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = client.name;
            select.appendChild(option);
        });
    }

    loadPetsInSelect(selectId) {
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">Selecione um pet</option>';
        
        this.db.getAllPets().forEach(pet => {
            const client = this.db.getClient(pet.clientId);
            const option = document.createElement('option');
            option.value = pet.id;
            option.textContent = `${pet.name} (${client ? client.name : 'Sem dono'})`;
            select.appendChild(option);
        });
    }

    // Carregar dados nas seções
    loadDashboard() {
        // Estatísticas
        this.dashboardStats.totalPets.textContent = this.db.getAllPets().length;
        this.dashboardStats.totalClients.textContent = this.db.getAllClients().length;
        
        const today = new Date().toISOString().split('T')[0];
        this.dashboardStats.todayAppointments.textContent = this.db.getAppointmentsByDate(today).length;
        
        this.dashboardStats.pendingVaccines.textContent = this.db.getPendingVaccines().length;
        
        // Próximas consultas
        this.upcomingList.innerHTML = '';
        const upcomingAppointments = this.db.getUpcomingAppointments(7);
        
        if (upcomingAppointments.length === 0) {
            this.upcomingList.innerHTML = '<p>Nenhuma consulta agendada para os próximos 7 dias.</p>';
        } else {
            upcomingAppointments.forEach(app => {
                const pet = this.db.getPet(app.petId);
                if (!pet) return;
                
                const client = this.db.getClient(pet.clientId);
                const clientName = client ? client.name : 'Sem dono';
                
                const appDate = new Date(app.date);
                const formattedDate = appDate.toLocaleDateString('pt-BR', { 
                    weekday: 'short', 
                    day: '2-digit', 
                    month: 'short' 
                });
                
                const appElement = document.createElement('div');
                appElement.className = 'upcoming-item';
                appElement.innerHTML = `
                    <div class="info">
                        <span class="pet-name">${pet.name} (${pet.species})</span>
                        <span class="client-name">${clientName}</span>
                    </div>
                    <div class="time">
                        <span class="appointment-date">${formattedDate}</span>
                        <span class="appointment-time">${app.time}</span>
                    </div>
                `;
                
                this.upcomingList.appendChild(appElement);
            });
        }
    }

    loadPets() {
        this.petsList.innerHTML = '';
        const searchTerm = this.petSearch.value.toLowerCase();
        
        const pets = this.db.getAllPets()
            .filter(pet => {
                if (!searchTerm) return true;
                return (
                    pet.name.toLowerCase().includes(searchTerm) ||
                    (pet.breed && pet.breed.toLowerCase().includes(searchTerm)) ||
                    pet.species.toLowerCase().includes(searchTerm)
                );
            });
        
        if (pets.length === 0) {
            this.petsList.innerHTML = '<tr><td colspan="6">Nenhum pet encontrado</td></tr>';
            return;
        }
        
        pets.forEach(pet => {
            const client = this.db.getClient(pet.clientId);
            const clientName = client ? client.name : 'Sem dono';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${pet.name}</td>
                <td>${pet.species}</td>
                <td>${pet.breed || '-'}</td>
                <td>${pet.birthdate ? this.calculateAge(pet.birthdate) : '-'}</td>
                <td>${clientName}</td>
                <td>
                    <button class="btn-icon edit-btn" data-id="${pet.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete-btn" data-id="${pet.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            row.querySelector('.edit-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.showPetModal(pet.id);
            });
            
            row.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm(`Tem certeza que deseja excluir o pet ${pet.name}?`)) {
                    if (this.db.deletePet(pet.id)) {
                        this.loadPets();
                        this.loadDashboard();
                        alert('Pet excluído com sucesso!');
                    } else {
                        alert('Não foi possível excluir o pet. Verifique se não há consultas ou vacinas associadas.');
                    }
                }
            });
            
            this.petsList.appendChild(row);
        });
    }

    loadClients() {
        this.clientsList.innerHTML = '';
        const searchTerm = this.clientSearch.value.toLowerCase();
        
        const clients = this.db.getAllClients()
            .filter(client => {
                if (!searchTerm) return true;
                return (
                    client.name.toLowerCase().includes(searchTerm) ||
                    client.phone.toLowerCase().includes(searchTerm) ||
                    (client.email && client.email.toLowerCase().includes(searchTerm))
                );
            });
        
        if (clients.length === 0) {
            this.clientsList.innerHTML = '<tr><td colspan="5">Nenhum cliente encontrado</td></tr>';
            return;
        }
        
        clients.forEach(client => {
            const petsCount = this.db.getPetsByClient(client.id).length;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${client.name}</td>
                <td>${client.phone}</td>
                <td>${client.email || '-'}</td>
                <td>${petsCount}</td>
                <td>
                    <button class="btn-icon edit-btn" data-id="${client.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete-btn" data-id="${client.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            row.querySelector('.edit-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.showClientModal(client.id);
            });
            
            row.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm(`Tem certeza que deseja excluir o cliente ${client.name}?`)) {
                    if (this.db.deleteClient(client.id)) {
                        this.loadClients();
                        this.loadDashboard();
                        alert('Cliente excluído com sucesso!');
                    } else {
                        alert('Não foi possível excluir o cliente. Verifique se não há pets associados.');
                    }
                }
            });
            
            this.clientsList.appendChild(row);
        });
    }

    loadCalendar() {
        // Calcular início e fim da semana atual
        const startOfWeek = new Date(this.currentDate);
        startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay());
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        // Atualizar título da semana
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        this.currentWeekDisplay.textContent = 
            `${startOfWeek.toLocaleDateString('pt-BR', options)} a ${endOfWeek.toLocaleDateString('pt-BR', options)}`;
        
        // Limpar calendário
        this.calendarView.innerHTML = '';
        
        // Criar colunas para cada dia da semana
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            
            const dayString = day.toISOString().split('T')[0];
            const appointments = this.db.getAppointmentsByDate(dayString);
            
            const dayColumn = document.createElement('div');
            dayColumn.className = 'day-column';
            
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.textContent = day.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' });
            
            dayColumn.appendChild(dayHeader);
            
            if (appointments.length === 0) {
                const emptyMsg = document.createElement('div');
                emptyMsg.className = 'appointment-item empty';
                emptyMsg.textContent = 'Nenhuma consulta';
                dayColumn.appendChild(emptyMsg);
            } else {
                appointments.sort((a, b) => a.time.localeCompare(b.time))
                    .forEach(app => {
                        const pet = this.db.getPet(app.petId);
                        if (!pet) return;
                        
                        const appElement = document.createElement('div');
                        appElement.className = 'appointment-item';
                        appElement.innerHTML = `
                            <strong>${app.time}</strong> - ${pet.name}
                            <div>${app.type}</div>
                        `;
                        
                        appElement.addEventListener('click', () => {
                            this.showAppointmentModal(app.id);
                        });
                        
                        dayColumn.appendChild(appElement);
                    });
            }
            
            this.calendarView.appendChild(dayColumn);
        }
    }

    loadVaccines() {
        this.vaccinesList.innerHTML = '';
        const filter = this.vaccineFilter.value;
        
        let vaccines = this.db.getAllVaccines();
        
        if (filter === 'pending') {
            vaccines = this.db.getPendingVaccines();
        } else if (filter === 'completed') {
            vaccines = vaccines.filter(v => !v.nextDate || new Date(v.nextDate) > new Date());
        }
        
        if (vaccines.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="6" style="text-align: center;">Nenhuma vacina encontrada</td>`;
            this.vaccinesList.appendChild(row);
            return;
        }
        
        vaccines.forEach(vaccine => {
            const pet = this.db.getPet(vaccine.petId);
            if (!pet) return;
            
            const client = this.db.getClient(pet.clientId);
            const clientName = client ? client.name : 'Sem dono';
            
            const status = vaccine.nextDate && new Date(vaccine.nextDate) <= new Date() ? 
                '<span class="status-pending">Pendente</span>' : 
                '<span class="status-completed">Completa</span>';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${pet.name} (${clientName})</td>
                <td>${vaccine.type}</td>
                <td>${new Date(vaccine.date).toLocaleDateString('pt-BR')}</td>
                <td>${vaccine.nextDate ? new Date(vaccine.nextDate).toLocaleDateString('pt-BR') : '-'}</td>
                <td>${status}</td>
                <td>
                    <button class="btn-icon edit-btn" data-id="${vaccine.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete-btn" data-id="${vaccine.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            row.querySelector('.edit-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.showVaccineModal(vaccine.id);
            });
            
            row.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm(`Tem certeza que deseja excluir o registro desta vacina?`)) {
                    if (this.db.deleteVaccine(vaccine.id)) {
                        this.loadVaccines();
                        this.loadDashboard();
                        alert('Vacina excluída com sucesso!');
                    } else {
                        alert('Erro ao excluir vacina.');
                    }
                }
            });
            
            this.vaccinesList.appendChild(row);
        });
    }

    // Relatórios
    showPetsReport() {
        const pets = this.db.getAllPets();
        const speciesCount = {};
        
        pets.forEach(pet => {
            speciesCount[pet.species] = (speciesCount[pet.species] || 0) + 1;
        });
        
        this.renderChart('Pets por Espécie', Object.keys(speciesCount), Object.values(speciesCount));
    }

    showAppointmentsReport() {
        const appointments = this.db.getAllAppointments();
        const monthCount = {};
        
        appointments.forEach(app => {
            const date = new Date(app.date);
            const month = date.toLocaleDateString('pt-BR', { month: 'long' });
            monthCount[month] = (monthCount[month] || 0) + 1;
        });
        
        this.renderChart('Consultas por Mês', Object.keys(monthCount), Object.values(monthCount));
    }

    showVaccinesReport() {
        const vaccines = this.db.getAllVaccines();
        const typeCount = {};
        
        vaccines.forEach(vaccine => {
            typeCount[vaccine.type] = (typeCount[vaccine.type] || 0) + 1;
        });
        
        this.renderChart('Vacinas Aplicadas', Object.keys(typeCount), Object.values(typeCount));
    }

    renderChart(title, labels, data) {
        if (this.reportChart) {
            this.reportChart.destroy();
        }
        
        const ctx = this.reportChartCanvas.getContext('2d');
        this.reportChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: title,
                    data: data,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: title,
                        font: { size: 18 }
                    },
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true, ticks: { precision: 0 } }
                }
            }
        });
    }

    // Utilitários
    calculateAge(birthdate) {
        if (!birthdate) return 'N/A';
        
        const birthDate = new Date(birthdate);
        const today = new Date();
        
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age > 0 ? `${age} anos` : 'Menos de 1 ano';
    }

    changeWeek(delta) {
        this.currentDate.setDate(this.currentDate.getDate() + (delta * 7));
        this.loadCalendar();
    }

    addSampleDataIfEmpty() {
        if (this.db.getAllClients().length === 0) {
            // Adicionar clientes de exemplo
            const client1 = this.db.addClient({
                name: "João Silva",
                phone: "(11) 99999-9999",
                email: "joao@example.com",
                address: "Rua Exemplo, 123"
            });
            
            const client2 = this.db.addClient({
                name: "Maria Souza",
                phone: "(11) 98888-8888",
                email: "maria@example.com",
                address: "Avenida Teste, 456"
            });
            
            // Adicionar pets de exemplo
            this.db.addPet({
                name: "Rex",
                species: "Cachorro",
                breed: "Labrador",
                birthdate: "2018-05-15",
                weight: 25,
                clientId: client1.id,
                notes: "Alergia a alguns tipos de ração"
            });
            
            this.db.addPet({
                name: "Mimi",
                species: "Gato",
                breed: "Siamês",
                birthdate: "2020-11-20",
                weight: 4.5,
                clientId: client2.id,
                notes: "Castrada em 2021"
            });
            
            // Adicionar consultas de exemplo
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);
            
            this.db.addAppointment({
                petId: this.db.getAllPets()[0].id,
                date: today.toISOString().split('T')[0],
                time: "14:30",
                type: "Consulta",
                notes: "Check-up anual",
                status: "agendado"
            });
            
            this.db.addAppointment({
                petId: this.db.getAllPets()[1].id,
                date: tomorrow.toISOString().split('T')[0],
                time: "10:00",
                type: "Vacinação",
                notes: "Dose anual da antirrábica",
                status: "agendado"
            });
            
            // Adicionar vacinas de exemplo
            this.db.addVaccine({
                petId: this.db.getAllPets()[0].id,
                type: "V8",
                date: "2023-01-10",
                nextDate: "2024-01-10",
                lote: "VAC2023-123",
                status: "pendente"
            });
            
            this.db.addVaccine({
                petId: this.db.getAllPets()[1].id,
                type: "Antirrábica",
                date: "2023-03-15",
                nextDate: "2024-03-15",
                lote: "RAB2023-456",
                status: "pendente"
            });
            
            alert('Dados de exemplo foram adicionados para demonstração!');
        }
    }
}

// Inicializar a aplicação
document.addEventListener('DOMContentLoaded', () => {
    new VetCareUI();
});