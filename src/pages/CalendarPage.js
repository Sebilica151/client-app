import React, { useEffect, useState } from 'react';
import {
  fetchDoctors,
  fetchAppointmentsByDoctorAndDate,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getCurrentDoctorId,
  getCurrentPatientId
} from '../services/api';

import AppointmentForm from '../components/Calendar/AppointmentForm';
import AppointmentList from '../components/Calendar/AppointmentList';
import { useAuth } from '../context/AuthContext';
import './CalendarPage.css';

function CalendarPage() {
  const { role } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [editData, setEditData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [patientId, setPatientId] = useState(null);

  useEffect(() => {
    if (Number(role) === 2) {
      fetchDoctors().then(setDoctors);
      setPatientId(getCurrentPatientId());
      console.log("PatientId setat:", getCurrentPatientId());
    } else if (Number(role) === 1) {
      const doctorId = getCurrentDoctorId();
      setSelectedDoctorId(doctorId);
      setSelectedDate(new Date().toISOString().split('T')[0]);
    }
  }, [role]);

  useEffect(() => {
    if (selectedDoctorId && selectedDate) {
      fetchAppointmentsByDoctorAndDate(selectedDoctorId, selectedDate)
        .then(setAppointments)
        .catch(() => setAppointments([]));
    }
  }, [selectedDoctorId, selectedDate, refreshKey]);

  const handleAdd = async (payload) => {
    try {
      await createAppointment(payload);
      setRefreshKey((k) => k + 1);
    } catch {
      alert('Eroare la adăugare programare!');
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      await updateAppointment(updatedData.Id, updatedData);
      setEditData(null);
      setRefreshKey((k) => k + 1);
    } catch {
      alert('Eroare la actualizare!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Confirmi ștergerea?')) {
      await deleteAppointment(id);
      setRefreshKey((k) => k + 1);
    }
  };

  return (
    <div className="calendar-container">
      <h2>Calendar programări</h2>

      {Number(role) === 2 && (
        <div className="form-group">
          <label>Doctor:</label>
          <select
            className="dropdown"
            value={selectedDoctorId}
            onChange={(e) => {
              setSelectedDoctorId(e.target.value);
              setSelectedDate('');
              setAppointments([]);
            }}
          >
            <option value="">-- Alege doctor --</option>
            {doctors.map((d) => (
              <option key={d.Id} value={d.Id}>{d.Name}</option>
            ))}
          </select>
        </div>
      )}

      {selectedDoctorId && (
        <div className="form-group">
          <label>Ziua:</label>
          <input
            type="date"
            className="input-date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      )}

      {selectedDoctorId && selectedDate && (
        <>
          {Number(role) === 2 && (
            <AppointmentForm
              doctorId={selectedDoctorId}
              patientId={patientId}
              selectedDate={selectedDate}
              existingAppointments={appointments}
              editData={editData}
              onSave={handleAdd}
              onUpdate={handleUpdate}
            />
          )}

          <AppointmentList
            appointments={appointments}
            role={role}
            onEdit={setEditData}
            onDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
}

export default CalendarPage;
