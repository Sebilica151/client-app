import React from 'react';

function AppointmentList({ appointments, role, onEdit, onDelete }) {
  if (!appointments || appointments.length === 0) {
    return <p>Nu există programări.</p>;
  }

  return (
    <div style={{ marginTop: '1rem' }}>
      <h3>Lista programărilor</h3>
      <ul>
        {appointments.map((appt) => (
          <li key={appt.Id}>
            <strong>{appt.Date?.split('T')[0]} - {appt.TimeSlot}</strong>
            {Number(role) === 1 && appt.Patient && (
              <>
                <p><strong>Pacient:</strong> {appt.Patient.Name}</p>
              </>
            )}

            {Number(role) === 2 && (
              <div style={{ marginTop: '0.5rem' }}>
                {onEdit && <button onClick={() => onEdit(appt)}>Editează</button>}
                {onDelete && <button onClick={() => onDelete(appt.Id)} style={{ marginLeft: '10px' }}>Șterge</button>}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AppointmentList;
