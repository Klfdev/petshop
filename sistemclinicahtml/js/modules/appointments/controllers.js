import { exportAppointmentToCalendar } from '../../lib/calendar-export.js';

export default class AppointmentsController {
    constructor(db) {
        this.db = db;
    }

    getAllAppointments() {
        return this.db.getAllAppointments();
    }

    addAppointment(appointmentData) {
        return this.db.addAppointment(appointmentData);
    }

    exportToCalendar(appointment) {
        exportAppointmentToCalendar(appointment, this.db);
    }

    // ... outros métodos específicos de appointments
}