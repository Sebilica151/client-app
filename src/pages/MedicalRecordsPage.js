// src/pages/MedicalRecordsPage.js
import React, { useEffect, useState } from 'react';
import {
  fetchPatients,
  getMedicalRecordsByPatientId,
  deleteMedicalRecord
} from '../services/api';
import MedicalRecordForm from '../components/MedicalRecords/MedicalRecordForm';
import MedicalRecordList from '../components/MedicalRecords/MedicalRecordList';
import { useAuth } from '../context/AuthContext';
import { getCurrentUserId } from '../services/api';


function MedicalRecordsPage() {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const { role } = useAuth();

  useEffect(() => {
  if (role === 1) {
    fetchPatients()
      .then(data => {
        console.log("Pacienți încărcați:", data);
        setPatients(Array.isArray(data) ? data : data?.$values || []);
      })
      .catch(err => {
        console.error("Eroare la fetchPatients:", err);
        setPatients([]);
      });
  } else if (role === 2) {
    setSelectedPatientId(getCurrentUserId());
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
    if (!selectedPatientId) return;
    getMedicalRecordsByPatientId(selectedPatientId)
      .then(setMedicalRecords)
      .catch(console.error);
    setRecordToEdit(null);
  }, [selectedPatientId]);
  

  const handleDelete = async (id) => {
    if (window.confirm('Ești sigur că vrei să ștergi această fișă medicală?')) {
      await deleteMedicalRecord(id);
      loadRecords();
    }
  };

  return (
    <div>
      <h2>Fișe Medicale</h2>
      {role === 1 && (
        <>
          <label>Selectează pacient:</label>
          <select
            value={selectedPatientId}
            onChange={e => setSelectedPatientId(e.target.value)}
          >
            <option value="">-- Alege pacientul --</option>
            {Array.isArray(patients) && patients.map((p, idx) => (
              <option key={p.Id ?? p.id ?? idx} value={p.Id ?? p.id}>
                {p.Name ?? p.name}
              </option>
            ))}
          </select>
        </>
      )}

      {selectedPatientId && (
        <>
          <MedicalRecordList
            records={medicalRecords}
            onEdit={setRecordToEdit}
            onDelete={handleDelete}
          />
          <MedicalRecordForm
            patientId={selectedPatientId}
            onRecordSaved={loadRecords}
            recordToEdit={recordToEdit}
            setRecordToEdit={setRecordToEdit}
          />
        </>
      )}
    </div>
  );
}

export default MedicalRecordsPage;
