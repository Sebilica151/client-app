import React, { useState, useEffect } from 'react';
import TimeSlotPicker from './TimeSlotPicker';
import '../../pages/CalendarPage.css';

const generateHalfHourSlots = () => {
  const slots = [];
  for (let min = 8 * 60; min <= 16 * 60 + 30; min += 30) {
    const h = String(Math.floor(min / 60)).padStart(2, '0');
    const m = String(min % 60).padStart(2, '0');
    slots.push(`${h}:${m}`);
  }
  return slots;
};


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

const allSlots = generateHalfHourSlots();

const availableSlots = allSlots.filter(slot =>
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
  <form className="appointment-form" onSubmit={(e) => e.preventDefault()}>
    <h3 className="appointment-title">
      {editData ? 'Editează programarea' : 'Programează-te'}
    </h3>

    <TimeSlotPicker
      availableSlots={availableSlots}
      selectedSlot={selectedTime}
      onSelect={(slot) => {
        setSelectedTime(slot);

        if (!editData && slot && selectedDate && doctorId && patientId) {
          const payload = {
            doctorId,
            patientId,
            date: selectedDate,
            timeSlot: slot + ':00'
          };
          onSave(payload);
          setSelectedTime('');
        }
      }}
    />

    {editData && (
      <button type="submit" className="submit-btn">
        Salvează modificările
      </button>
    )}
  </form>
);

}

export default AppointmentForm;
