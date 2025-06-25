// components/Profile/ProfileForm.js
import React from "react";

const ProfileForm = ({ formData, onChange, onSave, editing, setEditing }) => {
  if (!formData) return <p>Se încarcă...</p>;

  const isDoctor = formData.Role === "1";
  const roleData = isDoctor ? formData.Doctor : formData.Patient;
  if (!roleData) return <p>Datele nu sunt disponibile.</p>;

  return (
    <form>
      <div>
        <label>Nume:</label>
        <input
          type="text"
          value={roleData.Name || ""}
          disabled={!editing}
          onChange={(e) => onChange("Name", e.target.value)}
        />
      </div>
      <div>
        <label>Vârstă:</label>
        <input
          type="number"
          value={roleData.Age || ""}
          disabled={!editing}
          onChange={(e) => onChange("Age", e.target.value)}
        />
      </div>
      <div>
        <label>Gen:</label>
        <input
          type="text"
          value={roleData.Gender || ""}
          disabled={!editing}
          onChange={(e) => onChange("Gender", e.target.value)}
        />
      </div>
      <div>
        <label>Parolă:</label>
        <input
          type="password"
          value={formData.PasswordHash || ""}
          disabled={!editing}
          onChange={(e) => onChange("PasswordHash", e.target.value)}
        />
      </div>

      {isDoctor && (
        <>
          <div>
            <label>Specializare:</label>
            <input
              type="text"
              value={roleData.Specialization || ""}
              disabled={!editing}
              onChange={(e) => onChange("Specialization", e.target.value)}
            />
          </div>
          <div>
            <label>Parafă:</label>
            <input
              type="text"
              value={roleData.Seal || ""}
              disabled={!editing}
              onChange={(e) => onChange("Seal", e.target.value)}
            />
          </div>
          <div>
            <label>Telefon:</label>
            <input
              type="text"
              value={roleData.ContactNumber || ""}
              disabled={!editing}
              onChange={(e) => onChange("ContactNumber", e.target.value)}
            />
          </div>
          <div>
            <label>Ora de început a programului</label>
            <input
              type="time"
              value={roleData.WorkStart || "08:00"}
              disabled={!editing}
              onChange={(e) => onChange("WorkStart", e.target.value)}
              min="05:00"
              max="15:00"
              step="1800"
            />
          </div>
        </>
      )}

      {!editing ? (
        <button type="button" onClick={() => setEditing(true)}>
          Editează
        </button>
      ) : (
        <button type="button" onClick={onSave}>
          Salvează
        </button>
      )}
    </form>
  );
};

export default ProfileForm;
