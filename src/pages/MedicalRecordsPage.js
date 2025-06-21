// src/pages/MedicalRecordsPage.js
import React, { useEffect, useState } from 'react';
import {
  fetchPatients,
  getMedicalRecordsByPatientId,
  deleteMedicalRecord
} from '../services/api';
import './MedicalRecordsPage.css';
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

  const handleEdit = (record) => {
    setRecordToEdit(record);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEdit = Boolean(recordToEdit);

    try {
      const method = isEdit ? 'PUT' : 'POST';
      const endpoint = isEdit
        ? `/medical-records/${recordToEdit.Id}`
        : '/medical-records';

      await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...recordToEdit,
          patientId: selectedPatientId
        })
      });

      loadRecords();
    } catch (err) {
      console.error("Eroare la salvare:", err);
    }
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
          <div className="record-list">
            {medicalRecords.map((record) => (
              <div key={record.Id} className="record-card">
                <div><strong>Diagnostic:</strong> {record.Diagnosis}</div>
                <div><strong>Tratament:</strong> {record.Treatment}</div>
                <div><strong>Observații:</strong> {record.Notes}</div>
                <div className="record-actions">
                  <button onClick={() => handleEdit(record)} className="edit-button">
                    Editează
                  </button>
                  <button onClick={() => handleDelete(record.Id)} className="delete-button">
                    Șterge
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="record-form">
            <h3>{recordToEdit ? 'Editează fișa medicală' : 'Adaugă fișă medicală'}</h3>

            <input
              type="text"
              name="diagnosis"
              placeholder="Diagnostic"
              value={recordToEdit?.Diagnosis || ''}
              onChange={(e) =>
                setRecordToEdit((prev) => ({
                  ...prev,
                  Diagnosis: e.target.value
                }))
              }
              required
            />

            <input
              type="text"
              name="treatment"
              placeholder="Tratament"
              value={recordToEdit?.Treatment || ''}
              onChange={(e) =>
                setRecordToEdit((prev) => ({
                  ...prev,
                  Treatment: e.target.value
                }))
              }
              required
            />

            <textarea
              name="notes"
              placeholder="Observații"
              value={recordToEdit?.Notes || ''}
              onChange={(e) =>
                setRecordToEdit((prev) => ({
                  ...prev,
                  Notes: e.target.value
                }))
              }
            />

            <button type="submit" className="submit-button">
              {recordToEdit ? 'Salvează modificările' : 'Adaugă fișa'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default MedicalRecordsPage;
