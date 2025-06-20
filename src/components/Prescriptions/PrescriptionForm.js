import React, { useEffect, useState } from 'react';
import { createPrescription, updatePrescription } from '../../services/api';
import { getCurrentDoctorId } from '../../services/api';

function PrescriptionForm({ patientId, onSaved, editData }) {
  const [form, setForm] = useState({ medication: '', dosage: '' });

  useEffect(() => {
    if (editData) {
      setForm({
        medication: editData.medication,
        dosage: editData.dosage,
      });
    } else {
      setForm({ medication: '', dosage: '' });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const doctorId = getCurrentDoctorId();
    if (!doctorId || !patientId) {
      alert("Doctorul sau pacientul nu sunt setați corect.");
      return;
    }

    const payload = {
      doctorId,
      patientId,
      medication: form.medication,
      dosage: form.dosage,
    };

    try {
      if (editData) {
        await updatePrescription(editData.Id ?? editData.id, { ...payload, id: editData.Id ?? editData.id });
      } else {
        await createPrescription(payload);
      }

      setForm({ medication: '', dosage: '' });
      onSaved();
    } catch (err) {
      console.error("Eroare la salvare rețetă:", err);
      alert("Eroare la salvare rețetă.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{editData ? 'Editează rețeta' : 'Adaugă rețetă'}</h3>
      <input
        name="medication"
        value={form.medication}
        onChange={handleChange}
        placeholder="Medicament"
        required
      />
      <input
        name="dosage"
        value={form.dosage}
        onChange={handleChange}
        placeholder="Dozaj"
        required
      />
      <button type="submit">{editData ? 'Salvează modificările' : 'Adaugă'}</button>
    </form>
  );
}

export default PrescriptionForm;
