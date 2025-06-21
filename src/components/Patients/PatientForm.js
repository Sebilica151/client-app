import React, { useState, useEffect } from 'react';

const PatientForm = ({ onSave, patient }) => {
  const [formData, setFormData] = useState({ name: '', age: '', gender: '', phoneNumber: '' });

  useEffect(() => {
    if (patient) {
      setFormData(patient);
    } else {
      setFormData({ name: '', age: '', gender: '', phoneNumber: '' });
    }
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Nume" value={formData.name} onChange={handleChange} />
      <input name="age" placeholder="Varsta" value={formData.age} onChange={handleChange} />
      <input name="gender" placeholder="Gen" value={formData.gender} onChange={handleChange} />
      <input name="phoneNumber" placeholder="Telefon" value={formData.phoneNumber} onChange={handleChange} />
      <button type="submit">Salveaza</button>
    </form>
  );
};

export default PatientForm;
