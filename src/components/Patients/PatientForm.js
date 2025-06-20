import React, { useState } from 'react';

function ProfileForm({ data, onSave, onCancel }) {
  const [formData, setFormData] = useState(JSON.parse(JSON.stringify(data))); // deep copy

  const handleChange = (e) => {
    const { name, value } = e.target;
    const path = name.split('.');
    const updated = { ...formData };

    let target = updated;
    for (let i = 0; i < path.length - 1; i++) {
      target = target[path[i]];
    }
    target[path[path.length - 1]] = value;

    setFormData(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {data.role === "1" && data.doctor && (
        <>
          <input name="doctor.name" value={formData.doctor.name} onChange={handleChange} placeholder="Nume" />
          <input name="doctor.age" value={formData.doctor.age} onChange={handleChange} placeholder="Vârstă" />
          <input name="doctor.gender" value={formData.doctor.gender} onChange={handleChange} placeholder="Gen" />
          <input name="doctor.specialization" value={formData.doctor.specialization} onChange={handleChange} placeholder="Specializare" />
          <input name="doctor.seal" value={formData.doctor.seal} onChange={handleChange} placeholder="Parafă" />
          <input name="doctor.contactNumber" value={formData.doctor.contactNumber} onChange={handleChange} placeholder="Telefon" />
        </>
      )}
      {data.role === "2" && data.patient && (
        <>
          <input name="patient.name" value={formData.patient.name} onChange={handleChange} placeholder="Nume" />
          <input name="patient.age" value={formData.patient.age} onChange={handleChange} placeholder="Vârstă" />
          <input name="patient.gender" value={formData.patient.gender} onChange={handleChange} placeholder="Gen" />
        </>
      )}
      <button type="submit">Salvează</button>
      <button type="button" onClick={onCancel}>Anulează</button>
    </form>
  );
}

export default ProfileForm;
