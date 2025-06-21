import React, { useEffect, useState } from 'react';
import {
  fetchUsers,
  assignPatientToDoctor,
  unassignPatientFromDoctor,
  getCurrentUserId
} from '../services/api';
import './PatientsPage.css';

const PatientsPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [doctorUserId, setDoctorUserId] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const allUsers = await fetchUsers();
        const currentUserId = getCurrentUserId();
        setUsers(allUsers);
        setDoctorUserId(currentUserId);
      } catch (err) {
        console.error("Eroare la încărcare:", err);
      }
    };
    loadData();
  }, []);

  const handleAssign = async () => {
    if (!selectedPatientId || !doctorUserId) return;
    try {
      await assignPatientToDoctor(selectedPatientId, doctorUserId);
      setUsers(prev =>
        prev.map(u =>
          u.Id === parseInt(selectedPatientId) ? { ...u, DoctorId: doctorUserId } : u
        )
      );
      setSelectedPatientId('');
    } catch (err) {
      console.error("Eroare la asignare:", err);
    }
  };

  const handleUnassign = async (id) => {
    try {
      await unassignPatientFromDoctor(id);
      setUsers(prev =>
        prev.map(u =>
          u.Id === id ? { ...u, DoctorId: null } : u
        )
      );
    } catch (err) {
      console.error("Eroare la dezasignare:", err);
    }
  };

  const unassignedPatients = users.filter(u => u.Role === "2" && u.DoctorId === null);
  const myPatients = users.filter(u => u.DoctorId === doctorUserId);

  return (
    <div className="patients-container">
      <div className="assign-section">
        <h2>Pacienți neasignați</h2>
        <div className="assign-controls">
          <select
            value={selectedPatientId}
            onChange={e => setSelectedPatientId(e.target.value)}
          >
            <option value="">-- Selectează un pacient --</option>
            {unassignedPatients.map(p => (
              <option key={p.Id} value={p.Id}>
                {p.Email}
              </option>
            ))}
          </select>
          <button onClick={handleAssign} disabled={!selectedPatientId}>
            Atribuie pacient
          </button>
        </div>
      </div>

      <div className="my-patients-section">
        <h2>Pacienții mei</h2>
        {myPatients.length === 0 ? (
          <p>Nu ai pacienți asignați.</p>
        ) : (
          <ul className="patient-list">
            {myPatients.map(p => (
              <li key={p.Id}>
                {p.Email}
                <button
                  onClick={() => handleUnassign(p.Id)}
                  className="delete-button"
                >
                  Șterge
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PatientsPage;
