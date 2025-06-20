import React, { useEffect, useState } from 'react';
import {
  fetchPatients,
  fetchAppointmentsByDoctorAndDate,
  fetchAppointmentsForPatient,
  fetchProfile,
  getCurrentDoctorId,
  getCurrentPatientId
} from '../services/api';
import { useAuth } from '../context/AuthContext';

function DashboardPage() {
  const { role } = useAuth();
  const [patientCount, setPatientCount] = useState(0);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [associatedDoctor, setAssociatedDoctor] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  // Doctor Dashboard
  useEffect(() => {
    if (Number(role) === 1) {
      // Fetch number of patients
      fetchPatients().then(patients => setPatientCount(patients.length));

      // Fetch today's appointments
      const doctorId = getCurrentDoctorId();
      if (doctorId) {
        fetchAppointmentsByDoctorAndDate(doctorId, today)
          .then(setTodayAppointments)
          .catch(console.error);
      }
    }
  }, [role]);

  // Patient Dashboard
  useEffect(() => {
    if (Number(role) === 2) {
      const patientId = getCurrentPatientId();
      if (patientId) {
        // Get all appointments and pick next
        fetchAppointmentsForPatient(patientId)
          .then(apps => {
            const future = apps
              .filter(a => new Date(a.Date) >= new Date())
              .sort((a, b) => new Date(a.Date) - new Date(b.Date));
            setNextAppointment(future[0] || null);
          })
          .catch(console.error);
      }

      // Get associated doctor
      fetchProfile()
        .then(data => {
          setAssociatedDoctor(data.patient?.doctor || null);
        })
        .catch(console.error);
    }
  }, [role]);

  return (
    <div>
      <h2>Dashboard</h2>

      {Number(role) === 1 && (
        <>
          <p><strong>Număr total pacienți:</strong> {patientCount}</p>
          <p><strong>Programări azi:</strong> {todayAppointments.length}</p>
          <ul>
            {todayAppointments.map((appt, idx) => (
              <li key={idx}>
                {appt.TimeSlot} - {appt.Patient?.Name || 'Pacient necunoscut'}
              </li>
            ))}
          </ul>
        </>
      )}

      {Number(role) === 2 && (
        <>
          <p><strong>Următoarea programare:</strong></p>
          {nextAppointment ? (
            <p>
              {nextAppointment.Date} la {nextAppointment.TimeSlot}
              {nextAppointment.doctor && (
                <> cu Dr. {nextAppointment.Doctor.Name}</>
              )}
            </p>
          ) : (
            <p>Nu ai programări viitoare.</p>
          )}

          <p><strong>Medicul asociat:</strong></p>
          {associatedDoctor ? (
            <p>
              {associatedDoctor.Name} – {associatedDoctor.Specialization}
            </p>
          ) : (
            <p>Niciun medic asociat.</p>
          )}
        </>
      )}
    </div>
  );
}

export default DashboardPage;
