import React, { useState, useEffect } from 'react';
import TimeSlotPicker from './TimeSlotPicker';
import AppointmentRequestModal from './AppointmentRequestModal';
import '../../pages/CalendarPage.css';
import { API_BASE } from '../../services/api';

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
  doctorWorkEnd = "16:30",
  refreshAppointments // pentru actualizarea listei după upload
}) {
  const [selectedTime, setSelectedTime] = useState('');
  const [showModal, setShowModal] = useState(false);

  const workStart = doctor?.WorkStart || doctorWorkStart;
  const workEnd = doctor?.WorkEnd || doctorWorkEnd;
  const allSlots = generateHalfHourSlots(workStart, workEnd);

const takenSlots = appointments
  .filter(app => app.Date === selectedDate && app.Status !== 'rejected' && (!editData || app.Id !== editData?.Id))
  .map(app => app.TimeSlot.substring(0, 5));

  const availableSlots = allSlots.filter(slot =>
    !takenSlots.includes(slot) || slot === selectedTime
  );

  useEffect(() => {
  if (!editData && selectedTime && selectedDate && doctorId && patientId) {
    const alreadyTaken = appointments.some(
      app =>
        app.Date === selectedDate &&
        app.TimeSlot.substring(0, 5) === selectedTime
    );
    if (alreadyTaken) {
      alert('Acest interval este deja ocupat.');
      setSelectedTime('');
      return;
    }

    setShowModal(true);
  }
}, [selectedTime]);

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTime('');
  };

  const handleSubmitWithFile = async (file) => {
  const formData = new FormData();
  formData.append('DoctorId', doctorId);
  formData.append('PatientId', patientId);
  formData.append('Date', selectedDate);
  formData.append('TimeSlot', selectedTime + ':00');
  formData.append('File', file);

  try {
    const response = await fetch(`${API_BASE}/appointments/upload`, {
    method: 'POST',
    body: formData,
  });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message);
    }

    if (refreshAppointments) {
      await refreshAppointments(); 
    }

    setSelectedTime('');   
    setShowModal(false);  
  } catch (err) {
    alert('Eroare la trimiterea cererii: ' + err.message);
  }
};


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

      {!editData && (
        <AppointmentRequestModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSubmit={handleSubmitWithFile}
          selectedTime={selectedTime}
        />
      )}
    </form>
  );
}

export default AppointmentForm;
