// src/pages/ProfilePage.js
import React, { useEffect, useState } from "react";
import { fetchProfile, updateProfile } from "../services/api";
import ProfileForm from "../components/Profile/ProfileForm";
import "../pages/ProfilePage.css";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetchProfile();
        console.log("Date profil:", response);
        setUserData({
          ...response,
          role: response.Role ?? response.role // normalizează capitalizarea
        });
      } catch (error) {
        console.error("Eroare la încărcarea profilului:", error);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (field, value) => {
    if (["PasswordHash", "Email"].includes(field)) {
      setUserData((prev) => ({
        ...prev,
        [field]: value,
      }));
    } else {
      const roleKey = userData?.role === "1" ? "Doctor" : "Patient";
      setUserData((prev) => ({
        ...prev,
        [roleKey]: {
          ...prev[roleKey],
          [field]: value,
        },
      }));
    }
  };

  const handleSave = async () => {
  try {
    const updated = { ...userData };

    if (updated.Doctor?.WorkStart) {
      let start = updated.Doctor.WorkStart;
      if (start.length === 5) start += ":00"; 

      updated.Doctor.WorkStart = start;

      const [hours, minutes] = start.split(":").map(Number);
      const end = new Date(0, 0, 0, hours, minutes + 510); 

      const formattedEnd = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}:00`;

      updated.Doctor.WorkEnd = formattedEnd;
    }

    console.log("Trimitem profilul:", updated);
    console.log("Trimitem profilul:", updated.Doctor.WorkStart);

    await updateProfile(updated);
    setEditing(false);
    alert('Profil salvat cu succes');
  } catch (err) {
    console.error('Eroare la salvarea profilului:', err);
    alert('A apărut o eroare');
  }
};



  return (
 <div className="profile-page">
  <div className="profile-container">
    <h2>Profilul meu</h2>
    <ProfileForm
      formData={userData}
      onChange={handleChange}
      onSave={handleSave}
      editing={editing}
      setEditing={setEditing}
    />
  </div>
</div>
  );
};

export default ProfilePage;
