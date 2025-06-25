import React, { useState, useEffect } from 'react';
import TimeSlotPicker from './TimeSlotPicker';
import '../../pages/CalendarPage.css';

const generateHalfHourSlots = (start = '08:00', end = '16:30') => {
  const [startHour, startMin] = start.split(':').map(Number);
  const [endHour, endMin] = end.split(':').map(Number);
  const startTotal = startHour * 60 + startMin;
  const endTotal = endHour * 60 + endMin;

  const slots = [];
  for (let min = startTotal; min + 30 <= endTotal; min += 30) {
    const h = String(Math.floor(min / 60)).padStart(2, '0');
    const m = String(min % 60).padStart(2, '0');
    slots.push(`${h}:${m}`);
  }
  return slots;
};

function AppointmentForm({
  doctor,
  onSave,
  onUpdate,
  doctorId,
  patientId,
  selectedDate,
  appointments = [],
  editData = null,
  doctorWorkStart = "08:00",
  doctorWorkEnd = "16:30"
}) {
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    if (!editData && selectedTime && selectedDate && doctorId && patientId) {
      // Verificare dacă slotul este deja ocupat
      const alreadyTaken = appointments.some(
        app =>
          app.Date === selectedDate &&
          app.TimeSlot.substring(0, 5) === selectedTime
      );
      if (alreadyTaken) {
        alert('Acest interval este deja ocupat.');
        return;
      }

      const payload = {
        doctorId,
        patientId,
        date: selectedDate,
        timeSlot: selectedTime + ':00',
      };
      onSave(payload);
      setSelectedTime('');
    }
  }, [selectedTime]);

  const workStart = doctor?.WorkStart || doctorWorkStart;
  const workEnd = doctor?.WorkEnd || doctorWorkEnd;
  const allSlots = generateHalfHourSlots(workStart, workEnd);

  const takenSlots = appointments
    .filter(app => app.Date === selectedDate && (!editData || app.Id !== editData?.Id))
    .map(app => app.TimeSlot.substring(0, 5));

  const availableSlots = allSlots.filter(slot =>
    !takenSlots.includes(slot) || slot === selectedTime
  );

  return (
    <form className="appointment-form" onSubmit={(e) => e.preventDefault()}>
      <h3 className="appointment-title">
        {editData ? 'Editează programarea' : 'Programează-te'}
      </h3>

      <TimeSlotPicker
        availableSlots={availableSlots}
        selectedSlot={selectedTime}
        onSelect={setSelectedTime}
        workStart={workStart}
        workEnd={workEnd}
      />
    </form>
  );
}

export default AppointmentForm;
