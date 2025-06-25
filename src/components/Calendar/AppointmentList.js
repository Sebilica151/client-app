import React from 'react';
import '../../pages/CalendarPage.css';
import { API_BASE } from '../../services/api';

function AppointmentList({ appointments, role, onEdit, onDelete, onConfirm }) {
  if (!appointments || appointments.length === 0) {
    return <p className="empty-message">Nu există programări.</p>;
  }

  const formatStatus = (status) => {
    if (status === 'pending') return '🟡 În așteptare';
    if (status === 'confirmed') return '🟢 Confirmată';
    return status;
  };

  const handleDownload = (id) => {
    window.open(`${API_BASE}/appointments/download/${id}`, '_blank');
  };

const handleConfirm = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/appointments/confirm/${id}`, {
      method: 'PATCH',
    });

    if (!response.ok) throw new Error('Eroare la confirmare.');

    if (onConfirm) {
      await onConfirm(id); // dacă ai logica de refresh transmisă din CalendarPage
    }
  } catch (error) {
    alert('Eroare la confirmarea programării.');
    console.error(error);
  }
};

  return (
    <div className="appointments-section">
      <h3 className="section-title">Lista programărilor</h3>
      <ul className="appointments-list">
        {appointments.map((appt) => (
          <li key={appt.Id} className="appointment-item">
            <div>
              <strong>{appt.Date?.split('T')[0]} - {appt.TimeSlot}</strong>
              <p className="appointment-detail">
                <strong>Status:</strong> {formatStatus(appt.Status)}
              </p>

              {Number(role) === 1 && appt.Patient && (
                <p className="appointment-detail">
                  <strong>Pacient:</strong> {appt.Patient.Name}
                </p>
              )}
            </div>

            <div className="appointment-actions">
              {Number(role) === 1 && appt.Status === 'pending' && (
                <>
                  {appt.DocumentPath && (
                    <button onClick={() => handleDownload(appt.Id)}>
                      Vizualizează cerere
                    </button>
                  )}
                  <button
                    className="edit-button"
                    onClick={() => handleConfirm(appt.Id)}
                  >
                    Confirmă
                  </button>

                  {onDelete && (
                    <button className="delete-button" onClick={() => onDelete(appt.Id)}>
                      Respinge
                    </button>
                  )}
                </>
              )}

              {Number(role) === 2 && (
                <>
                  {onEdit && (
                    <button className="edit-button" onClick={() => onEdit(appt)}>
                      Editează
                    </button>
                  )}
                  {onDelete && (
                    <button className="delete-button" onClick={() => onDelete(appt.Id)}>
                      Șterge
                    </button>
                  )}
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AppointmentList;
