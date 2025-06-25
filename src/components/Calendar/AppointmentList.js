import React from 'react';
import '../../pages/CalendarPage.css';


function AppointmentList({ appointments, role, onEdit, onDelete }) {
  if (!appointments || appointments.length === 0) {
    return <p className="empty-message">Nu există programări.</p>;
  }

  return (
    <div className="appointments-section">
      <h3 className="section-title">Lista programărilor</h3>
      <ul className="appointments-list">
        {appointments.map((appt) => (
          <li key={appt.Id} className="appointment-item">
            <div>
              <strong>{appt.Date?.split('T')[0]} - {appt.TimeSlot}</strong>
              {Number(role) === 1 && appt.Patient && (
                <p className="appointment-detail"><strong>Pacient:</strong> {appt.Patient.Name}</p>
              )}
            </div>

            {Number(role) === 2 && (
              <div className="appointment-actions">
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
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AppointmentList;
