// src/components/Prescriptions/PrescriptionList.js
import React from 'react';
import { deletePrescription } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../../pages/PrescriptionsPage.css';

function PrescriptionList({ prescriptions, onEdit, onDeleted }) {
  const { role } = useAuth();

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmi ștergerea?")) return;
    await deletePrescription(id);
    onDeleted();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Lista rețetelor", 14, 16);

    autoTable(doc, {
      head: [['Medicament', 'Dozaj', 'Diagnostic', 'Data']],
      body: prescriptions.map(p => [
        p.Medication ?? p.medication ?? '—',
        p.Dosage ?? p.dosage ?? '—',
        p.Diagnosis ?? '—',
        p.IssuedAt ? new Date(p.IssuedAt).toLocaleDateString() : '—'
      ]),
      startY: 22
    });

    doc.save("retete.pdf");
  };

  if (!prescriptions || prescriptions.length === 0)
    return <p>Nu există rețete.</p>;

  return (
    <div className="prescription-list">
      {Number(role) === 2 && (
        <button className="export-btn" onClick={exportToPDF}>
          Exportă PDF
        </button>
      )}

      {prescriptions.map((p) => (
        <div key={p.Id ?? p.id} className="prescription-card">
          <div className="prescription-details">
            <p><em>Medicament:</em>{p.Medication}</p>
            <p><em>Dozaj:</em>{p.Dosage}</p>
            <p><em>Diagnostic:</em> {p.Diagnosis}</p>
            <p><em>Data:</em> {new Date(p.IssuedAt).toLocaleDateString()}</p>
          </div>

          {Number(role) === 1 && (
            <div className="prescription-actions">
              <button className="edit-btn" onClick={() => onEdit(p)}>
                Editează
              </button>
              <button className="delete-btn" onClick={() => handleDelete(p.Id ?? p.id)}>
                Șterge
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default PrescriptionList;
