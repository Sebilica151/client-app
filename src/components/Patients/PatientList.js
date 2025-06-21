import React from 'react';

const PatientList = ({ patients, onEdit, onDelete }) => {
  return (
    <div>
      <h2>Lista pacienti</h2>
      <ul>
        {patients.map((patient) => (
          <li key={patient.id}>
            {patient.name} - {patient.age} ani - {patient.gender} - {patient.phoneNumber}
            <button onClick={() => onEdit(patient)}>Editeaza</button>
            <button onClick={() => onDelete(patient.id)}>Sterge</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientList;
