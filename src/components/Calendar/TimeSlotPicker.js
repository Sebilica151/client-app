import React from 'react';
import '../../pages/CalendarPage.css';

function TimeSlotPicker({ availableSlots, selectedSlot, onSelect }) {
  const generateSlots = () => {
    const slots = [];
    const start = 8 * 60; 
    const end = 16 * 60 + 30; 

    for (let min = start; min <= end; min += 30) {
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
