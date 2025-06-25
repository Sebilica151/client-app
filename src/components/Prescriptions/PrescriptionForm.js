import React, { useEffect, useState } from 'react';
import { createPrescription, updatePrescription } from '../../services/api';
import { getCurrentDoctorId } from '../../services/api';
import '../../pages/PrescriptionsPage.css'; // asigură-te că e calea corectă

function PrescriptionForm({ patientId, onSaved, editData }) {
  const [form, setForm] = useState({ medication: '', dosage: '' , diagnosis: '', issuedAt: new Date().toISOString().split('T')[0]});

  useEffect(() => {
    if (editData) {
      setForm({
        medication: editData.medication,
        dosage: editData.dosage,
        diagnosis: editData.diagnosis?? '',
        issuedAt: editData.issuedAt?.split('T')[0] ?? new Date().toISOString().split('T')[0],
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
      diagnosis: form.diagnosis,
      issuedAt: form.issuedAt,
    };

    try {
      if (editData) {
        await updatePrescription(editData.Id ?? editData.id, {
          ...payload,
          id: editData.Id ?? editData.id,
        });
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
    <form className="prescription-form" onSubmit={handleSubmit}>
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
      <input
        name="diagnosis"
        value={form.diagnosis}
        onChange={handleChange}
        placeholder="Diagnostic"
        required
      />

      <input
        type="date"
        name="issuedAt"
        value={form.issuedAt}
        onChange={handleChange}
        required
      />
      <button type="submit">
        {editData ? 'Salvează modificările' : 'Adaugă'}
      </button>
    </form>
  );
}

export default PrescriptionForm;
