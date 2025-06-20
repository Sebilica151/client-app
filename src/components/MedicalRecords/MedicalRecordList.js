// src/components/MedicalRecords/MedicalRecordList.js
import React from 'react';
import { useAuth } from '../../context/AuthContext';

function MedicalRecordList({ records, onEdit, onDelete }) {
  const { role } = useAuth();
  if (!records || records.length === 0) {
    return <p>Nu există fișe medicale pentru acest pacient.</p>;
  }

  

  return (
    <ul>
      {records.map(record => (
        <li key={record.Id ?? record.id}>
        <strong>Diagnostic:</strong> {record.Diagnosis ?? record.Diagnosis} |{' '}
        <strong>Tratament:</strong> {record.Treatment ?? record.Treatment} |{' '}
        <strong>Observații:</strong> {record.Notes ?? record.Notes}
        <br />
        {role === 1 && (
          <div style={{ marginTop: '0.5rem' }}>
            <button onClick={() => onEdit(record)}>Editare</button>
            <button onClick={() => onDelete(record.Id)} style={{ marginLeft: '10px' }}>Ștergere</button>
          </div>
        )}
        </li>
      ))}
    </ul>
  );
}

export default MedicalRecordList;
