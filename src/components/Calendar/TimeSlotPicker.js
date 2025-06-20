import React from 'react';

const HOURS = Array.from({ length: 9 }, (_, i) => 8 + i); // 8-16

function TimeSlotPicker({ availableSlots, selectedSlot, onSelect }) {
  return (
    <div>
      <label>Selectează un interval orar:</label>
      <ul>
        {HOURS.map(hour => {
          const slot = `${hour.toString().padStart(2, '0')}:00`;
          const disabled = !availableSlots.includes(slot);
          return (
            <li key={slot}>
              <button
                disabled={disabled}
                onClick={() => onSelect(slot)}
                style={{ backgroundColor: selectedSlot === slot ? '#ccc' : '' }}
              >
                {slot}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default TimeSlotPicker;
