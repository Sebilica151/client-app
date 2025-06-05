import React, { useEffect, useState } from 'react';
import { fetchPatients, deletePatient } from '../../services/api';

function PatientList({ onSelect, onRefresh }) {
  const [patients, setPatients] = useState([]);

  const loadPatients = () => {
    fetchPatients()
      .then(setPatients)
      .catch(console.error);
  };

  useEffect(() => {
    loadPatients();
  }, [onRefresh]);

  const handleDelete = async (id) => {
    if (window.confirm('Ești sigur că vrei să ștergi acest pacient?')) {
      await deletePatient(id);
      loadPatients();
    }
  };

  return (
    <div>
      <h2>Lista Pacienților</h2>
      <ul>
        {patients.map(patient => (
          <li key={patient.id}>
            <span onClick={() => onSelect(patient)} style={{ cursor: 'pointer' }}>
              {patient.name} ({patient.age} ani)
            </span>
            <button onClick={() => handleDelete(patient.id)} style={{ marginLeft: '10px' }}>
              Șterge
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PatientList;
