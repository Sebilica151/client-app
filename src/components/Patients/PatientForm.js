import React, { useState, useEffect } from 'react';
import { createPatient, updatePatient } from '../../services/api';

function PatientForm({ onPatientSaved, patientToEdit }) {
  const [formData, setFormData] = useState({ name: '', age: '', gender: '' });

  useEffect(() => {
    if (patientToEdit) {
      setFormData({
        name: patientToEdit.name,
        age: patientToEdit.age,
        gender: patientToEdit.gender
      });
    } else {
      setFormData({ name: '', age: '', gender: '' });
    }
  }, [patientToEdit]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (patientToEdit) {
        await updatePatient(patientToEdit.id, formData);
      } else {
        await createPatient({
          name: formData.name,
          age: parseInt(formData.age),
          gender: formData.gender
        });
      }
      onPatientSaved();
      setFormData({ name: '', age: '', gender: '' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Adaugă pacient nou</h3>
      <input
        type="text"
        name="name"
        placeholder="Nume"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="age"
        placeholder="Vârstă"
        value={formData.age}
        onChange={handleChange}
        required
      />
      <select name="gender" value={formData.gender} onChange={handleChange} required>
        <option value="">Gen</option>
        <option value="Male">Masculin</option>
        <option value="Female">Feminin</option>
      </select>
      <button type="submit">Salvează</button>
    </form>
  );
}

export default PatientForm;