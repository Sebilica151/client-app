import React from 'react';
import '../../pages/CalendarPage.css';

function TimeSlotPicker({ availableSlots, selectedSlot, onSelect, workStart = "08:00", workEnd = "16:30" }) {
  const generateSlots = () => {
    const slots = [];
    const [startH, startM] = workStart.split(':').map(Number);
    const [endH, endM] = workEnd.split(':').map(Number);
    const start = startH * 60 + startM;
    const end = endH * 60 + endM;

    for (let min = start; min <= end - 30; min += 30) {
      const h = Math.floor(min / 60).toString().padStart(2, '0');
      const m = (min % 60).toString().padStart(2, '0');
      slots.push(`${h}:${m}`);
    }

    return slots;
  };

  const allSlots = generateSlots();

  return (
    <div className="slot-picker">
      <label className="slot-label">Selectează un interval orar:</label>
      <div className="slot-grid">
        {allSlots.map(slot => (
          <button
            key={slot}
            className={`slot-button ${selectedSlot === slot ? 'selected' : ''}`}
            disabled={!availableSlots.includes(slot)}
            onClick={() => onSelect(slot)}
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TimeSlotPicker;
