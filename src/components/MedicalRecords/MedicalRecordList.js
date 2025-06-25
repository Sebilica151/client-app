// src/components/MedicalRecords/MedicalRecordList.js
import React from 'react';
import { useAuth } from '../../context/AuthContext';

function MedicalRecordList({ records, onEdit, onArchive }) {
  const { role } = useAuth();

  if (!records || records.length === 0) {
    return <p>Nu există fișe medicale pentru acest pacient.</p>;
  }

  return (
    <ul>
      {records.map(record => (
        <li key={record.Id ?? record.id}>
          <div><strong>Diagnostic:</strong> {record.Diagnosis}</div>
          <div><strong>Tratament:</strong> {record.Treatment}</div>
          <div><strong>Gen:</strong> {record.Gender}</div>
          <div><strong>CNP:</strong> {record.PersonalNumber}</div>
          <div><strong>Data nașterii:</strong> {record.Birthday?.slice(0, 10)}</div>
          <div><strong>Locul nașterii:</strong> {record.BirthPlace}</div>
          <div><strong>Afecțiuni anterioare:</strong> {record.PastMedicalCondition}</div>
          <div><strong>Afecțiuni actuale:</strong> {record.CurrentMedicalCondition}</div>

          {role === 1 && !record.IsArchived && (
            <div style={{ marginTop: '0.5rem' }}>
              <button onClick={() => onEdit(record)}>Editare</button>
              <button onClick={() => onArchive(record.Id)} style={{ marginLeft: '10px' }}>Arhiveaza</button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export default MedicalRecordList;
