function formatDateToICS(date) {
    return date.toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
}

export function exportAppointmentToCalendar(appointment, db) {
    const pet = db.getPet(appointment.petId);
    const client = pet ? db.getClient(pet.clientId) : null;
    
    const startDate = new Date(`${appointment.date}T${appointment.time}:00`);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `DTSTART:${formatDateToICS(startDate)}`,
        `DTEND:${formatDateToICS(endDate)}`,
        `SUMMARY:Consulta para ${pet ? pet.name : 'Pet'} - ${appointment.type}`,
        `DESCRIPTION:Consulta agendada para ${pet ? pet.name : 'Pet'}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\n');
    
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Consulta_${pet ? pet.name : 'Pet'}_${appointment.date}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
