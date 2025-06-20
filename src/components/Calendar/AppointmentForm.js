import React, { useState, useEffect } from 'react';
import TimeSlotPicker from './TimeSlotPicker';

const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

function AppointmentForm({
  onSave,
  onUpdate,
  doctorId,
  patientId,
  selectedDate,
  existingAppointments = [],
  editData = null
}) {
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    if (editData?.TimeSlot) {
      setSelectedTime(editData.TimeSlot.split(':').slice(0, 2).join(':'));
    } else {
      setSelectedTime('');
    }
  }, [editData]);

  const takenSlots = existingAppointments
  .map(app => app.TimeSlot)
  .filter(Boolean)
  .map(slot => slot.substring(0, 5));

  const availableSlots = HOURS.filter(slot =>
    editData ? true : !takenSlots.includes(slot)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTime || !selectedDate || !doctorId || !patientId) return;

    const payload = {
      doctorId,
      patientId,
      date: selectedDate,
      timeSlot: selectedTime + ':00' 
    };

    if (editData?.Id) {
      onUpdate({ Id: editData.Id, ...payload });
    } else {
      onSave(payload);
    }

    setSelectedTime('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
      <h3>{editData ? 'Editează programarea' : 'Programează-te'}</h3>
      <TimeSlotPicker
        availableSlots={availableSlots}
        selectedSlot={selectedTime}
        onSelect={setSelectedTime}
      />
      <button type="submit">{editData ? 'Salvează modificările' : 'Confirmă'}</button>
    </form>
  );
}

export default AppointmentForm;
