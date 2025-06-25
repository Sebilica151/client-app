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
    gender: '',
    personalNumber: '',
    birthday: '',
    birthPlace: '',
    pastMedicalCondition: '',
    currentMedicalCondition: ''
  });

  const { role } = useAuth();

  useEffect(() => {
    if (recordToEdit) {
      setFormData({
        diagnosis: recordToEdit.Diagnosis || '',
        treatment: recordToEdit.Treatment || '',
        gender: recordToEdit.Gender || '',
        personalNumber: recordToEdit.PersonalNumber || '',
        birthday: recordToEdit.Birthday ? recordToEdit.Birthday.slice(0, 10) : '',
        birthPlace: recordToEdit.BirthPlace || '',
        pastMedicalCondition: recordToEdit.PastMedicalCondition || '',
        currentMedicalCondition: recordToEdit.CurrentMedicalCondition || ''
      });
    } else {
      setFormData({
        diagnosis: '',
        treatment: '',
        gender: '',
        personalNumber: '',
        birthday: '',
        birthPlace: '',
        pastMedicalCondition: '',
        currentMedicalCondition: ''
      });
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

      setFormData({
        diagnosis: '',
        treatment: '',
        gender: '',
        personalNumber: '',
        birthday: '',
        birthPlace: '',
        pastMedicalCondition: '',
        currentMedicalCondition: ''
      });

      onRecordSaved();
    } catch (err) {
      console.error('Eroare la salvare fișă medicală:', err);
    }
  };

  return (
    role === 1 && (
      <form onSubmit={handleSubmit} className="record-form">
        <h3>{recordToEdit ? 'Editează fișa medicală' : 'Adaugă fișă medicală'}</h3>

        <input type="text" name="diagnosis" placeholder="Diagnostic" value={formData.diagnosis} onChange={handleChange} required />
        <input type="text" name="treatment" placeholder="Tratament" value={formData.treatment} onChange={handleChange} required />
        <input type="text" name="gender" placeholder="Gen" value={formData.gender} onChange={handleChange} />
        <input type="text" name="personalNumber" placeholder="CNP" value={formData.personalNumber} onChange={handleChange} />
        <input type="date" name="birthday" placeholder="Data nașterii" value={formData.birthday} onChange={handleChange} />
        <input type="text" name="birthPlace" placeholder="Locul nașterii" value={formData.birthPlace} onChange={handleChange} />
        <textarea name="pastMedicalCondition" placeholder="Afecțiuni anterioare" value={formData.pastMedicalCondition} onChange={handleChange} />
        <textarea name="currentMedicalCondition" placeholder="Afecțiuni actuale" value={formData.currentMedicalCondition} onChange={handleChange} />

        <button type="submit" className="submit-button">
          {recordToEdit ? 'Salvează modificările' : 'Adaugă fișa'}
        </button>
      </form>
    )
  );
}

export default MedicalRecordForm;
