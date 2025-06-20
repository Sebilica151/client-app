import React, { useEffect, useState } from 'react';
import {
  createMedicalRecord,
  updateMedicalRecord
} from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function MedicalRecordForm({ patientId, onRecordSaved, recordToEdit }) {
  const [formData, setFormData] = useState({
    diagnosis: '',
    treatment: '',
    notes: ''
  });

  const { role } = useAuth();


  useEffect(() => {
    if (recordToEdit) {
      setFormData({
        diagnosis: recordToEdit.Diagnosis || '',
        treatment: recordToEdit.Treatment || '',
        notes: recordToEdit.Notes || ''
      });
    } else {
      setFormData({ diagnosis: '', treatment: '', notes: '' });
    }
  }, [recordToEdit]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (recordToEdit) {
        const recordId = recordToEdit.Id ?? recordToEdit.id;
        const patientId = recordToEdit.PatientId ?? recordToEdit.patientId;
      
        const payload = {
          id: recordId,
          patientId: patientId,
          ...formData
        };

        await updateMedicalRecord(recordId, payload);
      } else {
        const payload = {
          patientId,
          ...formData
        };
        await createMedicalRecord(payload);
      }

      setFormData({ diagnosis: '', treatment: '', notes: '' });
      onRecordSaved(); // ✅ Trigger refresh
    } catch (err) {
      console.error('Eroare la salvare fișă medicală:', err);
    }
  };

  return (
    role === 1 && (
      <form onSubmit={handleSubmit}>
        <h3>{recordToEdit ? 'Editează fișa medicală' : 'Adaugă fișă medicală'}</h3>
  
        <input
          type="text"
          name="diagnosis"
          placeholder="Diagnostic"
          value={formData.diagnosis}
          onChange={handleChange}
          required
        />
  
        <input
          type="text"
          name="treatment"
          placeholder="Tratament"
          value={formData.treatment}
          onChange={handleChange}
          required
        />
  
        <textarea
          name="notes"
          placeholder="Observații"
          value={formData.notes}
          onChange={handleChange}
        />
  
        <button type="submit">
          {recordToEdit ? 'Salvează modificările' : 'Adaugă fișa'}
        </button>
      </form>
    )
  );
}

export default MedicalRecordForm;
