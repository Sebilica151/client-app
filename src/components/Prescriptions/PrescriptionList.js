import React from 'react';
import { deletePrescription } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
      head: [['Medicament', 'Dozaj']],
      body: prescriptions.map(p => [
        p.Medication ?? p.medication ?? '—',
        p.Dosage ?? p.dosage ?? '—'
      ]),
      startY: 22
    });
  
    doc.save("retete.pdf");
  };
  
  if (!prescriptions || prescriptions.length === 0)
    return <p>Nu există rețete.</p>;

  return (
    <div>
      {Number(role) === 2 && (
        <button onClick={exportToPDF} style={{ marginBottom: '1rem' }}>
          Exportă PDF
        </button>
      )}

      <ul>
        {prescriptions.map((p) => (
          <li key={p.Id ?? p.id}>
            <strong>{p.Medication}</strong> – {p.Dosage}
            {Number(role) === 1 && (
              <>
                <button onClick={() => onEdit(p)} style={{ marginLeft: 10 }}>Editează</button>
                <button onClick={() => handleDelete(p.Id ?? p.id)} style={{ marginLeft: 5 }}>Șterge</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PrescriptionList;
