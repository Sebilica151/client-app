import React, { useState } from 'react';

function AppointmentRequestModal({ isOpen, onClose, onSubmit, selectedTime }) {
  const [file, setFile] = useState(null);

  const handleClickSubmit = () => {
    if (!file) {
      alert('Te rugăm să încarci un fișier!');
      return;
    }
    onSubmit(file);
    setFile(null);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Cerere pentru {selectedTime}</h3>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.png"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <div className="modal-actions">
          <button onClick={handleClickSubmit}>Trimite cererea</button>
          <button onClick={onClose}>Anulează</button>
        </div>
      </div>
    </div>
  );
}

export default AppointmentRequestModal;