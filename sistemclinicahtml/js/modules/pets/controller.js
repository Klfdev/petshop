export default class PetsController {
    constructor(db) {
        this.db = db;
    }

    getAllPets() {
        return this.db.getAllPets();
    }

    addPet(petData) {
        return this.db.addPet(petData);
    }

    updatePet(id, updatedPet) {
        return this.db.updatePet(id, updatedPet);
    }

    deletePet(id) {
        return this.db.deletePet(id);
    }

    getPetsByClient(clientId) {
        return this.db.getPetsByClient(clientId);
    }
}