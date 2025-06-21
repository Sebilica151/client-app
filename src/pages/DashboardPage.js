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
import './DashboardPage.css';

function DashboardPage() {
  const { role } = useAuth();
  const [patientCount, setPatientCount] = useState(0);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [associatedDoctor, setAssociatedDoctor] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (Number(role) === 1) {
      fetchPatients().then(patients => setPatientCount(patients.length));

      const doctorId = getCurrentDoctorId();
      if (doctorId) {
        fetchAppointmentsByDoctorAndDate(doctorId, today)
          .then(setTodayAppointments)
          .catch(console.error);
      }
    }
  }, [role]);

  useEffect(() => {
    if (Number(role) === 2) {
      const patientId = getCurrentPatientId();
      if (patientId) {
        fetchAppointmentsForPatient(patientId)
          .then(apps => {
            const future = apps
              .filter(a => new Date(a.Date) >= new Date())
              .sort((a, b) => new Date(a.Date) - new Date(b.Date));
            setNextAppointment(future[0] || null);
          })
          .catch(console.error);
      }

      fetchProfile()
        .then(data => {
          setAssociatedDoctor(data.patient?.doctor || null);
        })
        .catch(console.error);
    }
  }, [role]);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>

      {Number(role) === 1 && (
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Pacienți</h3>
            <p>{patientCount} în total</p>
          </div>
          <div className="dashboard-card">
            <h3>Programări azi</h3>
            <p>{todayAppointments.length}</p>
            <ul>
              {todayAppointments.map((appt, idx) => (
                <li key={idx}>
                  {appt.TimeSlot} – {appt.Patient?.Name || 'Pacient necunoscut'}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {Number(role) === 2 && (
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Următoarea programare</h3>
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
          </div>

          <div className="dashboard-card">
            <h3>Medicul asociat</h3>
            {associatedDoctor ? (
              <p>
                {associatedDoctor.Name} – {associatedDoctor.Specialization}
              </p>
            ) : (
              <p>Niciun medic asociat.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
