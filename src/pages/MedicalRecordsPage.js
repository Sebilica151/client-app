// src/pages/MedicalRecordsPage.js
import React, { useEffect, useState } from 'react';
import {
  fetchPatients,
  getMedicalRecordsByPatientId,
  archiveMedicalRecord,
  getArchivedMedicalRecordsByPatientId
} from '../services/api';
import './MedicalRecordsPage.css';
import { useAuth } from '../context/AuthContext';
import { getCurrentPatientId } from '../services/api';
import MedicalRecordList from '../components/MedicalRecords/MedicalRecordList';
import MedicalRecordForm from '../components/MedicalRecords/MedicalRecordForm';

function MedicalRecordsPage() {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const { role } = useAuth();
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    if (role === 1) {
      fetchPatients()
        .then(data => {
          setPatients(Array.isArray(data) ? data : data?.$values || []);
        })
        .catch(err => {
          console.error("Eroare la fetchPatients:", err);
          setPatients([]);
        });
    } else if (role === 2) {
      setSelectedPatientId(getCurrentPatientId());
    }
  }, [role]);

  const loadRecords = () => {
    if (!selectedPatientId) return;
    getMedicalRecordsByPatientId(selectedPatientId)
      .then(setMedicalRecords)
      .catch(console.error);
    setRecordToEdit(null);
  };
  
  useEffect(() => {
    loadRecords();
  }, [selectedPatientId]);

  const handleArchive = async (id) => {
  if (window.confirm("Ești sigur că vrei să arhivezi această fișă medicală?")) {
    await archiveMedicalRecord(id);
    loadRecords();
  }
  };

const loadArchivedRecords = async () => {
  if (!selectedPatientId) return;
  try {
    const data = await getArchivedMedicalRecordsByPatientId(selectedPatientId);
    setMedicalRecords(data);
    setShowArchived(true);
  } catch (err) {
    console.error("Eroare la încărcarea fișelor arhivate:", err);
  }
};

  const handleEdit = (record) => {
    setRecordToEdit(record);
  };

  return (
  <div className="records-container">
    <h2 className="records-title">Fișe Medicale</h2>

    {role === 1 && (
      <div className="patient-select">
        <label htmlFor="patient-dropdown">Selectează pacient:</label>
        <select
          id="patient-dropdown"
          value={selectedPatientId}
          onChange={e => setSelectedPatientId(e.target.value)}
        >
          <option value="">-- Alege pacientul --</option>
          {Array.isArray(patients) &&
            patients.map((p, idx) => (
              <option key={p.Id ?? p.id ?? idx} value={p.Id ?? p.id}>
                {p.Name ?? p.name}
              </option>
            ))}
        </select>
      </div>
    )}

    {selectedPatientId && (
      <>
        {role === 1 && (
          <button
            onClick={() => {
              showArchived ? loadRecords() : loadArchivedRecords();
              setShowArchived(prev => !prev);
            }}
            className="submit-button"
            style={{ marginBottom: '1rem' }}
          >
            {showArchived ? 'Ascunde fișele arhivate' : 'Afișează fișele arhivate'}
          </button>
        )}

        <MedicalRecordList
          records={medicalRecords}
          onEdit={handleEdit}
          onArchive={handleArchive}
        />

        {role === 1 && (
          <MedicalRecordForm
            patientId={selectedPatientId}
            onRecordSaved={loadRecords}
            recordToEdit={recordToEdit}
          />
        )}
      </>
    )}
  </div>
);

}

export default MedicalRecordsPage;